export const gameState = {
    currentBoard: ['', '', '', '', '', '', '', '', ''],
    gameActive: true,
    scores: {
        player: parseInt(localStorage.getItem('playerScore')) || 0,
        computer: parseInt(localStorage.getItem('computerScore')) || 0
    }
}; 