#!/bin/bash

# Jalankan backend Laravel di port yang diberikan Railway
cd backend
php artisan serve --host=0.0.0.0 --port=$PORT &

# Jalankan frontend
cd ../frontend
npx serve -p $PORT ./
