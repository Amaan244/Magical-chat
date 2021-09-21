const express = require("express");
const app = express();
                                        
const http = require("http").createServer(app);

const PORT = process.env.PORT || 5500;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Socket

const io = require("socket.io")(http);
var users = {};

io.on("connection", (socket) => {
  console.log('Connected..');
  socket.on("new-user-joined", (username) => {
    // users[socket.id] = username;
    // console.log(users);
    socket.broadcast.emit("user-connected",username);
  });

  socket.on("disconnect", (username) => {
    socket.broadcast.emit("user-disconnected",username);
    // , (user = users[socket.id]));
    // delete users[socket.id];
    // io.emit("user-list", users);
  });
  socket.on('message', (msg)=>{
      console.log(msg)
      socket.broadcast.emit('message', msg)
      // socket.broadcast.emit("user-connected", name);
      // socket.broadcast.emit("user-disconnected", name);
  });
});

