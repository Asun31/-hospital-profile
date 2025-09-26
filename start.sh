#!/bin/bash

# Atur working directory backend
cd backend || exit
echo "Starting Laravel backend..."
# Jalankan server Laravel sesuai PORT environment (Railway)
php artisan serve --host=0.0.0.0 --port=${BACKEND_PORT:-8000} &

# Kembali ke root dan masuk frontend
cd ../frontend || exit
echo "Starting frontend..."
# Jalankan frontend dengan serve dan port dari Railway
npx serve -s . -l ${PORT:-3000}
