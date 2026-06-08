FROM php:8.4-fpm


# Pre-configure Apt mirrors (Aliyun) for speed
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources || sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
# Use Tencent Cloud Mirror for potentially better stability
RUN composer config -g repo.packagist composer https://mirrors.cloud.tencent.com/composer/

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory contents
COPY . /var/www/html

# Set environment for composer (still useful for entrypoint)
ENV COMPOSER_PROCESS_TIMEOUT=2000
ENV COMPOSER_MEMORY_LIMIT=-1

# Expose port 8000
EXPOSE 8000

# Copy and set entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Start server via entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
