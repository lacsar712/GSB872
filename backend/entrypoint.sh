#!/bin/sh
set -e

# Install/Update dependencies
echo "Checking dependencies..."
if [ -f "composer.json" ]; then
    if [ ! -d "vendor" ]; then
        echo "Installing dependencies..."
        composer install --no-interaction --optimize-autoloader --no-dev --prefer-dist
    else
        echo "Dependencies already installed. Skipping..."
    fi
fi

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
# Wait a bit for the db container to initialize
sleep 5

echo "Running migrations..."
php artisan migrate --force || true

echo "Publishing Sanctum migrations..."
# Check if migration exists, if not publish it
if [ ! -f "database/migrations/2019_12_14_000001_create_personal_access_tokens_table.php" ]; then
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --tag="sanctum-migrations"
fi

echo "Ensuring storage permissions..."
chmod -R 777 storage bootstrap/cache

echo "Running seeders..."
# Only seed if we feel it's safe, or if our seeders are idempotent (which we ensured)
php artisan db:seed --force

echo "Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=8000
