export class AIPlayer {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
    }

    calculateMove(board) {
        // Check for winning move
        const winningMove = this.findWinningMove(board, 'O');
        if (winningMove !== null) {
            return winningMove;
        }

        // Block player's winning move
        const blockingMove = this.findWinningMove(board, 'X');
        if (blockingMove !== null) {
            return blockingMove;
        }

        // Take center if available
        const center = Math.floor(board.cells.length / 2);
        if (board.cells[center] === '') {
            return center;
        }

        // Take random available move
        const availableMoves = board.cells
            .map((cell, index) => cell === '' ? index : null)
            .filter(cell => cell !== null);

        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    findWinningMove(board, player) {
        for (let i = 0; i < board.cells.length; i++) {
            if (board.cells[i] === '') {
                board.cells[i] = player;
                if (board.checkWin(player)) {
                    board.cells[i] = '';
                    return i;
                }
                board.cells[i] = '';
            }
        }
        return null;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }
} 