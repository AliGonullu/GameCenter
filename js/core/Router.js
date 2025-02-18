export class Router {
    constructor() {
        this.routes = new Map();
        this.currentGame = null;
    }

    addRoute(gameId, handlers) {
        this.routes.set(gameId, handlers);
    }

    navigate(gameId) {
        // Hide all game containers
        document.querySelectorAll('.game-container').forEach(container => {
            container.classList.add('hidden');
        });

        // Hide main menu
        document.querySelector('.main-menu').classList.add('hidden');

        // Show selected game
        const gameContainer = document.getElementById(`${gameId}-game`);
        if (gameContainer) {
            gameContainer.classList.remove('hidden');

            // Initialize game if handlers exist
            const handlers = this.routes.get(gameId);
            if (handlers?.init) {
                handlers.init();
            }
            this.currentGame = gameId;
        }
    }

    returnToMenu() {
        // Cleanup current game if exists
        const handlers = this.routes.get(this.currentGame);
        if (handlers?.cleanup) {
            handlers.cleanup();
        }

        // Show main menu
        document.querySelector('.main-menu').classList.remove('hidden');

        // Hide all game containers
        document.querySelectorAll('.game-container').forEach(container => {
            container.classList.add('hidden');
        });

        this.currentGame = null;
    }
} 