const moment = require('moment')

const someTimestamp = moment().valueOf()
console.log(someTimestamp)

const date = moment(12345)
// date.add(1, 'years').subtract(9, 'months')
console.log(date.format('H:mm'))
