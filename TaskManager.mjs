class TaskManager {

  setup(connect) {
    try {
      connect((data) => {
        const task = this._tasks.get(data._id)
        if (!task) return
        task.trigger(data)
      })
    } catch (e) {
      throw new Error(`Invalid connect method. (${e.message}). Please check documentation.`)
    }
  }

  constructor() {
    this._tasks = new Map()
    this._timer = null
  }

  add(task) {
    this._tasks.set(task._id, task)
    if ((this._tasks.size > 0)) {
      this._start()
    }
  }

  _start() {
    if (!this.isRunning()) {
      this._timer = setInterval(() => {
        this._cleanup()
      }, 1000)
    }
  }

  _stop() {
    if (this.isRunning()) {
      clearInterval(this._timer)
      this._timer = null
    }
  }


  _cleanup() {
    for (const task of this._tasks.values()) {
      if (task._expiresAt < Date.now()) {
        if (!['completed', 'error'].includes(task.status)) {
          task.emit('timeout', task.data)
        }
        this._tasks.delete(task._id)
      }
    }

    if (this._tasks.size === 0) {
      this._stop()
    }
  }

  isRunning() {
    return this._timer !== null
  }
}

export default new TaskManager()