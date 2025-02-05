const crypto = require('crypto')
let _sender

module.exports = class Task {

  static setup(sender) {
    _sender = sender
  }

  static invoke() {
    let options = {}, cb = null

    if (arguments.length === 2) {
      cb      = arguments[0]
      options = arguments[1]
    } else if (arguments.length === 1) {
      if (typeof arguments[0] === 'function') cb = arguments[0]
      else options = arguments[0]
    }

    options = Object.assign({
      event:     null,
      serialize: false
    }, options)

    const task = new Task(options)
    return new Promise((resolve) => {
      resolve(options?.serialize ? task.serialize() : task)
      if (cb) {
        process.nextTick(() => {
          cb(task)
        })
      }
    })
  }

  constructor(options = {}) {
    this._id     = crypto.randomUUID()
    this._sender = options?.event?.sender ?? _sender
    if (!this._sender) throw new Error('Task requires a sender.')
    this.reset()
  }

  reset() {
    this.label    = ''
    this.status   = ''
    this.progress = 0
    this.error    = null
    this.data     = {}
  }

  update(data) {
    for (const key in data) {
      this.set(key, data[key])
    }
    return this
  }

  set(key, value) {
    if (['progress', 'status', 'label', 'error'].includes(key)) this[key] = value
    else if (key === 'data') {
      if (typeof value === 'object') {
        this.data = Object.assign(this.data, value)
      } else {
        this.data = value
      }
    }
    return this
  }

  unset(key) {
    delete this.data[key]
    return this
  }

  increment(value) {
    this.progress += value
    return this
  }

  complete() {
    return this.update({
      progress: 100,
      status:   'completed'
    })
  }

  throw(e) {
    return this.update({
      status: 'error',
      error:  e.message
    })
  }

  tick() {
    this._sender.send('epb:tick', this.serialize())
  }

  serialize() {
    return {
      _id:      this._id,
      label:    this.label,
      status:   this.status,
      progress: this.progress,
      data:     this.data,
      error:    this.error
    }
  }
}


