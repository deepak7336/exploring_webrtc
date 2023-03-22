const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"))
app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html")).listen(8080, () => { console.log("live at 8080") });