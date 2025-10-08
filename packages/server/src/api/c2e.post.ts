import { Readable } from "node:stream";
import { c2e } from "@uni-echarts/c2e";

export default eventHandler(async (event) => {
  const data = await readFormData(event);

  const file = data.get("file");

  if (!(file instanceof File) || file.type !== "text/javascript") {
    throw new TypeError("Invalid file");
  }

  const code = await file.text();

  const { output: [chunk] } = await c2e({
    write: false,
    code
  });

  event.node.res.setHeader("Content-Type", "text/javascript");
  event.node.res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent("echarts.esm.js")}"`
  );

  return Readable.from(chunk.code);
});