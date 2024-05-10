import Jimp from "jimp";

export default eventHandler(async (event) => {
  //
  const query = getRequestURL(event).searchParams;
  const address = query.get("address");
  const value = query.get("value");

  //
  const image = await Jimp.read("./public/phi.png");
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  image.print(
      font,
      0,
      0,
      {
        text: address + " " + value,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      image.bitmap.width,
      image.bitmap.height
  );

  //
  const buf = await image.getBufferAsync(Jimp.MIME_PNG);
  setHeaders(event, { 'Content-Type': 'image/png' });
  return buf;
});
