const {contextBridge, ipcRenderer} = 'electron'

module.exports = {
  setup: function () {
    contextBridge.exposeInMainWorld('ElectronProgressBridgeApi', {
      attach: (callback) => {
        ipcRenderer.on('task:update', (event, ...args) => callback(...args))
      }
    })
  }
}

