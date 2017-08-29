const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const { Users } = require('./utils/users')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const users = new Users()

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('new user connected')

  // socket.emit, instead of listening of an event creates an event
  // first arg = name of the event to emit, second arg object
  // that object is sent to a client side

  socket.on('join', (params, callback) => {
    // check if user name and room names are valid
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.')
    }

    socket.join(params.room)

    // user left/was kicked from the room
    users.removeUser(socket.id)

    // add new user to the list
    users.addUser(socket.id, params.name, params.room)
    // socket.leave('The Office Fans')

    // update users list at (chat.js)
    io.to(params.room).emit('updateUserList', users.getUserList(params.room))

    // socket.emit from Admin text: Welcome to chat app
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'))

    // broadcast sends an event to everybody but this socket
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined!`))

    // on success no arguments because the first and only argument in chat.js
    // is an error argument
    return callback()
  })

  socket.on('createMessage', (message, gotMessage) => {
    console.log(message)
    const user = users.getUser(socket.id)

    // check if user object exists
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
    }
    gotMessage()
  })

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id)

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.lng))
    }
  })

  socket.on('disconnect', () => {
    // remove users from list on disconnect
    const user = users.removeUser(socket.id)

    if (user) {
      // update the users list
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} just left the room.`))
    }
  })
})

// app.get('/', (req, res) => {
//   app.render('index.html')
// })

server.listen(port, () => console.log(`Server is up on port:  ${port}`))
