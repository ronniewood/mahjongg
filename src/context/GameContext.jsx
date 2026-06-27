import { createContext, useContext, useReducer } from 'react'
import { buildDeck, deal } from '../data/tiles.js'
import { PASS_STEPS, executePass } from '../engine/charleston.js'
import { scoreHand, suggestPass } from '../engine/scorer.js'

const GameContext = createContext(null)

const PLAYER_NAMES = ['South (You)', 'West', 'North', 'East']
const PLAYER_POSITIONS = ['south', 'west', 'north', 'east']

function initGame() {
  const deck = buildDeck()
  const { hands, remaining } = deal(deck)
  const players = hands.map((hand, i) => ({
    id: i,
    name: PLAYER_NAMES[i],
    position: PLAYER_POSITIONS[i],
    hand,
  }))

  return {
    players,
    remaining,
    passStepIndex: 0,           // index into PASS_STEPS
    charlestonsEnabled: { 2: true },  // second charleston on by default
    courtesyEnabled: true,
    selectedTiles: {},          // { [playerIdx]: Tile[] }
    passHistory: [],
    focusedPlayer: 0,           // which player's analysis panel is shown
    gamePhase: 'CHARLESTON',    // CHARLESTON | DONE
    secondCharlestonStopped: false,
  }
}

function gameReducer(state, action) {
  switch (action.type) {

    case 'NEW_GAME':
      return initGame()

    case 'SET_FOCUSED_PLAYER':
      return { ...state, focusedPlayer: action.playerIdx }

    case 'TOGGLE_TILE_SELECTION': {
      const { playerIdx, tile } = action
      const current = state.selectedTiles[playerIdx] || []
      const isSelected = current.find(t => t.id === tile.id)
      let next
      if (isSelected) {
        next = current.filter(t => t.id !== tile.id)
      } else if (current.length < 3) {
        next = [...current, tile]
      } else {
        next = current // already 3 selected, ignore
      }
      return {
        ...state,
        selectedTiles: { ...state.selectedTiles, [playerIdx]: next },
      }
    }

    case 'CLEAR_SELECTION':
      return { ...state, selectedTiles: {} }

    case 'SET_SELECTION':
      return { ...state, selectedTiles: { ...state.selectedTiles, [action.playerIdx]: action.tiles } }

    case 'EXECUTE_PASS': {
      const step = PASS_STEPS[state.passStepIndex]
      if (!step) return state

      const hands = state.players.map(p => p.hand)

      // Auto-select tiles for virtual players (1, 2, 3) using pass advisor
      const allSelectedTiles = { ...state.selectedTiles }
      for (let i = 1; i <= 3; i++) {
        const { suggestedPass } = suggestPass(hands[i])
        allSelectedTiles[i] = suggestedPass.length === 3
          ? suggestedPass
          : hands[i].filter(t => !t.isJoker).slice(0, 3)
      }

      const newHands = executePass(hands, allSelectedTiles, step.direction)
      const newPlayers = state.players.map((p, i) => ({ ...p, hand: newHands[i] }))

      // Track which tiles player 0 (South) receives this pass
      const SENDER_FOR_SOUTH = { LEFT: 3, RIGHT: 1, ACROSS: 2 }
      const senderIdx = SENDER_FOR_SOUTH[step.direction]
      const receivedTiles = allSelectedTiles[senderIdx] || []

      const historyEntry = {
        step,
        stepIndex: state.passStepIndex,
        selectedTiles: { ...state.selectedTiles },
        receivedTiles,
      }

      let nextIndex = state.passStepIndex + 1

      // Skip 2nd Charleston if stopped
      if (state.secondCharlestonStopped) {
        while (nextIndex < PASS_STEPS.length && PASS_STEPS[nextIndex].charleston === 2) {
          nextIndex++
        }
      }

      // Skip courtesy if disabled
      if (!state.courtesyEnabled && nextIndex < PASS_STEPS.length && PASS_STEPS[nextIndex].charleston === 3) {
        nextIndex++
      }

      const gamePhase = nextIndex >= PASS_STEPS.length ? 'DONE' : 'CHARLESTON'

      return {
        ...state,
        players: newPlayers,
        passStepIndex: nextIndex,
        selectedTiles: {},
        passHistory: [...state.passHistory, historyEntry],
        gamePhase,
      }
    }

    case 'STOP_SECOND_CHARLESTON': {
      // Advance past all 2nd Charleston steps immediately so the game doesn't
      // get stuck showing C2R as the current step after stopping
      let nextIndex = state.passStepIndex
      while (nextIndex < PASS_STEPS.length && PASS_STEPS[nextIndex].charleston === 2) {
        nextIndex++
      }
      // Also skip courtesy if disabled
      if (!state.courtesyEnabled && nextIndex < PASS_STEPS.length && PASS_STEPS[nextIndex].charleston === 3) {
        nextIndex++
      }
      const gamePhase = nextIndex >= PASS_STEPS.length ? 'DONE' : 'CHARLESTON'
      return { ...state, secondCharlestonStopped: true, passStepIndex: nextIndex, gamePhase }
    }

    case 'TOGGLE_COURTESY':
      return { ...state, courtesyEnabled: !state.courtesyEnabled }

    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, initGame)

  // Derived: analysis for focused player
  const focusedHand = state.players[state.focusedPlayer]?.hand ?? []
  const handScores = scoreHand(focusedHand)
  const passAdvice = state.gamePhase === 'CHARLESTON'
    ? suggestPass(focusedHand)
    : null
  const currentStep = PASS_STEPS[state.passStepIndex] ?? null

  const value = {
    ...state,
    dispatch,
    handScores,
    passAdvice,
    currentStep,
    PASS_STEPS,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
