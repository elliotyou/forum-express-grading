module.exports = {
  ifCond: (a, b, options) => a === b ? options.fn(this) : options.inverse(this)
}