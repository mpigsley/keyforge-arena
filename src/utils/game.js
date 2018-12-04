import { find } from 'constants/lodash';

export default ({ ctx, width, height, ratio }, { hasLoaded, deckDetails }) => {
  ctx.fillStyle = hasLoaded ? 'blue' : 'red';
  ctx.fillRect(0, 0, width * ratio, height * ratio);

  if (hasLoaded) {
    const userDeck = find(deckDetails, { isCurrentUser: true });
    // const opponentDeck = find(deckDetails, { isCurrentUser: false });
    ctx.drawImage(userDeck.cards[0].image.object, 10, 10);
  }
};
