import { SUIT } from '../data/tiles.js'

const SUIT_STYLE = {
  [SUIT.BAM]:    { border: 'border-green-400',  label: 'text-green-300'  },
  [SUIT.CRAK]:   { border: 'border-red-400',    label: 'text-red-300'    },
  [SUIT.DOT]:    { border: 'border-blue-400',   label: 'text-blue-300'   },
  [SUIT.WIND]:   { border: 'border-slate-400',  label: 'text-slate-300'  },
  [SUIT.DRAGON]: { border: 'border-amber-400',  label: 'text-amber-300'  },
  [SUIT.FLOWER]: { border: 'border-pink-400',   label: 'text-pink-300'   },
  [SUIT.JOKER]:  { border: 'border-purple-400', label: 'text-purple-300' },
}

const SUIT_LETTER = { [SUIT.BAM]: 'B', [SUIT.CRAK]: 'C', [SUIT.DOT]: 'D' }

function getLabel(tile) {
  const letter = SUIT_LETTER[tile.suit]
  return letter ? `${tile.rank}${letter}` : tile.display
}

export default function Tile({ tile, selected, onClick, onDoubleClick, faceDown = false, small = false }) {
  if (faceDown) {
    return (
      <div className={`${small ? 'w-8 h-11' : 'w-12 h-16'} rounded-lg border-2 border-slate-600 bg-slate-700 flex items-center justify-center shadow`}>
        <span className="text-slate-500 text-2xl select-none">🀫</span>
      </div>
    )
  }

  const style = SUIT_STYLE[tile.suit] || SUIT_STYLE[SUIT.WIND]
  const label = getLabel(tile)

  return (
    <div className="flex flex-col items-center gap-0.5" onDoubleClick={onDoubleClick}>
      <button
        onClick={onClick}
        className={[
          small ? 'w-8 h-11' : 'w-12 h-16',
          'rounded-lg border-2 bg-white flex items-center justify-center shadow transition-all select-none',
          selected ? 'border-yellow-400 ring-2 ring-yellow-300 -translate-y-3 shadow-lg' : style.border,
          onClick || onDoubleClick ? 'cursor-pointer hover:-translate-y-1 active:translate-y-0' : 'cursor-default',
        ].join(' ')}
      >
        <span className={`${small ? 'text-2xl' : 'text-4xl'} leading-none`} aria-hidden>{tile.glyph}</span>
      </button>
      <span className={`${small ? 'text-[8px]' : 'text-[10px]'} font-bold leading-none ${style.label}`}>
        {label}
      </span>
    </div>
  )
}
