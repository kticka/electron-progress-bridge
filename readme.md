# Electron Progress Bridge

[![Node.js CI](https://github.com/kticka/electron-progress-bridge/actions/workflows/test.yml/badge.svg)](https://github.com/kticka/electron-progress-bridge/actions/workflows/test.yml)

Electron Progress Bridge is a utility designed to facilitate the communication of progress updates from Electron's main process to the renderer process (ipcRenderer). This package is particularly useful for applications that require real-time progress tracking, such as file downloads, data
processing, or background computations.

## Installation

```bash
npm install electron-progress-bridge
```
## Prerequisites



## Usage

### ipcMain
```javascript
const Task = require('electron-progress-bridge')

Task.setup(mainWindow)

ipcMain.handle('method', (event) => {
  Task.invoke((task) => {
    task.set('status', 'working').tick()
    for (const i = 0; i <= 100; i++) {
      task.increment().tick()
    }
    task.complete().tick()
  }, {event})
})
```

### Preload
```javascript
const {contextBridge, ipcRenderer} = 'electron'

contextBridge.exposeInMainWorld('myApi', {
  // Expose listener for Task events
  bridge(callback)  {
    ipcRenderer.on('epb:tick', (event, task) => callback(task))
  },
  
  // Expose actual method
  method() {
    return ipcRenderer.invoke('method')
  },
})
```

### ipcRenderer
```javascript
import Task from 'electron-progress-bridge'

Task.setup(window.myApi.bridge)

Task.invoke(async () => await window.myApi.method()).then(task => {
  task.tick((data) => {
    console.log('progress', data)
  })

  task.completed(() => {
    console.log('completed', data)
  })
})
```



