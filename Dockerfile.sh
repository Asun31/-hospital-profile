# Gunakan PHP official image
FROM php:8.2-cli

# Install dependencies dasar
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

# Cek versi node & npm
RUN node -v
RUN npm -v
RUN npx -v

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy seluruh project
COPY . .

# Install backend dependencies
RUN cd backend && composer install --no-dev --optimize-autoloader

# Install frontend dependencies
RUN cd frontend && npm install

# Pastikan start.sh executable
RUN chmod +x start.sh

# Expose port frontend
ENV PORT 3000

# Jalankan start.sh
CMD ["bash", "start.sh"]
