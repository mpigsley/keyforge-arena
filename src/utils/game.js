import { find } from 'constants/lodash';

const SPINNER = new Image(54, 54);
SPINNER.src =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABK1JREFUeNqMVt1ZGzkUvVfS4IW1l8GO82w6IBXE7mCpAFMB+Pt4Z6iApALcAe4AU0HoAJfg7BPYHinnXmmciX+y0YdmJHnQ0bk/R5cvh5cUyFPwRD4EChgEvGWMB36R3+JaiTkmD5gOs8yNb25uLlerFf1pM2yIGA82TEY7xow1oj4GBU6S6yywPNG4JwDH+XGv0Whs7ndN8n97mmPsLCSYgy7ImPQE/pFDyAF+7L0fgTNFUDBcLal90taD1doQ/T6NT9DnW8zkT+jJuQVYukG3hifCVk/L3JOxMBa8VVlSp9MhHKLaB+zpNo1fdgEpmByuMqUAV5viOQLwXNax9KBAFNEEpN1pUwnQmvl6aTza6zNjrCKaymeyOdYAMgfg18iG4T/qw+AC94zvpzDjcwqOXo3VGH26H0xMZ7jPxgT0R2zUi4BYt6bAfEbJvJFZKA4ODgZ5nhcJLE9mk35X21vWC/TXKmiwr2xszoQd/PQv3t/QCzY2twpqBpb5FKOp+hCgzWaTWq0W1Xx0ij5An9WC5VtiLMwvNBrVaSGMvQk5jHQVPN7sb0HzAtE+QJrNgrcUNEARieWCut0ugR0tl8sKcJ5Ahc3jRviPK8ZGTaaBwGKyT+gTiwM4a3Jrba6MbeVXo5F4kp9shn29ndUYC9vLirGDXzRhrYhD8DME5Hkg22df5rDYS/RXmVIsaP/Q/SXs600YnifTjbeSWliEdTYb3QyTqYfdDKTL4B1KS6tVqf6SgGq3P9BvZGpvNIrPCgVKZlGlCDQDxJiCjVppCab05DJHzb+b1Gm36X80cVjLuzozexs0f6IgRkA5XRhzIixRL1+IzhwdHVHrn1Y9oXe1i10aKT6bGGhg1CKK+cT0zCGCs0oXTIogybJMw/779//o48duMvnO9rzLn+Kz8wgS5Shqo4njpCoOQA5Ajb8adHh4SMvVghaLhYb/HsBip88krNVISSEigOlhjmi0LziNhr6wOsgO9C1339vbGznnNAU2AM9Svk235cqKieKGkldAf7DGvTrjnjJnzyQoMu0ZTuZgUqvmlYR+f39XIE4uqCX1E/rDZpCYmKwOOmivAfYK9KF1AM7EdG4uAMLAOjmQideQXOJQkyUisqYiFRhtSFbxCxj8do0T30dmTvLhC+an0MZZVBHX09tBTG4qFigZEJEChjTIEwtRik81Qa7uOQU0IrYAe7FRjqYw6SlYjgAyN1GmHsFIGPfVnxzFuFITKEkfYK+oWZ5qKlIkcZ7UE92oXBmeIgIxtAO5UtSHqo9uiLW+sme5ejSIRASeAFR4LYy8MMzL1aq3EYWzJF28BgMEzGYpBkrMKelgl+P6uTcVY8NjLYyYPwMTCcufSaouH6al9xNJcjC82vDb9uVZKbrWIumNO+waVsu1TCC+Wxcg6xaSpsZSYM2wLO9/U8qZWH+wztQnsfAxV/E3MIKZVf1FsmJVV8mamhEmxZ0X7sSsABsGv1tZJGejmptU7FBUDYzPAXQBwFEEl+9+stFEroJEci2ELwIMmZuWoSTE9DYYcWVCjlJrZWMpeBhlAEqBiulPE84S3ixU5gSTwGGOdyEVNJXxA8nPevshwABHktBS1YoQ+QAAAABJRU5ErkJggg==';
const IMAGES = { SPINNER };

const LOADING_TEXT = 'Loading Game';
const SPINNER_SIZE = 13.5;

const MAX_CARD_WIDTH = 200;
const IMG_RATIO = 300 / 420;

const COLORS = {
  dark: '#424242',
  medium: '#828282',
  light: '#c0c0c0',
  veryLight: '#f5f5f5',
  border: '#e5e5e5',
  primary: '#691317',
  active: '#0aa5ff',
};

let ticker = 0;
export default ({ ctx, width, height, ratio }, { hasLoaded, deckDetails }) => {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width * ratio, height * ratio);

  if (!hasLoaded) {
    ctx.font = '35px Roboto, sans-serif';
    ctx.fillStyle = COLORS.dark;
    ctx.fillText(
      LOADING_TEXT,
      width / 2 - ctx.measureText(LOADING_TEXT).width / 2,
      height / 2 - 10,
    );
    ctx.save();
    ctx.translate(width / 2, height / 2 + 30); // to get it in the origin
    ticker += 1;
    ctx.rotate((ticker * Math.PI) / 64); // rotate in origin
    ctx.scale(1.5, 1.5);
    ctx.drawImage(IMAGES.SPINNER, -SPINNER_SIZE, -SPINNER_SIZE);
    ctx.restore();
  } else {
    const userDeck = find(deckDetails, { isCurrentUser: true });
    // const opponentDeck = find(deckDetails, { isCurrentUser: false });
    ctx.drawImage(
      userDeck.cards[0].image.object,
      10,
      10,
      MAX_CARD_WIDTH * IMG_RATIO,
      MAX_CARD_WIDTH,
    );
  }
};
