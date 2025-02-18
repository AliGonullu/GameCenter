import { TicTacToeGame } from './TicTacToeGame.js';
import { storage } from '../../utils/storage.js';

export const ticTacToeManager = {
    game: null,
    scores: {
        player: 0,
        computer: 0
    },

    init() {
        this.loadScores();
        this.addEventListeners();
    },

    start() {
        const size = parseInt(document.querySelector('.size-btn.selected').dataset.size);
        const difficulty = document.querySelector('.difficulty-btn.selected').dataset.difficulty;

        this.game = new TicTacToeGame(size);
        this.game.ai.setDifficulty(difficulty);
        this.updateDisplay();
    },

    handleCellClick(index) {
        if (!this.game) return;

        const result = this.game.makeMove(index);
        if (result) {
            this.updateDisplay();

            if (result.result === 'win') {
                this.handleWin(result.player);
            } else if (result.result === 'draw') {
                this.handleDraw();
            } else {
                const aiResult = this.game.makeAIMove();
                if (aiResult) {
                    this.updateDisplay();
                    if (aiResult.result === 'win') {
                        this.handleWin(aiResult.player);
                    } else if (aiResult.result === 'draw') {
                        this.handleDraw();
                    }
                }
            }
        }
    },

    updateDisplay() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = this.game.board.cells[index];
        });
    },

    loadScores() {
        const savedScores = storage.get('tictactoe_scores');
        if (savedScores) {
            this.scores = savedScores;
        }
        this.updateScoreDisplay();
    },

    cleanup() {
        this.game = null;
    }
}; 