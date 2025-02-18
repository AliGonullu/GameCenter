import { SETTINGS } from '../../config/settings.js';
import { Board } from './components/Board.js';
import { AIPlayer } from './services/AIPlayer.js';

export class TicTacToeGame {
    constructor(size = SETTINGS.tictactoe.boardSizes[0]) {
        this.board = new Board(size);
        this.ai = new AIPlayer();
        this.currentPlayer = 'X';
        this.gameActive = true;
    }

    makeMove(position) {
        if (!this.board.isValidMove(position) || !this.gameActive) {
            return false;
        }

        this.board.makeMove(position, this.currentPlayer);

        if (this.board.checkWin(this.currentPlayer)) {
            this.gameActive = false;
            return { result: 'win', player: this.currentPlayer };
        }

        if (this.board.isFull()) {
            this.gameActive = false;
            return { result: 'draw' };
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        return { result: 'continue' };
    }

    makeAIMove() {
        if (this.currentPlayer === 'O' && this.gameActive) {
            const move = this.ai.calculateMove(this.board);
            return this.makeMove(move);
        }
        return null;
    }

    reset() {
        this.board.reset();
        this.currentPlayer = 'X';
        this.gameActive = true;
    }
} 