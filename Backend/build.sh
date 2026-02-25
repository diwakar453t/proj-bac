#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing backend dependencies..."
python -m pip install --upgrade pip
pip install -r requirements.txt

echo "Build complete."
