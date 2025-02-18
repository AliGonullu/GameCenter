import { gameState } from '../js/game-state.js';
import { elements } from '../js/dom-elements.js';
import { gameManager } from '../js/game-manager.js';
import { scoreManager } from '../js/score-manager.js';
import { gameSetup } from '../js/game-setup.js';
import { menuManager } from '../js/menu-manager.js';

// Initialize scores from storage
scoreManager.loadScores();

// Initialize the game setup
gameSetup.init();

// Initialize menu
menuManager.init();

// Add event listeners for restart buttons
elements.restartButton.addEventListener('click', () => gameManager.restart());
elements.playAgainButton.addEventListener('click', () => gameManager.restart());

// Add reset scores button listener
elements.resetScoresButton.addEventListener('click', () => {
    scoreManager.confirmReset();
});

// Event Listeners
elements.cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');

        if (gameState.currentBoard[index] === '' && gameState.gameActive) {
            gameState.currentBoard[index] = 'X';
            e.target.textContent = 'X';

            if (gameManager.checkWinner('X')) {
                gameManager.showResult('You win!');
                gameManager.highlightWinningCombination('X');
                gameState.gameActive = false;
                return;
            }

            if (!gameState.currentBoard.includes('')) {
                gameManager.showResult('It\'s a Draw!');
                gameState.gameActive = false;
                return;
            }

            gameManager.makeComputerMove();
        }
    });
});

// Remove the keyboard shortcut since we now have a button
// document.addEventListener('keydown'... can be removed 