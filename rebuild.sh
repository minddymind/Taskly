#!/bin/bash

# Stop and remove existing containers
docker compose down

# Build the images without using cache
docker compose build --no-cache

# Start the containers in detached mode
docker compose up -d

# Check if Redis container is already running
if [ ! "$(docker ps -q -f name=redis-container)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=redis-container)" ]; then
        # Cleanup if redis-container exists but is stopped
        docker rm redis-container
    fi
    # Run Redis container
    docker run -d --name redis-container -p 6379:6379 redis
fi

echo "Rebuild complete. Redis and other services are up!"
