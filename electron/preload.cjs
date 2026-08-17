const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('srmb', {
  kiosk: process.env.SRMB_KIOSK === '1',
  exitApp: () => ipcRenderer.invoke('srmb:exit-app'),
});
