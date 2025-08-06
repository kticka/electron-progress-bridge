const {default: mitt}        = await import('mitt')
const {default: MTask}       = await import('../Task.cjs')
const {default: TaskManager} = await import('../TaskManager.mjs')
import RTask  from '../Task.mjs'
import {jest} from '@jest/globals'


describe('Bridge', () => {

  let mTask, rTask

  const bridge = mitt()

  const event = {
    sender: {
      send: jest.fn(function () {
        bridge.emit(...arguments)
      })
    }
  }

  beforeAll(() => {
    RTask.setup(function (cb) {
      bridge.on('epb:tick', cb)
    })

    MTask.setup(event.sender)
  })

  beforeEach(async () => {
    mTask = await MTask.invoke({event})
    rTask = await RTask.invoke(() => {
      return mTask.serialize()
    })
  })

  afterEach(() => {
    TaskManager._stop()
    TaskManager._tasks.clear()
  })

  it('rTask._id should be equal to mTask._id', async () => {
    expect(rTask._id).toBe(mTask._id)
  })

  it('MTask.emit() should trigger RTask.emit()', async () => {
    let received
    rTask.on('tick', () => {
      received = true
    })

    expect(received).toBeUndefined()
    mTask.emit()

    expect(received).toBe(true)
  })

  it('MTask.complete() should trigger RTask.complete()', async () => {
    let received

    rTask.on('completed', () => {
      received = true
    })

    mTask.complete().emit()
    expect(rTask.status).toBe('completed')
    expect(rTask.progress).toBe(100)
  })

  it('MTask.throw() should trigger RTask.catch()', async () => {
    let received

    rTask.on('error', () => {
      received = true
    })

    mTask.throw(new Error('test')).emit()

    expect(received).toBe(true)
    expect(rTask.status).toBe('error')
    expect(rTask.error).toBe('test')
  })

})