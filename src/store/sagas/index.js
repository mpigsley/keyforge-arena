import user from './user.saga';
import deck from './deck.saga';
import image from './image.saga';

const sagas = [user, deck, image];

export default sagaMiddleware =>
  sagas.forEach(sagaMiddleware.run.bind(sagaMiddleware));
