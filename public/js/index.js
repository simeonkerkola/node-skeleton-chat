/* eslint prefer-arrow-callback: 0, func-names: 0, no-var: 0, vars-on-top: 0 */
/* global moment  Mustache io */
var socket = io()

socket.on('updateRoomList', function (rooms) {
  console.log('Rooms list', rooms)

  var ul = $('<ul></ul>')

  rooms.forEach(function (room) {
    ul.append($('<li></li>').text(room))
  })

  $('.rooms').append(ul)

  // var select = $('<select></select>')
  //
  // rooms.forEach(function (room) {
  //   select.append($('<option></option>').val(room).text(room))
  // })
  //
  // $('.rooms').append(select)
})
