import Cell from "../maze/cell"
import Maze from "../maze/maze";
import MazeDrawer from "../maze/mazedrawer";
import MazePath from "../maze/mazepath";

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

    /**
     * Creates and renders a randomly-generated maze on an HTML canvas with the 
     * specified width and height.
     * 
     * @param {number} canvasWidth the width of the canvas that the maze is rendered on
     * @param {number} canvasHeight the height of the canvas that the maze is rendered on
     */
    constructor(canvasWidth: number, canvasHeight: number) {
        const element: HTMLElement = document.getElementById("mazeArea");
        element.innerHTML = "<canvas id=\"maze\" style=\"border:1px solid #000000\"></canvas>";

        const canvas: HTMLCanvasElement = document.getElementById("maze") as HTMLCanvasElement;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Note: mazes look the best when the number of rows and columns are both odd.
        this.maze = new Maze(25, 51);
        this.mazeDrawer = new MazeDrawer(this.maze, canvas);
        this.mazeDrawer.drawMaze();
        this.mazePath = new MazePath(this.mazeDrawer);
        this.mazePath.add(this.maze.getCell(0, 0));

        canvas.addEventListener("mousemove", (event: MouseEvent) => {
            this.handleMouseDrag(canvas, event);
        });

        this.isMazeSolved = false;
        this.startTime = new Date();
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
                    const cellNeighbours: Cell[] = cellToAdd.getNeighbours();

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

document.getElementById("generateMazeBtn").addEventListener("click", function(event: MouseEvent) {
    gameInstance = new MazeGame(1000, 500);
});

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