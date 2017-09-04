var socket = io();
var form = document.querySelector('#message-form');
var field = form.querySelector('input');
var list = document.querySelector('#messages');
var locationButton = document.querySelector('#send-location');

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('New message', message);

  var li = document.createElement('li');
  li.innerText = `${message.from}: ${message.text}`;
  list.appendChild(li);
});

socket.on('newLocationMessage', function (message) {
  var li = document.createElement('li');
  var link = document.createElement('a');
  li.innerText = `${message.from}: `
  link.setAttribute('href', message.url);
  link.setAttribute('target', '_blank');
  link.innerText = 'My current location';
  list.appendChild(li);
  li.appendChild(link);
  list.appendChild(li);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: field.value
  }, function () {
    field.value = '';
  });
});

locationButton.addEventListener('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported in your browser.');
  }

  locationButton.setAttribute('disabled', 'disabled');
  locationButton.innerText = 'Sending location...';

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttribute('disabled');
    locationButton.innerText = 'Send location';
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttribute('disabled');
    locationButton.innerText = 'Send location';
    alert('Unable to fetch location.');
  });
});
