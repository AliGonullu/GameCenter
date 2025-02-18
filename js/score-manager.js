import { gameState } from './game-state.js';
import { elements } from './dom-elements.js';

export const scoreManager = {
    loadScores() {
        const savedScores = localStorage.getItem('tictactoe_scores');
        if (savedScores) {
            const scores = JSON.parse(savedScores);
            gameState.scores = scores;
        }
        this.updateDisplay();
    },

    saveScores() {
        localStorage.setItem('tictactoe_scores', JSON.stringify(gameState.scores));
    },

    updateDisplay() {
        elements.playerScore.textContent = gameState.scores.player;
        elements.computerScore.textContent = gameState.scores.computer;
        this.saveScores();
    },

    updateScore(winner) {
        if (winner === 'player') {
            gameState.scores.player++;
        } else if (winner === 'computer') {
            gameState.scores.computer++;
        }
        this.updateDisplay();
    },

    reset() {
        gameState.scores.player = 0;
        gameState.scores.computer = 0;
        this.updateDisplay();
    },

    confirmReset() {
        if (confirm('Are you sure you want to reset the scores?')) {
            this.reset();
        }
    }
}; 