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


//Since we have jquery
//On submission of the message form
jQuery('#message-form').on('submit', function(e){
  //Don't let the page reload
  e.preventDefault();

  //Emit the message
  //Recall that socket = io(); and it represents this user's connection to the
  //server
  //Also since JS, we have access to jQuery at the same time as socket.js
  //that is given from server
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function(){
    jQuery('[name=message]').val("");
  });
});

//Now, listening to events from server (newMessage), we print it
//Recall that we avoid using arrow notation on user side since many have no es6
socket.on('newMessage', function(message){
console.log('newMessage', message);
var li = jQuery('<li></li>');
//Concatination works even if no es6
li.text(`${message.from}: ${message.text}`);
jQuery('#messages').append(li);
});

//--------------------------------------------------------- GEOLOCATION PART
//Click on the location button
var locationButton = jQuery('#send-location');
//Upon clicking the button
locationButton.on('click', function () {
  //!navigator.geolocation if not supported/allowed
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  //Navigator.geolocation.currentPosition gets an anonymous function
  //whos argument is the position (position.coords.latitude or longitude)
  navigator.geolocation.getCurrentPosition(function (position) {
    //Emit createLocation msg
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location.');
  });
});

//When we receive a newLocationMessage by the server, show it
socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});
