import connection from './connection.saga';
import deck from './deck.saga';
import image from './image.saga';
import user from './user.saga';

const sagas = [connection, deck, image, user];

export default sagaMiddleware =>
  sagas.forEach(sagaMiddleware.run.bind(sagaMiddleware));
