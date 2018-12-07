import { find, take } from 'constants/lodash';
import { renderLoader } from 'utils/canvas';
import { PADDING, COLORS, MAX_CARD_WIDTH, IMG_RATIO } from 'constants/canvas';

const drawBattlelines = (
  { ctx, ratioPadding, ratioWidth, ratioHeight, ratioMaxCardWidth, isOpponent },
  cards,
) => {
  let resizedWidth = ratioMaxCardWidth;
  const totalCardPadding = ratioPadding * (cards.length + 1);
  let maxTotalWidth = cards.length * ratioMaxCardWidth + totalCardPadding;
  if (maxTotalWidth > ratioWidth) {
    resizedWidth = (ratioWidth - totalCardPadding) / cards.length;
  }
  maxTotalWidth = cards.length * resizedWidth + totalCardPadding;

  const resizedHeight = resizedWidth / IMG_RATIO;
  const centeredOffset = (ratioWidth - maxTotalWidth) / 2;
  const verticalOffset = isOpponent
    ? -resizedHeight - ratioPadding
    : ratioPadding;
  cards.forEach(({ image }, index) => {
    ctx.drawImage(
      image.object,
      centeredOffset + ratioPadding * (index + 1) + index * resizedWidth,
      ratioHeight / 2 + verticalOffset,
      resizedWidth,
      resizedHeight,
    );
  });
};

export default (canvas, config) => {
  const { ctx, width, height, ratio } = canvas;
  const { hasLoaded, deckDetails } = config;
  const ratioWidth = width * ratio;
  const ratioHeight = height * ratio;

  // Clear
  ctx.fillStyle = 'white';
  ctx.strokeStyle = COLORS.medium;
  ctx.fillRect(0, 0, ratioWidth, ratioHeight);

  if (!hasLoaded) {
    renderLoader(canvas);
    return;
  }

  const ratioPadding = PADDING * ratio;
  const ratioMaxCardWidth = MAX_CARD_WIDTH * ratio;

  const vars = {
    ctx,
    ratioPadding,
    ratioWidth,
    ratioHeight,
    ratioMaxCardWidth,
  };

  // ctx.beginPath();
  // ctx.moveTo(0, ratioHeight / 2);
  // ctx.lineTo(ratioWidth, ratioHeight / 2);
  // ctx.stroke();

  const userDeck = find(deckDetails, { isCurrentUser: true });
  drawBattlelines({ ...vars, isOpponent: false }, take(userDeck.cards, 6));

  const opponentDeck = find(deckDetails, { isCurrentUser: false });
  drawBattlelines({ ...vars, isOpponent: true }, take(opponentDeck.cards, 12));
};
