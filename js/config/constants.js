export const GAME_SETTINGS = {
    snake: {
        baseSpeed: 200,
        speedIncrease: 2,
        initialPosition: { x: 10, y: 10 },
        boardSize: 25,
        tileSize: 25,
        appleTypes: {
            normal: {
                color: '#ff3838',
                probability: 0.5,
                points: 1,
                growthAmount: 1
            },
            speed: {
                color: '#ffeb3b',
                probability: 0.15,
                points: 2,
                growthAmount: 1,
                speedChange: -30
            },
            slow: {
                color: '#4834d4',
                probability: 0.15,
                points: 2,
                growthAmount: 1,
                speedChange: 50
            },
            grow: {
                color: '#2ecc71',
                probability: 0.1,
                points: 5,
                growthAmount: 8
            },
            rainbow: {
                color: '#ff36ff',
                probability: 0.1,
                points: 3,
                growthAmount: 1,
                effectDuration: 5000
            }
        }
    },
    tictactoe: {
        defaultSize: 3,
        defaultDifficulty: 'medium',
        difficulties: {
            easy: 0.2,
            medium: 0.6,
            hard: 0.9
        }
    }
}; 