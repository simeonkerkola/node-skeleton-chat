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
  const li = jQuery('<li></li>')
  li.text(`${message.from}: ${message.text}`)

  jQuery('#messages').append(li) // newest item shows on the bottom of a list
})

// e = event
jQuery('#message-form').on('submit', (e) => {
  // prevent the page load when submitting the form
  e.preventDefault()

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val(), // gets the value of message input field
  }, () => {})
})
