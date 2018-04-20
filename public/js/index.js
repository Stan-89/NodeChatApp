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
    //Just clearing before the next message
    jQuery('[name=message]').val("");
  });
});

//Now, listening to events from server (newMessage), we print it
//Recall that we avoid using arrow notation on user side since many have no es6
socket.on('newMessage', function(message){
var formattedTime = moment(message.createdAt).format('h:mm a');

  //We'll be rendering with Mustache. It's already included in index.html
  //Find the <script> tag that is text/template type with an id, take its html
  var template = jQuery('#message-template').html();

  //Using Mustache, render that html template by looking at the values in the
  //2nd argument for replacement
  var html = Mustache.render(template, {
    //RHS is what we got in the template, lhs is what we give in current context
    //RHS:LHS
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  //Finally, append that html to where it should go (in SCRIPT it wasn't visible)
  jQuery('#messages').append(html);

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
  //Format the time for printing
  var formattedTime = moment(message.createdAt).format('h:mm a');
  //We repeat the same thing now, but for location messages
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
});
