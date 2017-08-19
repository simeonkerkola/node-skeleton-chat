const expect = require('expect')

const { generateMessage, generateLocationMessage } = require('./message')

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'Me'
    const text = 'Yo!'
    const message = generateMessage(from, text)

    expect(message).toInclude({ from, text })
    expect(message.createdAt).toBeA('number')
  })
})

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'User2'
    const lat = 66
    const lng = 77
    const url = `https://www.google.com/maps?q=${lat},${lng}`
    const message = generateLocationMessage(from, lat, lng)

    expect(message).toInclude({ from, url })
    expect(message.createdAt).toBeA('number')
  })
})
