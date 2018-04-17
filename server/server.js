
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

  //Now, we're going to EMIT
  //socket.emit('newEmail', payload)
  socket.emit('newEmail', {
    from: 'Stannis@stan.ca',
    text: 'Hello how are you',
    createAt: 123
  });
  //^Ideally, we'd do this in a different file for example.
  //Ex: chat -> when a POST Msg has been sent and received
  //After an insertion into MongoDB for example.

  //Now, listen to event fired from the user side
  socket.on('createEmail', (newEmail) => {
    console.log("User created an email", newEmail);
  });

});







//Recall: app.use(express.static('dirname')) to be able to serve up
//static files such as .html
app.use(express.static(publicPath));

//Now we listen from the server.
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
