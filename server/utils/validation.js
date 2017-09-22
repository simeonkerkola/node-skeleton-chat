const isRealString = str => typeof str === 'string' && str.trim().length > 0
const isEmpty = str => !str || str.trim() === 0

module.exports = { isRealString, isEmpty }
