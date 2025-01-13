export const jazzProgressions = {
    major: {
      basic: [
        ['I', 'IV', 'V', 'I'],
        ['ii', 'V', 'I'],
        ['I', 'vi', 'ii', 'V']
      ],
      extended: [
        ['Imaj7', 'ii7', 'V7', 'Imaj7'],
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