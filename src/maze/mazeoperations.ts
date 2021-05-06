import MazePath from "./mazepath";
import Maze from "./maze";
import Cell from "./cell";
import MazeDrawer from "./mazedrawer";
import {Queue} from "./queue";


// Draws the solution of the given maze onto the given canvas.
export function drawSolution(maze: Maze, canvas: HTMLCanvasElement) {
    let visited: boolean[][] = [];            // Keeps track of previously visited paths.
    let toExplore: Queue<Cell> = new Queue(); // Location data will be stored as an array holding an x and y value.
    let discoveredFrom: Cell[][] = [];        // Marks which cell the current cell had come from.
    let mazePath: MazePath = new MazePath(new MazeDrawer(maze, canvas));

    // Initialises 2D arrays.
    for (let i = 0; i < maze.getColumns(); i++) {
        visited[i] = [];
        discoveredFrom[i] = [];
    }

    /*
    Runs a BFS on the maze until it reaches the endpoint.
    As the BFS runs, it keeps track of each cell that it comes from.
    Also keeps track of visited nodes to prevent looping.
     */
    visited[0][0] = true;
    toExplore.push(maze.getCell(0, 0));

    while (toExplore.size()) {
        let curr = toExplore.pop();
        let neighbors = maze.neighbours(curr)

        for (let c of neighbors) {
            let x = c.getColumn()
            let y = c.getRow();

            if (!visited[x][y] && c.isOpen()) {
                discoveredFrom[x][y] = curr;
                visited[x][y] = true;
                toExplore.push(c);
            }
        }
    }

    /*
    Starts at endpoint and traces back along the path where it came from.
    This gives us an array of cells representing the solution starting from the endpoint.
     */
    let solutionPath: Cell[] = [];
    let curr = (maze.getCell(maze.getRows() - 1, maze.getColumns() - 1));

    while (curr) {
        solutionPath.push(curr);
        curr = discoveredFrom[curr.getColumn()][curr.getRow()];
    }

    solutionPath.push(maze.getCell(0, 0));

    for (let i = solutionPath.length - 1; i >= 0; i--) {
        mazePath.add(solutionPath[i]);
    }
}