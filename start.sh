#!/bin/sh
# Masuk ke folder backend
cd backend

# Gunakan environment production
cp .env.production .env

# Jalankan Laravel di port yang diberikan Railway
php artisan serve --host=0.0.0.0 --port=$PORT
