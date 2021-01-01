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

/**
 * Represents a cell in a maze.
 */
class Cell {
    /**
     * Construct a cell with coordinates (row, column).
     * 
     * @param {number} row the row of the cell
     * @param {number} column the column of the cell
     * @param {boolean} [visited] whether the cell has been visited. If this parameter is omitted,
     * the cell is marked unvisited.
     * @param {boolean} [open] whether the cell is open or not. A cell that is not open (i.e. a closed cell)
     * is a wall. If this parameter is omitted, the cell is marked as closed.
     */
    constructor(row, column, visited, open) {
        this.row = row;
        this.column = column;
        this.visited = visited || false;
        this.open = open || false;
    }

    /**
     * Mark this cell as visited or unvisited, depending on the parameter value.
     * 
     * @param {boolean} visited true if this cell is to be marked visited; false otherwise
     */
    setVisited(visited) {
        this.visited = visited;
    }

    /**
     * Mark this cell as open or closed, depending on the parameter value.
     * 
     * @param {boolean} open true if this cell is to be marked open; false otherwise
     */
    setOpen(open) {
        this.open = open;
    }

    /**
     * Returns true if this cell is visited; false otherise.
     */
    isVisited() {
        return this.visited;
    }

    /**
     * Returns true if this cell is open; false otherwise.
     */
    isOpen() {
        return this.open;
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
     * Insert the given element with specified priority into the priority queue.
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
     */
    constructor(rows, columns) {
        if (rows > Math.floor(2147483647 / columns)) {
            throw new Error("Maze size is too large.");
        } else if (rows * columns === 0) {
            throw new Error("One of rows and columns is 0.");
        }

        this.rows = rows;
        this.columns = columns;
        this.board = this.initBoard();

        this.generateMaze();
    }

    /**
     * Initializes and returns the maze board. Each element is initialized to an open cell, except:
     * - all cells in odd-indexed rows are closed, excluding the last row
     * - all cells in odd-indexed columns are closed, excluding the last column
     * 
     * All cells are marked unvisited.
     */
    initBoard() {
        let board = [];

        for (let i = 0; i < this.rows; i++) {
            let row = [];

            if (i % 2 === 0 || i === this.rows - 1) {
                for (let j = 0; j < this.columns; j++) {
                    if (j % 2 === 0 || j === this.columns - 1) {
                        row.push(new Cell(i, j, false, true));
                    } else {
                        row.push(new Cell(i, j, false, false));
                    }
                }
            } else {
                for (let j = 0; j < this.columns; j++) {
                    row.push(new Cell(i, j, false, false));
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
        let weights = this.generateWeights();
        let pq = new PriorityQueue();

        this.board[0][0].setVisited(true);
        this.updatePQ(this.board[0][0], pq, weights);

        while (pq.size() !== 0) {
            let wall = pq.removeMin();
            let neighbours = this.neighbours(wall);
            let nextCell;

            for (let i = 0; i < neighbours.length; i++) {
                if (!neighbours[i].isVisited() && neighbours[i].isOpen()) {
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
                wall.setVisited(true);
                nextCell.setVisited(true);
                this.updatePQ(nextCell, pq, weights);
            } else if (Math.random() <= 0.03) {
                wall.setOpen(true);
                wall.setVisited(true);
            }
        }
    }

    /**
     * Inserts the walls adjacent to the given cell into the priority queue. This is a helper
     * function for generateMaze().
     * 
     * @param {Cell} cell the cell whose adjacent walls we want to insert into the priority queue
     * @param {PriorityQueue} pq the priority queue being used by the maze generator
     * @param {number[][]} weights the weights of each cell in the maze
     */
    updatePQ(cell, pq, weights) {
        let neighbours = this.neighbours(cell);

        for (let i = 0; i < neighbours.length; i++) {
            let cell = neighbours[i];

            if (!cell.isOpen()) {
                pq.insert(cell, weights[cell.row][cell.column]);
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
        let row = cell.row;
        let column = cell.column;

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
     * Each number from 0 to this.rows * this.columns - 1 is put into a random spot
     * in a 2D array with the same dimensions as the maze board. The function
     * then returns the 2D array.
     */
    generateWeights() {
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
}

var maze = {
    _maze: undefined,
    width: 1000,
    height: 500,

    createMaze: function() {
        // Note: mazes look the best when the number of rows and columns are both odd.
        this._maze = new Maze(25, 51);

        const element = document.getElementById("mazeArea");
        element.innerHTML = "<canvas id=\"maze\" style=\"border:1px solid #000000\"></canvas>";

        const canvas = document.getElementById("maze");
        const ctx = canvas.getContext("2d");

        canvas.width = this.width;
        canvas.height = this.height;

        cellWidth = canvas.width / this._maze.getColumns();
        cellHeight = canvas.height / this._maze.getRows();

        for (let row = 0; row < this._maze.getRows(); row++) {
            for (let column = 0; column < this._maze.getColumns(); column++) {
                if (this._maze.isOpen(row, column)) {
                    ctx.fillStyle = "#FFFFFF";
                } else {
                    ctx.fillStyle = "#000000";
                }

                ctx.fillRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight);
            }
        }
    }
};