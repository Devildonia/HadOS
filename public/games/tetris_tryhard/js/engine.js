import { COLS, ROWS, SHAPES, WALL_KICK_DATA, PIECE_TYPES, COLORS } from './constants.js';

export class TetrisEngine {
    constructor() {
        this.board = [];
        this.pieceBag = [];
        this.pieceConfig = {};
        this.initPieceConfig();
        this.reset();
    }

    reset() {
        this.board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
        this.pieceBag = [];
    }

    initPieceConfig() {
        for (const type in SHAPES) {
            const shape = SHAPES[type];
            let minX = 4, minY = 4, maxX = 0, maxY = 0;
            shape.forEach((row, y) => {
                row.forEach((val, x) => {
                    if (val) {
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                });
            });
            this.pieceConfig[type] = {
                minX, minY,
                gridW: maxX - minX + 1,
                gridH: maxY - minY + 1,
                assetRot: (type === 'I' || type === 'J' || type === 'L') ? 1 : 0
            };
        }
    }

    getNextPieceType() {
        if (this.pieceBag.length === 0) {
            this.pieceBag = [...PIECE_TYPES].sort(() => Math.random() - 0.5);
        }
        return this.pieceBag.pop();
    }

    createPiece(type = this.getNextPieceType()) {
        const rawShape = SHAPES[type];
        const config = this.pieceConfig[type];

        const matrix = rawShape.map((row, y) =>
            row.map((val, x) => val ? { sx: x - config.minX, sy: y - config.minY } : 0)
        );

        return {
            type: type,
            shape: matrix,
            x: Math.floor(COLS / 2) - Math.floor(rawShape[0].length / 2),
            y: type === 'I' ? -1 : 0,
            color: COLORS[type],
            rotation: (type === 'I' || type === 'J' || type === 'L') ? 1 : 0
        };
    }

    collides(piece, board, offsetX = 0, offsetY = 0) {
        for (let dy = 0; dy < piece.shape.length; dy++) {
            for (let dx = 0; dx < piece.shape[dy].length; dx++) {
                if (piece.shape[dy][dx]) {
                    const newX = piece.x + dx + offsetX;
                    const newY = piece.y + dy + offsetY;

                    if (newX < 0 || newX >= COLS || newY >= ROWS) {
                        return true;
                    }
                    if (newY >= 0 && board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /** For inverted gravity: checks if piece hits the ceiling (y < 0) or a block above it. */
    collidesUp(piece, board, offsetX = 0, offsetY = 0) {
        for (let dy = 0; dy < piece.shape.length; dy++) {
            for (let dx = 0; dx < piece.shape[dy].length; dx++) {
                if (piece.shape[dy][dx]) {
                    const newX = piece.x + dx + offsetX;
                    const newY = piece.y + dy + offsetY;

                    if (newX < 0 || newX >= COLS || newY < 0) {
                        return true;
                    }
                    if (newY < ROWS && board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    rotate(piece, board, dir = 1) {
        if (piece.type === 'O') return piece;

        const oldShape = piece.shape;
        const oldRotation = piece.rotation;
        const newRotation = (oldRotation + dir + 4) % 4;

        let rotated;
        if (dir === 1) {
            rotated = oldShape[0].map((_, i) => oldShape.map(row => row[i]).reverse());
        } else {
            rotated = oldShape[0].map((_, i) => oldShape.map(row => row[oldShape.length - 1 - i]));
        }

        const rotatedPiece = { ...piece, shape: rotated, rotation: newRotation };
        const kickType = (piece.type === 'I') ? "4x4" : "3x3";
        const kickKey = `${oldRotation}-${newRotation}`;
        const kicks = WALL_KICK_DATA[kickType][kickKey] || [[0, 0]];

        for (const [kx, ky] of kicks) {
            if (!this.collides(rotatedPiece, board, kx, -ky)) {
                rotatedPiece.x += kx;
                rotatedPiece.y -= ky;
                return rotatedPiece;
            }
        }
        return piece;
    }
}
