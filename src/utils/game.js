import { find } from 'constants/lodash';

import { renderLoader } from 'utils/canvas';
import { MAX_CARD_WIDTH, IMG_RATIO } from 'constants/canvas';

export default (canvas, config) => {
  const { ctx, width, height, ratio } = canvas;
  const { hasLoaded, deckDetails } = config;
  const ratioWidth = width * ratio;
  const ratioHeight = height * ratio;

  // Clear
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, ratioWidth, ratioHeight);

  if (!hasLoaded) {
    renderLoader(canvas);
    return;
  }

  const userDeck = find(deckDetails, { isCurrentUser: true });
  // const opponentDeck = find(deckDetails, { isCurrentUser: false });
  ctx.drawImage(
    userDeck.cards[0].image.object,
    10,
    10,
    MAX_CARD_WIDTH * IMG_RATIO * ratio,
    MAX_CARD_WIDTH * ratio,
  );
};
