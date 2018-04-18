
const path = require('path');
const express = require('express');
//Require http since we've been using it, but now need it explicitly
const http = require('http');

//Socket io
const socketIO = require('socket.io');

//Get the util generateMessage
//Recall object deconstruction ES6: const {onlyWhatWeWantImported} = require(...)
const {generateMessage} = require('./util/message.js');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();

//Now let's create server
var server = http.createServer(app);

//Get the SocketIO
//We tell socketIO what server we want to use it in.
var io = socketIO(server);
//io is the web socket server.

//A connection with the user is established
//when io.On , we listen to EVERYONE. Its argument is socket
//When socket.on, we listen to that specific connection ONLY.
io.on('connection', (socket) => {
//The arg socket represents the connection associated
//Print in the console about the connection
console.log("New user connected");


//Emit an event to this user (socket)
socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat application!'));

//Tell everyone except the current user about hte new connection
//socket.broadcast.emit will send to everyone except the socket [connected user]
//We'll send the same event type (newMessage) since it's the same thing as the one
//before - on the front end, we need to write it only once.
socket.broadcast.emit('newMessage',generateMessage('Admin', 'A new user has joined!'))

//A new message has been created by THIS (socket) user - user will emit a createMessage event
//and we take care of it here. Idea is to tell the chat that there is a new msg
socket.on('createMessage', (message) => {
  //We print it here on the server, we have received a msg from this connection
  console.log('createMessage', message);

  //Emit to EVERYONE, including the user who posted this message
  io.emit('newMessage', generateMessage(message.from, message.text));

  //Note: if we wanted to broadcast (show this msg to everyone except the socket)
  //Since it is the user on this particular socket that we sent it ...
  //Recall that we get socket from io.on('connection', (socket) => {...})
  /*
  socket.broadcast.emit('newMessage', {
    from: message.from,
    text: message.text,
    createdAt: new Date().getTime()
  });

  */
  });

  //On disconnect
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

});


//Recall: app.use(express.static('dirname')) to be able to serve up
//static files such as .html
app.use(express.static(publicPath));

//Now we listen from the server.
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
