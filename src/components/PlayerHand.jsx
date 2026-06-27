import Tile from './Tile.jsx'
import { useGame } from '../context/GameContext.jsx'

// Compact face-down stack shown for virtual players
function HiddenHand({ player }) {
  const count = player.hand.length
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="text-xs font-semibold text-white/70 tracking-wide uppercase">
        {player.name}
      </div>
      {/* Stacked tile fan */}
      <div className="relative h-12 flex items-center" style={{ width: `${Math.min(count, 5) * 10 + 36}px` }}>
        {[...Array(Math.min(count, 5))].map((_, i) => (
          <div
            key={i}
            className="absolute w-9 h-12 rounded border-2 border-slate-600 bg-slate-700 shadow"
            style={{ left: `${i * 10}px`, zIndex: i }}
          />
        ))}
      </div>
      <div className="text-xs text-white/40">{count} tiles</div>
    </div>
  )
}

export default function PlayerHand({ playerIdx, isActive, faceDown = false }) {
  const { players, selectedTiles, dispatch, gamePhase } = useGame()
  const player = players[playerIdx]
  const selected = selectedTiles[playerIdx] || []

  if (faceDown) {
    return <HiddenHand player={player} />
  }

  function handleTileClick(tile) {
    if (!isActive || gamePhase !== 'CHARLESTON') return
    dispatch({ type: 'TOGGLE_TILE_SELECTION', playerIdx, tile })
  }

  const sorted = [...player.hand].sort((a, b) => {
    const suitOrder = { BAM: 0, CRAK: 1, DOT: 2, WIND: 3, DRAGON: 4, FLOWER: 5, JOKER: 6 }
    const sa = suitOrder[a.suit] ?? 9
    const sb = suitOrder[b.suit] ?? 9
    if (sa !== sb) return sa - sb
    if (a.rank < b.rank) return -1
    if (a.rank > b.rank) return 1
    return 0
  })

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="text-xs font-semibold text-white/70 tracking-wide uppercase">
        {player.name}
        {isActive && <span className="ml-2 text-yellow-300 normal-case">← tap to select</span>}
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {sorted.map(tile => (
          <Tile
            key={tile.id}
            tile={tile}
            selected={!!selected.find(t => t.id === tile.id)}
            onClick={isActive && gamePhase === 'CHARLESTON' ? () => handleTileClick(tile) : null}
            faceDown={false}
          />
        ))}
      </div>
      {isActive && (
        <div className="text-xs text-yellow-200 mt-0.5">
          {selected.length}/3 tiles selected
        </div>
      )}
    </div>
  )
}
