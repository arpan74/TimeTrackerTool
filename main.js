const { app, BrowserWindow, Tray } = require("electron");

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

const createWindow = () => {
  window = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false
  });
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
  window.focus();
};

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};
