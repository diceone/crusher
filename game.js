document.addEventListener('DOMContentLoaded', () => {
    // Game configuration
    const config = {
        boardSize: 8,
        candyTypes: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
        candyEmojis: ['🍓', '🍊', '🍋', '🍏', '🫐', '🍇'],
        animationSpeed: 300, // ms
        matchScore: 10
    };

    // Game state
    let gameState = {
        board: [],
        selectedCandy: null,
        score: 0,
        moves: 0,
        isSwapping: false,
        isChecking: false
    };

    // DOM elements
    const boardElement = document.getElementById('board');
    const scoreElement = document.getElementById('score');
    const movesElement = document.getElementById('moves');
    const newGameButton = document.getElementById('new-game-btn');

    // Initialize the game
    function initGame() {
        resetGameState();
        createBoard();
        renderBoard();
        
        // Check for initial matches and fill the board
        let hasMatches = true;
        while (hasMatches) {
            hasMatches = checkForMatches();
            if (hasMatches) {
                removeMatches();
                fillBoard();
            }
        }
    }

    // Reset game state
    function resetGameState() {
        gameState = {
            board: [],
            selectedCandy: null,
            score: 0,
            moves: 0,
            isSwapping: false,
            isChecking: false
        };
        scoreElement.textContent = '0';
        movesElement.textContent = '0';
    }

    // Create the game board
    function createBoard() {
        for (let row = 0; row < config.boardSize; row++) {
            gameState.board[row] = [];
            for (let col = 0; col < config.boardSize; col++) {
                // Generate random candy but avoid creating matches
                let candyType;
                do {
                    candyType = getRandomCandyType();
                } while (
                    (row >= 2 && 
                     gameState.board[row-1][col] === candyType && 
                     gameState.board[row-2][col] === candyType) ||
                    (col >= 2 && 
                     gameState.board[row][col-1] === candyType && 
                     gameState.board[row][col-2] === candyType)
                );
                gameState.board[row][col] = candyType;
            }
        }
    }

    // Get random candy type
    function getRandomCandyType() {
        const randomIndex = Math.floor(Math.random() * config.candyTypes.length);
        return config.candyTypes[randomIndex];
    }

    // Render the game board
    function renderBoard() {
        boardElement.innerHTML = '';
        
        for (let row = 0; row < config.boardSize; row++) {
            for (let col = 0; col < config.boardSize; col++) {
                const candyType = gameState.board[row][col];
                const candyIndex = config.candyTypes.indexOf(candyType);
                const emoji = config.candyEmojis[candyIndex];
                
                const candy = document.createElement('div');
                candy.className = `candy ${candyType}`;
                candy.dataset.row = row;
                candy.dataset.col = col;
                candy.textContent = emoji;
                
                candy.addEventListener('click', () => handleCandyClick(row, col));
                
                boardElement.appendChild(candy);
            }
        }
    }

    // Handle candy click
    function handleCandyClick(row, col) {
        if (gameState.isSwapping || gameState.isChecking) return;
        
        const clickedCandy = { row, col, type: gameState.board[row][col] };
        
        // If no candy is selected, select this one
        if (!gameState.selectedCandy) {
            gameState.selectedCandy = clickedCandy;
            highlightCandy(row, col, true);
            return;
        }
        
        // If the same candy is clicked, deselect it
        if (gameState.selectedCandy.row === row && gameState.selectedCandy.col === col) {
            highlightCandy(row, col, false);
            gameState.selectedCandy = null;
            return;
        }
        
        // Check if the candies are adjacent
        const isAdjacent = 
            (Math.abs(gameState.selectedCandy.row - row) === 1 && gameState.selectedCandy.col === col) ||
            (Math.abs(gameState.selectedCandy.col - col) === 1 && gameState.selectedCandy.row === row);
        
        if (isAdjacent) {
            // Deselect the previously selected candy
            highlightCandy(gameState.selectedCandy.row, gameState.selectedCandy.col, false);
            
            // Swap the candies
            swapCandies(gameState.selectedCandy, clickedCandy);
        } else {
            // If not adjacent, deselect the previous candy and select the new one
            highlightCandy(gameState.selectedCandy.row, gameState.selectedCandy.col, false);
            gameState.selectedCandy = clickedCandy;
            highlightCandy(row, col, true);
        }
    }

    // Highlight or unhighlight a candy
    function highlightCandy(row, col, highlight) {
        const candyElements = document.querySelectorAll('.candy');
        const index = row * config.boardSize + col;
        
        if (highlight) {
            candyElements[index].classList.add('selected');
        } else {
            candyElements[index].classList.remove('selected');
        }
    }

    // Swap two candies
    function swapCandies(candy1, candy2) {
        gameState.isSwapping = true;
        
        // Swap in the data model
        const temp = gameState.board[candy1.row][candy1.col];
        gameState.board[candy1.row][candy1.col] = gameState.board[candy2.row][candy2.col];
        gameState.board[candy2.row][candy2.col] = temp;
        
        // Visual swap animation
        const candy1Element = document.querySelector(`.candy[data-row="${candy1.row}"][data-col="${candy1.col}"]`);
        const candy2Element = document.querySelector(`.candy[data-row="${candy2.row}"][data-col="${candy2.col}"]`);
        
        // Swap classes and emojis
        const candy1Type = candy1Element.className.split(' ')[1];
        const candy2Type = candy2Element.className.split(' ')[1];
        const candy1Emoji = candy1Element.textContent;
        const candy2Emoji = candy2Element.textContent;
        
        candy1Element.classList.remove(candy1Type);
        candy1Element.classList.add(candy2Type);
        candy1Element.textContent = candy2Emoji;
        
        candy2Element.classList.remove(candy2Type);
        candy2Element.classList.add(candy1Type);
        candy2Element.textContent = candy1Emoji;
        
        // Increment moves
        gameState.moves++;
        movesElement.textContent = gameState.moves;
        
        // Check for matches after swap
        setTimeout(() => {
            const hasMatches = checkForMatches();
            
            if (hasMatches) {
                removeMatches();
                
                // After removing matches, fill the board with new candies
                setTimeout(() => {
                    fillBoard();
                    gameState.isSwapping = false;
                    
                    // Continue checking for cascading matches
                    checkForCascadingMatches();
                }, config.animationSpeed);
            } else {
                // If no matches, swap back
                swapBack(candy1, candy2);
            }
            
            // Reset selected candy
            gameState.selectedCandy = null;
        }, config.animationSpeed);
    }

    // Swap back if no matches
    function swapBack(candy1, candy2) {
        // Swap back in the data model
        const temp = gameState.board[candy1.row][candy1.col];
        gameState.board[candy1.row][candy1.col] = gameState.board[candy2.row][candy2.col];
        gameState.board[candy2.row][candy2.col] = temp;
        
        // Visual swap back animation
        const candy1Element = document.querySelector(`.candy[data-row="${candy1.row}"][data-col="${candy1.col}"]`);
        const candy2Element = document.querySelector(`.candy[data-row="${candy2.row}"][data-col="${candy2.col}"]`);
        
        // Swap classes and emojis back
        const candy1Type = candy1Element.className.split(' ')[1];
        const candy2Type = candy2Element.className.split(' ')[1];
        const candy1Emoji = candy1Element.textContent;
        const candy2Emoji = candy2Element.textContent;
        
        candy1Element.classList.remove(candy1Type);
        candy1Element.classList.add(candy2Type);
        candy1Element.textContent = candy2Emoji;
        
        candy2Element.classList.remove(candy2Type);
        candy2Element.classList.add(candy1Type);
        candy2Element.textContent = candy1Emoji;
        
        // Decrement moves (since the swap was invalid)
        gameState.moves--;
        movesElement.textContent = gameState.moves;
        
        gameState.isSwapping = false;
    }

    // Check for matches (3 or more in a row/column)
    function checkForMatches() {
        gameState.isChecking = true;
        let hasMatches = false;
        
        // Check for horizontal matches
        for (let row = 0; row < config.boardSize; row++) {
            for (let col = 0; col < config.boardSize - 2; col++) {
                const candyType = gameState.board[row][col];
                if (candyType && 
                    gameState.board[row][col+1] === candyType && 
                    gameState.board[row][col+2] === candyType) {
                    
                    // Mark matched candies
                    for (let i = 0; i < 3; i++) {
                        if (!gameState.board[row][col+i].matched) {
                            gameState.board[row][col+i] = {
                                type: candyType,
                                matched: true
                            };
                        }
                    }
                    hasMatches = true;
                }
            }
        }
        
        // Check for vertical matches
        for (let col = 0; col < config.boardSize; col++) {
            for (let row = 0; row < config.boardSize - 2; row++) {
                const candyType = gameState.board[row][col];
                if (candyType && 
                    gameState.board[row+1][col] === candyType && 
                    gameState.board[row+2][col] === candyType) {
                    
                    // Mark matched candies
                    for (let i = 0; i < 3; i++) {
                        if (!gameState.board[row+i][col].matched) {
                            gameState.board[row+i][col] = {
                                type: candyType,
                                matched: true
                            };
                        }
                    }
                    hasMatches = true;
                }
            }
        }
        
        gameState.isChecking = false;
        return hasMatches;
    }

    // Remove matched candies
    function removeMatches() {
        let matchCount = 0;
        
        for (let row = 0; row < config.boardSize; row++) {
            for (let col = 0; col < config.boardSize; col++) {
                if (gameState.board[row][col].matched) {
                    const candyElement = document.querySelector(`.candy[data-row="${row}"][data-col="${col}"]`);
                    candyElement.classList.add('matched');
                    
                    // Set to null to indicate empty space
                    gameState.board[row][col] = null;
                    matchCount++;
                    
                    // Add pop animation
                    setTimeout(() => {
                        candyElement.style.opacity = '0';
                    }, 200);
                }
            }
        }
        
        // Update score
        if (matchCount > 0) {
            const points = matchCount * config.matchScore;
            gameState.score += points;
            scoreElement.textContent = gameState.score;
            
            // Show score animation
            const scoreAnimation = document.createElement('div');
            scoreAnimation.className = 'score-animation';
            scoreAnimation.textContent = `+${points}`;
            document.querySelector('.score').appendChild(scoreAnimation);
            
            setTimeout(() => {
                scoreAnimation.remove();
            }, 1000);
        }
    }

    // Fill the board with new candies
    function fillBoard() {
        // Move candies down to fill empty spaces
        for (let col = 0; col < config.boardSize; col++) {
            let emptySpaces = 0;
            
            // Start from the bottom of the column
            for (let row = config.boardSize - 1; row >= 0; row--) {
                if (gameState.board[row][col] === null) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    // Move candy down
                    const candyType = gameState.board[row][col];
                    gameState.board[row + emptySpaces][col] = candyType;
                    gameState.board[row][col] = null;
                    
                    // Update visual representation
                    const candyElement = document.querySelector(`.candy[data-row="${row}"][data-col="${col}"]`);
                    candyElement.dataset.row = row + emptySpaces;
                    
                    // Animate the candy falling
                    candyElement.style.transform = `translateY(${emptySpaces * 100}%)`;
                    setTimeout(() => {
                        candyElement.style.transform = '';
                    }, config.animationSpeed);
                }
            }
            
            // Add new candies at the top
            for (let i = 0; i < emptySpaces; i++) {
                const row = emptySpaces - i - 1;
                const candyType = getRandomCandyType();
                gameState.board[row][col] = candyType;
                
                // Create new candy element
                const candyIndex = config.candyTypes.indexOf(candyType);
                const emoji = config.candyEmojis[candyIndex];
                
                const candy = document.createElement('div');
                candy.className = `candy ${candyType}`;
                candy.dataset.row = row;
                candy.dataset.col = col;
                candy.textContent = emoji;
                candy.style.opacity = '0';
                
                candy.addEventListener('click', () => handleCandyClick(row, col));
                
                boardElement.appendChild(candy);
                
                // Animate the candy appearing
                setTimeout(() => {
                    candy.style.opacity = '1';
                }, 50);
            }
        }
        
        // Re-render the board to update positions
        setTimeout(() => {
            renderBoard();
        }, config.animationSpeed);
    }

    // Check for cascading matches after filling the board
    function checkForCascadingMatches() {
        setTimeout(() => {
            const hasMatches = checkForMatches();
            
            if (hasMatches) {
                removeMatches();
                
                setTimeout(() => {
                    fillBoard();
                    
                    // Continue checking for more cascading matches
                    checkForCascadingMatches();
                }, config.animationSpeed);
            }
        }, config.animationSpeed);
    }

    // Event listeners
    newGameButton.addEventListener('click', initGame);

    // Initialize the game on load
    initGame();
});
