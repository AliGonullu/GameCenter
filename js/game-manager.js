import { gameState } from './game-state.js';
import { elements } from './dom-elements.js';
import { computerPlayer } from './computer-player.js';
import { scoreManager } from './score-manager.js';
import { gameSettings } from './game-settings.js';

export const gameManager = {
    initializeGame() {
        // Reset game state
        const size = gameSettings.boardSize;
        gameState.currentBoard = Array(size * size).fill('');
        gameState.gameActive = true;

        // Add click handlers to all cells
        elements.cells.forEach(cell => {
            cell.addEventListener('click', this.handleCellClick.bind(this));
        });
    },

    handleCellClick(e) {
        const index = e.target.getAttribute('data-index');

        if (gameState.currentBoard[index] === '' && gameState.gameActive) {
            // Player's move
            gameState.currentBoard[index] = 'X';
            e.target.textContent = 'X';

            if (this.checkWinner('X')) {
                this.showResult('You win!');
                this.highlightWinningCombination('X');
                gameState.gameActive = false;
                return;
            }

            if (!gameState.currentBoard.includes('')) {
                this.showResult('It\'s a Draw!');
                gameState.gameActive = false;
                return;
            }

            this.makeComputerMove();
        }
    },

    checkWinner(player) {
        const size = gameSettings.boardSize;

        // Check rows
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
            }
            if (row.every(idx => gameState.currentBoard[idx] === player)) {
                return true;
            }
        }

        // Check columns
        for (let i = 0; i < size; i++) {
            let col = [];
            for (let j = 0; j < size; j++) {
                col.push(j * size + i);
            }
            if (col.every(idx => gameState.currentBoard[idx] === player)) {
                return true;
            }
        }

        // Check diagonals
        let diag1 = [];
        let diag2 = [];
        for (let i = 0; i < size; i++) {
            diag1.push(i * size + i);
            diag2.push(i * size + (size - 1 - i));
        }

        if (diag1.every(idx => gameState.currentBoard[idx] === player)) {
            return true;
        }
        if (diag2.every(idx => gameState.currentBoard[idx] === player)) {
            return true;
        }

        return false;
    },

    highlightWinningCombination(player) {
        const winningCombination = this.findWinningCombination(player);
        if (winningCombination) {
            winningCombination.forEach(index => {
                elements.cells[index].classList.add('winner');
            });
        }
    },

    findWinningCombination(player) {
        const size = gameSettings.boardSize;
        let winningCombination = null;

        // Check rows
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
            }
            if (row.every(idx => gameState.currentBoard[idx] === player)) {
                return row;
            }
        }

        // Check columns
        for (let i = 0; i < size; i++) {
            let col = [];
            for (let j = 0; j < size; j++) {
                col.push(j * size + i);
            }
            if (col.every(idx => gameState.currentBoard[idx] === player)) {
                return col;
            }
        }

        // Check diagonals
        let diag1 = [];
        let diag2 = [];
        for (let i = 0; i < size; i++) {
            diag1.push(i * size + i);
            diag2.push(i * size + (size - 1 - i));
        }

        if (diag1.every(idx => gameState.currentBoard[idx] === player)) {
            return diag1;
        }
        if (diag2.every(idx => gameState.currentBoard[idx] === player)) {
            return diag2;
        }

        return null;
    },

    showResult(message) {
        elements.resultMessage.textContent = message;
        elements.resultScreen.classList.add('show');

        if (message === 'You win!') {
            scoreManager.updateScore('player');
        } else if (message === 'Computer wins!') {
            scoreManager.updateScore('computer');
        }
    },

    makeComputerMove() {
        const move = computerPlayer.makeMove();

        gameState.currentBoard[move] = 'O';
        elements.cells[move].textContent = 'O';

        if (this.checkWinner('O')) {
            this.showResult('Computer wins!');
            this.highlightWinningCombination('O');
            gameState.gameActive = false;
            return;
        }

        // Add draw check after computer's move
        if (!gameState.currentBoard.includes('')) {
            this.showResult('It\'s a Draw!');
            gameState.gameActive = false;
            return;
        }
    },

    restart() {
        const size = gameSettings.boardSize;
        gameState.currentBoard = Array(size * size).fill('');
        gameState.gameActive = true;
        elements.resultScreen.classList.remove('show');
        elements.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner');
        });
    }
}; 