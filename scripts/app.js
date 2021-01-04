import Maze from "./maze.js";
import MazePath from "./mazepath.js";


var app = {
    maze: null,
    width: 1000,
    height: 500,
    isUserMouseDown: false,
    mazePath: null,
    mazeSolved: false,
    startTime: null,

    handleMouseDrag: function(canvas, event) {
        if (this.isUserMouseDown && this.maze && !this.mazeSolved) {
            const rect = canvas.getBoundingClientRect();
            const canvasX = event.clientX - rect.x;
            const canvasY = event.clientY - rect.y;

            const cellWidth = canvas.width / this.maze.getColumns();
            const cellHeight = canvas.height / this.maze.getRows();

            const cellRow = Math.floor(canvasY / cellHeight);
            const cellColumn = Math.floor(canvasX / cellWidth);

            const cellToAdd = this.maze.getCell(cellRow, cellColumn);

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

                if (cellToAdd === this.maze.getCell(this.maze.getRows() - 1, this.maze.getColumns() - 1)) {
                    if (this.mazePath.isComplete()) {
                        const finishTime = new Date();
                        const timeDelta = finishTime.getTime() - this.startTime.getTime();

                        alert("Congratulations! You solved the maze in " + (timeDelta / 1000) + " seconds!\n\n" + 
                            "If you want to try another maze, press the \"Generate a maze\" button.");
                        this.mazeSolved = true;
                    }
                }
            }
        }
    },

    createMaze: function() {
        this.isUserMouseDown = false;
        this.mazeSolved = false;

        const element = document.getElementById("mazeArea");
        element.innerHTML = "<canvas id=\"maze\" style=\"border:1px solid #000000\"></canvas>";

        const canvas = document.getElementById("maze");
        canvas.width = this.width;
        canvas.height = this.height;

        // Note: mazes look the best when the number of rows and columns are both odd.
        this.maze = new Maze(25, 51, canvas);
        this.maze.render();
        this.mazePath = new MazePath(this.maze);
        this.mazePath.add(this.maze.getCell(0, 0));

        canvas.addEventListener("mousemove", function(event) {
            app.handleMouseDrag(this, event);
        });

        this.startTime = new Date();
    }
};

document.getElementById("generateMazeBtn").addEventListener("click", function(event) {
    app.createMaze();
});

document.addEventListener("mousedown", function(event) {
    if (event.button === 0) {
        app.isUserMouseDown = true;
    }
});

document.addEventListener("mouseup", function(event) {
    if (event.button === 0) {
        app.isUserMouseDown = false;
    }
});