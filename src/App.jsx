import { useState, useEffect } from 'react'
import { GameProvider, useGame } from './context/GameContext.jsx'
import PlayerHand from './components/PlayerHand.jsx'
import CharlestonControls from './components/CharlestonControls.jsx'
import CollapsibleSection from './components/CollapsibleSection.jsx'
import PassHistoryPanel from './components/PassHistoryPanel.jsx'
import { HandAnalysisContent, PassAdvisorContent } from './components/AnalysisPanel.jsx'

function PanelStrip() {
  const { passHistory, passStepIndex, gamePhase } = useGame()
  const [globalExpand, setGlobalExpand] = useState(null)

  // Collapse all panels after each pass — player must re-evaluate fresh
  useEffect(() => {
    setGlobalExpand(false)
  }, [passStepIndex])

  function handleUserToggle() { setGlobalExpand(null) }

  return (
    <div className="flex flex-col gap-2">
      {/* Controls row */}
      <div className="flex items-center justify-between px-1">
        <span className="text-white/50 text-xs uppercase tracking-wide font-semibold">Analysis</span>
        <div className="flex gap-1">
          <button
            onClick={() => setGlobalExpand(true)}
            disabled={globalExpand === true}
            className="text-xs text-white/50 hover:text-white disabled:opacity-30 px-2 py-1 rounded hover:bg-white/10 transition-colors"
          >
            Show All
          </button>
          <button
            onClick={() => setGlobalExpand(false)}
            disabled={globalExpand === false}
            className="text-xs text-white/50 hover:text-white disabled:opacity-30 px-2 py-1 rounded hover:bg-white/10 transition-colors"
          >
            Hide All
          </button>
        </div>
      </div>

      {/* Three panels side by side */}
      <div className="flex gap-3 items-start">
        <div className="flex-1 min-w-0">
          <CollapsibleSection
            title="Pass History"
            badge={passHistory.length > 0 ? passHistory.length : null}
            globalExpand={globalExpand}
            onUserToggle={handleUserToggle}
          >
            <PassHistoryPanel />
          </CollapsibleSection>
        </div>

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
            Charleston complete! Open Hand Analysis above to review your final hand.
          </div>
        )}
      </div>
    </div>
  )
}

function Table() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-black/30 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🀄</span>
          <span className="text-white font-bold text-xl tracking-tight">MahjonggFlash</span>
          <span className="text-white/40 text-sm ml-1">2026 Card</span>
        </div>
        <span className="text-xs text-white/30">NMJL 2026</span>
      </header>

      <div className="flex-1 flex flex-col gap-4 p-4">
        {/* North */}
        <div className="flex justify-center">
          <PlayerHand playerIdx={2} isActive={false} faceDown={true} />
        </div>

        {/* Middle row: West | felt | East */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <PlayerHand playerIdx={1} isActive={false} faceDown={true} />
          </div>

          <div className="flex-1 flex items-center justify-center min-h-24">
            <div className="bg-green-800/40 rounded-2xl border border-green-700/30 w-full h-full min-h-24 flex items-center justify-center">
              <div className="text-center text-green-600/50 select-none py-4">
                <div className="text-3xl">🀄</div>
                <div className="text-sm mt-1">American Mahjong</div>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <PlayerHand playerIdx={3} isActive={false} faceDown={true} />
          </div>
        </div>

        {/* South — human hand */}
        <div className="flex justify-center">
          <PlayerHand playerIdx={0} isActive={true} faceDown={false} />
        </div>

        {/* Charleston controls */}
        <CharlestonControls />

        {/* Analysis panels */}
        <PanelStrip />
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
