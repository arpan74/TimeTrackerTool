const { app, BrowserWindow, Tray, ipcMain, webContents } = require("electron");

let tray;
let window;

app.dock.hide();

app.on("ready", () => {
  createTray();
  createWindow();
  tray.on("right-click", toggleWindow);
  tray.on("double-click", toggleWindow);
  tray.on("click", toggleWindow);
});

const createTray = () => {
  tray = new Tray(`${__dirname}/static/IconTemplate.png`);
};

ipcMain.on("fileLocation", (event, path) => {
  window.webContents.send("fileLocation", path);
});

const createWindow = () => {
  window = new BrowserWindow({
    width: 325,
    height: 425,
    //width: 800,
    //height: 800,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  //window.webContents.openDevTools();
  window.loadURL(`file://${__dirname}/index.html`);
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
};

const showWindow = () => {
  const { x, y } = getWindowPosition();
  window.setPosition(x, y, false);
  window.show();
  window.setVisibleOnAllWorkspaces(true); // put the window on all screens
  window.focus(); // focus the window up front on the active screen
  window.setVisibleOnAllWorkspaces(false); // disable all screen behavior
  window.webContents.send("newStartTime");
};

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};
