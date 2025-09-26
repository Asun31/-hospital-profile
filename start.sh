#!/bin/bash
echo "Starting Laravel backend..."
cd backend
php artisan serve --host=0.0.0.0 --port=8000 &

echo "Starting frontend..."
cd ../frontend
npm start
