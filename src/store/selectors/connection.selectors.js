import { createSelector } from 'reselect';
import dayjs from 'dayjs';

import { getConnections, getLobbies } from 'store/selectors/base.selectors';
import { findKey, map, sortBy } from 'constants/lodash';

const connectionsWithChallenges = createSelector(
  [getConnections, getLobbies],
  (connections, lobbies) =>
    map(connections, (connection, key) => ({
      ...connection,
      key,
      challenge: findKey(lobbies, ({ creator }) => key === creator),
    })),
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
