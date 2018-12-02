import connection from './connection.saga';
import deck from './deck.saga';
import game from './game.saga';
import image from './image.saga';
import lobby from './lobby.saga';
import user from './user.saga';

const sagas = [connection, deck, game, image, lobby, user];

export default sagaMiddleware =>
  sagas.forEach(sagaMiddleware.run.bind(sagaMiddleware));
