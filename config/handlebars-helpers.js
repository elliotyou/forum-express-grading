const moment = require('moment')

module.exports = {
  ifCond: (a, b, options) => a === b ? options.fn(this) : options.inverse(this),
  moment: a => moment(a).fromNow(),
  count: arr => arr.length
}