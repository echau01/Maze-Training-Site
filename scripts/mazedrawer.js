import Maze from "./maze.js";
import MazePath from "./mazepath.js"


export const DIRECTIONS = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
}

/**
 * A class that renders mazes onto HTML canvas elements.
 */
export default class MazeDrawer {
    /**
     * Create a maze drawer that handles the rendering of the given maze onto
     * the given canvas element.
     *
     * @param {Maze} maze
     * @param {HTMLCanvasElement} canvasElement
     */
    constructor(maze, canvasElement) {
        this.maze = maze;
        this.canvas = canvasElement;
    }

    /**
     * Render the maze associated with this maze drawer onto this maze drawer's
     * canvas element. Overlays the given maze path on top of the maze
     * if the parameter is supplied.
     *
     * @param {MazePath} [mazePath] the maze path to overlay on top of the maze.
     * This parameter is ignored if omitted.
     */
    drawMaze(mazePath) {
        for (let row = 0; row < this.maze.getRows(); row++) {
            for (let column = 0; column < this.maze.getColumns(); column++) {
                this.drawCell(row, column, mazePath);
            }
        }
    }

    /**
     * Draws an open cell at the given row and column on this maze drawer's canvas element.
     *
     * @param {number} row the row of the open cell to draw
     * @param {number} column the column of the open cell to draw
     */
    drawOpenCell(row, column) {
        const ctx = this.canvas.getContext("2d");
        const cellWidth = this.canvas.width / this.maze.getColumns();
        const cellHeight = this.canvas.height / this.maze.getRows();

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight);
    }

    /**
     * Draws a closed cell at the given row and column on this maze drawer's canvas element.
     *
     * @param {number} row the row of the closed cell to draw
     * @param {number} column the column of the closed cell to draw
     */
    drawClosedCell(row, column) {
        const ctx = this.canvas.getContext("2d");
        const cellWidth = this.canvas.width / this.maze.getColumns();
        const cellHeight = this.canvas.height / this.maze.getRows();

        ctx.fillStyle = "#000000";
        ctx.fillRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight);
    }

    /**
     * Draws the cell at the given row and column. If the cell is in the given maze path, then draws the
     * path on top of the cell. The mazePath parameter is ignored if it is omitted; no path is overlaid
     * above the cell.
     *
     * @param {number} row the row of the cell to draw
     * @param {number} column the column of the cell to draw
     * @param {MazePath} [mazePath] the maze path to render on top of the cell
     */
    drawCell(row, column, mazePath) {
        const cell = this.maze.getCell(row, column);

        if (cell.isOpen()) {
            this.drawOpenCell(cell.getRow(), cell.getColumn());
        } else {
            this.drawClosedCell(cell.getRow(), cell.getColumn());
        }

        if (mazePath) {
            const position = mazePath.getPosition(cell);

            if (position !== -1) {
                /**
                 * Assumes (dx, dy) is one of (0, -1), (0, 1), (-1, 0), or (1, 0).
                 * Returns one of DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT,
                 * or DIRECTIONS.RIGHT depending on which direction the vector (dx, dy)
                 * points towards. Note that a positive dy indicates a downward-pointing vector.
                 */
                const getDirection = function (dx, dy) {
                    if (dx === 0) {
                        return dy === 1 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
                    } else {
                        return dx === 1 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
                    }
                };

                const nextCell = mazePath.getCell(position + 1);
                const prevCell = mazePath.getCell(position - 1);

                if (nextCell) {
                    const dx = nextCell.getColumn() - cell.getColumn();
                    const dy = nextCell.getRow() - cell.getRow();
                    this.drawLineSegment(cell.getRow(), cell.getColumn(), getDirection(dx, dy));
                } else {
                    this.drawEllipse(cell.getRow(), cell.getColumn());
                }

                if (prevCell) {
                    const dx = prevCell.getColumn() - cell.getColumn();
                    const dy = prevCell.getRow() - cell.getRow();
                    this.drawLineSegment(cell.getRow(), cell.getColumn(), getDirection(dx, dy));
                }
            }
        }
    }

    /**
     * Draws a red line segment from the middle of the cell at the given row and column
     * to the edge of the cell in the given direction.
     *
     * @param {number} row the row of the cell to draw the line segment in
     * @param {number} column the column of the cell to draw the line segment in
     * @param {*} direction the direction to draw the line segment in, starting from the middle of the cell.
     * Must be one of DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, or DIRECTIONS.RIGHT.
     */
    drawLineSegment(row, column, direction) {
        const ctx = this.canvas.getContext("2d");
        const cellWidth = this.canvas.width / this.maze.getColumns();
        const cellHeight = this.canvas.height / this.maze.getRows();

        // The line segment is really a rectangle.
        // Top left corner of the line segment
        let x = column * cellWidth;
        let y = row * cellHeight;

        // Dimensions of the line segment
        let dx = 0.2 * cellWidth;
        let dy = 0.2 * cellHeight;

        if (direction === DIRECTIONS.UP || direction === DIRECTIONS.DOWN) {
            if (direction === DIRECTIONS.DOWN) {
                y += (cellHeight - dy) / 2;
            }

            x += (cellWidth - dx) / 2;
            dy = (cellHeight + dy) / 2;
        } else {
            if (direction === DIRECTIONS.RIGHT) {
                x += (cellWidth - dx) / 2;
            }

            y += (cellHeight - dy) / 2;
            dx = (cellWidth + dx) / 2;
        }

        ctx.fillStyle = "#FF0000";
        ctx.fillRect(x, y, dx, dy);
    }

    /**
     * Draws a red ellipse in the middle of the cell at the given row and column.
     *
     * @param {number} row the row of the cell to draw the ellipse in
     * @param {number} column the column of the cell to draw the ellipse in
     */
    drawEllipse(row, column) {
        const ctx = this.canvas.getContext("2d");
        const cellWidth = this.canvas.width / this.maze.getColumns();
        const cellHeight = this.canvas.height / this.maze.getRows();

        const x = column * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;

        ctx.fillStyle = "#FF0000";
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.scale(0.2 * cellWidth, 0.2 * cellHeight);
        ctx.arc(0, 0, 1, 0, 2 * Math.PI);
        ctx.restore();
        ctx.fill();
    }
}
