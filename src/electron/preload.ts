import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronIpc", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...eventArgs) =>
      listener(event, ...eventArgs)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
  checkUpdate(...args: any[]) {
    return ipcRenderer.send("check-update", ...args);
  },
  downloadUpdate(...args: any[]) {
    return ipcRenderer.send("download-update", ...args);
  },
  quitToinstallUpdate(...args: any[]) {
    return ipcRenderer.send("quit-to-install-update", ...args);
  },
  showNotification(...args: any[]) {
    return ipcRenderer.send("show-notification", ...args);
  },
  showMessageBox(...args: any[]) {
    return ipcRenderer.invoke("show-messagebox", ...args);
  },
  openFileDialog: (fileFilterStr) =>
    ipcRenderer.invoke("dialog:openFile", fileFilterStr),
  copyFile: (sourcePath, destinationDir) =>
    ipcRenderer.invoke("file:copyFile", sourcePath, destinationDir),
  onCopyProgress: (callback) =>
    ipcRenderer.on("file:copyProgress", (event, progress) =>
      callback(progress)
    ),
  acceptProtocolOpenQueryParams: (listener: (...args: any[]) => void) =>
    ipcRenderer.on("protocol-open-queryparams", (event, openQueryParamsJsonStr) =>
      listener(openQueryParamsJsonStr)
    ),
});

ipcRenderer.on("nitro-server-console-output", (event, message) => {
  console.log("[Nitro Server Process Console]:", message);
});

ipcRenderer.on("protocol-open-queryparams", (event, openQueryParamsJsonStr) => {
  console.log("[Protocol Open QueryParams]:", openQueryParamsJsonStr);
});
