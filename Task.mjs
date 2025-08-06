import mitt        from 'mitt'
import TaskManager from './TaskManager.mjs'

export default class Task {

  static setup(connect) {
    TaskManager.setup(connect)
  }

  static async invoke(cb, options = {}) {

    options = Object.assign({
      timeout: 5
    }, options)

    const data = await cb()
    const task = new Task(data, options)
    TaskManager.add(task)
    return task
  }

  constructor(data, options = {}) {
    this._id        = data._id
    this._timeout   = options?.timeout
    this._expiresAt = Date.now() + (this._timeout * 1000)
    this._emitter   = mitt()
    this.update(data)
  }

  on(event, cb) {
    this._emitter.on(event, cb)
    return this
  }

  emit(event, data) {
    this._emitter.emit(event, data)
  }

  update(data) {
    this.progress = data.progress ?? this.progress ?? 0
    this.label    = data.label ?? this.label ?? ''
    this.status   = data.status ?? this.status ?? ''
    this.data     = data.data ?? this.data ?? {}
    this.error    = data.error ?? this.error ?? null
    return this
  }

  trigger(data = {}) {
    this.update(data)
    this._expiresAt = Date.now() + (this._timeout * 1000)
    const event     = ['completed', 'error', 'timeout'].includes(this.status) ? this.status : 'tick'
    this.emit(event, this.serialize())
    return this
  }

  serialize() {
    return {
      _id:      this._id,
      status:   this.status,
      progress: this.progress,
      label:    this.label,
      error:    this.error,
      data:     this.data
    }
  }
}
