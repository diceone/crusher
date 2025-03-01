FROM nginx:alpine

# Add metadata labels
LABEL org.opencontainers.image.source=https://github.com/diceone/crusher
LABEL org.opencontainers.image.description="A fancy Candy Crush clone with Docker support"
LABEL org.opencontainers.image.licenses=MIT

# Copy the game files to the nginx html directory
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
