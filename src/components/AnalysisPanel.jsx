import { useGame } from '../context/GameContext.jsx'
import Tile from './Tile.jsx'

const SECTION_NAMES = {
  Q:  'Quints',
  CR: 'Consecutive Run',
  O:  '13579',
  Y:  '2026',
  E:  '2468',
  W:  'Winds & Dragons',
  T:  '369',
  S:  'Singles & Pairs',
  L:  'Any Like Numbers',
}

function handLabel(id) {
  const match = id?.match(/^([A-Z]+)(\d+)$/)
  if (!match) return id
  const [, prefix, num] = match
  return `${SECTION_NAMES[prefix] ?? prefix} Hand ${num}`
}

function FitBar({ score }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
      <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${score}%` }} />
    </div>
  )
}

export function HandAnalysisContent() {
  const { handScores, players, focusedPlayer } = useGame()
  const top3 = handScores.slice(0, 3)
  const best = top3[0]

  if (!best) return <p className="text-white/40 text-sm italic">No hands scored yet.</p>

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-white/40 mb-1">{players[focusedPlayer]?.name}</div>

      {/* Best hand */}
      <div className="bg-green-900/40 border border-green-600/30 rounded-lg p-3">
        <div className="text-xs text-green-300 font-semibold uppercase tracking-wide mb-1">Best Hand</div>
        <div className="font-bold text-white text-sm">{handLabel(best.hand.id)}</div>
        <div className="text-xs text-white/60 mt-0.5">
          {best.hand.points} pts{best.hand.closedOnly && <span className="ml-1 text-orange-300"> · Closed</span>}
        </div>
        <FitBar score={best.fitScore} />
        <div className="text-xs text-green-300 mt-1">{best.fitScore}% match</div>
        {best.hand.notes && <div className="text-xs text-white/40 mt-1 italic">{best.hand.notes}</div>}
      </div>

      {/* Runners-up */}
      {top3.slice(1).map(result => (
        <div key={result.hand.id} className="bg-white/5 rounded-lg p-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{handLabel(result.hand.id)}</div>
              <div className="text-xs text-white/50 mt-0.5">
                {result.hand.points} pts{result.hand.closedOnly && <span className="ml-1 text-orange-300"> · Closed</span>}
              </div>
            </div>
            <span className={`text-sm font-bold shrink-0 ${result.fitScore >= 70 ? 'text-green-400' : result.fitScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {result.fitScore}%
            </span>
          </div>
          <FitBar score={result.fitScore} />
        </div>
      ))}
    </div>
  )
}

export function PassAdvisorContent() {
  const { passAdvice, gamePhase, selectedTiles, dispatch } = useGame()

  if (gamePhase === 'DONE') {
    return <p className="text-white/40 text-sm italic">Charleston is complete.</p>
  }
  if (!passAdvice || passAdvice.suggestedPass.length === 0) {
    return <p className="text-white/40 text-sm italic">Not available right now.</p>
  }

  const humanSelected = selectedTiles[0] || []

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-white/50 italic">
        Double-click a tile to add it to your selection, or accept all.
      </p>

      <div className="flex gap-2 flex-wrap">
        {passAdvice.suggestedPass.map(tile => {
          const isSelected = !!humanSelected.find(t => t.id === tile.id)
          return (
            <Tile
              key={tile.id}
              tile={tile}
              selected={isSelected}
              small
              onDoubleClick={() => dispatch({ type: 'TOGGLE_TILE_SELECTION', playerIdx: 0, tile })}
            />
          )
        })}
      </div>

      <button
        onClick={() => dispatch({ type: 'SET_SELECTION', playerIdx: 0, tiles: passAdvice.suggestedPass })}
        className="text-xs bg-blue-600/70 hover:bg-blue-500/70 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold self-start"
      >
        Accept All
      </button>

      {passAdvice.resultingTopHand && (
        <div className="text-xs text-blue-300 border-t border-white/10 pt-2">
          After passing: <span className="font-semibold">{handLabel(passAdvice.resultingTopHand.hand.id)}</span>
          {' '}({passAdvice.resultingScore}% match)
        </div>
      )}
    </div>
  )
}
