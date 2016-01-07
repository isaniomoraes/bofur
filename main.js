'use strict';
const electron = require('electron');
const notifier = require('node-notifier');
const path = require('path');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;

var mainWindow;
var appIcon;
var forceQuit = false;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

var gme = {
  browserWindow: null,
  openConfigWindow: function () {
    var configWindow = new BrowserWindow({
      width: 600,
      height: 380,
      resizable: false,
      skipTaskbar: false,
      icon: __dirname + '/assets/images/stopwatch-taskbar.png',
    });
    configWindow.loadURL('file://' + __dirname + 'index.html');
  },
  reloadWindow: function () {
    BrowserWindow.getFocusedWindow().reload();
  },
  showMinimizedWindow: function () {
    gme.browserWindow.restore();
    gme.browserWindow.focus();
  },
  showInvisibleWindow: function () {
    gme.browserWindow.show();
  },
  toggleMinimize: function () {
    if (gme.browserWindow) {
      var isMinimized = gme.browserWindow.isMinimized();

      if (isMinimized) {
        gme.showMinimizedWindow();
      } else {
        gme.browserWindow.minimize();
      }
    }
  }
}

function launch() {
  var windowOpts = {
    width: 600,
    height: 380,
    resizable: false,
    skipTaskbar: false,
    icon: __dirname + '/assets/images/stopwatch-taskbar.png',
  };
  gme.browserWindow = new BrowserWindow(windowOpts);
  gme.browserWindow.loadURL('file://' + __dirname + '/index.html');

  gme.browserWindow.show();

  gme.browserWindow.on('close', function handleWindowClose (e) {
    if(!forceQuit)
      e.preventDefault();
      gme.toggleMinimize();
  });

  gme.browserWindow.on('before-quit', function handleWindowClose (e) {
    gme.browserWindow = null;
  });

  appIcon = new Tray(__dirname +'/assets/images/stopwatch.png');
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Show/Hide', type: 'radio', click: function() { gme.toggleMinimize(); } },
    { label: 'Exit', type: 'radio', click: function() { forceQuit = true; app.quit(true); } },
    ]);
  appIcon.setToolTip('Bofur');
  appIcon.setContextMenu(contextMenu);
}

app.on('ready', function() {
  launch();
});
