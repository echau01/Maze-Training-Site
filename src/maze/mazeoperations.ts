import MazePath from "./mazepath";
import Maze from "./maze";
import Cell from "./cell";


// Returns an array of cells which represents the solution to the maze.
export function getSolution(maze: Maze, mazePath: MazePath) {

    let visited: boolean[][] = [];     // Keeps track of previously visited paths.
    let toExplore: Cell[] = [];        // Location data will be stored as an array holding an x and y value.
    let discoveredFrom: Cell[][] = []; // Marks which cell the current cell had come from.

    // Clears the maze path.
    for (let i = 0; i < maze.getColumns(); i++) {
        visited[i] = [];
        discoveredFrom[i] = [];
    }

    visited[0][0] = true;
    discoveredFrom[0][0] = maze.getCell(0, 0);
    toExplore.push(maze.getCell(0, 0));

    /*
    Runs a BFS on the maze until it reaches the endpoint.
    As the BFS runs, it keeps track of each cell that it comes from.
    Also keeps track of visited nodes to prevent looping.
     */
    while (toExplore.length) {
        let curr = toExplore.shift();
        let neighbors = maze.neighbours(curr)

        for(let c of neighbors) {
            let x = c.getColumn()
            let y = c.getRow();

            if (!visited[x][y] && c.isOpen()) {
                discoveredFrom[x][y] = curr;
                visited[x][y] = true;
                toExplore.push(c);
            }
        }
    }
    let solutionPath: Cell[] = [];
    toExplore.push(maze.getCell(maze.getRows() - 1, maze.getColumns() - 1));


    /*
    Starts at endpoint and traces back along the path where it came from.
    This gives us an array of cells representing the solution starting from the endpoint.
     */
    while (toExplore.length) {
        let curr = toExplore.shift();
        let currX = curr.getColumn();
        let currY = curr.getRow();

        solutionPath.push(curr);

        if (!discoveredFrom[currX][currY].equals(maze.getCell(0, 0)))
            toExplore.push(discoveredFrom[currX][currY]);
    }
    solutionPath.push(maze.getCell(0, 0));

    for (let c of solutionPath.reverse()) {
        mazePath.add(c);
    }

    return mazePath
}