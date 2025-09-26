# Gunakan PHP 8.2 CLI official image
FROM php:8.2-cli

# Install dependencies + Node.js
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    libpq-dev \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

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

# Berikan izin eksekusi start.sh
RUN chmod +x start.sh

# Expose port Railway
ENV PORT 3000
ENV BACKEND_PORT 8000

# Jalankan start.sh
CMD ["bash", "start.sh"]
