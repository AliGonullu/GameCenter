export const collision = {
    checkWallCollision(head, boardSize) {
        return (
            head.x < 0 ||
            head.x >= boardSize ||
            head.y < 0 ||
            head.y >= boardSize
        );
    },

    checkSelfCollision(head, body) {
        return body.some((segment, index) =>
            index < body.length - 1 &&
            segment.x === head.x &&
            segment.y === head.y
        );
    },

    checkAppleCollision(head, apple) {
        return head.x === apple.x && head.y === apple.y;
    }
}; 