
const path = require('path');
const express = require('express');
//Require http since we've been using it, but now need it explicitly
const http = require('http');

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

//io.on lets us register a listener to an event.
//Socket is itself the connection established
io.on('connection', (socket) => {
  console.log("New user connected");

  //On disconnect, just say it
  socket.on('disconnect', () => {
    console.log("A user disconnected");
  });

  //Emit a message
  socket.emit('newMessage', {
    from: 'Stan',
    text: 'Some text here man',
    createdAt: 123123
  });

  //On createMessage, print it
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
  });

});


//Recall: app.use(express.static('dirname')) to be able to serve up
//static files such as .html
app.use(express.static(publicPath));

//Now we listen from the server.
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
