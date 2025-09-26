#!/bin/bash

# Jalankan backend Laravel
cd backend
php artisan serve --host=0.0.0.0 --port=8000 &

# Jalankan frontend
cd ../frontend
npx serve -p 3000 ./
