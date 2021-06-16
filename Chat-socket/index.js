const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 8000;

let recoveryDATA = [];
let usernameLIST = ["DS2", "ds2"];
let passwordLIST = ["cgsgforever", "CGSGFOREVER"];

app.use(express.static('public'));

io.on('connection', (socket) => {
  /* Send message callback */
  socket.on('sendMessage', msg => {
    recoveryDATA.push(msg);
    io.emit('getMessage', msg);
  });

  /* Request data if page reloaded */
  socket.on('requesRrecovery', code => {
    if (code === "code:30" && recoveryDATA != "")
      io.emit('receiveRecovery', recoveryDATA);
  })

  /* Registration of user */
  socket.on('setUsrename', data => {
    if (usernameLIST.indexOf(data.login) > -1)
      socket.emit('usernameOccupied', data.login + ' username is taken! Try another username.');
    else {
      usernameLIST.push(data.login);
      passwordLIST.push(data.password);
      socket.emit('registerUser', { username: data.login });
    }
  })

  /* Logging in user */
  socket.on('getUsrename', data => {
    let loginInd = usernameLIST.indexOf(data.login);
    if (loginInd == -1) {
      socket.emit('loginError', data.login + ' -- no such user exist.');
    } else {
      if (passwordLIST[loginInd] != data.password) {
        socket.emit('loginError', 'wrong password');
      } else {
        socket.emit('successAuth', 'Welcome!');
      }
    }
  })
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});