var socket = io();
var form = document.querySelector('#message-form');
var field = form.querySelector('input');
var list = document.querySelector('#messages');
var locationButton = document.querySelector('#send-location');

var scrollToBottom = function () {
  var newMessage = list.lastChild;
  var clientHeight = list.clientHeight;
  var scrollTop = list.scrollTop;
  var scrollHeight = list.scrollHeight;
  var newMessageHeight = newMessage.offsetHeight;
  var lastMessageHeight = newMessage.previousSibling ? newMessage.previousSibling.offsetHeight : 0;

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop = scrollHeight;
  }
};

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  var ol = document.createElement('ol');
  var usersContainer = document.querySelector('#users');
  usersContainer.innerHTML = '';

  users.forEach(function (user) {
    var li = document.createElement('li');
    li.innerText = user;
    ol.appendChild(li);
  });

  usersContainer.appendChild(ol);
});

socket.on('newMessage', function (message) {
  var li = document.createElement('li');
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = document.querySelector('#message-template').innerHTML;
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  li.classList.add('message');
  li.innerHTML = html;
  list.appendChild(li);

  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = document.createElement('li');
  var template = document.querySelector('#location-message-template').innerHTML;
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  li.classList.add('message');
  li.innerHTML = html;
  list.appendChild(li);
  scrollToBottom();
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
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
