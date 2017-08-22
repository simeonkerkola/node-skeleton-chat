/* eslint prefer-arrow-callback: 0, func-names: 0, no-var: 0, vars-on-top: 0 */
var socket = io()

function scrollToBottom() {
  // Selectors
  var messages = $('#messages') // select #messages container
  // store the selectror of a last list item
  var newMessage = messages.children('li:last-child')

  // Heights
  // .prop method fetches a property from th browser
  var clientHeight = messages.prop('clientHeight')
  var scrollTop = messages.prop('scrollTop')
  var scrollHeight = messages.prop('scrollHeight')

  // counts the height of a message, taking into a count padding as well
  var newMessageHeight = newMessage.innerHeight()

  // .prev() moves us to the previous child, ie from last message to second last
  var lastMessageHeight = newMessage.prev().innerHeight()

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight) // set the scrollTop value to scrollHeight
  }
}

socket.on('connect', function () {
  console.log('Connected to server')
})

socket.on('disconnect', function () {
  console.log('Disconnected from server')
})

// callback argument is the newMessage object from server side
socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('H:mm')
  var template = $('#message-template').html()
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  })
  $('#messages').append(html)
  scrollToBottom()
})

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('H:mm')
  var template = $('#location-message-template').html()
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime,
  })
  $('#messages').append(html)
  scrollToBottom()
})

// e = event
$('#message-form').on('submit', function (e) {
  // prevent the page load when submitting the form
  e.preventDefault()

  var messageTextBox = $('[name=message]')

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val(), // gets the value of message input field
  }, function () {
    messageTextBox.val('') // clears value after message sent
  })
})

var locationButton = $('#send-location')
locationButton.on('click', function () {
  // if there's no geolocation on a navigator
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }

  // disable location button while fethching location
  locationButton.attr('disabled', 'disabled').text('Sending location...')

  navigator.geolocation.getCurrentPosition(function (position) {
    // release the location button again
    locationButton.removeAttr('disabled').text('Send location')

    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    })
  }, function () {
    // release the button if denied as well
    locationButton.removeAttr('disabled').text('Send location')
    alert('Unable to fetch location')
  })
})
