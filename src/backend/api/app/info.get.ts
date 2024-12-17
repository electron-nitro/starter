import packageJson from "~~/package.json";

export default defineEventHandler(() => {
  return {
    name: packageJson.name,
    productName: packageJson.productName,
    version: packageJson.version,
    description: packageJson.description,
  };
});
