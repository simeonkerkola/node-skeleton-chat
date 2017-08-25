const expect = require('expect')

const { isRealString } = require('./validation')

describe('isRealString', () => {
  it('it should reject non-string values', () => {
    const res = isRealString(666)
    expect(res).toBe(false)
  })

  it('should reject string with only spaces', () => {
    const res = isRealString('  ')
    expect(res).toBe(false)
  })

  it('should allow string with non-space charecters', () => {
    const res = isRealString(' c.')
    expect(res).toBe(true)
  })
})
