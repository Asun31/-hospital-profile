#!/bin/bash

# Jalankan backend Laravel
cd backend || exit
echo "Starting Laravel backend..."
php artisan serve --host=0.0.0.0 --port=${BACKEND_PORT} &

# Tunggu backend siap (opsional, bisa tambahkan sleep)
sleep 5

# Jalankan frontend via npm start
cd ../frontend || exit
echo "Starting frontend..."
npm start
