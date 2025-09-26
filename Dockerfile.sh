# Gunakan PHP official image dengan CLI
FROM php:8.2-cli

# Install dependencies dasar + Node.js + npm
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    libpq-dev \
    bash \
    && apt-get clean

# Install Node.js LTS (20.x) + npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Pastikan semua executable tersedia di PATH
ENV PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/sbin:${PATH}"

# Set working directory
WORKDIR /app

# Copy semua file project
COPY . .

# Install backend dependencies
RUN cd backend && composer install --no-dev --optimize-autoloader

# Install frontend dependencies
RUN cd frontend && npm install

# Pastikan start.sh executable
RUN chmod +x start.sh

# Expose frontend port
ENV PORT 3000

# Jalankan start.sh saat container start
CMD ["bash", "start.sh"]
