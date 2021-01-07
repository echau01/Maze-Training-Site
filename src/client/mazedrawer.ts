import Cell from "./cell";
import Direction from "./direction"
import Maze from "./maze";
import MazePath from "./mazepath";


/**
 * A class that renders mazes onto HTML canvas elements.
 */
export default class MazeDrawer {
    private maze: Maze;
    private canvas: HTMLCanvasElement;
    
    /**
     * Create a maze drawer that handles the rendering of the given maze onto
     * the given canvas element.
     *
     * @param {Maze} maze
     * @param {HTMLCanvasElement} canvasElement
     */
    constructor(maze: Maze, canvasElement: HTMLCanvasElement) {
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
    drawMaze(mazePath?: MazePath): void {
        for (let row = 0; row < this.maze.getRows(); row++) {
            for (let column = 0; column < this.maze.getColumns(); column++) {
                this.drawCell(row, column, mazePath);
            }
        }
    }

    /**
     * Draws a cell at the given row and column on this maze drawer's canvas element.
     * The cell is coloured according to the value of fillColour. No maze path is rendered
     * on top of the cell. A black border is drawn around the cell.
     *
     * @param {number} row the row of the open cell to draw
     * @param {number} column the column of the open cell to draw
     * @param {string} fillColour the hex colour code of the colour to fill the cell with.
     * Must begin with the # symbol (e.g. "#FFFFFF" for white).
     */
    drawPlainCell(row: number, column: number, fillColour: string): void {
        const ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
        const cellWidth: number = this.canvas.width / this.maze.getColumns();
        const cellHeight: number = this.canvas.height / this.maze.getRows();

        ctx.fillStyle = fillColour;
        ctx.strokeStyle = "#000000";
        ctx.fillRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight);
        ctx.strokeRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight);
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
    drawCell(row: number, column: number, mazePath?: MazePath): void {
        const cell: Cell = this.maze.getCell(row, column);

        if (row === this.maze.getRows() - 1 && column === this.maze.getColumns() - 1) {
            this.drawPlainCell(cell.getRow(), cell.getColumn(), "#00FF00"); // green
        } else if (cell.isOpen()) {
            this.drawPlainCell(cell.getRow(), cell.getColumn(), "#FFFFFF"); // white
        } else {
            this.drawPlainCell(cell.getRow(), cell.getColumn(), "#000000"); // black
        }

        if (mazePath) {
            const position: number = mazePath.getPosition(cell);

            if (position !== -1) {
                /**
                 * Assumes (dx, dy) is one of (0, -1), (0, 1), (-1, 0), or (1, 0).
                 * Returns one of Direction.UP, Direction.DOWN, Direction.LEFT,
                 * or Direction.RIGHT depending on which direction the vector (dx, dy)
                 * points towards. Note that a positive dy indicates a downward-pointing vector.
                 */
                const getDirection = function (dx: number, dy: number): Direction {
                    if (dx === 0) {
                        return dy === 1 ? Direction.DOWN : Direction.UP;
                    } else {
                        return dx === 1 ? Direction.RIGHT : Direction.LEFT;
                    }
                };

                const nextCell: Cell = mazePath.getCell(position + 1);
                const prevCell: Cell = mazePath.getCell(position - 1);

                if (nextCell) {
                    const dx: number = nextCell.getColumn() - cell.getColumn();
                    const dy: number = nextCell.getRow() - cell.getRow();
                    this.drawLineSegment(cell.getRow(), cell.getColumn(), getDirection(dx, dy));
                } else {
                    this.drawEllipse(cell.getRow(), cell.getColumn());
                }

                if (prevCell) {
                    const dx: number = prevCell.getColumn() - cell.getColumn();
                    const dy: number = prevCell.getRow() - cell.getRow();
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
     * @param {Direction} direction the direction to draw the line segment in, starting from the middle of the cell.
     */
    drawLineSegment(row: number, column: number, direction: Direction): void {
        const ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
        const cellWidth: number = this.canvas.width / this.maze.getColumns();
        const cellHeight: number = this.canvas.height / this.maze.getRows();

        // The line segment is really a rectangle.
        // Top left corner of the line segment
        let x: number = column * cellWidth;
        let y: number = row * cellHeight;

        // Dimensions of the line segment
        let dx: number = 0.2 * cellWidth;
        let dy: number = 0.2 * cellHeight;

        if (direction === Direction.UP || direction === Direction.DOWN) {
            if (direction === Direction.DOWN) {
                y += (cellHeight - dy) / 2;
            }

            x += (cellWidth - dx) / 2;
            dy = (cellHeight + dy) / 2;
        } else {
            if (direction === Direction.RIGHT) {
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
    drawEllipse(row: number, column: number): void {
        const ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
        const cellWidth: number = this.canvas.width / this.maze.getColumns();
        const cellHeight: number = this.canvas.height / this.maze.getRows();

        const x: number = column * cellWidth + cellWidth / 2;
        const y: number = row * cellHeight + cellHeight / 2;

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
