export const getImg = src =>
  new Promise(resolve => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "*";
    img.onload = () => resolve(img);
  });

export const imgLoaded = img =>
  new Promise(resolve => {
    if (img && img.complete) resolve();
    img.onload = () => resolve();
  });

export const readFile = file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve({ file, url: reader.result });
    reader.readAsDataURL(file);
  });

export const nextFrame = () =>
  new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

export const nameToEmoji = {
  Злость: "😠",
  Отвращение: "🤢",
  Страх: "😨",
  Радость: "😄",
  Груст: "🙁",
  Удивление: "😲",
  Нейтраль: "😐"
};

export const drawBox = ({ ctx, x, y, width, height }) => {
  ctx.strokeStyle = "#feda31";
  ctx.lineWidth = "3";
  ctx.strokeRect(x, y, width, height);
};

export const drawText = ({ ctx, x, y, text }) => {
  const pad = 4;
  ctx.fillStyle = "#feda31";
  ctx.font = "16px Arial";
  ctx.textBaseline = "top";
  ctx.fillText(text, x + pad, y + pad);
};
