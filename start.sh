#!/bin/bash
# start.sh

# Jalankan Laravel backend
cd backend || exit
echo "Starting Laravel backend..."
php artisan serve --host=0.0.0.0 --port=${BACKEND_PORT} &

# Tunggu sebentar supaya backend siap
sleep 5

# Jalankan frontend
cd ../frontend || exit
echo "Starting frontend..."
npm start
