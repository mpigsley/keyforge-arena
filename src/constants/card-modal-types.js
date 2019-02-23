export default {
  STARTING_HAND_FIRST: {
    key: 'STARTING_HAND_FIRST',
    listKey: 'hand',
    persisted: true,
    title: 'Starting Hand',
    subTitle:
      'You are going first. You may mulligan your hand to draw a new hand with one less card.',
  },
  STARTING_HAND_SECOND: {
    key: 'STARTING_HAND_SECOND',
    listKey: 'hand',
    persisted: true,
    title: 'Starting Hand',
    subTitle:
      'You are going second. You may mulligan your hand to draw a new hand with one less card.',
  },
  DISCARD_PILE: {
    key: 'DISCARD_PILE',
    listKey: 'discard',
    isStack: true,
    title: 'Discarded Cards',
  },
  OPPONENTS_DISCARD_PILE: {
    key: 'OPPONENTS_DISCARD_PILE',
    listKey: 'opponentDiscard',
    isStack: true,
    title: "Opponent's Discarded Cards",
  },
  PURGED_PILE: {
    key: 'PURGED_PILE',
    listKey: 'purged',
    isStack: true,
    title: 'Purged Cards',
  },
  OPPONENTS_PURGED_PILE: {
    key: 'OPPONENTS_PURGED_PILE',
    listKey: 'opponentPurged',
    isStack: true,
    title: "Opponent's Purged Cards",
  },
  ARCHIVED_PILE: {
    key: 'ARCHIVED_PILE',
    listKey: 'archived',
    isStack: true,
    title: 'Archived Cards',
  },
};
