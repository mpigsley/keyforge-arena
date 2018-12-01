import { createSelector } from 'reselect';
import dayjs from 'dayjs';

import {
  getConnections,
  getLobbies,
  getUserId,
} from 'store/selectors/base.selectors';
import { findKey, map, sortBy } from 'constants/lodash';

const connectionsWithChallenges = createSelector(
  [getConnections, getLobbies, getUserId],
  (connections, lobbies, uid) =>
    map(connections, (connection, key) => {
      const challenge = findKey(lobbies, ({ players }) =>
        players.includes(key),
      );
      return {
        ...connection,
        isChallengeCreator: (lobbies[challenge] || {}).creator === uid,
        challenge,
        key,
      };
    }),
);

// eslint-disable-next-line
export const getSortedConnections = createSelector(
  [connectionsWithChallenges],
  connections =>
    sortBy(
      connections.map(({ online, ...connection }) => {
        const lastOnline = dayjs(online);
        return {
          ...connection,
          sortDate: new Date(online),
          lastOnline: lastOnline.isAfter(dayjs().subtract(12, 'hour'))
            ? lastOnline.format('h:mm a')
            : lastOnline.format('MMMM D YYYY'),
          isOnline: lastOnline.isAfter(dayjs().subtract(45, 'second')),
        };
      }),
      ['-sortDate', '-pending'],
    ),
);
