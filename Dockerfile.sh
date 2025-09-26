# Gunakan PHP 8.2 CLI official image
FROM php:8.2-cli

# Install dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    libpq-dev \
    npm \
    nodejs \
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

# Expose port dari Railway
ENV PORT 3000

# Jalankan start.sh
CMD ["bash", "start.sh"]
