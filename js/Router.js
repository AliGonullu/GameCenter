export class Router {
    constructor() {
        this.currentGame = null;
    }

    showGame(gameId) {
        // Hide menu, show game
        document.querySelector('.main-menu').classList.add('hidden');
        document.getElementById(`${gameId}-game`).classList.remove('hidden');
        this.currentGame = gameId;
    }

    showMenu() {
        // Hide games, show menu
        document.querySelectorAll('.game-container').forEach(container => {
            container.classList.add('hidden');
        });
        document.querySelector('.main-menu').classList.remove('hidden');
        this.currentGame = null;
    }
} 