# Crusher - A Fancy Candy Crush Clone

Crusher is a beautiful, browser-based match-3 game inspired by Candy Crush. The game features colorful candies, smooth animations, and an engaging gameplay experience.

## Features

- Colorful, modern UI with gradient backgrounds and candy emojis
- Responsive design that works on desktop and mobile devices
- Score tracking and move counting
- Match-3 gameplay with cascading matches
- Smooth animations for candy swapping, matching, and board filling

## How to Play

### Running Locally

1. Open `index.html` in your web browser
2. Click on a candy to select it
3. Click on an adjacent candy to swap them
4. Create matches of 3 or more identical candies in a row or column
5. Matched candies will be removed, and new ones will fall from the top
6. Try to get the highest score possible!

### Running with Docker

#### Option 1: Build locally

1. Build the Docker image:
   ```bash
   docker build -t crusher-game .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 8080:80 crusher-game
   ```

3. Open your browser and navigate to `http://localhost:8080`

#### Option 2: Use pre-built image from GitHub Container Registry

1. Pull the Docker image:
   ```bash
   docker pull ghcr.io/diceone/crusher:latest
   ```

2. Run the Docker container:
   ```bash
   docker run -p 8080:80 ghcr.io/diceone/crusher:latest
   ```

3. Open your browser and navigate to `http://localhost:8080`

4. Play the game as described above

## Game Controls

- **Click/Tap**: Select and swap candies
- **New Game Button**: Start a new game

## Technical Details

The game is built using:
- HTML5
- CSS3 (with animations and gradients)
- Vanilla JavaScript (no external libraries)
- Docker for containerization and deployment
- GitHub Actions for CI/CD

## Continuous Integration

This project uses GitHub Actions for continuous integration and deployment:

- Automatically builds Docker images on every push to the main branch
- Publishes images to GitHub Container Registry
- Runs weekly builds to ensure dependencies are up-to-date
- Allows manual triggering of builds through the GitHub Actions interface

You can see the workflow configuration in `.github/workflows/docker-build.yml`.

## Future Enhancements

Potential future improvements:
- Add sound effects and background music
- Implement different levels with objectives
- Add special candies and power-ups
- Include a timer mode
- Add local storage for high scores

## Credits

Created by [Your Name] as a fun project to demonstrate web development skills.

Enjoy playing Crusher!
