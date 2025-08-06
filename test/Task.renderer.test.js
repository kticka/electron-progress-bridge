import Task        from '../Task.mjs'
import TaskManager from '../TaskManager.mjs'

describe('Renderer Task', () => {
  let task

  beforeEach(async () => {
    task = await Task.invoke(() => {
      return {}
    }, {timeout: 1})
  })

  afterEach(() => {
    TaskManager._stop()
    TaskManager._tasks.clear()
  })

  it('Should trigger "completed" callback when status is completed', async () => {
    let triggered = false
    task.on('completed', () => {
      triggered = true
    })

    task.trigger({
      status: 'completed'
    })

    expect(triggered).toBe(true)
  })

  it('Should trigger "catch" callback when status is error', async () => {
    let triggered = false

    task.on('error', () => {
      triggered = true
    })

    task.trigger({
      status: 'error'
    })

    expect(triggered).toBe(true)
  })

  it('Should trigger "timeout" callback when status is timeout', async () => {
    let triggered = false

    task.on('timeout', () => {
      triggered = true
    })

    task.trigger({
      status: 'timeout'
    })

    expect(triggered).toBe(true)
  })

  it('Should trigger "tick" callback on any other status', async () => {
    let triggered = false

    task.on('tick', () => {
      triggered = true
    })

    task.trigger({
      status: 'inprogress'
    })

    expect(triggered).toBe(true)
  })

  it('Task.trigger should extend expiredAt by timeout', async () => {
    const date = Date.now() + task._timeout * 1000
    task.trigger()
    expect(task._expiresAt).toBeCloseTo(date, -2)
  })
})