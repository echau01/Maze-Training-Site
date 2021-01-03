/**
 * Swaps the elements at index1 and index2 of this array.
 * 
 * @param {number} index1 the index of the first element to swap
 * @param {number} index2 the index of the second element to swap
 */
Array.prototype.swap = function(index1, index2) {
    const temp = this[index1];
    this[index1] = this[index2];
    this[index2] = temp;
}

const DIRECTIONS = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
}

/**
 * Represents a cell in a maze.
 */
class Cell {
    /**
     * Constructs a cell at the given row and column of the specified maze. 
     * 
     * Every cell is either open or closed. An open cell is a cell that can be in a maze path,
     * and a closed cell is a wall.
     * 
     * @param {number} row the row of the cell
     * @param {number} column the column of the cell
     * @param {boolean} open whether the cell is open or not
     * @param {maze} maze the maze this cell is in. The caller must update the maze's board to include
     * this new cell.
     */
    constructor(row, column, open, maze) {
        this.row = row;
        this.column = column;
        this.open = open;
        this.maze = maze;

        // Make this.row and this.column immutable
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

/**
 * Represents an element in a priority queue.
 */
class PriorityQueueElement {
    /**
     * Create a priority queue element with the given priority that contains the given data.
     * 
     * @param {any} data the data this element contains
     * @param {number} priority the priority of the element
     */
    constructor(data, priority) {
        this.data = data;
        this.priority = priority;
    }
}

/**
 * A priority queue implemented as a 0-based binary minheap.
 */
class PriorityQueue {
    /**
     * Constructs a priority queue with the given PriorityQueueElements. If no parameter is passed
     * in to the constructor, an empty priority queue is created.
     * 
     * @param {PriorityQueueElement[]} [queueElements] the elements of the priority queue to be constructed
     */
    constructor(queueElements) {
        if (queueElements === undefined) {
            this.heap = [];
            this._size = 0;
        } else {
            this.heap = queueElements.slice();
            this._size = queueElements.length;

            this.buildHeap();
        }
    }

    /**
     * Inserts the given element with specified priority into the priority queue.
     * 
     * @param {any} element the element to insert
     * @param {number} priority the priority of the element
     */
    insert(element, priority) {
        this.heap.push(new PriorityQueueElement(element, priority));
        this._size += 1;
        this.heapifyUp(this._size - 1);
    }

    /**
     * Removes and returns the element with minimum priority in the queue.
     */
    removeMin() {
        this.heap.swap(0, this._size - 1);
        this._size -= 1;

        return this.heap.pop().data;
    }

    /**
     * Returns the number of elements in this priority queue.
     */
    size() {
        return this._size;
    }

    /**
     * Converts this.heap to a binary minheap.
     */
    buildHeap() {
        for (let i = Math.floor((this._size - 2) / 2); i >= 0; i--) {
            this.heapifyDown(i);
        }
    }

    parent(index) {
        return Math.floor((index - 1) / 2);
    }

    leftChild(index) {
        return 2 * index + 1;
    }

    rightChild(index) {
        return 2 * index + 2;
    }

    heapifyUp(index) {
        while (index !== 0) {
            let parent = this.parent(index);
            if (this.heap[index].priority < this.heap[parent].priority) {
                this.heap.swap(index, parent);
                index = parent;
            } else {
                break;
            }
        }
    }

    heapifyDown(index) {
        while (index <= Math.floor((this._size - 2) / 2)) {
            let leftIdx = this.leftChild(index);
            let rightIdx = this.rightChild(index);

            let minIdx;
            if (rightIdx < _size) {
                minIdx = this.heap[leftIdx].priority < this.heap[rightIdx].priority ? leftIdx : rightIdx;
            } else {
                minIdx = leftIdx;
            }

            if (this.heap[index].priority > this.heap[minIdx].priority) {
                this.heap.swap(index, minIdx);
                index = minIdx;
            } else {
                break;
            }
        }
    }
}

class Maze {
    /**
     * Constructs a 2D maze with the given dimensions. The total size of the maze (equal
     * to the product of rows and columns) must be at least 1 and at most 2^31 - 1.
     * 
     * @param {number} rows the number of rows in the maze
     * @param {number} columns the number of columns in the maze
     * @param {HTMLCanvasElement} canvasElement the canvas element that this maze will be rendered on
     */
    constructor(rows, columns, canvasElement) {
        if (rows > Math.floor(2147483647 / columns)) {
            throw new Error("Maze size is too large.");
        } else if (rows * columns === 0) {
            throw new Error("One of rows and columns is 0.");
        }

        this.rows = rows;
        this.columns = columns;
        this.board = this.initBoard();
        this.generateMaze();
        this.mazeDrawer = new MazeDrawer(this, canvasElement);
    }

    /**
     * Initializes and returns the maze board. Each element is initialized to an open cell, except:
     * - all cells in odd-indexed rows are closed, excluding the last row
     * - all cells in odd-indexed columns are closed, excluding the last column
     */
    initBoard() {
        let board = [];

        for (let i = 0; i < this.rows; i++) {
            let row = [];

            if (i % 2 === 0 || i === this.rows - 1) {
                for (let j = 0; j < this.columns; j++) {
                    if (j % 2 === 0 || j === this.columns - 1) {
                        row.push(new Cell(i, j, true, this));
                    } else {
                        row.push(new Cell(i, j, false, this));
                    }
                }
            } else {
                for (let j = 0; j < this.columns; j++) {
                    row.push(new Cell(i, j, false, this));
                }
            }

            board.push(row);
        }

        return board;
    }

    /**
     * Returns true if the cell at (row, column) is open; false otherwise.
     * 
     * @param {number} row the row of the cell 
     * @param {number} column the column of the cell
     */
    isOpen(row, column) {
        return this.board[row][column].isOpen();
    }

    /**
     * Generates a random maze using Prim's algorithm. The generated maze is stored in
     * this.board, a 2D boolean array of cells.
     */
    generateMaze() {
        /**
         * Puts each number from 0 to this.rows * this.columns - 1 into a random spot
         * in a 2D array with the same dimensions as the maze board. The function
         * then returns the 2D array.
         */
        const generateWeights = (function() {
            // We use the Fisher-Yates shuffle.

            let weights = []

            for (let i = 0; i < this.rows; i++) {
                let currentRow = []
                for (let j = 0; j < this.columns; j++) {
                    currentRow.push(i * this.columns + j);
                }
                weights.push(currentRow);
            }

            for (let i = this.rows * this.columns - 1; i >= 0; i--) {
                const row = Math.floor(i / this.columns);
                const column = i % this.columns;

                // rand is a random number between 0 and i inclusive.
                const rand = Math.floor(Math.random() * (i + 1));
                const randRow = Math.floor(rand / this.columns);
                const randColumn = rand % this.columns;

                const temp = weights[row][column];
                weights[row][column] = weights[randRow][randColumn];
                weights[randRow][randColumn] = temp;
            }

            return weights;
        }).bind(this);

        /**
         * Inserts the walls adjacent to the given cell into the priority queue.
         * 
         * @param {Cell} cell the cell whose adjacent walls we want to insert into the priority queue
         * @param {PriorityQueue} pq the priority queue being used by the maze generator
         * @param {number[][]} weights the weights of each cell in the maze
         */
        const updatePQ = (function(cell, pq, weights) {
            let neighbours = this.neighbours(cell);

            for (let i = 0; i < neighbours.length; i++) {
                let cell = neighbours[i];

                if (!cell.isOpen()) {
                    pq.insert(cell, weights[cell.row][cell.column]);
                }
            }
        }).bind(this);

        let weights = generateWeights();
        let pq = new PriorityQueue();
        let visited = new Array(this.rows).fill(false).map(() => new Array(this.columns).fill(false));

        visited[0][0] = true;
        updatePQ(this.board[0][0], pq, weights);

        while (pq.size() !== 0) {
            let wall = pq.removeMin();
            let neighbours = this.neighbours(wall);
            let nextCell;

            for (let i = 0; i < neighbours.length; i++) {
                if (!visited[neighbours[i].getRow()][neighbours[i].getColumn()] && neighbours[i].isOpen()) {
                    // This if block runs at most once during the loop's execution.
                    // A wall joins exactly two open cells, and one of those cells must have
                    // been visited. Hence, at most one adjacent open cell is unvisited.
                    nextCell = neighbours[i];
                    break;
                }
            }

            // If nextCell is not undefined, then the if block in the for loop above must have run.
            // That means there is an open, unvisited cell adjacent to the wall. Hence, we should
            // remove the wall. 
            //
            // If nextCell is undefined, then both open cells adjacent to the wall have been visited. 
            // In this case, there is a 3% that we remove the wall, creating a cycle in the maze.
            if (nextCell !== undefined) {
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

    /**
     * Returns all valid neighbours of the given cell in this.board. The neighbours of 
     * a cell are the cells exactly 1 unit above, below, to the left, and to the right 
     * of the cell.
     * 
     * @param {Cell} cell the cell whose neighbours we want
     */
    neighbours(cell) {
        let result = [];
        let row = cell.getRow();
        let column = cell.getColumn();

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
     * Returns the number of rows in this maze.
     */
    getRows() {
        return this.rows;
    }

    /**
     * Returns the number of columns in this maze.
     */
    getColumns() {
        return this.columns;
    }

    /**
     * Returns the MazeDrawer object that renders this maze.
     */
    getMazeDrawer() {
        return this.mazeDrawer;
    }

    /**
     * Returns the cell at the given row and column in this maze, assuming
     * that the row and column are in the bounds of the maze board. If that
     * assumption is not true, returns null.
     * 
     * @param {number} row the row of the cell to get
     * @param {number} column the column of the cell to get
     */
    getCell(row, column) {
        if (0 <= row && row < this.rows) {
            if (0 <= column && column < this.columns) {
                return this.board[row][column];
            }
        }
        
        return null;
    }

    /**
     * Renders this maze onto the canvas element associated with this maze.
     */
    render() {
        this.mazeDrawer.drawMaze();
    }
}

/**
 * Represents a path through a maze. A path is an ordered list of cells satisfying the following:
 * 1. Any two cells adjacent to each other in the path are adjacent in the maze.
 * 2. There are no duplicate cells.
 * 3. Every cell in the path is an open cell and is in the maze.
 */
class MazePath {
    /**
     * Constructs an empty path through the given maze.
     * 
     * @param {Maze} maze the maze that the path will travel through
     */
    constructor(maze) {
        this.maze = maze;
        this.path = [];
        this.cellPositions = new Array(maze.getRows()).fill(-1).map(() => new Array(maze.getColumns()).fill(-1));
    }

    /**
     * Appends the given cell to this maze path if all of the following are true:
     * 1. The cell is not already on the path.
     * 2. The cell is open.
     * 3. The cell is in the same maze that this path travels through.
     * 4. The last element of the path is a neighbouring cell.
     * 
     * If the conditions are not all satisfied, then the function does not change the path.
     * 
     * If the maze path changes, all cells affected are re-rendered.
     * 
     * @param {Cell} cell the cell to add to this maze path
     */
    add(cell) {
        if (cell && cell.maze === this.maze && cell.isOpen()) {
            const drawer = this.maze.getMazeDrawer();
            
            if (this.path.length === 0) {
                this.cellPositions[cell.getRow()][cell.getColumn()] = 0;
                this.path.push(cell);
                drawer.drawCircle(cell.getRow(), cell.getColumn());
            } else if (this.cellPositions[cell.getRow()][cell.getColumn()] === -1) {
                const cellNeighbours = cell.getNeighbours();
                const lastCell = this.path[this.path.length - 1];

                for (let i = 0; i < cellNeighbours.length; i++) {
                    const curr = cellNeighbours[i];

                    if (curr.getRow() === lastCell.getRow() && curr.getColumn() === lastCell.getColumn()) {
                        this.cellPositions[cell.getRow()][cell.getColumn()] = this.path.length;
                        this.path.push(cell);

                        drawer.drawCell(lastCell.getRow(), lastCell.getColumn(), this);
                        drawer.drawCell(cell.getRow(), cell.getColumn(), this);

                        break;
                    }
                }
            }
        }
    }

    /**
     * Removes the given cell and all cells that come after it from this maze path.
     * If the cell is not on the path, does nothing.
     * 
     * The cell coming before the given cell in this maze path is re-rendered.
     * 
     * @param {Cell} cell the cell to remove from this maze path
     */
    remove(cell) {
        if (cell && cell.maze === this.maze) {
            const drawer = this.maze.getMazeDrawer();
            const position = this.cellPositions[cell.getRow()][cell.getColumn()];

            if (position !== -1) {
                for (let i = position; i < this.path.length; i++) {
                    const currentCell = this.path[i];
                    this.cellPositions[currentCell.getRow()][currentCell.getColumn()] = -1;

                    // We omit the maze path from the function arguments because we are
                    // removing currentCell from the path, so we do not want currentCell
                    // to be rendered with a path.
                    drawer.drawCell(currentCell.getRow(), currentCell.getColumn(), this);
                }

                this.path.length = position;

                const lastCell = this.path[this.path.length - 1];
                drawer.drawCell(lastCell.getRow(), lastCell.getColumn(), this);
            }
        }
    }

    /**
     * Returns the position of the given cell in this maze path. If the cell is 
     * not on the path, returns -1.
     * 
     * @param {Cell} cell the cell whose position we want
     */
    getPosition(cell) {
        if (cell.maze === this.maze) {
            return this.cellPositions[cell.getRow()][cell.getColumn()];
        }

        return -1;
    }

    /**
     * Returns the cell at the given position in this maze path. Returns null
     * if there is no cell at the given position.
     * 
     * @param {number} position the position of the cell to get
     */
    getCell(position) {
        if (0 <= position && position < this.path.length) {
            return this.path[position];
        }
        
        return null;
    }

    /**
     * Returns the number of cells on this maze path.
     */
    getLength() {
        return this.path.length;
    }

    /**
     * Returns true if the given cell is in this maze path; false otherwise.
     * 
     * @param {Cell} cell the cell to check
     */
    isInPath(cell) {
        return this.getPosition(cell) !== -1;
    }

    /**
     * Returns true if this maze path is a valid path from the top-left corner to the
     * bottom-right corner of the maze; false otherwise.
     */
    isComplete() {

    }
}

class MazeDrawer {
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
                const getDirection = function(dx, dy) {
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
                    this.drawCircle(cell.getRow(), cell.getColumn());
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
     * Draws a red circle in the middle of the cell at the given row and column.
     * 
     * @param {number} row the row of the cell to draw the circle in
     * @param {number} column the column of the cell to draw the circle in
     */
    drawCircle(row, column) {
        const ctx = this.canvas.getContext("2d");
        const cellWidth = this.canvas.width / this.maze.getColumns();
        const cellHeight = this.canvas.height / this.maze.getRows();

        const radius = 0.2 * cellWidth;

        const x = column * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;

        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

var maze = {
    _maze: undefined,
    width: 1000,
    height: 500,
    isUserMouseDown: false,
    mazePath: undefined,

    handleMouseDrag: function(canvas, event) {
        if (this.isUserMouseDown && this._maze) {
            const rect = canvas.getBoundingClientRect();
            const canvasX = event.clientX - rect.x;
            const canvasY = event.clientY - rect.y;

            const cellWidth = canvas.width / this._maze.getColumns();
            const cellHeight = canvas.height / this._maze.getRows();

            const cellRow = Math.floor(canvasY / cellHeight);
            const cellColumn = Math.floor(canvasX / cellWidth);

            const cellToAdd = this._maze.getCell(cellRow, cellColumn);

            if (cellToAdd && cellToAdd.isOpen()) {
                if (this.mazePath.isInPath(cellToAdd)) {
                    this.mazePath.remove(this.mazePath.getCell(this.mazePath.getPosition(cellToAdd) + 1));
                } else {
                    const cellNeighbours = cellToAdd.getNeighbours();

                    for (let i = 0; i < cellNeighbours.length; i++) {
                        const position = this.mazePath.getPosition(cellNeighbours[i]);

                        if (position !== -1) {
                            const cellToRemove = this.mazePath.getCell(position + 1);

                            if (cellToRemove !== cellToAdd) {
                                this.mazePath.remove(cellToRemove);
                            }
                        }
                    }
                }

                this.mazePath.add(cellToAdd);
            }
        }
    },

    createMaze: function() {
        this.isUserMouseDown = false;

        const element = document.getElementById("mazeArea");
        element.innerHTML = "<canvas id=\"maze\" style=\"border:1px solid #000000\"></canvas>";

        const canvas = document.getElementById("maze");
        canvas.width = this.width;
        canvas.height = this.height;

        // Note: mazes look the best when the number of rows and columns are both odd.
        this._maze = new Maze(25, 51, canvas);
        this._maze.render();
        this.mazePath = new MazePath(this._maze);
        this.mazePath.add(this._maze.getCell(0, 0));

        canvas.addEventListener("mousemove", function(event) {
            maze.handleMouseDrag(this, event);
        });
    }
};

document.addEventListener("mousedown", function(event) {
    if (event.button === 0) {
        maze.isUserMouseDown = true;
    }
});

document.addEventListener("mouseup", function(event) {
    if (event.button === 0) {
        maze.isUserMouseDown = false;
    }
});