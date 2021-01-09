import * as express from "express";
import * as path from "path";

const app = express();
const port = 3000;

app.use("/", express.static(path.join(__dirname + "/../client")));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});