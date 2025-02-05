const {default: TaskManager} = await import('../TaskManager.mjs')
import Task from '../Task.mjs'

describe('TaskManager', () => {

  afterAll(() => {
    TaskManager._tasks.clear()
    TaskManager._stop()
  })

  it('TaskManager.add should add task to TaskManager._tasks and start timer', async () => {
    await Task.invoke(() => ({_id: 'test'}))
    expect(TaskManager._tasks.size).toBe(1)
    expect(TaskManager.isRunning()).toBe(true)
    expect(TaskManager._timer).not.toBe(null)

  })

  it('TaskManager._cleanup should remove expired tasks and stop timer', async () => {
    await Task.invoke(() => ({_id: 'test'}), {timeout: -1})
    TaskManager._cleanup()

    expect(TaskManager._tasks.size).toBe(0)
    expect(TaskManager.isRunning()).toBe(false)
    expect(TaskManager._timer).toBe(null)
  })
})