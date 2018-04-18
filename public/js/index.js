var socket = io();


socket.on('connect', function(){
  console.log('Connected to server');
});

socket.on('disconnect', function(){
  console.log("Disconnected from server");
});


socket.on('newMessage', function(message) {
  console.log("Received message from server", message);
});


//Just a test to see how we can use the event acknowledgement from the server
socket.emit('createMessage', {
  from: 'Frank',
  text: 'Hi'
}, function (data) {
  console.log('Got it', data);
});
