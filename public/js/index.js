const socket = io()

socket.on('connect', () => {
  console.log('Connected to server')

  socket.emit('createMessage', {
    from: 'This guy',
    text: 'Im online!',
  })
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

// callback argument is the email object from server side

socket.on('newMessage', (message) => {
  console.log('New message', message)
})
