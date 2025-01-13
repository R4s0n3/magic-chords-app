

export const chordVoicings: Record<string, ChordVoicing> = {
    // Major chords
    C: {
      root: ['C3', 'E3', 'G3'],
      first: ['E3', 'G3', 'C4'],
      second: ['G3', 'C4', 'E4'],
      open: ['C3', 'G3', 'E4', 'C5'],
      extended: ['C3', 'E3', 'G3', 'B3', 'D4']
    },
    D: {
      root: ['D3', 'F#3', 'A3'],
      first: ['F#3', 'A3', 'D4'],
      second: ['A3', 'D4', 'F#4'],
      open: ['D3', 'A3', 'F#4', 'D5'],
      extended: ['D3', 'F#3', 'A3', 'C#4', 'E4']
    },
    E: {
      root: ['E3', 'G#3', 'B3'],
      first: ['G#3', 'B3', 'E4'],
      second: ['B3', 'E4', 'G#4'],
      open: ['E3', 'B3', 'G#4', 'E5'],
      extended: ['E3', 'G#3', 'B3', 'D#4', 'F#4']
    },
    F: {
      root: ['F3', 'A3', 'C4'],
      first: ['A3', 'C4', 'F4'],
      second: ['C4', 'F4', 'A4'],
      open: ['F3', 'C4', 'A4', 'F5'],
      extended: ['F3', 'A3', 'C4', 'E4', 'G4']
    },
    G: {
      root: ['G2', 'B2', 'D3'],
      first: ['B2', 'D3', 'G3'],
      second: ['D3', 'G3', 'B3'],
      open: ['G2', 'D3', 'B3', 'G4'],
      extended: ['G2', 'B2', 'D3', 'F#3', 'A3']
    },
    A: {
      root: ['A2', 'C#3', 'E3'],
      first: ['C#3', 'E3', 'A3'],
      second: ['E3', 'A3', 'C#4'],
      open: ['A2', 'E3', 'C#4', 'A4'],
      extended: ['A2', 'C#3', 'E3', 'G#3', 'B3']
    },
    B: {
      root: ['B2', 'D#3', 'F#3'],
      first: ['D#3', 'F#3', 'B3'],
      second: ['F#3', 'B3', 'D#4'],
      open: ['B2', 'F#3', 'D#4', 'B4'],
      extended: ['B2', 'D#3', 'F#3', 'A#3', 'C#4']
    },
     // Major chords (Sharp/Flat)
  'C#': {
    root: ['C#3', 'F3', 'G#3'],
    first: ['F3', 'G#3', 'C#4'],
    second: ['G#3', 'C#4', 'F4'],
    open: ['C#3', 'G#3', 'F4', 'C#5'],
    extended: ['C#3', 'F3', 'G#3', 'C3', 'D#4']
  },
  'Db': {
    root: ['Db3', 'F3', 'Ab3'],
    first: ['F3', 'Ab3', 'Db4'],
    second: ['Ab3', 'Db4', 'F4'],
    open: ['Db3', 'Ab3', 'F4', 'Db5'],
    extended: ['Db3', 'F3', 'Ab3', 'C4', 'Eb4']
  },
  'D#': {
    root: ['D#3', 'G3', 'A#3'],
    first: ['G3', 'A#3', 'D#4'],
    second: ['A#3', 'D#4', 'G4'],
    open: ['D#3', 'A#3', 'G4', 'D#5'],
    extended: ['D#3', 'G3', 'A#3', 'D3', 'F4']
  },
  'Eb': {
    root: ['Eb3', 'G3', 'Bb3'],
    first: ['G3', 'Bb3', 'Eb4'],
    second: ['Bb3', 'Eb4', 'G4'],
    open: ['Eb3', 'Bb3', 'G4', 'Eb5'],
    extended: ['Eb3', 'G3', 'Bb3', 'D4', 'F4']
  },
  'F#': {
    root: ['F#3', 'A#3', 'C#4'],
    first: ['A#3', 'C#4', 'F#4'],
    second: ['C#4', 'F#4', 'A#4'],
    open: ['F#3', 'C#4', 'A#4', 'F#5'],
    extended: ['F#3', 'A#3', 'C#4', 'F3', 'G#4']
  },
  'Gb': {
    root: ['Gb3', 'Bb3', 'Db4'],
    first: ['Bb3', 'Db4', 'Gb4'],
    second: ['Db4', 'Gb4', 'Bb4'],
    open: ['Gb3', 'Db4', 'Bb4', 'Gb5'],
    extended: ['Gb3', 'Bb3', 'Db4', 'F4', 'Ab4']
  },
  'G#': {
    root: ['G#2', 'C3', 'D#3'],
    first: ['C3', 'D#3', 'G#3'],
    second: ['D#3', 'G#3', 'C4'],
    open: ['G#2', 'D#3', 'C4', 'G#4'],
    extended: ['G#2', 'C3', 'D#3', 'G3', 'A#3']
  },
  'Ab': {
    root: ['Ab2', 'C3', 'Eb3'],
    first: ['C3', 'Eb3', 'Ab3'],
    second: ['Eb3', 'Ab3', 'C4'],
    open: ['Ab2', 'Eb3', 'C4', 'Ab4'],
    extended: ['Ab2', 'C3', 'Eb3', 'G3', 'Bb3']
  },
  'A#': {
    root: ['A#2', 'D3', 'F3'],
    first: ['D3', 'F3', 'A#3'],
    second: ['F3', 'A#3', 'D4'],
    open: ['A#2', 'F3', 'D4', 'A#4'],
    extended: ['A#2', 'D3', 'F3', 'A3', 'C4']
  },
  'Bb': {
    root: ['Bb2', 'D3', 'F3'],
    first: ['D3', 'F3', 'Bb3'],
    second: ['F3', 'Bb3', 'D4'],
    open: ['Bb2', 'F3', 'D4', 'Bb4'],
    extended: ['Bb2', 'D3', 'F3', 'A3', 'C4']
  },
    // Minor chords
    Cm: {
      root: ['C3', 'Eb3', 'G3'],
      first: ['Eb3', 'G3', 'C4'],
      second: ['G3', 'C4', 'Eb4'],
      open: ['C3', 'G3', 'Eb4', 'C5'],
      extended: ['C3', 'Eb3', 'G3', 'Bb3', 'D4']
    },
    Dm: {
      root: ['D3', 'F3', 'A3'],
      first: ['F3', 'A3', 'D4'],
      second: ['A3', 'D4', 'F4'],
      open: ['D3', 'A3', 'F4', 'D5'],
      extended: ['D3', 'F3', 'A3', 'C4', 'E4']
    },
    Em: {
      root: ['E3', 'G3', 'B3'],
      first: ['G3', 'B3', 'E4'],
      second: ['B3', 'E4', 'G4'],
      open: ['E3', 'B3', 'G4', 'E5'],
      extended: ['E3', 'G3', 'B3', 'D4', 'F#4']
    },
    Fm: {
      root: ['F3', 'Ab3', 'C4'],
      first: ['Ab3', 'C4', 'F4'],
      second: ['C4', 'F4', 'Ab4'],
      open: ['F3', 'C4', 'Ab4', 'F5'],
      extended: ['F3', 'Ab3', 'C4', 'Eb4', 'G4']
    },
    Gm: {
      root: ['G2', 'Bb2', 'D3'],
      first: ['Bb2', 'D3', 'G3'],
      second: ['D3', 'G3', 'Bb3'],
      open: ['G2', 'D3', 'Bb3', 'G4'],
      extended: ['G2', 'Bb2', 'D3', 'F3', 'A3']
    },
    Am: {
      root: ['A2', 'C3', 'E3'],
      first: ['C3', 'E3', 'A3'],
      second: ['E3', 'A3', 'C4'],
      open: ['A2', 'E3', 'C4', 'A4'],
      extended: ['A2', 'C3', 'E3', 'G3', 'B3']
    },
    Bm: {
      root: ['B2', 'D3', 'F#3'],
      first: ['D3', 'F#3', 'B3'],
      second: ['F#3', 'B3', 'D4'],
      open: ['B2', 'F#3', 'D4', 'B4'],
      extended: ['B2', 'D3', 'F#3', 'A3', 'C#4']
    },
    // Minor chords (Sharp/Flat)
  'C#m': {
    root: ['C#3', 'E3', 'G#3'],
    first: ['E3', 'G#3', 'C#4'],
    second: ['G#3', 'C#4', 'E4'],
    open: ['C#3', 'G#3', 'E4', 'C#5'],
    extended: ['C#3', 'E3', 'G#3', 'B3', 'D#4']
  },
  'Dbm': {
    root: ['Db3', 'E3', 'Ab3'],
    first: ['E3', 'Ab3', 'Db4'],
    second: ['Ab3', 'Db4', 'E4'],
    open: ['Db3', 'Ab3', 'E4', 'Db5'],
    extended: ['Db3', 'E3', 'Ab3', 'B3', 'Eb4']
  },
  'D#m': {
    root: ['D#3', 'F#3', 'A#3'],
    first: ['F#3', 'A#3', 'D#4'],
    second: ['A#3', 'D#4', 'F#4'],
    open: ['D#3', 'A#3', 'F#4', 'D#5'],
    extended: ['D#3', 'F#3', 'A#3', 'C#4', 'E#4']
  },
  'Ebm': {
    root: ['Eb3', 'Gb3', 'Bb3'],
    first: ['Gb3', 'Bb3', 'Eb4'],
    second: ['Bb3', 'Eb4', 'Gb4'],
    open: ['Eb3', 'Bb3', 'Gb4', 'Eb5'],
    extended: ['Eb3', 'Gb3', 'Bb3', 'Db4', 'F4']
  },
  'F#m': {
    root: ['F#3', 'A3', 'C#4'],
    first: ['A3', 'C#4', 'F#4'],
    second: ['C#4', 'F#4', 'A4'],
    open: ['F#3', 'C#4', 'A4', 'F#5'],
    extended: ['F#3', 'A3', 'C#4', 'E4', 'G#4']
  },
  'Gbm': {
    root: ['Gb3', 'A3', 'Db4'],
    first: ['A3', 'Db4', 'Gb4'],
    second: ['Db4', 'Gb4', 'A4'],
    open: ['Gb3', 'Db4', 'A4', 'Gb5'],
    extended: ['Gb3', 'A3', 'Db4', 'E4', 'Ab4']
  },
  'G#m': {
    root: ['G#2', 'B2', 'D#3'],
    first: ['B2', 'D#3', 'G#3'],
    second: ['D#3', 'G#3', 'B3'],
    open: ['G#2', 'D#3', 'B3', 'G#4'],
    extended: ['G#2', 'B2', 'D#3', 'F#3', 'A#3']
  },
  'Abm': {
    root: ['Ab2', 'B2', 'Eb3'],
    first: ['B2', 'Eb3', 'Ab3'],
    second: ['Eb3', 'Ab3', 'B3'],
    open: ['Ab2', 'Eb3', 'B3', 'Ab4'],
    extended: ['Ab2', 'B2', 'Eb3', 'Gb3', 'Bb3']
  },
  'A#m': {
    root: ['A#2', 'C#3', 'F3'],
    first: ['C#3', 'F3', 'A#3'],
    second: ['F3', 'A#3', 'C#4'],
    open: ['A#2', 'F3', 'C#4', 'A#4'],
    extended: ['A#2', 'C#3', 'F3', 'G#3', 'B3']
  },
  'Bbm': {
    root: ['Bb2', 'Db3', 'F3'],
    first: ['Db3', 'F3', 'Bb3'],
    second: ['F3', 'Bb3', 'Db4'],
    open: ['Bb2', 'F3', 'Db4', 'Bb4'],
    extended: ['Bb2', 'Db3', 'F3', 'Ab3', 'C4']
  }

  };

export const jazzProgressions = {
    major: {
      basic: [
        ['I', 'IV', 'V', 'I'],      // Make sure these are arrays
        ['ii', 'V', 'I'],
        ['I', 'vi', 'ii', 'V']
      ],
      extended: [
        ['Imaj7', 'iv7', 'V7', 'Imaj7'],
        ['ii7', 'V7', 'Imaj7'],
        ['Imaj7', 'vi7', 'ii7', 'V7']
      ]
    },
    minor: {
      basic: [
        ['i', 'iv', 'V', 'i'],
        ['ii°', 'V', 'i'],
        ['i', 'VI', 'VII', 'i']
      ]
    }
  } as const;