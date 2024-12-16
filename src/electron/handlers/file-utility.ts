import path from "node:path";
import fs from "node:fs";
import { ipcMain, dialog, FileFilter } from "electron";

export const configureCopyFileHandler = () => {
  // 处理文件复制操作
  ipcMain.handle("file:copyFile", copyFile);
};

//复制文件 并返回进度
async function copyFile(event, sourcePath, destinationDir) {
  const fileName = path.basename(sourcePath);
  const destinationPath = path.join(destinationDir, fileName);
  const fileSize = fs.statSync(sourcePath).size;

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destinationPath);

    let copiedBytes = 0;

    readStream.on("data", (chunk) => {
      copiedBytes += chunk.length;
      const progress = Math.round((copiedBytes / fileSize) * 100);
      event.sender.send("file:copyProgress", progress);
    });

    readStream.on("error", (err) => {
      reject(err);
    });

    writeStream.on("finish", () => {
      resolve(destinationPath);
    });

    readStream.pipe(writeStream);
  });
}

export const configureOpenFileHandler = () => {
  ipcMain.handle("dialog:openFile", handleOpenFile);
};

//调用文件选择框，选择文件获取文件本地路径
async function handleOpenFile(event, fileFilterStr) {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: parseFileFilters(fileFilterStr),
  });
  if (canceled) {
    return null;
  } else {
    return filePaths[0]; // 返回文件路径
  }
}

const fileFilterNameMapping = {
  doc: "Word文字",
  docx: "Word文字",
  xls: "Excel表格",
  xlsx: "Excel表格",
  txt: "文本文件",
  pdf: "PDF文件",
  zip: "压缩文件",
  rar: "压缩文件",
};

function parseFileFilters(fileFilterStr: string): FileFilter[] {
  fileFilterStr ??= "";
  const fileFilterExts = fileFilterStr
    .split(",")
    .map((ext) => ext.trim().toLowerCase())
    .filter((ext) => ext.length > 0);

  const fileFilters = fileFilterExts.reduce((fileFilterArr, filterExt) => {
    const filterName = fileFilterNameMapping[filterExt] ?? filterExt;

    if (!fileFilterArr.some((fileFilter) => fileFilter.name === filterName)) {
      fileFilterArr.push({ name: filterName, extensions: [filterExt] });
    } else {
      const fileFilter = fileFilterArr.find(
        (fileFilter) => fileFilter.name === filterName
      );
      fileFilter.extensions.push(filterExt);
    }

    return fileFilterArr;
  }, [] as FileFilter[]);

  if (fileFilters.length === 0) {
    fileFilters.push({ name: "所有文件", extensions: ["*"] });
  } else {
    fileFilters.unshift({ name: "所有格式", extensions: fileFilterExts });
  }

  return fileFilters;
}
