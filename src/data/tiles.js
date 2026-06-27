// Tile suits
export const SUIT = {
  BAM: 'BAM',
  CRAK: 'CRAK',
  DOT: 'DOT',
  WIND: 'WIND',
  DRAGON: 'DRAGON',
  FLOWER: 'FLOWER',
  JOKER: 'JOKER',
}

// Wind names
export const WIND = { N: 'N', E: 'E', W: 'W', S: 'S' }

// Dragon names
export const DRAGON = { RED: 'RED', GREEN: 'GREEN', WHITE: 'WHITE' }

// Unicode tile glyphs
const BAM_GLYPHS  = ['🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘']
const CRAK_GLYPHS = ['🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏']
const DOT_GLYPHS  = ['🀙','🀚','🀛','🀜','🀝','🀞','🀟','🀠','🀡']

function makeSuitTiles(suit, glyphs) {
  const tiles = []
  for (let rank = 1; rank <= 9; rank++) {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({
        id: `${suit}-${rank}-${copy}`,
        suit,
        rank,
        display: `${rank}`,
        glyph: glyphs[rank - 1],
        isJoker: false,
        isFlower: false,
      })
    }
  }
  return tiles
}

function makeWindTiles() {
  const tiles = []
  const winds = [
    { name: WIND.E, label: 'E', glyph: '🀀' },
    { name: WIND.S, label: 'S', glyph: '🀁' },
    { name: WIND.W, label: 'W', glyph: '🀂' },
    { name: WIND.N, label: 'N', glyph: '🀃' },
  ]
  winds.forEach(({ name, label, glyph }) => {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({
        id: `WIND-${name}-${copy}`,
        suit: SUIT.WIND,
        rank: name,
        display: label,
        glyph,
        isJoker: false,
        isFlower: false,
      })
    }
  })
  return tiles
}

function makeDragonTiles() {
  const tiles = []
  const dragons = [
    { name: DRAGON.RED,   label: 'R', glyph: '🀄', color: 'red'   },
    { name: DRAGON.GREEN, label: 'G', glyph: '🀅', color: 'green' },
    { name: DRAGON.WHITE, label: '0', glyph: '🀆', color: 'white' },
  ]
  dragons.forEach(({ name, label, glyph, color }) => {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push({
        id: `DRAGON-${name}-${copy}`,
        suit: SUIT.DRAGON,
        rank: name,
        display: label,
        glyph,
        color,
        isJoker: false,
        isFlower: false,
      })
    }
  })
  return tiles
}

function makeFlowerTiles() {
  const tiles = []
  // 4 flower types, 2 copies each = 8
  for (let rank = 1; rank <= 4; rank++) {
    for (let copy = 0; copy < 2; copy++) {
      tiles.push({
        id: `FLOWER-${rank}-${copy}`,
        suit: SUIT.FLOWER,
        rank,
        display: `F${rank}`,
        glyph: '🌸',
        isJoker: false,
        isFlower: true,
      })
    }
  }
  return tiles
}

function makeJokerTiles() {
  const tiles = []
  for (let i = 0; i < 8; i++) {
    tiles.push({
      id: `JOKER-${i}`,
      suit: SUIT.JOKER,
      rank: null,
      display: 'J',
      glyph: '🃏',
      isJoker: true,
      isFlower: false,
    })
  }
  return tiles
}

export function buildDeck() {
  return [
    ...makeSuitTiles(SUIT.BAM,  BAM_GLYPHS),
    ...makeSuitTiles(SUIT.CRAK, CRAK_GLYPHS),
    ...makeSuitTiles(SUIT.DOT,  DOT_GLYPHS),
    ...makeWindTiles(),
    ...makeDragonTiles(),
    ...makeFlowerTiles(),
    ...makeJokerTiles(),
  ]
}

// Fisher-Yates shuffle
export function shuffle(deck) {
  const arr = [...deck]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function deal(deck, playerCount = 4, tilesEach = 13) {
  const shuffled = shuffle(deck)
  const hands = Array.from({ length: playerCount }, (_, i) =>
    shuffled.slice(i * tilesEach, (i + 1) * tilesEach)
  )
  const remaining = shuffled.slice(playerCount * tilesEach)
  return { hands, remaining }
}
