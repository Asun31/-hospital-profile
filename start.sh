#!/bin/bash

# Jalankan backend Laravel di background
cd backend
php artisan serve --host=0.0.0.0 --port=8000 &

# Jalankan frontend Node
cd ../frontend
npx serve -p 3000 ./
