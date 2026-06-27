import { useState } from 'react'
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
      <div className={`${color} h-1.5 rounded-full`} style={{ width: `${score}%` }} />
    </div>
  )
}

export function HandAnalysisContent() {
  const { handScores, players, focusedPlayer } = useGame()
  const top3 = handScores.slice(0, 3)
  const [showScores, setShowScores] = useState(false)

  if (top3.length === 0) return <p className="text-white/40 text-sm italic">No hands scored yet.</p>

  return (
    <div className="flex flex-col gap-2 select-none" onDoubleClick={() => setShowScores(s => !s)}>
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/40">{players[focusedPlayer]?.name} · priority order</div>
        <div className="text-xs text-white/25 italic">{showScores ? 'double-click to hide' : 'double-click for scores'}</div>
      </div>

      {top3.map((result, i) => (
        <div
          key={result.hand.id}
          className={`rounded-lg p-2.5 ${i === 0 ? 'bg-green-900/40 border border-green-600/30' : 'bg-white/5'}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <span className={`text-sm font-black shrink-0 leading-tight ${i === 0 ? 'text-green-400' : 'text-white/30'}`}>
                #{i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${i === 0 ? 'text-white' : 'text-white/80'}`}>
                  {handLabel(result.hand.id)}
                </div>
                <div className="text-xs text-white/50 mt-0.5">
                  {result.hand.points} pts{result.hand.closedOnly && <span className="ml-1 text-orange-300"> · Closed</span>}
                </div>
              </div>
            </div>
            {showScores && (
              <span className={`text-sm font-bold shrink-0 ${result.fitScore >= 70 ? 'text-green-400' : result.fitScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {result.fitScore}%
              </span>
            )}
          </div>
          {showScores && <FitBar score={result.fitScore} />}
        </div>
      ))}
    </div>
  )
}

export function PassAdvisorContent() {
  const { passAdvice, gamePhase, selectedTiles, currentStep, dispatch } = useGame()

  if (gamePhase === 'DONE') {
    return <p className="text-white/40 text-sm italic">Charleston is complete.</p>
  }
  if (!passAdvice || passAdvice.suggestedPass.length === 0) {
    return <p className="text-white/40 text-sm italic">Not available right now.</p>
  }

  const humanSelected = selectedTiles[0] || []
  const isCourtesy = currentStep?.charleston === 3
  const canPass = isCourtesy ? humanSelected.length >= 1 : humanSelected.length === 3

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-white/50 italic">
        Double-click a tile to select it, or accept all.
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
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => dispatch({ type: 'SET_SELECTION', playerIdx: 0, tiles: passAdvice.suggestedPass })}
          className="text-xs bg-blue-600/70 hover:bg-blue-500/70 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold"
        >
          Accept All
        </button>
        {canPass && (
          <button
            onClick={() => dispatch({ type: 'EXECUTE_PASS' })}
            className="text-xs bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-lg transition-colors font-bold"
          >
            Pass {humanSelected.length}/{isCourtesy ? '1–3' : '3'}
          </button>
        )}
      </div>
      {passAdvice.resultingTopHand && (
        <div className="text-xs text-blue-300 border-t border-white/10 pt-2">
          After passing: <span className="font-semibold">{handLabel(passAdvice.resultingTopHand.hand.id)}</span>
          {' '}({passAdvice.resultingScore}% match)
        </div>
      )}
    </div>
  )
}
