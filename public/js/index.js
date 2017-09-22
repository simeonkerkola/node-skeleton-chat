/* eslint prefer-arrow-callback: 0, func-names: 0, no-var: 0, vars-on-top: 0 */
/* global moment  Mustache io */
var socket = io()

socket.on('updateRoomList', function (rooms) {
  // var ul = $('<ul></ul>')
  //
  // rooms.forEach(function (room) {
  //   var nameCapitalized = room[0].toUpperCase() + room.slice(1)
  //   ul.append($('<li></li>').text(nameCapitalized))
  // })
  //
  // $('.rooms').append(ul)

  var select = $('.roomList')

  rooms.forEach(function (room) {
    var nameCapitalized = room[0].toUpperCase() + room.slice(1)
    select.append($('<option></option>').val(room).text(nameCapitalized))
  })

  $('.rooms').append(select)
})

// toggle 'room' attribute between list and input
$('a').click(function () {
  $('.toggle').toggle()
  if ($('.roomList').attr('name')) {
    $('.roomList').removeAttr('name')
    $('.roomField').attr('name', 'room')
    document.querySelector('.room-toggle-link').textContent = '- New Room'
  } else {
    $('.roomField').removeAttr('name')
    $('.roomList').attr('name', 'room')
    document.querySelector('.room-toggle-link').textContent = '+ New Room'
  }
})

console.log('moi')
