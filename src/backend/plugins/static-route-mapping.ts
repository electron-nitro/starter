import fs from "node:fs";
import path from "node:path";
import { lookup } from "mime-types";

const getFileMeta = async (filePath: string) => {
  try {
    const stats = await fs.promises.stat(filePath);
    const mimeType = lookup(filePath) || "application/octet-stream";
    return {
      type: mimeType, // 文件 MIME 类型
      etag: `${stats.ino}-${stats.size}-${stats.mtimeMs}`,
      mtime: stats.mtimeMs, // 文件最后修改时间
      path: filePath,
      size: stats.size, // 文件大小
    };
  } catch (error) {
    // 如果文件不存在，返回 undefined
    return undefined;
  }
};

const getFileContents = async (filePath: string) => {
  try {
    const contents = await fs.promises.readFile(filePath);
    return contents;
  } catch (error) {
    // 如果文件不存在，返回 undefined
    return undefined;
  }
};

const resolveMappingFilePath = (
  routePrefixPath: string,
  mappingDir: string,
  id: string
) => {
  const mappingDirPath = path.join(getAppDataPath(), mappingDir);

  return path.join(mappingDirPath, id.slice(routePrefixPath.length));
};

const resolveGetFileMetaFunc = (
  routePrefixPath: string,
  mappingDir: string
) => {
  return (id: string) => {
    const filePath = resolveMappingFilePath(routePrefixPath, mappingDir, id);

    return getFileMeta(filePath);
  };
};

const resolveGetFileContentsFunc = (
  routePrefixPath: string,
  mappingDir: string
) => {
  return (id: string) => {
    const filePath = resolveMappingFilePath(routePrefixPath, mappingDir, id);

    return getFileContents(filePath);
  };
};

export default defineNitroPlugin(async (nitroApp) => {
  const runtimeConfig = useRuntimeConfig();

  for (const routePath in runtimeConfig.nitro.routeRules) {
    const routeConfig = runtimeConfig.nitro.routeRules[routePath];

    if (routeConfig.static) {
      let routePrefixPath = routePath; // 静态路由前缀Path
      if (routePath.endsWith("/**")) {
        routePrefixPath = routePath.slice(0, -3);
      }

      const staticMappingDir = runtimeConfig.staticMappingDir; // 静态映射目录

      nitroApp.router.use(
        routePath,
        eventHandler(async (event) => {
          return serveStatic(event, {
            getMeta: resolveGetFileMetaFunc(routePrefixPath, staticMappingDir),
            getContents: resolveGetFileContentsFunc(
              routePrefixPath,
              staticMappingDir
            ),
          });
        })
      );
    }
  }
});
