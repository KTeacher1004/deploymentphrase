#!/usr/bin/env bash
set -e

echo "==> Building client (React)..."
cd client
npm install
npm run build

echo "==> Installing server dependencies..."
cd ../server
npm install

echo "==> Build completed!"
