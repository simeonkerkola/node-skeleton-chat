const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation')

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

  socket.on('join', (params, callback) => {
    // check if user name and room names are valid
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are required.')
    }

    socket.join(params.room)
    // socket.leave('The Office Fans')

    // socket.emit from Admin text: Welcome to chat app
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

    // broadcast sends an event to everybody but this socket
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined!`))

    // on success no arguments because the first and only argument in chat.js
    // is an error argument
    callback()
  })

  socket.on('createMessage', (message, gotMessage) => {
    console.log(message)
    io.emit('newMessage', generateMessage(message.from, message.text))
    gotMessage()
  })

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng))
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected')
  })
})

// app.get('/', (req, res) => {
//   app.render('index.html')
// })

server.listen(port, () => console.log(`Server is up on port:  ${port}`))
