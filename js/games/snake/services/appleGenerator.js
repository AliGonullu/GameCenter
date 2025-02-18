export class AppleGenerator {
    constructor(types) {
        this.appleTypes = types;
    }

    generateNewApple(boardSize, snake) {
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * boardSize),
                y: Math.floor(Math.random() * boardSize)
            };
        } while (this.isPositionOccupied(position, snake));

        return {
            ...position,
            type: this.selectAppleType()
        };
    }

    selectAppleType() {
        const random = Math.random();
        let cumulativeProbability = 0;

        for (const [type, data] of Object.entries(this.appleTypes)) {
            cumulativeProbability += data.probability;
            if (random <= cumulativeProbability) {
                return type;
            }
        }
        return 'normal';
    }

    isPositionOccupied(position, snake) {
        return snake.some(segment =>
            segment.x === position.x &&
            segment.y === position.y
        );
    }
} 