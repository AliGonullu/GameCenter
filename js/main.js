import { Router } from './core/Router.js';
import { snakeManager } from './games/snake/SnakeManager.js';
import { ticTacToeManager } from './games/tictactoe/TicTacToeManager.js';

// Initialize router
const router = new Router();

// Add game routes
router.addRoute('snake', {
    init: () => snakeManager.start(),
    cleanup: () => snakeManager.cleanup()
});

router.addRoute('tictactoe', {
    init: () => ticTacToeManager.start(),
    cleanup: () => ticTacToeManager.cleanup()
});

// Add click handlers for game cards
document.querySelectorAll('.game-card').forEach(card => {
    if (!card.classList.contains('coming-soon')) {
        card.addEventListener('click', () => {
            const gameId = card.dataset.game;
            router.navigate(gameId);
        });
    }
});

// Add back button handlers
document.querySelectorAll('.back-button').forEach(button => {
    button.addEventListener('click', () => router.returnToMenu());
}); 