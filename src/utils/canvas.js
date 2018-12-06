import { COLORS, IMAGES } from 'constants/canvas';

export const getPixelRatio = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;
  return dpr / bsr;
};

export const shadowRect = (ctx, x, y, w, h, radius) => {
  const r = x + w;
  const b = y + h;
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.shadowColor = COLORS.light;
  ctx.shadowBlur = 30;
  ctx.moveTo(x + radius, y);
  ctx.lineTo(r - radius, y);
  ctx.quadraticCurveTo(r, y, r, y + radius);
  ctx.lineTo(r, y + h - radius);
  ctx.quadraticCurveTo(r, b, r - radius, b);
  ctx.lineTo(x + radius, b);
  ctx.quadraticCurveTo(x, b, x, b - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.fill();
  ctx.shadowBlur = 0;
};

const START_TIME = new Date().getTime();
const SPINNER_SIZE = 13.5;
const LOADING_TEXT = 'Loading Game';
export const renderLoader = ({ ctx, width, height, ratio, current }) => {
  const ratioWidth = width * ratio;
  const ratioHeight = height * ratio;
  const textWidth = ctx.measureText(LOADING_TEXT).width;
  ctx.font = `${35 * ratio}px Roboto, sans-serif`;
  if (textWidth < 100) {
    ctx.fillStyle = COLORS.white;
  } else {
    const boxSize = textWidth + 100 * ratio;
    shadowRect(
      ctx,
      ratioWidth / 2 - boxSize / 2,
      ratioHeight / 2 - 75 * ratio,
      boxSize,
      300,
      5 * ratio,
    );
    ctx.fillStyle = COLORS.dark;
    ctx.save();
    ctx.translate(ratioWidth / 2, ratioHeight / 2 + 30 * ratio);
    ctx.rotate(((current - START_TIME) * Math.PI) / 1000);
    ctx.scale(1.2 * ratio, 1.2 * ratio);
    ctx.drawImage(IMAGES.SPINNER, -SPINNER_SIZE, -SPINNER_SIZE);
    ctx.restore();
  }
  ctx.fillText(
    LOADING_TEXT,
    ratioWidth / 2 - textWidth / 2,
    ratioHeight / 2 - 10 * ratio,
  );
};
