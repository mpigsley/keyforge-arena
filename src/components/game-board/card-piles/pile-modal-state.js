import React, { Component } from 'react';

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
      discarded: CardsType.isRequired,
      purged: CardsType.isRequired,
      archived: CardsType,
    };

    static defaultProps = {
      archived: [],
    };

    state = {
      openPile: undefined,
    };

    render() {
      const { props, state } = this;
      const { openPile } = state;
      return (
        <>
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
        </>
      );
    }
  };
