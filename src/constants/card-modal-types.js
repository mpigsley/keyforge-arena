import GAME_ACTION_TYPES from 'constants/game-action-types.json';

const STARTING_ACTIONS = [
  {
    key: 'mulligan',
    children: 'Mulligan',
    action: GAME_ACTION_TYPES.MULLIGAN_HAND,
    style: { width: 150 },
  },
  {
    key: 'keep',
    children: 'Keep',
    primary: true,
    action: GAME_ACTION_TYPES.KEEP_HAND,
    style: { width: 150 },
  },
];

const STARTING_HAND = {
  key: 'STARTING_HAND',
  listKey: 'hand',
  persisted: true,
  title: 'Starting Hand',
  subTitle: 'Waiting on Opponent',
};

export default {
  STARTING_HAND,
  STARTING_HAND_FIRST: {
    ...STARTING_HAND,
    key: 'STARTING_HAND_FIRST',
    actions: STARTING_ACTIONS,
    subTitle:
      'You are going first. You may mulligan your hand to draw a new hand with one less card.',
  },
  STARTING_HAND_SECOND: {
    ...STARTING_HAND,
    key: 'STARTING_HAND_SECOND',
    actions: STARTING_ACTIONS,
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
