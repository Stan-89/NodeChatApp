
const path = require('path');
const express = require('express');
//Require http since we've been using it, but now need it explicitly
const http = require('http');

//Socket io
const socketIO = require('socket.io');

//Get the util generateMessage
//Recall object deconstruction ES6: const {onlyWhatWeWantImported} = require(...)
const {generateMessage, generateLocationMessage} = require('./util/message.js');

//Realstring tool from utils
const {isRealString} = require('./util/validation.js');

//User class
const {Users} = require('./util/users.js');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();

//Now let's create server
var server = http.createServer(app);

//Get the SocketIO
//We tell socketIO what server we want to use it in.
var io = socketIO(server);
//io is the web socket server.

//We keep track of our users with Users
var users = new Users();

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
socket.broadcast.emit('newMessage',generateMessage('Admin', 'A new user has joined!'));

//After the connection is made and we have the socket (individual conenction)
//Listen to 'join' event sent from the connection -> and use callback since we'll return
//error msg if the name is not right
socket.on('join', (params, callback) => {
  if(!isRealString(params.name) || !isRealString(params.room)){
    callback("Name and room name are required!");
  }

  //Join the room in question
  socket.join(params.room);

  //Remove the user, just in case
  users.removeUser(socket.id);

  //Add him
  users.addUser(socket.id, params.name, params.room);

  //Emit to whole room
  io.to(params.room).emit('updateUserList', users.getUserList(params.room));

  //If here, we're ok
  //Emit to this particular user
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  //Broadcast to room (everyone in room except current user) that he/she has joined
  //In params, we have .room and .name contained (from deparam href)
  socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));


  //If no errors, empty callback -> so that if(err) will be false and server will tell OK
  callback();
});



//A new message has been created by THIS (socket) user - user will emit a createMessage event
//and we take care of it here. Idea is to tell the chat that there is a new msg
socket.on('createMessage', (message, callback) => {
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

    //Event acknowledgement: We can send 1 argument back with callback(...);
    callback({
      msg:'AllGood',
      myStatus: 200
    });

  });

  //Now, when this connection sends a createLocationMessage, we'll emit it
  //to everyone. Note that the from will always be Admin and in this case
  //the payload is just the coords. Also: no callback for validation needed.
  //(Second argument would have to be callback if we want to send back info)
  socket.on('createLocationMessage', (coords) => {
    //Emit to everyone
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  //On disconnect
  socket.on('disconnect', () => {
    //Get the disconnected user
    var user = users.removeUser(socket.id);

    //If there was such a user, update the list and send msg
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });

});


//Recall: app.use(express.static('dirname')) to be able to serve up
//static files such as .html
app.use(express.static(publicPath));

//Now we listen from the server.
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
