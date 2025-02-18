export const SETTINGS = {
    snake: {
        speed: 200,
        boardSize: 25,
        appleTypes: {
            normal: { color: '#ff3838', points: 1 },
            speed: { color: '#ffeb3b', points: 2, speedBoost: true },
            grow: { color: '#2ecc71', points: 5, growth: 5 },
            rainbow: { color: '#ff36ff', points: 2, colorChange: true }
        }
    },
    tictactoe: {
        boardSizes: [3, 4, 5, 6],
        difficulties: ['easy', 'medium', 'hard']
    }
}; 