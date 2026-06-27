import { useState, useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext.jsx'
import Tile from './Tile.jsx'

const ARROWS = { LEFT: '←', ACROSS: '↕', RIGHT: '→' }
const SEND_TO   = { LEFT: 'West', ACROSS: 'North', RIGHT: 'East' }
const RECV_FROM = { LEFT: 'East', ACROSS: 'North', RIGHT: 'West' }

// Shows the full 4-player pass sequence before the state updates
function PassAnimation({ step, passingTiles, onComplete }) {
  const [phase, setPhase] = useState(0) // 0=you pass, 1=others pass, 2=receiving
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700)
    const t2 = setTimeout(() => setPhase(2), 1400)
    const t3 = setTimeout(() => onCompleteRef.current(), 2100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, []) // run once on mount only

  const FaceDown = () => (
    <div className="w-8 h-11 rounded-lg border-2 border-slate-600 bg-slate-700 flex items-center justify-center shadow">
      <span className="text-slate-500 text-base">🀫</span>
    </div>
  )

  const ThreeFaceDown = () => (
    <div className="flex gap-1">
      <FaceDown /><FaceDown /><FaceDown />
    </div>
  )

  return (
    <div className="bg-black/50 rounded-xl p-3 text-white flex flex-col gap-3">
      <div className="text-xs font-bold text-yellow-300 uppercase tracking-wide">
        {ARROWS[step.direction]} {step.label}
      </div>

      {/* Phase 0: you passing out */}
      <div className={`flex items-center gap-3 transition-opacity duration-300 ${phase >= 0 ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-xs text-white/50 w-24 shrink-0">You → {SEND_TO[step.direction]}</span>
        <div className="flex gap-1">
          {passingTiles.map(t => <Tile key={t.id} tile={t} small />)}
        </div>
        <span className="text-white/40 text-lg">{ARROWS[step.direction]}</span>
      </div>

      {/* Phase 1: virtual players passing — show the full 4-way exchange */}
      {(() => {
        const chain = step.direction === 'LEFT'
          ? [['West','North'],['North','East'],['East','You']]
          : step.direction === 'RIGHT'
            ? [['East','North'],['North','West'],['West','You']]
            : [['North','You'],['West','East']]
        return (
          <div className={`flex flex-col gap-1.5 transition-opacity duration-300 ${phase >= 1 ? 'opacity-100' : 'opacity-30'}`}>
            {chain.map(([from, to], i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-white/40 w-28 shrink-0">{from} → {to}</span>
                <div className={`flex gap-0.5 ${phase >= 1 ? 'animate-pulse' : ''}`}>
                  <FaceDown /><FaceDown /><FaceDown />
                </div>
              </div>
            ))}
          </div>
        )
      })()}

      {/* Phase 2: receiving */}
      <div className={`flex items-center gap-3 transition-opacity duration-300 ${phase >= 2 ? 'opacity-100' : 'opacity-30'}`}>
        <span className="text-xs text-white/60 w-24 shrink-0">{RECV_FROM[step.direction]} → You</span>
        <div className={`flex gap-1 ${phase >= 2 ? 'animate-bounce' : ''}`}>
          <FaceDown /><FaceDown /><FaceDown />
        </div>
        <span className="text-xs text-green-400">incoming...</span>
      </div>
    </div>
  )
}

export default function CharlestonControls() {
  const {
    currentStep, passStepIndex, PASS_STEPS, selectedTiles,
    secondCharlestonStopped, courtesyEnabled, gamePhase, dispatch,
  } = useGame()

  const humanSelected = selectedTiles[0] || []
  const isCourtesy = currentStep?.charleston === 3
  const canPass = isCourtesy ? humanSelected.length >= 1 : humanSelected.length === 3

  const [animating, setAnimating] = useState(false)
  const [animStep, setAnimStep] = useState(null)
  const [animTiles, setAnimTiles] = useState([])
  const onCompleteRef = useRef(null)

  function handlePass() {
    if (!canPass) return
    setAnimStep(currentStep)
    setAnimTiles([...humanSelected])
    setAnimating(true)
  }

  function handleAnimComplete() {
    dispatch({ type: 'EXECUTE_PASS' })
    setAnimating(false)
    setAnimStep(null)
    setAnimTiles([])
  }

  if (gamePhase === 'DONE') {
    return (
      <div className="flex items-center justify-center gap-3 p-3 bg-white/10 rounded-xl">
        <span className="text-white font-semibold text-sm">Charleston Complete!</span>
        <button
          onClick={() => dispatch({ type: 'NEW_GAME' })}
          className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors"
        >
          New Game
        </button>
      </div>
    )
  }

  if (animating && animStep) {
    return (
      <PassAnimation
        step={animStep}
        passingTiles={animTiles}
        onComplete={handleAnimComplete}
      />
    )
  }

  return (
    <div className="flex flex-col gap-2 px-3 py-2 bg-white/10 rounded-xl">
      {/* Step progress bar — compact */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {PASS_STEPS.map((step, i) => {
          if (secondCharlestonStopped && step.charleston === 2) return null
          if (!courtesyEnabled && step.charleston === 3) return null
          return (
            <div
              key={step.id}
              className={[
                'flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors',
                i < passStepIndex ? 'bg-green-700/60 text-green-200' :
                i === passStepIndex ? 'bg-yellow-500 text-black' :
                'bg-white/10 text-white/40'
              ].join(' ')}
            >
              <span>{ARROWS[step.direction]}</span>
              <span>{step.charleston === 3 ? 'Crt' : `C${step.charleston}`}</span>
            </div>
          )
        })}
      </div>

      {/* Current step + actions — single row */}
      {currentStep && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="text-white font-semibold text-sm">
              {ARROWS[currentStep.direction]} {currentStep.label}
            </span>
            <span className="text-white/50 text-xs ml-2">
              {isCourtesy ? '(select 1–3 tiles)' : '(select 3 tiles)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!secondCharlestonStopped && passStepIndex === 3 && (
              <button
                onClick={() => dispatch({ type: 'STOP_SECOND_CHARLESTON' })}
                className="text-xs bg-orange-700 hover:bg-orange-600 text-white px-2 py-1 rounded-lg transition-colors"
              >
                Stop 2nd
              </button>
            )}

            {passStepIndex === 6 && (
              <button
                onClick={() => dispatch({ type: 'TOGGLE_COURTESY' })}
                className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                  courtesyEnabled ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-800 text-white/40'
                }`}
              >
                {courtesyEnabled ? 'Skip Courtesy' : 'Courtesy: Off'}
              </button>
            )}

            <button
              onClick={handlePass}
              disabled={!canPass}
              className={[
                'px-5 py-1.5 rounded-lg font-bold text-sm transition-colors',
                canPass
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
                  : 'bg-white/20 text-white/30 cursor-not-allowed'
              ].join(' ')}
            >
              Pass {humanSelected.length}/{isCourtesy ? '1–3' : '3'}
            </button>

            <button
              onClick={() => dispatch({ type: 'NEW_GAME' })}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
