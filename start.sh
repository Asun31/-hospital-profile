#!/usr/bin/env bash

# ===========================
# Start script untuk backend + frontend
# ===========================

# Cek OS
OS="$(uname -s)"

echo "Detected OS: $OS"

# ===== Backend =====
echo "Starting backend..."
cd backend || exit 1

# Gunakan PORT dari Railway atau default 8000
PORT="${PORT:-8000}"

# Linux/macOS: jalankan background
if [[ "$OS" == "Linux" || "$OS" == "Darwin" ]]; then
    php artisan serve --host=0.0.0.0 --port="$PORT" &
else
    # Windows (Git Bash / WSL)
    start php artisan serve --host=0.0.0.0 --port="$PORT"
fi

cd ..

# ===== Frontend =====
echo "Starting frontend..."
cd frontend || exit 1

# Default frontend port 3000
FRONTEND_PORT=3000

if [[ "$OS" == "Linux" || "$OS" == "Darwin" ]]; then
    npx serve -p "$FRONTEND_PORT" ./ &
else
    start npx serve -p "$FRONTEND_PORT" ./
fi

echo "All services started."
wait
