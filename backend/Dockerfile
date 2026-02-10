# backend/Dockerfile
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Default command (can be overridden in docker-compose)
CMD ["gunicorn", "emergency_news.wsgi:application", "--bind", "0.0.0.0:9000"]
