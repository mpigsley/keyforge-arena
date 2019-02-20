import React, { Component, Fragment } from 'react';

import CardModal from 'components/game-board/card-modal';

import { capitalize } from 'constants/lodash';
import { CardsType } from 'constants/types';

const PILE_TYPES = {
  DISCARDED: 'discarded',
  PURGED: 'purged',
  ARCHIVED: 'archived',
};

export default Wrapped =>
  class PileModalState extends Component {
    static propTypes = {
      [PILE_TYPES.DISCARDED]: CardsType.isRequired,
      [PILE_TYPES.PURGED]: CardsType.isRequired,
      [PILE_TYPES.ARCHIVED]: CardsType.isRequired,
    };

    state = {
      openPile: undefined,
    };

    render() {
      const { props, state } = this;
      const { openPile } = state;
      return (
        <Fragment>
          <Wrapped
            {...this.props}
            onOpenDiscard={() =>
              this.setState({ openPile: PILE_TYPES.DISCARDED })
            }
            onOpenPurged={() => this.setState({ openPile: PILE_TYPES.PURGED })}
            onOpenArchived={() =>
              this.setState({ openPile: PILE_TYPES.ARCHIVED })
            }
          />
          <CardModal
            cards={props[openPile]}
            title={`${capitalize(openPile)} Cards`}
            onClose={() => this.setState({ openPile: undefined })}
          />
        </Fragment>
      );
    }
  };
