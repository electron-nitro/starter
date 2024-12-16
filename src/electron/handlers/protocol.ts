import { BrowserWindow, ipcMain } from "electron";

export const protocol_scheme = "ztx-bid-invitation";

export const configureProtocolUrlHandler = (
  protocolUrlHandler: (protocolUrlStr: string) => void
) => {
  ipcMain.on("protocol-open-url", (event, protocolUrlArg) => {
    protocolUrlHandler(protocolUrlArg);
  });
};

export const sendProtocolUrlQueryParamsToFocusWindow = (
  protocolUrlStr: string
) => {
  const receivedProtocolUrl = new URL(protocolUrlStr);
  const receivedOpenQueryParams = Object.fromEntries(
    receivedProtocolUrl.searchParams.entries()
  );

  BrowserWindow.getFocusedWindow()?.webContents.send(
    "protocol-open-queryparams",
    JSON.stringify(receivedOpenQueryParams)
  );
};

const resolveProtocolUrlArg = (argv: string[]) => {
  const protocolUrlPrefix = `${protocol_scheme}://`;

  return argv.find((arg) => arg.startsWith(protocolUrlPrefix));
};

export const checkProcessProtocolUrlArg = (argv: string[]) => {
  const protocolUrlArg = resolveProtocolUrlArg(argv);

  if (protocolUrlArg) {
    ipcMain.emit("protocol-open-url", null, protocolUrlArg);
  }
};
