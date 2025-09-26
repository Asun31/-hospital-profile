# Gunakan PHP official image
FROM php:8.2-cli

# Install dependencies dasar
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    libpq-dev \
    && apt-get clean

# Install Node.js (LTS) dan npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

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

# Expose port Railway
ENV PORT 3000

# Jalankan start.sh
CMD ["bash", "start.sh"]
