
const path = require('path');
const express = require('express');
//Socket io
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();

//Now let's create server
var server = http.createServer(app);

//Get the SocketIO
//We tell socketIO what server we want to use it in.
var io = socketIO(server);
//io is the web socket server.

//Recall: app.use(express.static('dirname')) to be able to serve up
//static files such as .html
app.use(express.static(publicPath));

//Now we listen from the server.
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
