# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies required for WeasyPrint (PDF generation) and PostgreSQL
RUN apt-get update && apt-get install -y \
    build-essential \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libharfbuzz-subset0 \
    libjpeg-dev \
    libopenjp2-7-dev \
    libffi-dev \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application code into a 'backend' directory
COPY . /app/backend

# Create storage directories if they don't exist
RUN mkdir -p /app/backend/storage/avatars /app/backend/storage/pdfs

# Expose the port the app runs on (7860 is required by Hugging Face Spaces)
EXPOSE 7860

# Command to run the application using Uvicorn
CMD uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-7860}
