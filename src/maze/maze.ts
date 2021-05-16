import Cell from "./cell";
import { PriorityQueue } from "./util/priority-queue";


/**
 * Represents a maze, comprised of a 2D grid of open or closed cells.
 */
export default class Maze {
    private rows: number;
    private columns: number;
    private board: Cell[][];

    /**
     * Constructs a 2D maze with the given dimensions. The total size of the maze (equal
     * to the product of rows and columns) must be at least 1 and at most 2^31 - 1.
     *
     * @param {number} rows the number of rows in the maze
     * @param {number} columns the number of columns in the maze
     */
    constructor(rows: number, columns: number) {
        if (rows * columns === 0) {
            throw new Error("One of rows and columns is 0.");
        } else if (rows > Math.floor(2147483647 / columns)) {
            throw new Error("Maze size is too large.");
        }

        this.rows = rows;
        this.columns = columns;
        this.board = this.initBoard();
        this.generateMaze();
    }

    /**
     * Returns true if the cell at (row, column) is open; false otherwise.
     *
     * @param {number} row the row of the cell
     * @param {number} column the column of the cell
     */
    isOpen(row: number, column: number): boolean {
        return this.board[row][column].isOpen();
    }

    /**
     * Returns all valid neighbours of the given cell in this.board. The neighbours of
     * a cell are the cells exactly 1 unit above, below, to the left, and to the right
     * of the cell.
     *
     * @param {Cell} cell the cell whose neighbours we want
     */
    neighbours(cell: Cell): Cell[] {
        let result: Cell[] = [];
        const row: number = cell.getRow();
        const column: number = cell.getColumn();

        for (let i = -1; i <= 1; i += 2) {
            if (0 <= row + i && row + i <= this.rows - 1) {
                result.push(this.board[row + i][column]);
            }

            if (0 <= column + i && column + i <= this.columns - 1) {
                result.push(this.board[row][column + i]);
            }
        }

        return result;
    }

    /**
     * Returns true if the two cells are neighbours in this maze; false otherwise.
     *
     * Two cells are neighbours iff. they are both contained in this maze (determined
     * using the contains function), and the Manhattan distance of the two cells
     * equals 1.
     *
     * @param {Cell} cellOne the first cell
     * @param {Cell} cellTwo the second cell
     */
    areNeighbours(cellOne: Cell, cellTwo: Cell): boolean {
        if (this.contains(cellOne) && this.contains(cellTwo)) {
            const dx = cellOne.getColumn() - cellTwo.getColumn();
            const dy = cellOne.getRow() - cellTwo.getRow();

            return Math.abs(dx) + Math.abs(dy) === 1;
        }

        return false;
    }

    /**
     * Returns true iff. the given cell object is contained in this maze.
     * It is sufficient for the given cell to be equal to a cell in this maze
     * (using the equals method in the Cell class).
     * 
     * @param cell the cell to check
     */
    contains(cell: Cell): boolean {
        const row = cell.getRow();
        const col = cell.getColumn();

        if (0 <= row && row < this.rows) {
            if (0 <= col && col < this.columns) {
                return this.board[row][col].equals(cell);
            }
        }

        return false;
    }

    /**
     * Returns the number of rows in this maze.
     */
    getRows(): number {
        return this.rows;
    }

    /**
     * Returns the number of columns in this maze.
     */
    getColumns(): number {
        return this.columns;
    }

    /**
     * Returns the cell at the given row and column in this maze, assuming
     * that the row and column are in the bounds of the maze board. If that
     * assumption is not true, returns null.
     *
     * @param {number} row the row of the cell to get
     * @param {number} column the column of the cell to get
     */
    getCell(row: number, column: number): Cell {
        if (0 <= row && row < this.rows) {
            if (0 <= column && column < this.columns) {
                return this.board[row][column];
            }
        }

        return null;
    }

    /**
     * Initializes and returns the maze board. Each element is initialized to an open cell, except:
     * - all cells in odd-indexed rows are closed, excluding the last row
     * - all cells in odd-indexed columns are closed, excluding the last column
     */
    private initBoard(): Cell[][] {
        let board: Cell[][] = [];

        for (let i = 0; i < this.rows; i++) {
            let row: Cell[] = [];

            if (i % 2 === 0 || i === this.rows - 1) {
                for (let j = 0; j < this.columns; j++) {
                    if (j % 2 === 0 || j === this.columns - 1) {
                        row.push(new Cell(i, j, true));
                    } else {
                        row.push(new Cell(i, j, false));
                    }
                }
            } else {
                for (let j = 0; j < this.columns; j++) {
                    row.push(new Cell(i, j, false));
                }
            }

            board.push(row);
        }

        return board;
    }

    /**
     * Generates a random maze using Prim's algorithm. The generated maze is stored in
     * this.board, a 2D boolean array of cells.
     */
    private generateMaze(): void {
        /**
         * Puts each number from 0 to this.rows * this.columns - 1 into a random spot
         * in a 2D array with the same dimensions as the maze board. The function
         * then returns the 2D array.
         */
        const generateWeights = () => {
            // We use the Fisher-Yates shuffle.
            let weights: number[][] = [];

            for (let i = 0; i < this.rows; i++) {
                let currentRow: number[] = [];
                for (let j = 0; j < this.columns; j++) {
                    currentRow.push(i * this.columns + j);
                }
                weights.push(currentRow);
            }

            for (let i = this.rows * this.columns - 1; i >= 0; i--) {
                const row: number = Math.floor(i / this.columns);
                const column: number = i % this.columns;

                // rand is a random number between 0 and i inclusive.
                const rand: number = Math.floor(Math.random() * (i + 1));
                const randRow: number = Math.floor(rand / this.columns);
                const randColumn: number = rand % this.columns;

                const temp: number = weights[row][column];
                weights[row][column] = weights[randRow][randColumn];
                weights[randRow][randColumn] = temp;
            }

            return weights;
        };

        /**
         * Inserts the walls adjacent to the given cell into the priority queue.
         *
         * @param {Cell} cell the cell whose adjacent walls we want to insert into the priority queue
         * @param {PriorityQueue<Cell>} pq the priority queue being used by the maze generator
         * @param {number[][]} weights the weights of each cell in the maze
         */
        const updatePQ = (cell: Cell, pq: PriorityQueue<Cell>, weights: number[][]) => {
            const neighbours: Cell[] = this.neighbours(cell);

            for (let i = 0; i < neighbours.length; i++) {
                const cell: Cell = neighbours[i];

                if (!cell.isOpen()) {
                    pq.insert(cell, weights[cell.getRow()][cell.getColumn()]);
                }
            }
        };

        const weights: number[][] = generateWeights();
        let pq: PriorityQueue<Cell> = new PriorityQueue<Cell>();
        let visited: boolean[][] = new Array<boolean>(this.rows).fill(false).map(() => new Array<boolean>(this.columns).fill(false));

        visited[0][0] = true;
        updatePQ(this.board[0][0], pq, weights);

        while (pq.size() !== 0) {
            let wall: Cell = pq.removeMin();
            const neighbours: Cell[] = this.neighbours(wall);
            let nextCell: Cell = null;

            for (let i = 0; i < neighbours.length; i++) {
                if (!visited[neighbours[i].getRow()][neighbours[i].getColumn()] && neighbours[i].isOpen()) {
                    // This if block runs at most once during the loop's execution.
                    // A wall joins exactly two open cells, and one of those cells must have
                    // been visited. Hence, at most one adjacent open cell is unvisited.
                    nextCell = neighbours[i];
                    break;
                }
            }

            // If nextCell is not null, then the if block in the for loop above must have run.
            // That means there is an open, unvisited cell adjacent to the wall. Hence, we should
            // remove the wall. 
            //
            // If nextCell is null, then both open cells adjacent to the wall have been visited. 
            // In this case, there is a 3% that we remove the wall, creating a cycle in the maze.
            if (nextCell) {
                wall.setOpen(true);
                visited[wall.getRow()][wall.getColumn()] = true;
                visited[nextCell.getRow()][nextCell.getColumn()] = true;
                updatePQ(nextCell, pq, weights);
            } else if (Math.random() <= 0.03) {
                wall.setOpen(true);
                visited[wall.getRow()][wall.getColumn()] = true;
            }
        }
    }
}
