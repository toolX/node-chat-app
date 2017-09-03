var socket = io();
var form = document.querySelector('#message-form');
var field = form.querySelector('input');
var list = document.querySelector('#messages');

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

form.addEventListener('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: field.value
  }, function () {

  });
});
