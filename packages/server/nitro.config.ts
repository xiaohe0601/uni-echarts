export default defineNitroConfig({
  compatibilityDate: "2025-03-01",
  srcDir: "src",
  routeRules: {
    "/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:9862"
        // "Access-Control-Allow-Origin": "https://uni-echarts.xiaohe.ink"
      }
    }
  }
});