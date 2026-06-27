import { useState, useEffect } from 'react'
import { GameProvider, useGame } from './context/GameContext.jsx'
import PlayerHand from './components/PlayerHand.jsx'
import CharlestonControls from './components/CharlestonControls.jsx'
import CollapsibleSection from './components/CollapsibleSection.jsx'
import PassHistoryPanel from './components/PassHistoryPanel.jsx'
import { HandAnalysisContent, PassAdvisorContent } from './components/AnalysisPanel.jsx'

function PlayerPill({ player }) {
  const initial = player.name[0]
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg text-xs">
      <span className="font-bold text-white/80">{initial}</span>
      <span className="text-white/30">·</span>
      <span className="text-white/50">{player.hand.length}</span>
    </div>
  )
}

function Table() {
  const { players, passHistory, passStepIndex, gamePhase } = useGame()
  const [globalExpand, setGlobalExpand] = useState(null)

  // Collapse all panels after each pass — player must re-evaluate fresh
  useEffect(() => {
    setGlobalExpand(false)
  }, [passStepIndex])

  function handleUserToggle() { setGlobalExpand(null) }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-b from-green-900 to-green-950">

      {/* Header: logo + virtual player pills */}
      <header className="shrink-0 flex items-center justify-between px-4 py-2.5 bg-black/30">
        <div className="flex items-center gap-2">
          <span className="text-xl">🀄</span>
          <span className="text-white font-bold text-base tracking-tight">MahjonggFlash</span>
          <span className="text-white/40 text-xs">NMJL 2026</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map(i => <PlayerPill key={i} player={players[i]} />)}
        </div>
      </header>

      {/* Charleston controls bar */}
      <div className="shrink-0 px-3 pt-2 pb-1">
        <CharlestonControls />
      </div>

      {/* Human hand */}
      <div className="shrink-0 px-3 py-2 border-b border-white/10">
        <PlayerHand playerIdx={0} isActive={true} faceDown={false} />
      </div>

      {/* Analysis panels — fill remaining space */}
      <div className="flex-1 min-h-0 flex flex-col px-3 pt-2 pb-2 gap-2 overflow-hidden">

        {/* Controls row */}
        <div className="shrink-0 flex items-center justify-between px-1">
          <span className="text-white/50 text-xs uppercase tracking-wide font-semibold">Analysis</span>
          <div className="flex gap-1">
            <button
              onClick={() => setGlobalExpand(true)}
              disabled={globalExpand === true}
              className="text-xs text-white/50 hover:text-white disabled:opacity-30 px-2 py-0.5 rounded hover:bg-white/10 transition-colors"
            >
              Show All
            </button>
            <button
              onClick={() => setGlobalExpand(false)}
              disabled={globalExpand === false}
              className="text-xs text-white/50 hover:text-white disabled:opacity-30 px-2 py-0.5 rounded hover:bg-white/10 transition-colors"
            >
              Hide All
            </button>
          </div>
        </div>

        {/* Main panels — horizontal, scroll if content overflows */}
        <div className="flex gap-2 flex-1 min-h-0 overflow-y-auto items-start">
          <div className="flex-1 min-w-0">
            <CollapsibleSection
              title="Hand Analysis"
              globalExpand={globalExpand}
              onUserToggle={handleUserToggle}
            >
              <HandAnalysisContent />
            </CollapsibleSection>
          </div>

          {gamePhase === 'CHARLESTON' && (
            <div className="flex-1 min-w-0">
              <CollapsibleSection
                title="Pass Advisor"
                globalExpand={globalExpand}
                onUserToggle={handleUserToggle}
              >
                <PassAdvisorContent />
              </CollapsibleSection>
            </div>
          )}

          {gamePhase === 'DONE' && (
            <div className="flex-1 min-w-0 bg-yellow-900/30 border border-yellow-600/30 rounded-xl px-4 py-3 text-xs text-yellow-200">
              Charleston complete! Open Hand Analysis to review your final hand.
            </div>
          )}
        </div>

        {/* Pass History — demoted footer strip */}
        <div className="shrink-0">
          <CollapsibleSection
            title="Pass History"
            badge={passHistory.length > 0 ? passHistory.length : null}
            globalExpand={globalExpand}
            onUserToggle={handleUserToggle}
          >
            <PassHistoryPanel />
          </CollapsibleSection>
        </div>

      </div>
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <Table />
    </GameProvider>
  )
}
