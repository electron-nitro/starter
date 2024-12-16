import { globalShortcut, BrowserWindow } from "electron";

export const registerDevToolsShortcutKey = () => {
  globalShortcut.register("CommandOrControl+Shift+I", () => {
    BrowserWindow.getFocusedWindow()?.webContents.toggleDevTools();
  });
};

export const registerReloadShortcutKeys = () => {
  globalShortcut.register("CommandOrControl+R", () => {
    BrowserWindow.getFocusedWindow()?.webContents.reload();
  });

  globalShortcut.register("CommandOrControl+Shift+R", () => {
    BrowserWindow.getFocusedWindow()?.webContents.reloadIgnoringCache();
  });
};
