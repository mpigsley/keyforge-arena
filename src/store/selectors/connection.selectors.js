import { createSelector } from 'reselect';
import dayjs from 'dayjs';

import { getConnections } from 'store/selectors/base.selectors';
import { map, sortBy } from 'constants/lodash';

// eslint-disable-next-line
export const getSortedConnections = createSelector(
  [getConnections],
  connections =>
    sortBy(
      map(connections, ({ online, ...connection }, key) => {
        const lastOnline = dayjs(online);
        return {
          ...connection,
          lastOnline: lastOnline.isAfter(dayjs().subtract(1, 'day'))
            ? lastOnline.format('h:mm a')
            : lastOnline.format('MMMM D YYYY'),
          isOnline: lastOnline.isAfter(dayjs().subtract(45, 'second')),
          key,
        };
      }),
      ['username', 'isOnline', 'pending'],
    ),
);
