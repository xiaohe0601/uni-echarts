import { Readable } from "node:stream";
import { c2e } from "@uni-echarts/c2e";

export default eventHandler(async (event) => {
  const data = await readFormData(event);

  const file = data.get("file");

  if (!(file instanceof File) || file.type !== "text/javascript") {
    throw createError({
      status: 400,
      statusMessage: "Bad Request",
      message: "Invalid file"
    });
  }

  const code = await file.text();

  const { output: [chunk] } = await c2e({
    write: false,
    code
  });

  setResponseHeader(event, "Content-Type", "text/javascript");
  setResponseHeader(event, "Cache-Control", "no-cache");
  setResponseHeader(event, "Transfer-Encoding", "chunked");
  setResponseHeader(
    event,
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent("echarts.esm.js")}"`
  );

  return sendStream(event, Readable.from(chunk.code));
});