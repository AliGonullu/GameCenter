import { gameState } from './game-state.js';
import { gameSettings } from './game-settings.js';

export const computerPlayer = {
    findWinningMove(player) {
        const size = gameSettings.boardSize;

        // Check rows
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
            }
            let result = this.checkPotentialWin(row, player);
            if (result !== null) return result;
        }

        // Check columns
        for (let i = 0; i < size; i++) {
            let col = [];
            for (let j = 0; j < size; j++) {
                col.push(j * size + i);
            }
            let result = this.checkPotentialWin(col, player);
            if (result !== null) return result;
        }

        // Check diagonals
        let diag1 = [];
        let diag2 = [];
        for (let i = 0; i < size; i++) {
            diag1.push(i * size + i);
            diag2.push(i * size + (size - 1 - i));
        }

        let result = this.checkPotentialWin(diag1, player);
        if (result !== null) return result;

        result = this.checkPotentialWin(diag2, player);
        if (result !== null) return result;

        return null;
    },

    checkPotentialWin(line, player) {
        const playerCells = line.filter(idx => gameState.currentBoard[idx] === player);
        const emptyCells = line.filter(idx => gameState.currentBoard[idx] === '');

        if (playerCells.length === line.length - 1 && emptyCells.length === 1) {
            return emptyCells[0];
        }
        return null;
    },

    findBestMove() {
        const size = gameSettings.boardSize;

        // Take center if available (for odd-sized boards)
        if (size % 2 === 1) {
            const center = Math.floor(size * size / 2);
            if (gameState.currentBoard[center] === '' && Math.random() > 0.1) {
                return center;
            }
        }

        // Take corners
        const corners = [0, size - 1, size * (size - 1), (size * size) - 1];
        const availableCorners = corners.filter(corner => gameState.currentBoard[corner] === '');
        if (Math.random() > 0.4 && availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Take any available cell
        const emptyCells = gameState.currentBoard
            .map((cell, index) => cell === '' ? index : null)
            .filter(cell => cell !== null);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    },

    makeMove() {
        const difficultyChance = gameSettings.difficultyLevels[gameSettings.difficulty];

        if (Math.random() < difficultyChance) {
            // Make optimal move
            return this.findWinningMove('O') ||
                this.findWinningMove('X') ||
                this.findBestMove();
        } else {
            // Make random move
            const emptyCells = gameState.currentBoard
                .map((cell, index) => cell === '' ? index : null)
                .filter(cell => cell !== null);
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
    }
}; 