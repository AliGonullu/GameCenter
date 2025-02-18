export class Board {
    constructor(size) {
        this.size = size;
        this.cells = Array(size * size).fill('');
    }

    makeMove(position, player) {
        this.cells[position] = player;
    }

    isValidMove(position) {
        return this.cells[position] === '';
    }

    isFull() {
        return !this.cells.includes('');
    }

    checkWin(player) {
        // Check rows
        for (let i = 0; i < this.size; i++) {
            if (this.checkLine(i * this.size, 1, this.size, player)) {
                return true;
            }
        }

        // Check columns
        for (let i = 0; i < this.size; i++) {
            if (this.checkLine(i, this.size, this.size, player)) {
                return true;
            }
        }

        // Check diagonals
        if (this.checkLine(0, this.size + 1, this.size, player)) {
            return true;
        }
        if (this.checkLine(this.size - 1, this.size - 1, this.size, player)) {
            return true;
        }

        return false;
    }

    checkLine(start, step, count, player) {
        for (let i = 0; i < count; i++) {
            if (this.cells[start + i * step] !== player) {
                return false;
            }
        }
        return true;
    }

    reset() {
        this.cells = Array(this.size * this.size).fill('');
    }
} 