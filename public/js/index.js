const socket = io()

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

// callback argument is the newMessage object from server side
socket.on('newMessage', (message) => {
  console.log('New message', message)
  const li = $('<li></li>')
  li.text(`${message.from}: ${message.text}`)

  $('#messages').append(li) // newest item shows on the bottom of a list
})

// e = event
$('#message-form').on('submit', (e) => {
  // prevent the page load when submitting the form
  e.preventDefault()

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val(), // gets the value of message input field
  }, () => {})
})

const locationButton = $('#send-location')
locationButton.on('click', () => {
  // if there's no geolocation on a navigator
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }

  navigator.geolocation.getCurrentPosition( (position) => {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    })
  }, () => {
    alert('Unable to fetch location')
  })
})

