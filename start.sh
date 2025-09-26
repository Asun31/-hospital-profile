#!/bin/bash

# Jalankan Laravel backend di background
cd backend
php artisan migrate --force
php -S 0.0.0.0:8000 -t public &

# Jalankan frontend (Node + serve)
cd ../frontend
npx serve -s . -l $PORT

