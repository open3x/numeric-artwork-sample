import { createCanvas, loadImage } from "@napi-rs/canvas";

export default eventHandler(async (event) => {
  const [canvasW, canvasH] = [512, 512];
  const canvas = createCanvas(canvasW, canvasH);
  const ctx = canvas.getContext('2d');

  const host = event.node.req.headers.host;
  const base = (process.env.NODE_ENV === "development" ? "http://" : "https://") + host;
  const pancake = await loadImage(new URL("/pancake.webp", base));
  ctx.drawImage(pancake, 0, 0);
  const star = await loadImage(new URL("/star.webp", base));
  ctx.drawImage(star, 0, 0);

  const buf = canvas.toBuffer("image/png");
  setHeaders(event, { "Content-Type": "image/png" });
  setResponseStatus(event, 200);
  return buf;
});
