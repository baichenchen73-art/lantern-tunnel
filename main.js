// 用獨立視窗開啟遊戲（不需要瀏覽器）。F11 全螢幕，Ctrl+R 重新整理，F12 開發者工具（看錯誤訊息、下中斷點）。
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 640,
    minHeight: 360,
    backgroundColor: '#0d0b13',
    title: '地道',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true }
  });
  Menu.setApplicationMenu(null);
  const file = path.join(__dirname, 'index.html');
  win.loadFile(file);
  // 在 VS Code 改了 index.html 並存檔（Ctrl+S），遊戲視窗會自動重新載入
  let t = null;
  try {
    require('fs').watch(file, () => {
      clearTimeout(t);
      t = setTimeout(() => { if (!win.isDestroyed()) win.reload(); }, 400);
    });
  } catch (e) {}
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    if (input.control && input.key.toLowerCase() === 'r') { win.reload(); e.preventDefault(); }
    if (input.key === 'F12') { win.webContents.toggleDevTools(); e.preventDefault(); }
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
