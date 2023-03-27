const express = require("express");
const app = express();
let http = require("http").Server(app);
app.use(express.static(__dirname + "/public"))

let io = require("socket.io")(http);

io.on("connection", socket => {
    console.log("user connected");
    socket.on("create or join", room => {
        console.log('create or join to room ', room);
        const myRoom = io.sockets.adapter.rooms.get(room) || { size: 0 };
        const numClients = myRoom.size;
        console.log(room, 'has ', numClients, 'clients');

        if (numClients == 0) {
            socket.join(room);
            socket.emit("created", room);
        }
        else if (numClients > 0) {
            socket.join(room);
            socket.emit("joined", room);
        }
        else {
            socket.emit("full", room);
        }
    })
    socket.on("ready", room => {
        socket.broadcast.to(room).emit("ready");
    })
    socket.on("candidate", event => {
        socket.broadcast.to(event.room).emit("candidate", event);
    })
    socket.on("offer", event => {
        socket.broadcast.to(event.room).emit("offer", event.sdp);
    })
    socket.on("answer", event => {
        socket.broadcast.to(event.room).emit("answer", event.sdp);
    })
})

http.listen(8080, () => { console.log("live at 8080") });