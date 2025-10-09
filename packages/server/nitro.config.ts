import process from "node:process";

export default defineNitroConfig({
  compatibilityDate: "2025-03-01",
  srcDir: "src",
  routeRules: {
    "/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": process.env.NITRO_WEB_URL || "http://localhost:9862"
      }
    }
  }
});