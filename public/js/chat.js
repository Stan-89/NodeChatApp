var socket = io();

//Declare our scroll to bottom function
function scrollToBottom ()
{
  // Selecting the stuff

  //The whole spot for messages (this is our working screen)
  var messages = jQuery('#messages');
  //The added msg
  var newMessage = messages.children('li:last-child');

  // Heights: note: we can .prop('nameOfProp') in jQuery to get the info
  //Concerning the particular container

  //ClientHeight: what the user sees currently
  var clientHeight = messages.prop('clientHeight');
  //scrollTop: how many pixels since the top of this element
  var scrollTop = messages.prop('scrollTop');
  //All of it
  var scrollHeight = messages.prop('scrollHeight');
  //New message inner height
  var newMessageHeight = newMessage.innerHeight();
  //Last message's
  var lastMessageHeight = newMessage.prev().innerHeight();

  //What the client sees + pixels from beginning  + newMsgHeight + lastMsgHeight > scrollheight
  //Then we're not exactly on the bottom, but at least 1px off it (but not more than 1 new msg distance)
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}


socket.on('connect', function(){
  //Here: we write our code for checking the room name and what to send to server
  var params = jQuery.deparam(window.location.search); //The GEt string

  //Emit join event with the params as payload
  //Recall that third argument: anon function -> what happens with the info
  //given back from the server (event ACKNOWLEDGEMENT)
  socket.emit('join', params, function (err){
    //If an error was made (returned from server)
    if(err){
      alert(err);
      //After alert, redirect it
      window.location.href = '/';
    }
    else{
      //We'll take care of this later
      console.log("No error");
    }
  });

  console.log('Connected to server');
});

socket.on('disconnect', function(){
  console.log("Disconnected from server");
});

//On updateUserList event, time to run an update for the user list
socket.on('updateUserList', function(users){
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
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
  scrollToBottom();

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
  scrollToBottom();
});
