/* eslint prefer-arrow-callback: 0, func-names: 0, no-var: 0, vars-on-top: 0 */
var socket = io()

socket.on('connect', function () {
  console.log('Connected to server')
})

socket.on('disconnect', function () {
  console.log('Disconnected from server')
})

// callback argument is the newMessage object from server side
socket.on('newMessage', function (message) {
  console.log('New message', message)
  var li = $('<li></li>')
  li.text(`${message.from}: ${message.text}`)

  $('#messages').append(li) // newest item shows on the bottom of a list
})

socket.on('newLocationMessage', function (message) {
  var li = $('<li></li>')
  var a = $('<a target="_blank">My current location</a>')

  li.text(`${message.from}: `)
  a.attr('href', message.url)
  li.append(a)
  $('#messages').append(li) 
})

// e = event
$('#message-form').on('submit', function (e) {
  // prevent the page load when submitting the form
  e.preventDefault()

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val(), // gets the value of message input field
  }, function () {})
})

var locationButton = $('#send-location')
locationButton.on('click', function () {
  // if there's no geolocation on a navigator
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    })
  }, function () {
    alert('Unable to fetch location')
  })
})

