#!/bin/bash

# Build the Docker image
echo "Building Docker image for Crusher game..."
docker build -t crusher-game .

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Docker image built successfully!"
    
    # Run the Docker container
    echo "Starting Crusher game container on port 8080..."
    docker run -p 8080:80 crusher-game
else
    echo "Error: Failed to build Docker image."
    exit 1
fi
