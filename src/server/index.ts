import * as express from "express";
import * as path from "path";
import Maze from "../maze/maze";

const app = express();
const port = 3000;

app.use("/", express.static(path.join(__dirname + "/../client")));

app.get("/generateMaze", function(req, res) {
    // TODO: store maze in a database for solution verification later
    const maze = new Maze(25, 51);
    res.send(maze);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});