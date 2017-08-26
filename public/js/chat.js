/* eslint prefer-arrow-callback: 0, func-names: 0, no-var: 0, vars-on-top: 0 */
/* global moment  Mustache io */
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
  // grab that search string and return an object w/ name and room values
  var params = $.deparam(window.location.search)

  // Check that room where trying to join indeed exists
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err)
      // sending user back to the root of the app by changing one of the
      // properties under the location
      window.location.href = '/'
    } else {
      console.log('No error')
    }
  })
})

socket.on('disconnect', function () {
  console.log('Disconnected from server')
})

socket.on('updateUserList', function (users) {
  // console.log(users)

  // create a new jQuery element
  var ol = $('<ol></ol>')

  // append each user to ol-list above
  users.forEach(function (user) {
    // create a new list item and set the text property to user(name)
    ol.append($('<li></li>').text(user))
  })

  // whipe the list replacing it with the new version
  $('.users').html(ol)
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
