import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas";

export default eventHandler(async (event) => {
  const { address, data } = getQuery(event);
  if (!address || !data) {
    setResponseStatus(event, 400);
    return { error: "address and data are required" };
  }

  const [canvasW, canvasH] = [512, 512];
  const canvas = createCanvas(canvasW, canvasH);
  const ctx = canvas.getContext('2d');
  {
    const [rectW, rectH] = [448, 200];
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    const rectX = (canvasW - rectW) / 2;
    const rectY = (canvasH - rectH) / 2;
    ctx.fillRect(rectX, rectY, rectW, rectH);
    ctx.strokeRect(rectX, rectY, rectW, rectH);

    const host = event.node.req.headers.host;
    const base = (process.env.NODE_ENV === "development" ? "http://" : "https://") + host;
    const image = await loadImage(new URL("/p.png", base));
    const [imageW, imageH] = [96, 96];
    const imageX = rectX + 32;
    const imageY = rectY + rectH / 2 - imageH / 2;
    ctx.drawImage(image, imageX, imageY, imageW, imageH);

    const font = await useStorage("assets:server").getItemRaw("Roboto-Bold.ttf");
    GlobalFonts.register(font, "Roboto-Bold");
    const text = data.toLocaleString();
    ctx.font = "96px Roboto-Bold";
    ctx.lineWidth = 6;
    const metrics = ctx.measureText(text);
    const textW = metrics.width;
    const textH = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const textX = imageX + imageW / 2 + (rectW - imageW / 2 - textW) / 2;
    const textY = rectY + (rectH / 2) - (textH / 2) + metrics.actualBoundingBoxAscent;
    ctx.fillStyle = "black";
    ctx.fillText(text, textX, textY);
  }

  const buf = canvas.toBuffer("image/png");
  setHeaders(event, { "Content-Type": "image/png" });
  setResponseStatus(event, 200);
  return buf;
});
