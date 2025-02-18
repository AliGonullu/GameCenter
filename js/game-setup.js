import { elements } from './dom-elements.js';
import { gameSettings } from './game-settings.js';
import { gameManager } from './game-manager.js';
import { menuManager } from './menu-manager.js';

export const gameSetup = {
    init() {
        this.addEventListeners();
        this.selectDefaultOptions();
    },

    addEventListeners() {
        elements.sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectSize(btn));
        });

        elements.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectDifficulty(btn));
        });

        elements.startGameBtn.addEventListener('click', () => this.startGame());

        elements.backButton.addEventListener('click', () => this.returnToMenu());

        elements.menuBackButton.addEventListener('click', () => {
            menuManager.returnToMenu();
        });
    },

    selectSize(btn) {
        elements.sizeBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        gameSettings.boardSize = parseInt(btn.dataset.size);
    },

    selectDifficulty(btn) {
        elements.difficultyBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        gameSettings.difficulty = btn.dataset.difficulty;
    },

    selectDefaultOptions() {
        // Select default size (3x3)
        elements.sizeBtns[0].classList.add('selected');
        // Select default difficulty (medium)
        elements.difficultyBtns[1].classList.add('selected');
    },

    startGame() {
        elements.openingScreen.classList.add('hidden');
        elements.gameScreen.classList.remove('hidden');
        this.createBoard();
        gameManager.initializeGame();
    },

    createBoard() {
        const size = gameSettings.boardSize;
        const board = elements.board;

        // Clear existing board
        board.innerHTML = '';

        // Set grid columns based on size
        board.style.gridTemplateColumns = `repeat(${size}, 100px)`;

        // Create cells
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            board.appendChild(cell);
        }

        // Update cells reference
        elements.cells = document.querySelectorAll('.cell');
    },

    returnToMenu() {
        elements.gameScreen.classList.add('hidden');
        elements.openingScreen.classList.remove('hidden');
        // Reset the game state
        gameManager.restart();
        // Return to main menu
        menuManager.returnToMenu();
    }
}; 