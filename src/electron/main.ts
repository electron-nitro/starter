import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  globalShortcut,
} from "electron";
import { isDevelopment, isProduction } from "./utils/env";
import { startBackgroundNitroServer } from "./helpers/start-nitro-server";
import { configureMessageBoxHandler } from "./handlers/messagebox";
import { configureNotificationHandler } from "./handlers/notification";
import { configureUpdater } from "./autoupdate/updater";
import path from "node:path";
import fs from "node:fs";
import {
  registerDevToolsShortcutKey,
  registerReloadShortcutKeys,
} from "./handlers/shortcutkey";

let mainWindow: BrowserWindow;
let is_update_downloaded = false; // 是否更新已下载完成
let is_quiting = false; // 是否正在退出

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(process.env.NITRO_LISTEN_URL);

  if (isDevelopment) {
    // mainWindow.loadFile("./test.html");
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("page-title-updated", (event) => {
    event.preventDefault(); // 阻止 窗口标题更新
  });

  injectUpdaterHandlerJs(mainWindow); // 注入自动更新处理代码

  // 主窗口关闭时隐藏窗口而不是退出应用
  mainWindow.on("close", (event) => {
    if (!is_quiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function injectUpdaterHandlerJs(win: BrowserWindow) {
  win.webContents.on("did-finish-load", () => {
    const injectUpdaterHandlerJsCode = fs
      .readFileSync(
        path.join(__dirname, "autoupdate/inject-updater-handler.js")
      )
      .toString();
    win.webContents.executeJavaScript(injectUpdaterHandlerJsCode);
  });
}

function createTray() {
  const iconPath = resolveTrayIconPath();

  const tray = new Tray(iconPath);

  // 设置托盘图标的悬停提示
  tray.setToolTip(app.name);

  // 创建一个右键菜单
  const contextMenu = Menu.buildFromTemplate([
    { label: "显示窗口", click: () => mainWindow.show() },
    { type: "separator" },
    { label: "退出", click: quitApp },
  ]);

  // 将菜单设置为托盘图标的上下文菜单
  tray.setContextMenu(contextMenu);

  // 监听托盘图标的点击事件
  tray.on("click", (event) => {
    mainWindow.show();
  });
}

function resolveTrayIconPath() {
  let iconPath = "";
  if (process.platform === "win32") {
    iconPath = path.join(__dirname, "icons", "icon_16x16.ico");
  } else if (process.platform === "darwin") {
    iconPath = path.join(__dirname, "icons", "icon_32x32.png");
  } else {
    iconPath = path.join(__dirname, "icons", "icon_16x16.png");
  }
  return iconPath;
}

function quitApp() {
  // 标识 应用正在退出
  is_quiting = true;

  globalShortcut.unregisterAll(); // 取消所有快捷键

  if (is_update_downloaded) {
    ipcMain.emit("install-update");
  } else {
    app.quit();
  }
}

// 单实例锁定
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    if (isProduction) {
      startBackgroundNitroServer();
    }

    Menu.setApplicationMenu(null); // 禁用系统菜单
    registerDevToolsShortcutKey(); // 注册开发者工具快捷键
    registerReloadShortcutKeys(); // 注册刷新快捷键

    configureMessageBoxHandler();
    configureNotificationHandler();

    createWindow();
    createTray(); // 添加系统托盘
    configureUpdater();

    ipcMain.on("update-downloaded", () => {
      is_update_downloaded = true;
    });

    ipcMain.on("quit-to-install-update", () => {
      quitApp();
    });

    ipcMain.on("nitro-server-console", (event, message) => {
      mainWindow &&
        mainWindow.webContents.send("nitro-server-console-output", message);
    });

    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      quitApp();
    }
  });
}
