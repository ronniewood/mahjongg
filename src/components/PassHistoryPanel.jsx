import { useGame } from '../context/GameContext.jsx'

const DIRECTION_ARROWS = { LEFT: '←', ACROSS: '↕', RIGHT: '→' }

const SUIT_PILL_COLORS = {
  BAM:    'bg-green-800/60 text-green-200 border-green-600/40',
  CRAK:   'bg-red-800/60 text-red-200 border-red-600/40',
  DOT:    'bg-blue-800/60 text-blue-200 border-blue-600/40',
  WIND:   'bg-slate-700/60 text-slate-200 border-slate-500/40',
  DRAGON: 'bg-yellow-800/60 text-yellow-200 border-yellow-600/40',
  FLOWER: 'bg-pink-800/60 text-pink-200 border-pink-600/40',
  JOKER:  'bg-purple-800/60 text-purple-200 border-purple-600/40',
}

function TilePill({ tile }) {
  const color = SUIT_PILL_COLORS[tile.suit] || 'bg-white/10 text-white border-white/20'
  return (
    <span className={`inline-flex items-center gap-0.5 border rounded px-1.5 py-0.5 text-xs font-mono ${color}`}>
      {tile.glyph} {tile.display}
    </span>
  )
}

function TileList({ tiles }) {
  if (!tiles || tiles.length === 0) return <span className="text-white/30 text-xs italic">—</span>
  return (
    <div className="flex flex-wrap gap-1">
      {tiles.map(t => <TilePill key={t.id} tile={t} />)}
    </div>
  )
}

export default function PassHistoryPanel() {
  const { passHistory } = useGame()

  if (passHistory.length === 0) {
    return <p className="text-white/40 text-sm italic">No passes yet. Complete a pass to see history.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {[...passHistory].reverse().map(entry => (
        <div key={entry.stepIndex} className="border border-white/10 rounded-lg p-3 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70 uppercase tracking-wide">
            <span className="text-base leading-none">{DIRECTION_ARROWS[entry.step.direction]}</span>
            <span>{entry.step.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-white/40 mb-1">You passed</div>
              <TileList tiles={entry.selectedTiles[0]} />
            </div>
            <div>
              <div className="text-xs text-white/40 mb-1">You received</div>
              <TileList tiles={entry.receivedTiles} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
