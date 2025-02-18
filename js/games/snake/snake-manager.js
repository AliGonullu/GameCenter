import { SnakeGame } from './snake-game.js';

export const snakeManager = {
    game: null,

    init() {
        const canvas = document.getElementById('snake-canvas');
        const scoreElement = document.getElementById('snake-score');
        const highScoreElement = document.getElementById('snake-high-score');

        this.game = new SnakeGame(canvas, scoreElement, highScoreElement);
        this.addEventListeners();
    },

    addEventListeners() {
        // Back button
        document.getElementById('snake-back-button').addEventListener('click', () => {
            this.cleanup();
            document.getElementById('snake-game').classList.add('hidden');
            document.querySelector('.main-menu').classList.remove('hidden');
        });

        // Restart button
        document.getElementById('snake-restart').addEventListener('click', () => {
            this.game.start();
        });

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
    },

    handleResize() {
        const container = document.querySelector('.game-area');
        const canvas = document.getElementById('snake-canvas');

        // Make the canvas responsive while maintaining the grid
        const size = Math.min(
            container.clientWidth,
            window.innerHeight - 200
        );

        // Adjust canvas display size (CSS)
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
    },

    start() {
        // Create a new game instance each time we start
        this.cleanup();
        this.init();
        this.game.start();
    },

    cleanup() {
        if (this.game) {
            this.game.cleanup();
            this.game = null;

            // Reset score displays
            document.getElementById('snake-score').textContent = '0';
            document.getElementById('snake-game-over').classList.add('hidden');

            // Remove any window resize listeners
            window.removeEventListener('resize', this.handleResize.bind(this));
        }
    }
}; 