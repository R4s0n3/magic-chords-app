export type Genre = "jazz" | "pop" | "lofi" | "neosoul" | "dark";

export const chordProgressions = {
  jazz: {
    major: [
      ["I", "IV", "V", "I"],
      ["ii", "V", "I", "vi"],
      ["I", "vi", "ii", "V"],
    ],
    minor: [
      ["i", "iv", "V", "i"],
      ["i", "VI", "II", "V"],
    ],
  },
  pop: {
    major: [
      ["I", "IV", "V", "vi"],
      ["vi", "IV", "I", "V"],
      ["I", "V", "vi", "IV"],
    ],
    minor: [
      ["i", "VII", "VI", "V"],
      ["i", "iv", "V", "i"],
    ],
  },
  lofi: {
    major: [
      ["I", "IV", "V", "I"],
      ["I", "vi", "IV", "V"],
    ],
    minor: [
      ["i", "iv", "V", "i"],
      ["i", "VI", "IV", "V"],
    ],
  },
  neosoul: {
    major: [
      ["I", "bVII", "IV", "I"],
      ["ii", "V", "I", "VI"],
    ],
    minor: [
      ["i", "iv", "V", "i"],
      ["i", "VI", "VII", "i"],
    ],
  },
  dark: {
    major: [
      ["I", "bVI", "bVII", "I"],
      ["I", "iv", "bVI", "V"],
    ],
    minor: [
      ["i", "bVI", "iv", "V"],
      ["i", "bII", "V", "i"],
    ],
  },
} as const;
