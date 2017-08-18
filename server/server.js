const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { generateMessage } = require('./utils/message')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)


app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('new user connected')

  // socket.emit, instead of listening of an event creates an event
  // first arg = name of the event to emit, second arg object
  // that object is sent to a client side

  // socket.emit from Admin text: Welcome to chat app
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

  // broadcast sends an event to everybody but this socket
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined!'))

  socket.on('createMessage', (message, gotMessage) => {
    console.log(message)
    io.emit('newMessage', generateMessage(message.from, message.text))
    gotMessage('this is from the server')
    // broadcast sends an event to everybody but this socket
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime(),
    // })
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected')
  })
})

// app.get('/', (req, res) => {
//   app.render('index.html')
// })

server.listen(port, () => console.log(`Server is up on port:  ${port}`))
