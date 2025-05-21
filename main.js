const { app, BrowserWindow, screen } = require("electron");
app.commandLine.appendSwitch("use-fake-ui-for-media-stream");

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize; // Get screen dimensions
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    title: "touch_panel",
    fullscreen: true,
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: true,
  });
  mainWindow.setVisibleOnAllWorkspaces(true); // Ensure visibility across workspaces
  mainWindow.loadFile("index.html");
};

app.once("ready", () => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
