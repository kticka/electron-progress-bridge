const {contextBridge, ipcRenderer} = 'electron'

module.exports = {
  setup: function () {
    contextBridge.exposeInMainWorld('ElectronProgressBridgeApi', {
      bridge: (callback) => {
        ipcRenderer.on('epb:tick', (event, ...args) => callback(...args))
      }
    })
  }
}

