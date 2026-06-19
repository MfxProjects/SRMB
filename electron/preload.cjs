const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('srmb', {
  kiosk: process.env.SRMB_KIOSK === '1',
});

