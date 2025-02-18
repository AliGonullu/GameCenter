export class SnakeGame {
    constructor(canvas, scoreElement, highScoreElement) {
        // Apple types and their probabilities - define this first
        this.appleTypes = {
            normal: {
                color: '#ff3838',  // Brighter red
                probability: 0.5,   // Slightly reduced probability
                effect: () => {
                    this.score++;
                    this.snakeLength++;
                }
            },
            speed: {
                color: '#ffeb3b',  // Bright yellow
                probability: 0.15,  // Increased probability
                effect: () => {
                    this.score += 2;
                    this.snakeLength++;
                    // More dramatic speed increase
                    this.currentSpeed = Math.max(40, this.currentSpeed - 30);
                }
            },
            slow: {
                color: '#4834d4',  // Deep purple
                probability: 0.15,
                effect: () => {
                    this.score += 2;
                    this.snakeLength++;
                    // More dramatic slowdown
                    this.currentSpeed = Math.min(this.baseSpeed + 50, this.currentSpeed + 50);
                }
            },
            grow: {
                color: '#2ecc71',  // Emerald green
                probability: 0.1,
                effect: () => {
                    this.score += 5;  // Increased score
                    this.snakeLength += 8;  // Grow more
                }
            },
            rainbow: {
                color: '#ff36ff',  // Bright pink
                probability: 0.1,
                effect: () => {
                    this.score += 3;
                    this.snakeLength++;
                    this.snakeColor = this.getRandomColor();
                    // Add pulsing effect
                    this.startPulsingEffect();
                }
            }
        };

        // Snake appearance
        this.snakeColor = {
            head: '#43cea2',
            body: '#2eaf83'
        };

        // Canvas and score elements
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scoreElement = scoreElement;
        this.highScoreElement = highScoreElement;

        // Game settings
        this.tileSize = 25;
        this.tileCount = 25;
        this.baseSpeed = 200;
        this.currentSpeed = this.baseSpeed;
        this.speedIncrease = 2;

        // Initialize canvas size
        this.canvas.width = this.tileSize * this.tileCount;
        this.canvas.height = this.tileSize * this.tileCount;

        // Initialize with a starting direction
        this.dx = 1;
        this.dy = 0;

        // Initial game settings
        this.initialSettings = {
            speed: 200,        // Store initial speed
            snakeLength: 1,    // Store initial length
            position: { x: 10, y: 10 }, // Store initial position
            direction: { dx: 1, dy: 0 } // Store initial direction
        };

        // Game state
        this.reset();

        // Load high score
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.highScoreElement.textContent = this.highScore;

        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        // Start listening for keyboard input
        document.addEventListener('keydown', this.handleKeyPress);
    }

    getRandomColor() {
        const colors = [
            { head: '#ff3838', body: '#ff0000' },    // Bright red
            { head: '#ffeb3b', body: '#ffd700' },    // Gold
            { head: '#4834d4', body: '#3498db' },    // Royal blue
            { head: '#2ecc71', body: '#27ae60' },    // Emerald
            { head: '#ff36ff', body: '#e056fd' },    // Magenta
            { head: '#00ffff', body: '#00c3ff' },    // Cyan
            { head: '#ff9f43', body: '#ee5253' }     // Orange
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    startPulsingEffect() {
        this.isPulsing = true;
        this.pulseTime = 0;
        setTimeout(() => {
            this.isPulsing = false;
        }, 5000); // Pulse effect lasts 5 seconds
    }

    reset() {
        // Snake initial state - use initial settings
        this.snake = [{ ...this.initialSettings.position }];
        this.snakeLength = this.initialSettings.snakeLength;

        // Reset movement to initial values
        this.dx = this.initialSettings.direction.dx;
        this.dy = this.initialSettings.direction.dy;
        this.pendingMove = null;

        // Reset speed to initial value
        this.currentSpeed = this.baseSpeed;

        // Game state
        this.score = 0;
        this.gameOver = false;
        this.paused = false;

        // Place first apple
        this.placeApple();

        // Update score display
        this.scoreElement.textContent = this.score;

        // Hide game over screen
        document.getElementById('snake-game-over').classList.add('hidden');

        // Reset snake color
        this.snakeColor = {
            head: '#43cea2',
            body: '#2eaf83'
        };

        // Reset effects
        this.isPulsing = false;
        this.pulseTime = 0;

        // Cancel any pending timeouts or animation frames
        if (this.gameLoopTimeout) {
            clearTimeout(this.gameLoopTimeout);
        }
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    placeApple() {
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment =>
            segment.x === position.x && segment.y === position.y));

        // Select apple type based on probability
        const random = Math.random();
        let cumulativeProbability = 0;
        let selectedType = 'normal';

        for (const [type, data] of Object.entries(this.appleTypes)) {
            cumulativeProbability += data.probability;
            if (random <= cumulativeProbability) {
                selectedType = type;
                break;
            }
        }

        this.apple = {
            ...position,
            type: selectedType
        };
    }

    handleKeyPress(e) {
        if (this.gameOver) {
            return;
        }

        switch (e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                if (this.dy !== 1) {
                    this.pendingMove = { dx: 0, dy: -1 };
                }
                break;
            case 's':
            case 'arrowdown':
                if (this.dy !== -1) {
                    this.pendingMove = { dx: 0, dy: 1 };
                }
                break;
            case 'a':
            case 'arrowleft':
                if (this.dx !== 1) {
                    this.pendingMove = { dx: -1, dy: 0 };
                }
                break;
            case 'd':
            case 'arrowright':
                if (this.dx !== -1) {
                    this.pendingMove = { dx: 1, dy: 0 };
                }
                break;
            case ' ':
                this.paused = !this.paused;
                break;
        }
    }

    update() {
        if (this.gameOver || this.paused) return;

        // Handle pending move immediately
        if (this.pendingMove) {
            this.dx = this.pendingMove.dx;
            this.dy = this.pendingMove.dy;
            this.pendingMove = null;
        }

        // Move snake
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

        // Check for collisions
        if (this.checkCollision(head)) {
            this.gameOver = true;
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check for apple
        if (head.x === this.apple.x && head.y === this.apple.y) {
            // Apply apple effect
            const appleData = this.appleTypes[this.apple.type];
            appleData.effect();

            // Update score display
            this.scoreElement.textContent = this.score;

            // Place new apple
            this.placeApple();

            // Update high score
            if (this.score > this.highScore) {
                this.highScore = this.score;
                this.highScoreElement.textContent = this.highScore;
                localStorage.setItem('snakeHighScore', this.highScore);
            }
        }

        // Remove tail if snake hasn't eaten
        while (this.snake.length > this.snakeLength) {
            this.snake.pop();
        }
    }

    checkCollision(head) {
        // Wall collision
        if (head.x < 0 || head.x >= this.tileCount ||
            head.y < 0 || head.y >= this.tileCount) {
            return true;
        }

        // Self collision - only check if snake length > 1
        return this.snake.length > 1 && this.snake.some((segment, index) =>
            // Skip checking the last segment as it will be removed
            index < this.snake.length - 1 && segment.x === head.x && segment.y === head.y);
    }

    draw() {
        // Clear canvas completely
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid (optional)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.tileSize, 0);
            this.ctx.lineTo(i * this.tileSize, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.tileSize);
            this.ctx.lineTo(this.canvas.width, i * this.tileSize);
            this.ctx.stroke();
        }

        // Draw snake with pulsing effect if active
        this.snake.forEach((segment, index) => {
            let color = index === 0 ? this.snakeColor.head : this.snakeColor.body;

            if (this.isPulsing) {
                this.pulseTime += 0.1;
                const pulse = Math.sin(this.pulseTime) * 0.3 + 0.7; // Value between 0.4 and 1
                this.ctx.globalAlpha = pulse;
            }

            this.ctx.fillStyle = color;
            this.ctx.fillRect(
                segment.x * this.tileSize + 1,
                segment.y * this.tileSize + 1,
                this.tileSize - 2,
                this.tileSize - 2
            );
            this.ctx.globalAlpha = 1;
        });

        // Draw apple with enhanced glow effect
        const appleData = this.appleTypes[this.apple.type];

        // Stronger glow for special apples
        if (this.apple.type !== 'normal') {
            this.ctx.shadowColor = appleData.color;
            this.ctx.shadowBlur = 15;

            // Add outer glow
            this.ctx.beginPath();
            this.ctx.arc(
                (this.apple.x + 0.5) * this.tileSize,
                (this.apple.y + 0.5) * this.tileSize,
                this.tileSize / 2,
                0,
                Math.PI * 2
            );
            this.ctx.fillStyle = appleData.color + '40'; // 25% opacity
            this.ctx.fill();
        }

        // Draw apple
        this.ctx.shadowColor = appleData.color;
        this.ctx.shadowBlur = this.apple.type === 'normal' ? 10 : 20;
        this.ctx.fillStyle = appleData.color;

        this.ctx.beginPath();
        this.ctx.arc(
            (this.apple.x + 0.5) * this.tileSize,
            (this.apple.y + 0.5) * this.tileSize,
            this.tileSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Reset shadow
        this.ctx.shadowBlur = 0;
    }

    gameLoop() {
        this.update();
        this.draw();

        if (!this.gameOver) {
            // Store the timeout ID
            this.gameLoopTimeout = setTimeout(() => {
                this.animationFrameId = requestAnimationFrame(this.gameLoop);
            }, this.currentSpeed);
        } else {
            document.getElementById('snake-game-over').classList.remove('hidden');
            document.querySelector('.final-score').textContent = this.score;
        }
    }

    start() {
        this.reset();
        requestAnimationFrame(this.gameLoop);
    }

    cleanup() {
        // Cancel any pending animations or timeouts
        if (this.gameLoopTimeout) {
            clearTimeout(this.gameLoopTimeout);
        }
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyPress);

        // Reset all game state
        this.reset();
    }
} 