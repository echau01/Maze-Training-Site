/**
 * Represents a cell in a maze.
 */
export default class Cell {
    private readonly row: number;
    private readonly column: number;
    private open: boolean;

    /**
     * Constructs a cell at the given row and column.
     *
     * Every cell is either open or closed. An open cell is a cell that can be in a maze path,
     * and a closed cell is a wall.
     *
     * @param {number} row the row of the cell. Must be a nonnegative integer.
     * @param {number} column the column of the cell. Must be a nonnegative integer.
     * @param {boolean} open whether the cell is open or not
     */
    constructor(row: number, column: number, open: boolean) {
        if (row < 0) {
            throw new Error("row parameter is negative");
        }
        if (column < 0) {
            throw new Error("column parameter is negative");
        }

        this.row = row;
        this.column = column;
        this.open = open;
    }

    /**
     * Marks this cell as open or closed, depending on the parameter value.
     *
     * @param {boolean} open true if this cell is to be marked open; false otherwise
     */
    setOpen(open: boolean): void {
        this.open = open;
    }

    /**
     * Returns true if this cell is open; false otherwise.
     */
    isOpen(): boolean {
        return this.open;
    }

    /**
     * Returns the row of this cell in the maze.
     */
    getRow(): number {
        return this.row;
    }

    /**
     * Returns the column of this cell in the maze.
     */
    getColumn(): number {
        return this.column;
    }

    /**
     * Returns true if this cell has the same row, column, and open status
     * as the specified cell.
     * 
     * @param otherCell the cell to compare to this cell for equality
     */
    equals(otherCell: Cell): boolean {
        return this.row === otherCell.row 
            && this.column === otherCell.column 
            && this.open === otherCell.open;
    }
}
