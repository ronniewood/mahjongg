// NMJL 2026 Card Definitions
// Pattern notation:
//   { type, suit, ranks, count, jokerOk }
//   type: 'PAIR'|'PUNG'|'KONG'|'QUINT'|'SEXTET'|'SINGLE'|'SEQUENCE'
//   suit: 'SAME'|'ANY'|'BAM'|'CRAK'|'DOT'|'WIND'|'DRAGON'|'FLOWER'
//         'SAME' = all groups in the hand share one suit chosen by player
//         'ANY'  = each group can be any suit independently
//   ranks: array of rank values (numbers for suit tiles, 'N'|'E'|'W'|'S' for winds,
//          'RED'|'GREEN'|'WHITE' for dragons, 'F' for flowers)
//   count: number of tiles in this group (2=pair, 3=pung, 4=kong, 5=quint, 6=sextet)
//   jokerOk: whether jokers can substitute in this group
//
// alternates: array of alternate group patterns (for -or- hands)
// notes: human-readable rule clarification
// confirmed: true = verified from card image

export const CARD_YEAR = 2026

export const HANDS = [

  // ─── QUINTS ────────────────────────────────────────────────────────────────

  {
    id: 'Q1',
    category: 'Quints',
    name: 'Three Quints',
    points: 40,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 3 Suits, Any Like Nos.',
    // 11111 1111 11111 (same number, 3 different suits)
    groups: [
      { type: 'QUINT', suit: 'SUIT_A', ranks: ['N'], count: 5, jokerOk: true },
      { type: 'KONG',  suit: 'SUIT_B', ranks: ['N'], count: 4, jokerOk: true },
      { type: 'QUINT', suit: 'SUIT_C', ranks: ['N'], count: 5, jokerOk: true },
    ],
    suitRule: 'THREE_SUITS_SAME_RANK',
  },
  {
    id: 'Q2',
    category: 'Quints',
    name: 'FF Quint Pair Quint Consec',
    points: 45,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 Suit, Any 3 Consec. Nos.',
    // FF 11111 22 33333
    groups: [
      { type: 'PAIR',  suit: 'FLOWER', ranks: ['F'],   count: 2, jokerOk: false },
      { type: 'QUINT', suit: 'SAME',   ranks: ['N'],   count: 5, jokerOk: true  },
      { type: 'PAIR',  suit: 'SAME',   ranks: ['N+1'], count: 2, jokerOk: false },
      { type: 'QUINT', suit: 'SAME',   ranks: ['N+2'], count: 5, jokerOk: true  },
    ],
    suitRule: 'ONE_SUIT_CONSEC',
  },
  {
    id: 'Q3',
    category: 'Quints',
    name: 'Two Quints Dragon',
    points: 40,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 Nos. in Any 1 Suit w Opp. Dragon',
    // 11111 44444 DDDD
    groups: [
      { type: 'QUINT', suit: 'SAME',   ranks: ['N'],   count: 5, jokerOk: true },
      { type: 'QUINT', suit: 'SAME',   ranks: ['N+3'], count: 5, jokerOk: true },
      { type: 'KONG',  suit: 'DRAGON', ranks: ['OPP'], count: 4, jokerOk: true },
    ],
    suitRule: 'ONE_SUIT_OPP_DRAGON',
  },

  // ─── CONSECUTIVE RUN ───────────────────────────────────────────────────────

  {
    id: 'CR1',
    category: 'Consecutive Run',
    name: 'Pair Pung Pair Pung Kong (low or high)',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 Suit, These Nos. Only',
    // 11 222 33 444 5555  -or-  55 666 77 888 9999
    alternates: [
      { startRank: 1, pattern: [2,3,2,3,4] },
      { startRank: 5, pattern: [2,3,2,3,4] },
    ],
    suitRule: 'ONE_SUIT',
    groups: [
      { type: 'PAIR',  suit: 'SAME', ranks: ['N'],   count: 2, jokerOk: false },
      { type: 'PUNG',  suit: 'SAME', ranks: ['N+1'], count: 3, jokerOk: true  },
      { type: 'PAIR',  suit: 'SAME', ranks: ['N+2'], count: 2, jokerOk: false },
      { type: 'PUNG',  suit: 'SAME', ranks: ['N+3'], count: 3, jokerOk: true  },
      { type: 'KONG',  suit: 'SAME', ranks: ['N+4'], count: 4, jokerOk: true  },
    ],
  },
  {
    id: 'CR2',
    category: 'Consecutive Run',
    name: 'FFF Kong Single Kong Quint (5 consec)',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 or 2 Suits, Any 5 Consec. Nos.',
    // FFF 1111 234 5555
    groups: [
      { type: 'PUNG',     suit: 'FLOWER', ranks: ['F'],           count: 3, jokerOk: false },
      { type: 'KONG',     suit: 'SAME',   ranks: ['N'],           count: 4, jokerOk: true  },
      { type: 'SEQUENCE', suit: 'ANY',    ranks: ['N+1','N+2','N+3'], count: 3, jokerOk: false },
      { type: 'KONG',     suit: 'SAME',   ranks: ['N+4'],         count: 4, jokerOk: true  },
    ],
    suitRule: 'ONE_OR_TWO_SUITS',
  },
  {
    id: 'CR3',
    category: 'Consecutive Run',
    name: 'Pair Pair Pung Pung Kong (3 consec, 3 suits)',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 3 Suits, Any 3 Consec. Nos.',
    // 11 22 111 222 3333
    groups: [
      { type: 'PAIR', suit: 'SUIT_A', ranks: ['N'],   count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SUIT_B', ranks: ['N+1'], count: 2, jokerOk: false },
      { type: 'PUNG', suit: 'SUIT_C', ranks: ['N'],   count: 3, jokerOk: true  },
      { type: 'PUNG', suit: 'SUIT_C', ranks: ['N+1'], count: 3, jokerOk: true  },
      { type: 'KONG', suit: 'SUIT_C', ranks: ['N+2'], count: 4, jokerOk: true  },
    ],
    suitRule: 'THREE_SUITS',
  },
  {
    id: 'CR4',
    category: 'Consecutive Run',
    name: 'Pung Pung Kong Kong (4 consec)',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 or 2 Suits, Any 4 Consec. Nos.',
    // 111 222 3333 4444
    groups: [
      { type: 'PUNG', suit: 'SAME', ranks: ['N'],   count: 3, jokerOk: true },
      { type: 'PUNG', suit: 'SAME', ranks: ['N+1'], count: 3, jokerOk: true },
      { type: 'KONG', suit: 'ANY',  ranks: ['N+2'], count: 4, jokerOk: true },
      { type: 'KONG', suit: 'ANY',  ranks: ['N+3'], count: 4, jokerOk: true },
    ],
    suitRule: 'ONE_OR_TWO_SUITS',
  },
  {
    id: 'CR5',
    category: 'Consecutive Run',
    name: 'FFF Pair Pair Pung Dragon Kong (run + matching dragon)',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: '1 or 2 Suits, Any Run, Ds Match Middle No.',
    // FFF 11 22 333 DDDD
    groups: [
      { type: 'PUNG', suit: 'FLOWER',           ranks: ['F'],          count: 3, jokerOk: false },
      { type: 'PAIR', suit: 'SAME',              ranks: ['N'],          count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'ANY',               ranks: ['N+1'],        count: 2, jokerOk: false },
      { type: 'PUNG', suit: 'ANY',               ranks: ['N+2'],        count: 3, jokerOk: true  },
      { type: 'KONG', suit: 'DRAGON_MATCH_MID',  ranks: ['MATCH_N+1'], count: 4, jokerOk: true  },
    ],
    suitRule: 'ONE_OR_TWO_SUITS',
  },
  {
    id: 'CR6',
    category: 'Consecutive Run',
    name: 'Kong 6 Flowers Kong (2 consec)',
    points: 30,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 Suit, Any 2 Consec. Nos.',
    // 1111 FFFFFF 2222
    groups: [
      { type: 'KONG',   suit: 'SAME',   ranks: ['N'],   count: 4, jokerOk: true  },
      { type: 'SEXTET', suit: 'FLOWER', ranks: ['F'],   count: 6, jokerOk: false },
      { type: 'KONG',   suit: 'SAME',   ranks: ['N+1'], count: 4, jokerOk: true  },
    ],
    suitRule: 'ONE_SUIT',
  },
  {
    id: 'CR7',
    category: 'Consecutive Run',
    name: 'FF Kong Kong Kong (3 consec)',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 or 3 Suits, Any 3 Consec. Nos.',
    // FF 1111 2222 3333
    groups: [
      { type: 'PAIR', suit: 'FLOWER', ranks: ['F'],   count: 2, jokerOk: false },
      { type: 'KONG', suit: 'ANY',    ranks: ['N'],   count: 4, jokerOk: true  },
      { type: 'KONG', suit: 'ANY',    ranks: ['N+1'], count: 4, jokerOk: true  },
      { type: 'KONG', suit: 'ANY',    ranks: ['N+2'], count: 4, jokerOk: true  },
    ],
    suitRule: 'ONE_OR_THREE_SUITS',
  },
  {
    id: 'CR8',
    category: 'Consecutive Run',
    name: 'Single Pair Pung x2 Pair (4 consec, 3 suits)',
    points: 35,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 3 Suits, Any 4 Consec. Nos.',
    // 1 22 333 1 22 333 44
    groups: [
      { type: 'SINGLE', suit: 'SUIT_A', ranks: ['N'],   count: 1, jokerOk: false },
      { type: 'PAIR',   suit: 'SUIT_B', ranks: ['N+1'], count: 2, jokerOk: false },
      { type: 'PUNG',   suit: 'SUIT_C', ranks: ['N+2'], count: 3, jokerOk: false },
      { type: 'SINGLE', suit: 'SUIT_A', ranks: ['N'],   count: 1, jokerOk: false },
      { type: 'PAIR',   suit: 'SUIT_B', ranks: ['N+1'], count: 2, jokerOk: false },
      { type: 'PUNG',   suit: 'SUIT_C', ranks: ['N+2'], count: 3, jokerOk: false },
      { type: 'PAIR',   suit: 'ANY',    ranks: ['N+3'], count: 2, jokerOk: false },
    ],
    suitRule: 'THREE_SUITS',
  },

  // ─── 13579 ─────────────────────────────────────────────────────────────────

  {
    id: 'O1',
    category: '13579',
    name: 'Pair Pung Pair Pung Kong odds',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 or 3 Suits',
    // 11 333 55 777 9999
    groups: [
      { type: 'PAIR', suit: 'ANY', ranks: [1], count: 2, jokerOk: false },
      { type: 'PUNG', suit: 'ANY', ranks: [3], count: 3, jokerOk: true  },
      { type: 'PAIR', suit: 'ANY', ranks: [5], count: 2, jokerOk: false },
      { type: 'PUNG', suit: 'ANY', ranks: [7], count: 3, jokerOk: true  },
      { type: 'KONG', suit: 'ANY', ranks: [9], count: 4, jokerOk: true  },
    ],
    suitRule: 'ONE_OR_THREE_SUITS',
  },
  {
    id: 'O2',
    category: '13579',
    name: 'Pung Pung Kong Quint odds (2 suits)',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 Suits',
    // 111 333 3333 5555  -or-  555 777 7777 9999
    alternates: [
      { ranks: [1,3,3,5] },
      { ranks: [5,7,7,9] },
    ],
    groups: [
      { type: 'PUNG', suit: 'SUIT_A', ranks: ['N'],   count: 3, jokerOk: true },
      { type: 'PUNG', suit: 'SUIT_A', ranks: ['N+2'], count: 3, jokerOk: true },
      { type: 'KONG', suit: 'SUIT_B', ranks: ['N+2'], count: 4, jokerOk: true },
      { type: 'KONG', suit: 'SUIT_B', ranks: ['N+4'], count: 4, jokerOk: true },
    ],
    suitRule: 'TWO_SUITS',
  },
  {
    id: 'O3',
    category: '13579',
    name: 'NN Kong Pair Quint SS odds',
    points: 30,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 Suit, North and South Only',
    // NN 1111 35 5555 SS  -or-  NN 5555 77 9999 SS
    alternates: [
      { ranks: [1,3,5,5] },
      { ranks: [5,7,7,9] },
    ],
    groups: [
      { type: 'PAIR',  suit: 'WIND', ranks: ['N'],  count: 2, jokerOk: false },
      { type: 'KONG',  suit: 'SAME', ranks: ['N1'], count: 4, jokerOk: true  },
      { type: 'PAIR',  suit: 'SAME', ranks: ['N2'], count: 2, jokerOk: false },
      { type: 'KONG',  suit: 'SAME', ranks: ['N3'], count: 4, jokerOk: true  },
      { type: 'PAIR',  suit: 'WIND', ranks: ['S'],  count: 2, jokerOk: false },
    ],
    suitRule: 'ONE_SUIT_NS_WINDS',
  },
  {
    id: 'O4',
    category: '13579',
    name: 'Pair-1357-9 Kong Kong (pair + kongs match)',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 3 Suits, Pair Any Odd No., Kongs Match Pair',
    // 113579 1111 1111
    groups: [
      { type: 'PAIR',     suit: 'ANY', ranks: ['N'],      count: 2, jokerOk: false },
      { type: 'SEQUENCE', suit: 'ANY', ranks: [1,3,5,7,9], count: 4, jokerOk: false },
      { type: 'KONG',     suit: 'ANY', ranks: ['N'],      count: 4, jokerOk: true  },
      { type: 'KONG',     suit: 'ANY', ranks: ['N'],      count: 4, jokerOk: true  },
    ],
    suitRule: 'THREE_SUITS',
  },
  {
    id: 'O5',
    category: '13579',
    name: 'FFF Pair Pair Pung Dragon odds',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 Suit w Matching Dragon',
    // FFF 11 33 555 DDDD  -or-  FFF 55 77 999 DDDD
    groups: [
      { type: 'PUNG', suit: 'FLOWER',       ranks: ['F'],   count: 3, jokerOk: false },
      { type: 'PAIR', suit: 'SAME',         ranks: ['N'],   count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SAME',         ranks: ['N+2'], count: 2, jokerOk: false },
      { type: 'PUNG', suit: 'SAME',         ranks: ['N+4'], count: 3, jokerOk: true  },
      { type: 'KONG', suit: 'DRAGON_MATCH', ranks: ['M'],   count: 4, jokerOk: true  },
    ],
    suitRule: 'ONE_SUIT_MATCHING_DRAGON',
  },
  {
    id: 'O6',
    category: '13579',
    name: 'Pair Pair Pung Pung Kong odds (3 suits)',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 3 Suits',
    // 11 33 111 333 5555  -or-  55 77 555 777 9999
    groups: [
      { type: 'PAIR', suit: 'SUIT_A', ranks: ['N'],   count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SUIT_B', ranks: ['N+2'], count: 2, jokerOk: false },
      { type: 'PUNG', suit: 'SUIT_C', ranks: ['N'],   count: 3, jokerOk: true  },
      { type: 'PUNG', suit: 'SUIT_C', ranks: ['N+2'], count: 3, jokerOk: true  },
      { type: 'KONG', suit: 'SUIT_C', ranks: ['N+4'], count: 4, jokerOk: true  },
    ],
    suitRule: 'THREE_SUITS',
  },
  {
    id: 'O7',
    category: '13579',
    name: 'Kong Pair Pair Pair Kong odds',
    points: 30,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 or 2 Suits',
    // 1111 33 55 77 9999
    groups: [
      { type: 'KONG', suit: 'SAME', ranks: [1], count: 4, jokerOk: true  },
      { type: 'PAIR', suit: 'ANY',  ranks: [3], count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'ANY',  ranks: [5], count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'ANY',  ranks: [7], count: 2, jokerOk: false },
      { type: 'KONG', suit: 'SAME', ranks: [9], count: 4, jokerOk: true  },
    ],
    suitRule: 'ONE_OR_TWO_SUITS',
  },
  {
    id: 'O8',
    category: '13579',
    name: 'FF Pair Pair Pair Pung Pung odds (3 suits)',
    points: 35,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 3 Suits, These Nos. Only',
    // FF 11 33 55 111 111  -or-  FF 55 77 99 555 555
    groups: [
      { type: 'PAIR', suit: 'FLOWER', ranks: ['F'],   count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SUIT_A', ranks: ['N'],   count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SUIT_B', ranks: ['N+2'], count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SUIT_C', ranks: ['N+4'], count: 2, jokerOk: false },
      { type: 'PUNG', suit: 'SUIT_A', ranks: ['N'],   count: 3, jokerOk: false },
      { type: 'PUNG', suit: 'SUIT_B', ranks: ['N'],   count: 3, jokerOk: false },
    ],
    suitRule: 'THREE_SUITS',
  },
  {
    id: 'O9',
    category: '13579',
    name: 'FF Sequence Pung Pung Dragon odds',
    points: 30,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 1 Suit w Opp. Dragon',
    // FF 135 777 999 DDD
    groups: [
      { type: 'PAIR',     suit: 'FLOWER',     ranks: ['F'],   count: 2, jokerOk: false },
      { type: 'SEQUENCE', suit: 'SAME',       ranks: [1,3,5], count: 3, jokerOk: false },
      { type: 'PUNG',     suit: 'SAME',       ranks: [7],     count: 3, jokerOk: false },
      { type: 'PUNG',     suit: 'SAME',       ranks: [9],     count: 3, jokerOk: false },
      { type: 'PUNG',     suit: 'DRAGON_OPP', ranks: ['OPP'], count: 3, jokerOk: false },
    ],
    suitRule: 'ONE_SUIT_OPP_DRAGON',
  },

  // ─── 2026 ──────────────────────────────────────────────────────────────────

  {
    id: 'Y1',
    category: '2026',
    name: 'Pung Zero Pung Kong Kong',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 Suits. White Dragon = 0',
    // 222 000 2222 6666
    groups: [
      { type: 'PUNG', suit: 'SAME',   ranks: [2],       count: 3, jokerOk: true  },
      { type: 'PUNG', suit: 'DRAGON', ranks: ['WHITE'], count: 3, jokerOk: true  },
      { type: 'KONG', suit: 'SAME',   ranks: [2],       count: 4, jokerOk: true  },
      { type: 'KONG', suit: 'SAME',   ranks: [6],       count: 4, jokerOk: true  },
    ],
    suitRule: 'TWO_SUITS',
  },
  {
    id: 'Y2',
    category: '2026',
    name: '2026 Dragon Kong Dragon',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 Suits w Matching Dragons, Kong 2 or 6',
    // 2026 DDD 2222 DDD
    groups: [
      { type: 'SEQUENCE', suit: 'ANY',          ranks: [2, 0, 2, 6], count: 4, jokerOk: false },
      { type: 'PUNG',     suit: 'DRAGON_MATCH', ranks: ['MATCH'],    count: 3, jokerOk: true  },
      { type: 'KONG',     suit: 'ANY',          ranks: [2],          count: 4, jokerOk: true  }, // Kong 2 or 6
      { type: 'PUNG',     suit: 'DRAGON_MATCH', ranks: ['MATCH'],    count: 3, jokerOk: true  },
    ],
    suitRule: 'TWO_SUITS_MATCHING_DRAGON',
  },
  {
    id: 'Y3',
    category: '2026',
    name: 'FFF 2026 Pung Kong',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 3 Suits',
    // FFF 2026 222 6666
    groups: [
      { type: 'PUNG',     suit: 'FLOWER', ranks: ['F'],        count: 3, jokerOk: false },
      { type: 'SEQUENCE', suit: 'ANY',    ranks: [2, 0, 2, 6], count: 4, jokerOk: false },
      { type: 'PUNG',     suit: 'ANY',    ranks: [2],          count: 3, jokerOk: true  },
      { type: 'KONG',     suit: 'ANY',    ranks: [6],          count: 4, jokerOk: true  },
    ],
    suitRule: 'THREE_SUITS',
  },
  {
    id: 'Y4',
    category: '2026',
    name: 'Pair Zero Pung Pung NEWS',
    points: 30,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 Suits',
    // 22 00 222 666 NEWS
    groups: [
      { type: 'PAIR',   suit: 'ANY',    ranks: [2],       count: 2, jokerOk: false },
      { type: 'PAIR',   suit: 'DRAGON', ranks: ['WHITE'], count: 2, jokerOk: false },
      { type: 'PUNG',   suit: 'ANY',    ranks: [2],       count: 3, jokerOk: true  },
      { type: 'PUNG',   suit: 'ANY',    ranks: [6],       count: 3, jokerOk: true  },
      { type: 'SINGLE', suit: 'WIND',   ranks: ['N'],     count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'WIND',   ranks: ['E'],     count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'WIND',   ranks: ['W'],     count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'WIND',   ranks: ['S'],     count: 1, jokerOk: false },
    ],
    suitRule: 'TWO_SUITS',
  },

  // ─── 2468 ──────────────────────────────────────────────────────────────────

  {
    id: 'E1',
    category: '2468',
    name: 'Pung Pung Kong Kong evens',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 or 2 Suits',
    // 222 444 6666 8888
    groups: [
      { type: 'PUNG', suit: 'ANY', ranks: [2], count: 3, jokerOk: true },
      { type: 'PUNG', suit: 'ANY', ranks: [4], count: 3, jokerOk: true },
      { type: 'KONG', suit: 'ANY', ranks: [6], count: 4, jokerOk: true },
      { type: 'KONG', suit: 'ANY', ranks: [8], count: 4, jokerOk: true },
    ],
    suitRule: 'ONE_OR_TWO_SUITS',
  },
  {
    id: 'E2',
    category: '2468',
    name: 'FF Kong Pair Pair Kong evens',
    points: 30,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 Suits',
    // FF 2222 44 66 8888
    groups: [
      { type: 'PAIR', suit: 'FLOWER', ranks: ['F'], count: 2, jokerOk: false },
      { type: 'KONG', suit: 'ANY',    ranks: [2],   count: 4, jokerOk: true  },
      { type: 'PAIR', suit: 'ANY',    ranks: [4],   count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'ANY',    ranks: [6],   count: 2, jokerOk: false },
      { type: 'KONG', suit: 'ANY',    ranks: [8],   count: 4, jokerOk: true  },
    ],
    suitRule: 'TWO_SUITS',
  },
  {
    id: 'E3',
    category: '2468',
    name: 'EE Pair Pung Pung Pair WW',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 Suit, East and West Only',
    // EE 22 444 666 88 WW
    groups: [
      { type: 'PAIR', suit: 'WIND', ranks: ['E'], count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SAME', ranks: [2],   count: 2, jokerOk: false },
      { type: 'PUNG', suit: 'SAME', ranks: [4],   count: 3, jokerOk: true  },
      { type: 'PUNG', suit: 'SAME', ranks: [6],   count: 3, jokerOk: true  },
      { type: 'PAIR', suit: 'SAME', ranks: [8],   count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'WIND', ranks: ['W'], count: 2, jokerOk: false },
    ],
    suitRule: 'ONE_SUIT_EW_WINDS',
  },
  {
    id: 'E4',
    category: '2468',
    name: 'Kong Dragon Kong Dragon evens',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 Suits w Matching Dragons, These Nos. Only',
    // 2222 DDD 8888 DDD
    groups: [
      { type: 'KONG', suit: 'ANY',          ranks: [2],       count: 4, jokerOk: true  },
      { type: 'PUNG', suit: 'DRAGON_MATCH', ranks: ['MATCH'], count: 3, jokerOk: true  },
      { type: 'KONG', suit: 'ANY',          ranks: [8],       count: 4, jokerOk: true  },
      { type: 'PUNG', suit: 'DRAGON_MATCH', ranks: ['MATCH'], count: 3, jokerOk: true  },
    ],
    suitRule: 'TWO_SUITS_MATCHING_DRAGON',
  },
  {
    id: 'E5',
    category: '2468',
    name: 'FFF Pair Pair Pung Kong evens',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 1 Suit',
    // FFF 22 44 666 8888
    groups: [
      { type: 'PUNG', suit: 'FLOWER', ranks: ['F'], count: 3, jokerOk: false },
      { type: 'PAIR', suit: 'SAME',   ranks: [2],   count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SAME',   ranks: [4],   count: 2, jokerOk: false },
      { type: 'PUNG', suit: 'SAME',   ranks: [6],   count: 3, jokerOk: true  },
      { type: 'KONG', suit: 'SAME',   ranks: [8],   count: 4, jokerOk: true  },
    ],
    suitRule: 'ONE_SUIT',
  },
  {
    id: 'E6',
    category: '2468',
    name: '2468 Kong Dragon Kong Dragon',
    points: 30,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 3 Suits, Like Kongs 2,4,6 or 8 w Matching Dragon',
    // 2468 2222 D 2222 D  (singles 2,4,6,8 + two like kongs each followed by single dragon)
    groups: [
      { type: 'SINGLE', suit: 'ANY',          ranks: [2],       count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',          ranks: [4],       count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',          ranks: [6],       count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',          ranks: [8],       count: 1, jokerOk: false },
      { type: 'KONG',   suit: 'SUIT_A',       ranks: ['K'],     count: 4, jokerOk: true  }, // K = chosen even
      { type: 'SINGLE', suit: 'DRAGON_MATCH', ranks: ['MATCH'], count: 1, jokerOk: false },
      { type: 'KONG',   suit: 'SUIT_B',       ranks: ['K'],     count: 4, jokerOk: true  }, // same K, diff suit
      { type: 'SINGLE', suit: 'DRAGON_MATCH', ranks: ['MATCH'], count: 1, jokerOk: false },
    ],
    suitRule: 'THREE_SUITS',
  },
  {
    id: 'E7',
    category: '2468',
    name: 'FFF 2468 FFF Kong',
    points: 30,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 Suits, Kong 2,4,6 or 8',
    // FFF 2468 FFF 2222  (two flower pungs surrounding singles 2,4,6,8 + like kong)
    groups: [
      { type: 'PUNG',   suit: 'FLOWER', ranks: ['F'], count: 3, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [2],   count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [4],   count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [6],   count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [8],   count: 1, jokerOk: false },
      { type: 'PUNG',   suit: 'FLOWER', ranks: ['F'], count: 3, jokerOk: false },
      { type: 'KONG',   suit: 'ANY',    ranks: ['K'], count: 4, jokerOk: true  }, // K = 2,4,6 or 8
    ],
    suitRule: 'TWO_SUITS',
  },
  {
    id: 'E8',
    category: '2468',
    name: 'FF 246 888 246 888',
    points: 30,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 2 Suits',
    // FF 246 888 246 888
    groups: [
      { type: 'PAIR',   suit: 'FLOWER', ranks: ['F'], count: 2, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [2],   count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [4],   count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [6],   count: 1, jokerOk: false },
      { type: 'PUNG',   suit: 'ANY',    ranks: [8],   count: 3, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [2],   count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [4],   count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [6],   count: 1, jokerOk: false },
      { type: 'PUNG',   suit: 'ANY',    ranks: [8],   count: 3, jokerOk: false },
    ],
    suitRule: 'TWO_SUITS',
  },

  // ─── WINDS AND DRAGONS ─────────────────────────────────────────────────────

  {
    id: 'W1',
    category: 'Winds and Dragons',
    name: 'Four Winds alternates',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'NNNN EEE WWW SSSS -or- NNN EEEE WWWW SSS',
    // NNNN EEE WWW SSSS  -or-  NNN EEEE WWWW SSS
    groups: [
      { type: 'KONG', suit: 'WIND', ranks: ['N'], count: 4, jokerOk: true },
      { type: 'PUNG', suit: 'WIND', ranks: ['E'], count: 3, jokerOk: true },
      { type: 'PUNG', suit: 'WIND', ranks: ['W'], count: 3, jokerOk: true },
      { type: 'KONG', suit: 'WIND', ranks: ['S'], count: 4, jokerOk: true },
    ],
    suitRule: 'WINDS_ONLY',
  },
  {
    id: 'W2',
    category: 'Winds and Dragons',
    name: '1234 Three Dragons',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 4 Consec. Nos. in Any 1 Suit, Any 3 Dragons',
    // 1234 DDD DDD DDDD
    groups: [
      { type: 'SINGLE', suit: 'SAME',   ranks: ['N'],      count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'SAME',   ranks: ['N+1'],    count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'SAME',   ranks: ['N+2'],    count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'SAME',   ranks: ['N+3'],    count: 1, jokerOk: false },
      { type: 'PUNG',   suit: 'DRAGON', ranks: ['COLOR1'], count: 3, jokerOk: true  },
      { type: 'PUNG',   suit: 'DRAGON', ranks: ['COLOR2'], count: 3, jokerOk: true  },
      { type: 'KONG',   suit: 'DRAGON', ranks: ['COLOR3'], count: 4, jokerOk: true  },
    ],
    suitRule: 'ONE_SUIT_ALL_THREE_DRAGONS',
  },
  {
    id: 'W3',
    category: 'Winds and Dragons',
    name: 'NNN Two Like Odd Kongs SSS',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any Like Odd Nos. in Any 2 Suits',
    // NNN 1111 1111 SSS
    groups: [
      { type: 'PUNG', suit: 'WIND',   ranks: ['N'],   count: 3, jokerOk: true },
      { type: 'KONG', suit: 'SUIT_A', ranks: ['ODD'], count: 4, jokerOk: true },
      { type: 'KONG', suit: 'SUIT_B', ranks: ['ODD'], count: 4, jokerOk: true },
      { type: 'PUNG', suit: 'WIND',   ranks: ['S'],   count: 3, jokerOk: true },
    ],
    suitRule: 'TWO_SUITS_NS_WINDS',
  },
  {
    id: 'W4',
    category: 'Winds and Dragons',
    name: 'EEE Two Like Even Kongs WWW',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any Like Even Nos. in Any 2 Suits',
    // EEE 2222 2222 WWW
    groups: [
      { type: 'PUNG', suit: 'WIND',   ranks: ['E'],    count: 3, jokerOk: true },
      { type: 'KONG', suit: 'SUIT_A', ranks: ['EVEN'], count: 4, jokerOk: true },
      { type: 'KONG', suit: 'SUIT_B', ranks: ['EVEN'], count: 4, jokerOk: true },
      { type: 'PUNG', suit: 'WIND',   ranks: ['W'],    count: 3, jokerOk: true },
    ],
    suitRule: 'TWO_SUITS_EW_WINDS',
  },
  {
    id: 'W5',
    category: 'Winds and Dragons',
    name: 'FFF North FFF Dragon',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any Wind, Any Dragon',
    // FFF NNNN FFF DDDD
    groups: [
      { type: 'PUNG', suit: 'FLOWER', ranks: ['F'],   count: 3, jokerOk: false },
      { type: 'KONG', suit: 'WIND',   ranks: ['N'],   count: 4, jokerOk: true  },
      { type: 'PUNG', suit: 'FLOWER', ranks: ['F'],   count: 3, jokerOk: false },
      { type: 'KONG', suit: 'DRAGON', ranks: ['ANY'], count: 4, jokerOk: true  },
    ],
    suitRule: 'ANY_WIND_ANY_DRAGON',
  },
  {
    id: 'W6',
    category: 'Winds and Dragons',
    name: '1N 2EE 3WWW 4SSSS',
    points: 30,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 1 Suit, These Nos. Only',
    // 1 N 2 EE 3 WWW 4 SSSS
    groups: [
      { type: 'SINGLE', suit: 'SAME', ranks: [1],   count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'WIND', ranks: ['N'], count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'SAME', ranks: [2],   count: 1, jokerOk: false },
      { type: 'PAIR',   suit: 'WIND', ranks: ['E'], count: 2, jokerOk: false },
      { type: 'SINGLE', suit: 'SAME', ranks: [3],   count: 1, jokerOk: false },
      { type: 'PUNG',   suit: 'WIND', ranks: ['W'], count: 3, jokerOk: false },
      { type: 'SINGLE', suit: 'SAME', ranks: [4],   count: 1, jokerOk: false },
      { type: 'KONG',   suit: 'WIND', ranks: ['S'], count: 4, jokerOk: false },
    ],
    suitRule: 'ONE_SUIT',
  },
  {
    id: 'W7',
    category: 'Winds and Dragons',
    name: 'FF North South Two Dragons',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 Dragons',
    // FF NNNN SSSS DD DD  -or-  FF EEEE WWWW DD DD
    groups: [
      { type: 'PAIR', suit: 'FLOWER', ranks: ['F'],   count: 2, jokerOk: false },
      { type: 'KONG', suit: 'WIND',   ranks: ['N'],   count: 4, jokerOk: true  },
      { type: 'KONG', suit: 'WIND',   ranks: ['S'],   count: 4, jokerOk: true  },
      { type: 'PAIR', suit: 'DRAGON', ranks: ['ANY'], count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'DRAGON', ranks: ['ANY'], count: 2, jokerOk: false },
    ],
    suitRule: 'ANY_TWO_DRAGONS',
  },
  {
    id: 'W8',
    category: 'Winds and Dragons',
    name: 'NN EEE 2026 WWW SS',
    points: 30,
    closedOnly: true,
    confirmed: true,
    notes: '2026, Any 1 Suit',
    // NN EEE 2026 WWW SS
    groups: [
      { type: 'PAIR',     suit: 'WIND', ranks: ['N'],        count: 2, jokerOk: false },
      { type: 'PUNG',     suit: 'WIND', ranks: ['E'],        count: 3, jokerOk: false },
      { type: 'SEQUENCE', suit: 'SAME', ranks: [2, 0, 2, 6], count: 4, jokerOk: false },
      { type: 'PUNG',     suit: 'WIND', ranks: ['W'],        count: 3, jokerOk: false },
      { type: 'PAIR',     suit: 'WIND', ranks: ['S'],        count: 2, jokerOk: false },
    ],
    suitRule: 'ONE_SUIT',
  },

  // ─── 369 ───────────────────────────────────────────────────────────────────

  {
    id: 'T1',
    category: '369',
    name: 'Pung Pung Kong Kong 369',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 or 3 Suits',
    // 333 666 6666 9999  (pung-3 + pung-6 + kong-6 + kong-9, suits vary)
    groups: [
      { type: 'PUNG', suit: 'ANY', ranks: [3], count: 3, jokerOk: true },
      { type: 'PUNG', suit: 'ANY', ranks: [6], count: 3, jokerOk: true },
      { type: 'KONG', suit: 'ANY', ranks: [6], count: 4, jokerOk: true },
      { type: 'KONG', suit: 'ANY', ranks: [9], count: 4, jokerOk: true },
    ],
    suitRule: 'TWO_OR_THREE_SUITS',
  },
  {
    id: 'T2',
    category: '369',
    name: 'Pair Pair Pung Pung Kong 369 (3 suits)',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 3 Suits',
    // 33 66 333 666 9999
    groups: [
      { type: 'PAIR', suit: 'SUIT_A', ranks: [3], count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SUIT_B', ranks: [6], count: 2, jokerOk: false },
      { type: 'PUNG', suit: 'SUIT_C', ranks: [3], count: 3, jokerOk: true  },
      { type: 'PUNG', suit: 'SUIT_C', ranks: [6], count: 3, jokerOk: true  },
      { type: 'KONG', suit: 'SUIT_C', ranks: [9], count: 4, jokerOk: true  },
    ],
    suitRule: 'THREE_SUITS',
  },
  {
    id: 'T3',
    category: '369',
    name: 'FFF Pair Pung Pair Dragon Kong',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: '1 Suit w Matching or Opp. Dragon',
    // FFF 33 666 99 DDDD
    groups: [
      { type: 'PUNG', suit: 'FLOWER',    ranks: ['F'], count: 3, jokerOk: false },
      { type: 'PAIR', suit: 'SAME',      ranks: [3],   count: 2, jokerOk: false },
      { type: 'PUNG', suit: 'SAME',      ranks: [6],   count: 3, jokerOk: true  },
      { type: 'PAIR', suit: 'SAME',      ranks: [9],   count: 2, jokerOk: false },
      { type: 'KONG', suit: 'DRAGON_ANY', ranks: ['D'], count: 4, jokerOk: true  },
    ],
    suitRule: 'ONE_SUIT_ANY_DRAGON',
  },
  {
    id: 'T4',
    category: '369',
    name: 'Pair Pair Pung Pung NEWS 369',
    points: 30,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 Suits',
    // 33 66 666 999 NEWS
    groups: [
      { type: 'PAIR',   suit: 'ANY',  ranks: [3],   count: 2, jokerOk: false },
      { type: 'PAIR',   suit: 'ANY',  ranks: [6],   count: 2, jokerOk: false },
      { type: 'PUNG',   suit: 'ANY',  ranks: [6],   count: 3, jokerOk: true  },
      { type: 'PUNG',   suit: 'ANY',  ranks: [9],   count: 3, jokerOk: true  },
      { type: 'SINGLE', suit: 'WIND', ranks: ['N'], count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'WIND', ranks: ['E'], count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'WIND', ranks: ['W'], count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'WIND', ranks: ['S'], count: 1, jokerOk: false },
    ],
    suitRule: 'TWO_SUITS',
  },
  {
    id: 'T5',
    category: '369',
    name: 'FF 3369 Kong Kong (kongs match pair)',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 3 Suits, Pair 3,6 or 9, Kongs Match Pair',
    // FF 3369 3333 3333  (pair within 3369 determines which number the two kongs use)
    groups: [
      { type: 'PAIR',     suit: 'FLOWER', ranks: ['F'],                  count: 2, jokerOk: false },
      { type: 'SEQUENCE', suit: 'ANY',    ranks: [3, 3, 6, 9],           count: 4, jokerOk: false }, // pair digit varies
      { type: 'KONG',     suit: 'ANY',    ranks: ['MATCH_PAIR_IN_SEQ'],  count: 4, jokerOk: false },
      { type: 'KONG',     suit: 'ANY',    ranks: ['MATCH_PAIR_IN_SEQ'],  count: 4, jokerOk: false },
    ],
    suitRule: 'THREE_SUITS',
  },
  {
    id: 'T6',
    category: '369',
    name: 'FF Pung Pung Pung Singles 369',
    points: 30,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 2 Suits',
    // FF 333 666 999 369
    groups: [
      { type: 'PAIR',   suit: 'FLOWER', ranks: ['F'], count: 2, jokerOk: false },
      { type: 'PUNG',   suit: 'ANY',    ranks: [3],   count: 3, jokerOk: false },
      { type: 'PUNG',   suit: 'ANY',    ranks: [6],   count: 3, jokerOk: false },
      { type: 'PUNG',   suit: 'ANY',    ranks: [9],   count: 3, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [3],   count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [6],   count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',    ranks: [9],   count: 1, jokerOk: false },
    ],
    suitRule: 'TWO_SUITS',
  },

  // ─── SINGLES AND PAIRS ─────────────────────────────────────────────────────

  {
    id: 'S1',
    category: 'Singles and Pairs',
    name: 'All Winds + Like No. w Matching Dragon',
    points: 50,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 3 Suits, Any Like No. w Matching Dragon',
    // NN EE WW SS 1D 1D 1D  (4 wind pairs + 3 x [number + matching dragon])
    groups: [
      { type: 'PAIR',   suit: 'WIND', ranks: ['N'], count: 2, jokerOk: false },
      { type: 'PAIR',   suit: 'WIND', ranks: ['E'], count: 2, jokerOk: false },
      { type: 'PAIR',   suit: 'WIND', ranks: ['W'], count: 2, jokerOk: false },
      { type: 'PAIR',   suit: 'WIND', ranks: ['S'], count: 2, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',  ranks: ['N'], count: 1, jokerOk: false }, // number tile
      { type: 'SINGLE', suit: 'DRAGON_MATCH', ranks: ['M'], count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',  ranks: ['N'], count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'DRAGON_MATCH', ranks: ['M'], count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY',  ranks: ['N'], count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'DRAGON_MATCH', ranks: ['M'], count: 1, jokerOk: false },
    ],
    suitRule: 'THREE_SUITS',
  },
  {
    id: 'S2',
    category: 'Singles and Pairs',
    name: '2 4 66 88 2 4 66 88 88',
    points: 50,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 3 Suits, These Nos. Only',
    // 2 4 66 88 2 4 66 88 88  (14 tiles)
    groups: [
      { type: 'SINGLE', suit: 'ANY', ranks: [2], count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY', ranks: [4], count: 1, jokerOk: false },
      { type: 'PAIR',   suit: 'ANY', ranks: [6], count: 2, jokerOk: false },
      { type: 'PAIR',   suit: 'ANY', ranks: [8], count: 2, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY', ranks: [2], count: 1, jokerOk: false },
      { type: 'SINGLE', suit: 'ANY', ranks: [4], count: 1, jokerOk: false },
      { type: 'PAIR',   suit: 'ANY', ranks: [6], count: 2, jokerOk: false },
      { type: 'PAIR',   suit: 'ANY', ranks: [8], count: 2, jokerOk: false },
      { type: 'PAIR',   suit: 'ANY', ranks: [8], count: 2, jokerOk: false },
    ],
    suitRule: 'THREE_SUITS',
  },
  {
    id: 'S3',
    category: 'Singles and Pairs',
    name: 'FF 3369 3669 3699',
    points: 50,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 3 Suits',
    groups: [
      { type: 'PAIR',     suit: 'FLOWER', ranks: ['F'],     count: 2, jokerOk: false },
      { type: 'SEQUENCE', suit: 'ANY',    ranks: [3,3,6,9], count: 4, jokerOk: false },
      { type: 'SEQUENCE', suit: 'ANY',    ranks: [3,6,6,9], count: 4, jokerOk: false },
      { type: 'SEQUENCE', suit: 'ANY',    ranks: [3,6,9,9], count: 4, jokerOk: false },
    ],
    suitRule: 'THREE_SUITS',
  },
  {
    id: 'S4',
    category: 'Singles and Pairs',
    name: '7 Pairs Consec (1 suit)',
    points: 50,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 1 Suit, Any 7 Consec. Nos.',
    // 11 22 33 44 55 66 77
    groups: [
      { type: 'PAIR', suit: 'SAME', ranks: ['N'],   count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SAME', ranks: ['N+1'], count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SAME', ranks: ['N+2'], count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SAME', ranks: ['N+3'], count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SAME', ranks: ['N+4'], count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SAME', ranks: ['N+5'], count: 2, jokerOk: false },
      { type: 'PAIR', suit: 'SAME', ranks: ['N+6'], count: 2, jokerOk: false },
    ],
    suitRule: 'ONE_SUIT',
  },
  {
    id: 'S5',
    category: 'Singles and Pairs',
    name: '11 357 99 x2',
    points: 50,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 2 Suits',
    // 11 357 99 11 357 99
    groups: [
      { type: 'PAIR',     suit: 'ANY', ranks: [1],     count: 2, jokerOk: false },
      { type: 'SEQUENCE', suit: 'ANY', ranks: [3,5,7], count: 3, jokerOk: false },
      { type: 'PAIR',     suit: 'ANY', ranks: [9],     count: 2, jokerOk: false },
      { type: 'PAIR',     suit: 'ANY', ranks: [1],     count: 2, jokerOk: false },
      { type: 'SEQUENCE', suit: 'ANY', ranks: [3,5,7], count: 3, jokerOk: false },
      { type: 'PAIR',     suit: 'ANY', ranks: [9],     count: 2, jokerOk: false },
    ],
    suitRule: 'TWO_SUITS',
  },
  {
    id: 'S6',
    category: 'Singles and Pairs',
    name: 'FF 2026 x3',
    points: 75,
    closedOnly: true,
    confirmed: true,
    notes: 'Any 3 Suits',
    // FF 2026 2026 2026
    groups: [
      { type: 'PAIR',     suit: 'FLOWER', ranks: ['F'],       count: 2, jokerOk: false },
      { type: 'SEQUENCE', suit: 'ANY',    ranks: [2,'0',2,6], count: 4, jokerOk: false },
      { type: 'SEQUENCE', suit: 'ANY',    ranks: [2,'0',2,6], count: 4, jokerOk: false },
      { type: 'SEQUENCE', suit: 'ANY',    ranks: [2,'0',2,6], count: 4, jokerOk: false },
    ],
    suitRule: 'THREE_SUITS',
  },

  // ─── ANY LIKE NUMBERS ──────────────────────────────────────────────────────

  {
    id: 'L1',
    category: 'Any Like Numbers',
    name: 'Kong 6 Flowers Kong (2 suits)',
    points: 30,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 2 Suits',
    // 1111 FFFFFF 1111
    groups: [
      { type: 'KONG',   suit: 'SUIT_A', ranks: ['N'], count: 4, jokerOk: true  },
      { type: 'SEXTET', suit: 'FLOWER', ranks: ['F'], count: 6, jokerOk: false },
      { type: 'KONG',   suit: 'SUIT_B', ranks: ['N'], count: 4, jokerOk: true  },
    ],
    suitRule: 'TWO_SUITS_SAME_RANK',
  },
  {
    id: 'L2',
    category: 'Any Like Numbers',
    name: 'Kong Dragon Pung Dragon Kong Dragon',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 3 Suits w Matching Dragon',
    // 1111 D 111 D 1111 D  (4+1+3+1+4+1 = 14)
    groups: [
      { type: 'KONG',   suit: 'SUIT_A', ranks: ['N'],     count: 4, jokerOk: true  },
      { type: 'SINGLE', suit: 'DRAGON', ranks: ['MATCH'], count: 1, jokerOk: false },
      { type: 'PUNG',   suit: 'SUIT_B', ranks: ['N'],     count: 3, jokerOk: true  },
      { type: 'SINGLE', suit: 'DRAGON', ranks: ['MATCH'], count: 1, jokerOk: false },
      { type: 'KONG',   suit: 'SUIT_C', ranks: ['N'],     count: 4, jokerOk: true  },
      { type: 'SINGLE', suit: 'DRAGON', ranks: ['MATCH'], count: 1, jokerOk: false },
    ],
    suitRule: 'THREE_SUITS_MATCHING_DRAGON',
  },
  {
    id: 'L3',
    category: 'Any Like Numbers',
    name: 'FF Kong Pair Kong Dragon Pair',
    points: 25,
    closedOnly: false,
    confirmed: true,
    notes: 'Any 3 Suits w Any Dragon',
    // FF 1111 11 1111 DD  (2+4+2+4+2 = 14)
    groups: [
      { type: 'PAIR', suit: 'FLOWER', ranks: ['F'],   count: 2, jokerOk: false },
      { type: 'KONG', suit: 'SUIT_A', ranks: ['N'],   count: 4, jokerOk: true  },
      { type: 'PAIR', suit: 'SUIT_B', ranks: ['N'],   count: 2, jokerOk: false },
      { type: 'KONG', suit: 'SUIT_C', ranks: ['N'],   count: 4, jokerOk: true  },
      { type: 'PAIR', suit: 'DRAGON', ranks: ['ANY'], count: 2, jokerOk: false },
    ],
    suitRule: 'THREE_SUITS_ANY_DRAGON',
  },
]

// Helper: get only confirmed hands (for production analysis)
export const CONFIRMED_HANDS = HANDS.filter(h => h.confirmed && h.groups.length > 0)

// Helper: get all hands (including stubs) for admin review
export const ALL_HANDS = HANDS
