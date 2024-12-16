import path from "node:path";
import fs from "node:fs";
import { newGuid } from "./guid";
import envPaths from "env-paths";

const downloadFilesDir = "downloads";

const outputFilesDir = "outputs";

const appPaths = envPaths("ztx-bid-invitation-app", { suffix: "" });

export const getAppDataPath = () => appPaths.data;

export function getAbsoluteDirectoryPath(relativeDirPath: string) {
  const absoluteDirPath = path.join(getAppDataPath(), relativeDirPath);

  if (!fs.existsSync(absoluteDirPath)) {
    fs.mkdirSync(absoluteDirPath, { recursive: true });
  }
  return absoluteDirPath;
}

export function getDownloadFilesDirectoryPath() {
  return getAbsoluteDirectoryPath(downloadFilesDir);
}

export function getOutputFilesDirectoryPath() {
  return getAbsoluteDirectoryPath(outputFilesDir);
}

export function getDownloadSaveFilePath(saveFileName: string) {
  return path.join(getDownloadFilesDirectoryPath(), saveFileName);
}

export function getOutputSaveFilePath(saveFileName: string) {
  return path.join(getOutputFilesDirectoryPath(), saveFileName);
}

export function resolveDownloadSaveFileName(
  remoteFileUrl: string,
  defaultFileExt?: string
) {
  let fileExtension = resolveFileExtensionFromUrl(remoteFileUrl);

  if (!fileExtension && defaultFileExt) {
    fileExtension = defaultFileExt;
  }

  return newGuid() + fileExtension;
}

function resolveFileExtensionFromUrl(remoteFileurl: string): string {
  // 从 URL 提取路径部分
  const pathname = new URL(remoteFileurl).pathname;
  // 使用 path.extname 提取扩展名
  return path.extname(pathname);
}
