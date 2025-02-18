import { elements } from './dom-elements.js';
import { snakeManager } from './games/snake/snake-manager.js';

export const menuManager = {
    init() {
        this.addEventListeners();
    },

    addEventListeners() {
        document.querySelectorAll('.game-card').forEach(card => {
            if (!card.classList.contains('coming-soon')) {
                card.addEventListener('click', (e) => {
                    const gameId = card.dataset.game;
                    this.startGame(gameId);
                });
            }
        });
    },

    startGame(gameId) {
        document.querySelector('.main-menu').classList.add('hidden');
        document.getElementById(`${gameId}-game`).classList.remove('hidden');

        // Initialize specific game
        if (gameId === 'snake') {
            snakeManager.start();
        }
    },

    returnToMenu() {
        document.querySelector('.main-menu').classList.remove('hidden');
        document.querySelectorAll('.game-container').forEach(container => {
            container.classList.add('hidden');
        });

        // Cleanup running games
        snakeManager.cleanup();
    }
}; 