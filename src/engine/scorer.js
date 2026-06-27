import { CONFIRMED_HANDS } from '../data/nmjl2026.js'
import { SUIT, DRAGON } from '../data/tiles.js'

// ─── Tile helpers ────────────────────────────────────────────────────────────

function isFlower(tile) { return tile.suit === SUIT.FLOWER }
function isJoker(tile)  { return tile.suit === SUIT.JOKER  }
function isSuitTile(tile) {
  return tile.suit === SUIT.BAM || tile.suit === SUIT.CRAK || tile.suit === SUIT.DOT
}

// Count matching tiles in hand (non-joker)
function countMatching(hand, suit, rank) {
  return hand.filter(t => !isJoker(t) && t.suit === suit && t.rank === rank).length
}

function countJokers(hand) {
  return hand.filter(isJoker).length
}

function countFlowers(hand) {
  return hand.filter(isFlower).length
}

// ─── Simple fit scorer ───────────────────────────────────────────────────────
// For each confirmed hand definition, compute how many tiles in the player's
// hand satisfy the hand's requirements, and return a 0–100 fit score.
//
// This is a heuristic scorer for Charleston-phase analysis.
// Full exact matching would require combinatorial search; heuristics are fast
// and good enough for "best hand to pursue" recommendations.

function scoreGroupMatch(hand, group, jokerBudget, suitBinding) {
  // suitBinding: { SAME: 'BAM'|'CRAK'|'DOT', SUIT_A: ..., SUIT_B: ..., SUIT_C: ... }
  const { type, suit, ranks, count, jokerOk } = group

  // Resolve suit
  let resolvedSuit = suit
  if (suit === 'FLOWER') resolvedSuit = SUIT.FLOWER
  else if (suit === 'DRAGON' || suit === 'DRAGON_MATCH' || suit === 'DRAGON_OPP' || suit === 'DRAGON_MATCH_MID' || suit === 'DRAGON_ANY') resolvedSuit = SUIT.DRAGON
  else if (suit === 'WIND') resolvedSuit = SUIT.WIND
  else if (suitBinding[suit]) resolvedSuit = suitBinding[suit]

  let needed = count
  let have = 0
  let jokersUsed = 0

  if (resolvedSuit === SUIT.FLOWER) {
    have = Math.min(countFlowers(hand), count)
  } else if (resolvedSuit === SUIT.JOKER) {
    have = Math.min(countJokers(hand), count)
  } else {
    for (const rank of ranks) {
      if (typeof rank === 'number') {
        have += Math.min(countMatching(hand, resolvedSuit, rank), count - have)
      } else if (rank === 'F') {
        have += Math.min(countFlowers(hand), count - have)
      }
    }
  }

  // Fill remainder with jokers if allowed
  const stillNeeded = count - have
  if (jokerOk && stillNeeded > 0 && jokerBudget > 0) {
    const jokersToUse = Math.min(stillNeeded, jokerBudget)
    jokersUsed = jokersToUse
    have += jokersToUse
  }

  return { have, needed: count, jokersUsed }
}

// Try all suit assignments for a hand pattern and return the best fit
const SUIT_TILES = [SUIT.BAM, SUIT.CRAK, SUIT.DOT]

function tryAllSuitBindings(hand, handDef) {
  const { groups, suitRule } = handDef

  if (!groups || groups.length === 0) return { fitScore: 0, tilesHave: 0, tilesNeeded: 14 }

  // Generate suit binding permutations based on suitRule
  const bindings = getSuitBindings(suitRule)
  const jokers = countJokers(hand)

  let bestScore = 0
  let bestResult = null

  for (const binding of bindings) {
    let totalHave = 0
    let totalNeeded = 0
    let jokerBudget = jokers

    let valid = true
    const groupResults = []

    for (const group of groups) {
      const result = scoreGroupMatch(hand, group, jokerBudget, binding)
      jokerBudget -= result.jokersUsed
      totalHave += result.have
      totalNeeded += result.needed
      groupResults.push(result)
    }

    const score = totalNeeded > 0 ? totalHave / totalNeeded : 0
    if (score > bestScore) {
      bestScore = score
      bestResult = { fitScore: Math.round(score * 100), tilesHave: totalHave, tilesNeeded: totalNeeded, groupResults }
    }
  }

  return bestResult || { fitScore: 0, tilesHave: 0, tilesNeeded: 14 }
}

function getSuitBindings(suitRule) {
  const s = SUIT_TILES
  switch (suitRule) {
    case 'ONE_SUIT':
    case 'ONE_SUIT_NS_WINDS':
    case 'ONE_SUIT_MATCHING_DRAGON':
    case 'ONE_SUIT_OPP_DRAGON':
    case 'ONE_SUIT_CONSEC':
      return s.map(a => ({ SAME: a, SUIT_A: a }))

    case 'TWO_SUITS':
    case 'ONE_OR_TWO_SUITS':
    case 'TWO_SUITS_SAME_RANK':
      return [
        { SUIT_A: s[0], SUIT_B: s[1], SAME: s[0] },
        { SUIT_A: s[0], SUIT_B: s[2], SAME: s[0] },
        { SUIT_A: s[1], SUIT_B: s[2], SAME: s[1] },
        { SUIT_A: s[1], SUIT_B: s[0], SAME: s[1] },
        { SUIT_A: s[2], SUIT_B: s[0], SAME: s[2] },
        { SUIT_A: s[2], SUIT_B: s[1], SAME: s[2] },
      ]

    case 'THREE_SUITS':
    case 'ONE_OR_THREE_SUITS':
    case 'THREE_SUITS_SAME_RANK':
    case 'THREE_SUITS_MATCHING_DRAGON':
      return [
        { SUIT_A: s[0], SUIT_B: s[1], SUIT_C: s[2], SAME: s[0] },
        { SUIT_A: s[0], SUIT_B: s[2], SUIT_C: s[1], SAME: s[0] },
        { SUIT_A: s[1], SUIT_B: s[0], SUIT_C: s[2], SAME: s[1] },
        { SUIT_A: s[1], SUIT_B: s[2], SUIT_C: s[0], SAME: s[1] },
        { SUIT_A: s[2], SUIT_B: s[0], SUIT_C: s[1], SAME: s[2] },
        { SUIT_A: s[2], SUIT_B: s[1], SUIT_C: s[0], SAME: s[2] },
      ]

    default:
      return [
        ...s.map(a => ({ SAME: a, SUIT_A: a, SUIT_B: a, SUIT_C: a })),
        { SUIT_A: s[0], SUIT_B: s[1], SUIT_C: s[2], SAME: s[0] },
        { SUIT_A: s[0], SUIT_B: s[2], SUIT_C: s[1], SAME: s[0] },
        { SUIT_A: s[1], SUIT_B: s[0], SUIT_C: s[2], SAME: s[1] },
      ]
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────

// Score all confirmed hands for a given player hand.
// Returns sorted array of { hand, fitScore, tilesHave, tilesNeeded }
export function scoreHand(playerTiles) {
  const results = CONFIRMED_HANDS.map(handDef => {
    const result = tryAllSuitBindings(playerTiles, handDef)
    return {
      hand: handDef,
      ...result,
    }
  })

  return results.sort((a, b) => b.fitScore - a.fitScore)
}

// Get the top N hand recommendations
export function getTopHands(playerTiles, n = 3) {
  return scoreHand(playerTiles).slice(0, n)
}

// Pass advisor: score each possible set of 3 tiles to pass and recommend
// the best 3 tiles to discard (keep the hand that maximizes best fit score)
export function suggestPass(playerTiles, count = 3) {
  const tiles = playerTiles.filter(t => t.suit !== 'JOKER') // never pass jokers
  const n = tiles.length
  const combos = []

  // Generate all C(n,3) combinations
  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      for (let k = j + 1; k < n; k++) {
        combos.push([tiles[i], tiles[j], tiles[k]])
      }
    }
  }

  // For each combo, score the remaining hand
  let bestScore = -1
  let bestPass = []
  let bestTopHand = null

  for (const combo of combos) {
    const comboIds = new Set(combo.map(t => t.id))
    const remaining = playerTiles.filter(t => !comboIds.has(t.id))
    const top = scoreHand(remaining)
    const score = top[0]?.fitScore ?? 0

    if (score > bestScore) {
      bestScore = score
      bestPass = combo
      bestTopHand = top[0]
    }
  }

  return { suggestedPass: bestPass, resultingTopHand: bestTopHand, resultingScore: bestScore }
}
