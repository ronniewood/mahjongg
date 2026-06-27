import { useGame } from '../context/GameContext.jsx'

const DIRECTION_ARROWS = { LEFT: '←', ACROSS: '↕', RIGHT: '→' }

export default function CharlestonControls() {
  const {
    currentStep, passStepIndex, PASS_STEPS, selectedTiles,
    secondCharlestonStopped, courtesyEnabled, gamePhase, dispatch,
  } = useGame()

  const humanSelected = selectedTiles[0] || []
  const isCourtesy = currentStep?.charleston === 3
  const canPass = isCourtesy ? humanSelected.length >= 1 : humanSelected.length === 3

  function handlePass() {
    if (!canPass) return
    dispatch({ type: 'EXECUTE_PASS' })
  }

  if (gamePhase === 'DONE') {
    return (
      <div className="flex items-center justify-center gap-4 p-4 bg-white/10 rounded-xl">
        <span className="text-white font-semibold">Charleston Complete!</span>
        <button
          onClick={() => dispatch({ type: 'NEW_GAME' })}
          className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          New Game
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/10 rounded-xl">
      {/* Step indicator */}
      <div className="flex items-center gap-2 flex-wrap">
        {PASS_STEPS.map((step, i) => {
          const isSkipped = secondCharlestonStopped && step.charleston === 2
          const isCourtesySkipped = !courtesyEnabled && step.charleston === 3
          if (isSkipped || isCourtesySkipped) return null
          return (
            <div
              key={step.id}
              className={[
                'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors',
                i < passStepIndex ? 'bg-green-700/60 text-green-200' :
                i === passStepIndex ? 'bg-yellow-500 text-black' :
                'bg-white/10 text-white/40'
              ].join(' ')}
            >
              <span>{DIRECTION_ARROWS[step.direction]}</span>
              <span>{step.charleston === 3 ? 'Courtesy' : `C${step.charleston}`}</span>
            </div>
          )
        })}
      </div>

      {/* Current step info */}
      {currentStep && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-white font-semibold text-lg">
              {DIRECTION_ARROWS[currentStep.direction]} {currentStep.label}
            </div>
            <div className="text-white/60 text-sm">
              {isCourtesy ? 'Select 1–3 tiles to pass (optional exchange)' : 'Select 3 tiles from your hand to pass'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stop 2nd Charleston — shown at start of 2nd Charleston */}
            {!secondCharlestonStopped && passStepIndex === 3 && (
              <button
                onClick={() => dispatch({ type: 'STOP_SECOND_CHARLESTON' })}
                className="text-xs bg-orange-700 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors"
              >
                Stop 2nd Charleston
              </button>
            )}

            {/* Courtesy pass toggle — shown before courtesy step */}
            {passStepIndex === 6 && (
              <button
                onClick={() => dispatch({ type: 'TOGGLE_COURTESY' })}
                className={`text-xs px-3 py-2 rounded-lg transition-colors ${
                  courtesyEnabled
                    ? 'bg-slate-600 hover:bg-slate-500 text-white'
                    : 'bg-slate-800 text-white/40'
                }`}
              >
                {courtesyEnabled ? 'Skip Courtesy' : 'Courtesy: Off'}
              </button>
            )}

            <button
              onClick={handlePass}
              disabled={!canPass}
              className={[
                'px-6 py-2 rounded-lg font-bold text-sm transition-colors',
                canPass
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
                  : 'bg-white/20 text-white/30 cursor-not-allowed'
              ].join(' ')}
            >
              Pass {humanSelected.length}/{isCourtesy ? '1–3' : '3'}
            </button>

            <button
              onClick={() => dispatch({ type: 'NEW_GAME' })}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
