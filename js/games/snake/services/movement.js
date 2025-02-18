export const movement = {
    calculateNextPosition(head, direction) {
        return {
            x: head.x + direction.dx,
            y: head.y + direction.dy
        };
    },

    isValidDirection(currentDir, newDir) {
        return !(currentDir.dx + newDir.dx === 0 && currentDir.dy + newDir.dy === 0);
    },

    handleKeyPress(event, currentDirection) {
        const directions = {
            'ArrowUp': { dx: 0, dy: -1 },
            'ArrowDown': { dx: 0, dy: 1 },
            'ArrowLeft': { dx: -1, dy: 0 },
            'ArrowRight': { dx: 1, dy: 0 },
            'w': { dx: 0, dy: -1 },
            's': { dx: 0, dy: 1 },
            'a': { dx: -1, dy: 0 },
            'd': { dx: 1, dy: 0 }
        };

        const newDir = directions[event.key.toLowerCase()];
        if (newDir && this.isValidDirection(currentDirection, newDir)) {
            return newDir;
        }
        return null;
    }
}; 