import Maze from "./maze.js";


/**
 * Represents a cell in a maze.
 */
export default class Cell {
    /**
     * Constructs a cell at the given row and column of the specified maze.
     *
     * Every cell is either open or closed. An open cell is a cell that can be in a maze path,
     * and a closed cell is a wall.
     *
     * @param {number} row the row of the cell. Must be a nonnegative integer.
     * @param {number} column the column of the cell. Must be a nonnegative integer.
     * @param {boolean} open whether the cell is open or not
     * @param {Maze} maze the maze this cell is in. The caller must update the maze's board to include
     * this new cell.
     */
    constructor(row, column, open, maze) {
        if (row < 0) {
            throw new Error("row parameter is negative");
        }
        if (column < 0) {
            throw new Error("column parameter is negative");
        }

        this.row = row;
        this.column = column;
        this.open = open;
        this.maze = maze;

        // Makes this.row and this.column immutable
        Object.defineProperties(this, {
            "row": {
                writable: false,
                configurable: false
            },
            "column": {
                writable: false,
                configurable: false
            }
        });
    }

    /**
     * Marks this cell as open or closed, depending on the parameter value.
     *
     * @param {boolean} open true if this cell is to be marked open; false otherwise
     */
    setOpen(open) {
        this.open = open;
    }

    /**
     * Returns true if this cell is open; false otherwise.
     */
    isOpen() {
        return this.open;
    }

    /**
     * Returns true if this cell is a neighbour of otherCell in the maze; false otherwise.
     *
     * Two cells are neighbours iff. they are in the same maze, and the sum of their horizontal
     * distance (in terms of number of columns) and their vertical distance (in terms of number of rows)
     * equals 1.
     *
     * @param {Cell} otherCell the cell whose neighbourship with this cell we want to check
     */
    isNeighbour(otherCell) {
        if (otherCell.maze === this.maze) {
            const dx = otherCell.getColumn() - this.column;
            const dy = otherCell.getRow() - this.row;

            return Math.abs(dx) + Math.abs(dy) === 1;
        }

        return false;
    }

    /**
     * Returns all valid neighbours of this cell in the maze it is in. The neighbours of
     * a cell are the cells exactly 1 unit above, below, to the left, and to the right
     * of the cell.
     */
    getNeighbours() {
        return this.maze.neighbours(this);
    }

    /**
     * Returns the row of this cell in the maze.
     */
    getRow() {
        return this.row;
    }

    /**
     * Returns the column of this cell in the maze.
     */
    getColumn() {
        return this.column;
    }
}
