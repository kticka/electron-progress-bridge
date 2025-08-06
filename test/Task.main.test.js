const {default: Task}     = await import('../Task.cjs')
import {jest} from '@jest/globals'

const event = {
  sender: {
    send: jest.fn()
  }
}

describe('Renderer Task', () => {

  afterEach(() => {
    event.sender.send.mockClear()
  })

  it('Task.invoke() without sender should throw an error', async () => {
    try {
      await Task.invoke(null)
      fail('Expected Error to be thrown.')
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })

  it('Task._sender.send should be triggered when provided by options', async () => {
    const task = await Task.invoke(null, {event})
    expect(task._sender).toBeDefined()
    task.emit()
    expect(event.sender.send).toHaveBeenCalledTimes(1)
  })

  it('Task._sender.send should be triggered when provided by setup', async () => {
    Task.setup(event.sender)
    const task = await Task.invoke(null)
    expect(task._sender).toBeDefined()
    task.emit()
    expect(event.sender.send).toHaveBeenCalledTimes(1)
  })

  it('Task.update() should update direct properties and data properties', async () => {
    const task = await Task.invoke(null, {event})
    task.update({
      label:    'test1',
      progress: 50,
      status:   'test2',
      data:     {
        test: 'test3'
      },
      skip:     'test3'
    })

    expect(task.label).toBe('test1')
    expect(task.progress).toBe(50)
    expect(task.status).toBe('test2')
    expect(task.data.test).toBe('test3')
    expect(task.skip).toBeUndefined()
    expect(task.data.skip).toBeUndefined()
  })

  it('Task.set() should update direct properties and data properties', async () => {
    const task = await Task.invoke(null, {event})
    task.set('label', 'test1')
    task.set('progress', 50)
    task.set('status', 'test2')
    task.set('data', {test: 'test3'})
    task.set('skip', 'test3')

    expect(task.label).toBe('test1')
    expect(task.progress).toBe(50)
    expect(task.status).toBe('test2')
    expect(task.data.test).toBe('test3')
    expect(task.skip).toBeUndefined()
    expect(task.data.skip).toBeUndefined()
  })

  it('Task.unset() should remove data properties', async () => {
    const task = await Task.invoke(null, {event})
    task.update({
      data: {
        test: 'test1',
        test2: 'test2'
      }
    })

    task.unset('test')
    expect(task.data.test).toBeUndefined()
    expect(task.data.test2).toBe('test2')
  })

  it('Task.increment() should increment progress', async () => {
    const task = await Task.invoke(null, {event})
    task.increment(10)
    expect(task.progress).toBe(10)
  })

  it('Task.complete() should set progress to 100 and status to completed', async () => {
    const task = await Task.invoke(null, {event})
    task.complete()
    expect(task.progress).toBe(100)
    expect(task.status).toBe('completed')
  })

  it('Task.throw() should set status to error', async () => {
    const task = await Task.invoke(null, {event})
    task.throw(new Error('test'))
    expect(task.status).toBe('error')
    expect(task.error).toBe('test')
  })

})