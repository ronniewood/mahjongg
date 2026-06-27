// Charleston pass sequence
// Players: [0=South(human), 1=West, 2=North, 3=East] arranged clockwise

export const PASS_STEPS = [
  { id: 'C1L', charleston: 1, direction: 'LEFT',   label: '1st Charleston — Pass Left'   },
  { id: 'C1A', charleston: 1, direction: 'ACROSS', label: '1st Charleston — Pass Across' },
  { id: 'C1R', charleston: 1, direction: 'RIGHT',  label: '1st Charleston — Pass Right'  },
  { id: 'C2R', charleston: 2, direction: 'RIGHT',  label: '2nd Charleston — Pass Right'  },
  { id: 'C2A', charleston: 2, direction: 'ACROSS', label: '2nd Charleston — Pass Across' },
  { id: 'C2L', charleston: 2, direction: 'LEFT',   label: '2nd Charleston — Pass Left'   },
  { id: 'CRT', charleston: 3, direction: 'ACROSS', label: 'Courtesy Pass (optional)'     },
]

// Given a direction, return [from, to] index pairs for 4 players
// Players seated: 0=South, 1=West, 2=North, 3=East (clockwise)
// "Left" from South's perspective = West (player 1)
function getPassTargets(direction) {
  switch (direction) {
    case 'LEFT':
      // Each player passes to the player on their left
      // 0→1, 1→2, 2→3, 3→0
      return [[0,1],[1,2],[2,3],[3,0]]
    case 'RIGHT':
      // 0→3, 3→2, 2→1, 1→0
      return [[0,3],[3,2],[2,1],[1,0]]
    case 'ACROSS':
      // 0→2, 2→0, 1→3, 3→1
      return [[0,2],[2,0],[1,3],[3,1]]
    default:
      return []
  }
}

// Execute a pass: hands is array of 4 tile arrays,
// selectedTiles is { [playerIdx]: Tile[] } — 3 tiles each player is passing
// Returns new hands after the exchange
export function executePass(hands, selectedTiles, direction) {
  const targets = getPassTargets(direction)
  const newHands = hands.map(h => [...h])

  // Remove passed tiles from senders
  for (const [from] of targets) {
    const passing = selectedTiles[from] || []
    newHands[from] = newHands[from].filter(t => !passing.find(p => p.id === t.id))
  }

  // Add received tiles to receivers
  for (const [from, to] of targets) {
    const passing = selectedTiles[from] || []
    newHands[to] = [...newHands[to], ...passing]
  }

  return newHands
}

// Validate that a player has selected exactly 3 tiles (or 1-3 for courtesy)
export function validateSelection(selectedTiles, playerIdx, isCourtesy = false) {
  const tiles = selectedTiles[playerIdx] || []
  if (isCourtesy) return tiles.length >= 1 && tiles.length <= 3
  return tiles.length === 3
}
