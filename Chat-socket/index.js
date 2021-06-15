const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 8000;

let recoveryDATA = "";

app.use(express.static('public'))

io.on('connection', (socket) => {
  socket.on('sendMessage', msg => {
    let result = msg.split(":");
    recoveryDATA = recoveryDATA + `<tr class="anim"><td class="name">${result[0]}:</td><td class="msg">${result[1]}</td></tr>`;
    io.emit('getMessage', msg);
  });
  socket.on('requesRrecovery', code => {
    if (code === "code:30" && recoveryDATA != "")
      io.emit('receiveRecovery', recoveryDATA);
  })
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});