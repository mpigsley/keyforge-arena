import { toastr } from 'react-redux-toastr';

import {
  requestConnection as request,
  connectionReply as reply,
} from 'store/api/connection.api';

// const ACTION_PREFIX = '@@connection';

export const requestConnection = connection => () =>
  request({ connection }).then(() => {
    toastr.success(
      'Connection Request Sent',
      'If the user accepts they will show up on the dashboard.',
    );
  });

export const connectionReply = (connection, accepted) =>
  reply({ connection, accepted });
