//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "src/backend",
  output: {
    dir: "dist/backend",
  },
  experimental: {
    openAPI: true,
    asyncContext: true,
  },
  openAPI: {
    production: "runtime",
    meta: {
      title: "ztx-bid-invitation",
      description: "ztx bid invitation backend api",
      version: "1.0",
    },
  },
  routeRules: {
    "/static/**": { static: true },
  },
  runtimeConfig: {
    staticMappingDir: "outputs",
  },
  compatibilityDate: "2024-08-27",
});
