var socket = io();


socket.on('connect', function(){
  console.log('Connected to server');
});

socket.on('disconnect', function(){
  console.log("Disconnected from server");
});

//Listen for newEmail that we declared in the server.js
socket.on('newEmail', function(email) {
  console.log("Received mail from server", email);
});

//Now, send it!
socket.emit('createEmail', {
  to: "yo@yo.ca",
  text: "The text yo"
});
