import Cell from "../maze/cell"
import Maze from "../maze/maze";
import MazeDrawer from "../maze/mazedrawer";
import MazePath from "../maze/mazepath";
import {getSolution} from "../maze/mazeoperations";

var isUserMouseDown: boolean = false;
var gameInstance: MazeGame;

/**
 * Represents an instance of a timed maze-solving challenge.
 */
class MazeGame {
    private maze: Maze;
    private mazePath: MazePath;
    private mazeDrawer: MazeDrawer;
    private isMazeSolved: boolean;
    private startTime: Date;
    private canvas: HTMLCanvasElement;

    /**
     * Creates and renders the given maze on an HTML canvas with the specified width and 
     * height. The user can then solve the maze by dragging their mouse from start to
     * finish.
     * 
     * @param {number} canvasWidth the width of the canvas that the maze is rendered on
     * @param {number} canvasHeight the height of the canvas that the maze is rendered on
     * @param {Maze} maze the maze that the user must solve
     */
    constructor(canvasWidth: number, canvasHeight: number, maze: Maze) {
        const element: HTMLElement = document.getElementById("mazeArea");
        element.innerHTML = "<canvas id=\"maze\" style=\"border:1px solid #000000\"></canvas>";

        //const canvas: HTMLCanvasElement = document.getElementById("maze") as HTMLCanvasElement;
        this.canvas = document.getElementById("maze") as HTMLCanvasElement;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        this.maze = maze;
        this.mazeDrawer = new MazeDrawer(this.maze, this.canvas);
        this.mazeDrawer.drawMaze();
        this.mazePath = new MazePath(this.mazeDrawer);
        this.mazePath.add(this.maze.getCell(0, 0));

        this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
            this.handleMouseDrag(this.canvas, event);
        });

        this.isMazeSolved = false;
        this.startTime = new Date();
    }

    solveMaze() {
        if (!this.isMazeSolved) {
            const finishTime: Date = new Date();
            const timeDelta: number = finishTime.getTime() - this.startTime.getTime();

            this.isMazeSolved = true;
            this.mazePath = getSolution(this.maze, new MazePath(new MazeDrawer(this.maze, this.canvas)));

            alert("You have given up solving the maze after " + (timeDelta / 1000) + " seconds.\n\n" +
                "The solution to the maze will be shown upon closing this prompt.\n\n" +
                "If you want to try another maze, press the \"Generate a maze\" button.");
        }
    }

    private handleMouseDrag(canvas: HTMLCanvasElement, event: MouseEvent): void {
        if (isUserMouseDown && this.maze && !this.isMazeSolved) {
            const rect: DOMRect = canvas.getBoundingClientRect();
            const canvasX: number = event.clientX - rect.x;
            const canvasY: number = event.clientY - rect.y;

            const cellWidth: number = canvas.width / this.maze.getColumns();
            const cellHeight: number = canvas.height / this.maze.getRows();

            const cellRow: number = Math.floor(canvasY / cellHeight);
            const cellColumn: number = Math.floor(canvasX / cellWidth);

            const cellToAdd: Cell = this.maze.getCell(cellRow, cellColumn);

            if (cellToAdd && cellToAdd.isOpen()) {
                if (this.mazePath.isInPath(cellToAdd)) {
                    this.mazePath.remove(this.mazePath.getCell(this.mazePath.getPosition(cellToAdd) + 1));
                } else {
                    const cellNeighbours: Cell[] = this.maze.neighbours(cellToAdd);

                    for (let i = 0; i < cellNeighbours.length; i++) {
                        const position: number = this.mazePath.getPosition(cellNeighbours[i]);

                        if (position !== -1) {
                            const cellToRemove: Cell = this.mazePath.getCell(position + 1);

                            if (cellToRemove !== cellToAdd) {
                                this.mazePath.remove(cellToRemove);
                            }
                        }
                    }
                }

                this.mazePath.add(cellToAdd);

                if (cellToAdd === this.maze.getCell(this.maze.getRows() - 1, this.maze.getColumns() - 1)) {
                    if (this.mazePath.isComplete()) {
                        const finishTime: Date = new Date();
                        const timeDelta: number = finishTime.getTime() - this.startTime.getTime();

                        alert("Congratulations! You solved the maze in " + (timeDelta / 1000) + " seconds!\n\n" +
                            "If you want to try another maze, press the \"Generate a maze\" button.");
                        this.isMazeSolved = true;
                    }
                }
            }
        }
    }
}

document.getElementById("generateMazeBtn").addEventListener("click", function() {
    fetch("/generateMaze")
        .then(res => res.json())
        .then(data => {
            // data has all the properties of a Maze object without the Maze prototype.
            // We set data to have the Maze prototype, then we set each element in the
            // maze board to have the Cell prototype.

            Object.setPrototypeOf(data, Maze.prototype);
            let board = data.board;

            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    Object.setPrototypeOf(board[i][j], Cell.prototype);
                }
            }

            gameInstance = new MazeGame(1000, 500, data);
        })
        .catch(err => console.log(err));
});

document.getElementById("giveUpBtn").addEventListener("click", function() {
    if (gameInstance) {
        gameInstance.solveMaze();
    }
})

document.addEventListener("mousedown", function(event: MouseEvent) {
    if (event.button === 0) {
        isUserMouseDown = true;
    }
});

document.addEventListener("mouseup", function(event: MouseEvent) {
    if (event.button === 0) {
        isUserMouseDown = false;
    }
});