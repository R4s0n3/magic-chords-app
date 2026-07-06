import type { Genre } from "./chords/progressions";

/**
 * Pure drum-beat generation shared by live playback (drums.ts) and MIDI
 * export (composition.ts). Keep this module free of Tone imports.
 */

export type DrumInstrument = "kick" | "snare" | "hihat" | "openhat";

/**
 * A generated drum beat: one bar of 16 steps per instrument.
 * Each step holds a velocity 0..1 (0 = no hit).
 * `swing` delays every odd 16th step for groove (0 = straight).
 */
export type DrumBeat = {
  steps: Record<DrumInstrument, number[]>;
  swing: number;
  genre: Genre;
  seed: number;
};

export const DRUM_STEPS = 16;

// Deterministic PRNG so a beat can be regenerated identically from its seed
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type GrooveTemplate = {
  kick: number[];
  snare: number[];
  openhat: number[];
};

type GenreStyle = {
  swing: number;
  // Seed picks one of these base grooves...
  templates: GrooveTemplate[];
  // ...and one of these hat feels (velocity cycle applied per step)
  hatFeels: number[][];
  // probabilities used by the variation pass
  ghostKickProb: number;
  ghostSnareProb: number;
  hatDropProb: number;
};

// Hat feels are 4-step velocity cycles: [downbeat, e, 8th-off, a]
const STRAIGHT_8THS = [0.6, 0, 0.45, 0];
const BUSY_16THS = [0.7, 0.3, 0.5, 0.3];
const SPARSE_QUARTERS = [0.6, 0, 0, 0];
const OFFBEAT_8THS = [0, 0, 0.6, 0];

const STYLES: Record<Genre, GenreStyle> = {
  jazz: {
    swing: 0.55,
    templates: [
      {
        kick: [0.9, 0, 0, 0, 0, 0, 0, 0.4, 0, 0, 0.7, 0, 0, 0, 0, 0],
        snare: [0, 0, 0, 0, 0.7, 0, 0, 0.25, 0, 0.2, 0, 0, 0.8, 0, 0, 0],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        kick: [0.9, 0, 0, 0.35, 0, 0, 0, 0, 0, 0, 0.6, 0, 0, 0.3, 0, 0],
        snare: [0, 0, 0.2, 0, 0.7, 0, 0, 0, 0, 0.25, 0, 0, 0.8, 0, 0.2, 0],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        kick: [0.85, 0, 0, 0, 0, 0, 0.5, 0, 0.7, 0, 0, 0, 0, 0, 0.35, 0],
        snare: [0, 0, 0, 0.25, 0.75, 0, 0, 0, 0, 0, 0.2, 0, 0.8, 0, 0, 0.25],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    hatFeels: [STRAIGHT_8THS, SPARSE_QUARTERS, OFFBEAT_8THS],
    ghostKickProb: 0.4,
    ghostSnareProb: 0.5,
    hatDropProb: 0.1,
  },
  neosoul: {
    swing: 0.35,
    templates: [
      {
        kick: [0.95, 0, 0, 0, 0, 0, 0, 0.6, 0, 0, 0.8, 0, 0, 0.3, 0, 0],
        snare: [0, 0, 0, 0, 0.9, 0, 0, 0.2, 0, 0, 0, 0.15, 0.9, 0, 0, 0],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0],
      },
      {
        kick: [0.95, 0, 0, 0.4, 0, 0, 0.6, 0, 0, 0, 0.75, 0, 0, 0, 0.35, 0],
        snare: [0, 0, 0, 0, 0.9, 0, 0, 0, 0, 0.2, 0, 0, 0.9, 0, 0.2, 0],
        openhat: [0, 0, 0, 0, 0, 0, 0.35, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        kick: [0.9, 0, 0.4, 0, 0, 0, 0, 0.55, 0, 0.35, 0.75, 0, 0, 0, 0, 0],
        snare: [0, 0, 0, 0.2, 0.9, 0, 0, 0, 0, 0, 0, 0, 0.9, 0, 0, 0.25],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0],
      },
    ],
    hatFeels: [BUSY_16THS, STRAIGHT_8THS],
    ghostKickProb: 0.5,
    ghostSnareProb: 0.4,
    hatDropProb: 0.15,
  },
  lofi: {
    swing: 0.45,
    templates: [
      {
        kick: [0.9, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0.85, 0, 0, 0, 0, 0],
        snare: [0, 0, 0, 0, 0.8, 0, 0, 0, 0, 0, 0, 0, 0.8, 0, 0, 0.2],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        kick: [0.9, 0, 0, 0.35, 0, 0, 0, 0, 0.6, 0, 0.8, 0, 0, 0, 0, 0],
        snare: [0, 0, 0, 0, 0.8, 0, 0, 0.15, 0, 0, 0, 0, 0.8, 0, 0, 0],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        kick: [0.85, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, 0.8, 0, 0, 0.35, 0, 0],
        snare: [0, 0, 0, 0, 0.8, 0, 0, 0, 0, 0.15, 0, 0, 0.8, 0, 0.15, 0],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0],
      },
    ],
    hatFeels: [STRAIGHT_8THS, BUSY_16THS, SPARSE_QUARTERS],
    ghostKickProb: 0.35,
    ghostSnareProb: 0.35,
    hatDropProb: 0.2,
  },
  pop: {
    swing: 0,
    templates: [
      {
        kick: [0.95, 0, 0, 0, 0, 0, 0.5, 0, 0.9, 0, 0.4, 0, 0, 0, 0, 0],
        snare: [0, 0, 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0, 0.9, 0, 0, 0],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0],
      },
      {
        // four on the floor
        kick: [0.95, 0, 0, 0, 0.85, 0, 0, 0, 0.9, 0, 0, 0, 0.85, 0, 0, 0],
        snare: [0, 0, 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0, 0.9, 0, 0, 0],
        openhat: [0, 0, 0.4, 0, 0, 0, 0.4, 0, 0, 0, 0.4, 0, 0, 0, 0.4, 0],
      },
      {
        kick: [0.95, 0, 0, 0.4, 0, 0, 0, 0, 0.9, 0, 0, 0.4, 0, 0, 0.5, 0],
        snare: [0, 0, 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0, 0.9, 0, 0, 0.2],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0],
      },
    ],
    hatFeels: [STRAIGHT_8THS, BUSY_16THS, OFFBEAT_8THS],
    ghostKickProb: 0.25,
    ghostSnareProb: 0.2,
    hatDropProb: 0.05,
  },
  dark: {
    swing: 0,
    templates: [
      {
        kick: [0.95, 0, 0, 0.5, 0, 0, 0.7, 0, 0, 0.4, 0, 0, 0.8, 0, 0, 0],
        snare: [0, 0, 0, 0, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0.2],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        kick: [0.95, 0, 0, 0, 0, 0.5, 0, 0.65, 0, 0, 0, 0.4, 0.8, 0, 0, 0],
        snare: [0, 0, 0, 0, 0, 0, 0, 0, 0.9, 0, 0, 0.2, 0, 0, 0.25, 0],
        openhat: [0, 0, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        kick: [0.95, 0, 0.45, 0, 0, 0, 0, 0.6, 0, 0, 0.7, 0, 0, 0.45, 0, 0],
        snare: [0, 0, 0, 0, 0.9, 0, 0, 0, 0, 0, 0, 0, 0.9, 0, 0.25, 0],
        openhat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    hatFeels: [BUSY_16THS, STRAIGHT_8THS],
    ghostKickProb: 0.45,
    ghostSnareProb: 0.3,
    hatDropProb: 0.1,
  },
};

/**
 * Generate a one-bar drum beat for a genre. Same (genre, seed) always
 * yields the same beat, so playback and MIDI export stay in sync.
 * Different seeds pick different base grooves and hat feels, so every
 * "new beat" is audibly distinct, not just re-humanized.
 */
export function generateDrumBeat(genre: Genre, seed: number): DrumBeat {
  const style = STYLES[genre];
  const rng = mulberry32(seed * 7919 + genre.length);

  // Cycle templates with the seed so consecutive "new beat" clicks are
  // guaranteed to change the base groove, not just the humanization
  const template = style.templates[Math.abs(seed) % style.templates.length]!;
  const hatFeel = style.hatFeels[Math.floor(rng() * style.hatFeels.length)]!;

  const humanize = (v: number) =>
    v <= 0 ? 0 : Math.min(1, Math.max(0.1, v + (rng() - 0.5) * 0.16));

  const kick = template.kick.map(humanize);
  const snare = template.snare.map(humanize);
  const openhat = template.openhat.map(humanize);
  const hihat = Array.from({ length: DRUM_STEPS }, (_, i) =>
    humanize(hatFeel[i % hatFeel.length]!),
  );

  // Ghost kick on a random empty offbeat step
  if (rng() < style.ghostKickProb) {
    const candidates = [];
    for (let i = 1; i < DRUM_STEPS; i += 2) {
      if (!kick[i] && !snare[i]) candidates.push(i);
    }
    const pick = candidates[Math.floor(rng() * candidates.length)];
    if (pick !== undefined) kick[pick] = 0.3 + rng() * 0.2;
  }

  // Ghost snare (quiet grace note) just before or after a main snare hit
  if (rng() < style.ghostSnareProb) {
    const mains = snare.flatMap((v, i) => (v > 0.5 ? [i] : []));
    const anchor = mains[Math.floor(rng() * mains.length)];
    if (anchor !== undefined) {
      const spot = rng() < 0.5 ? anchor - 1 : anchor + 2;
      if (spot >= 0 && spot < DRUM_STEPS && !snare[spot] && !kick[spot]) {
        snare[spot] = 0.15 + rng() * 0.15;
      }
    }
  }

  // Hat variation: drop a few steps so the top line breathes differently
  for (let i = 0; i < DRUM_STEPS; i++) {
    if (hihat[i] && rng() < style.hatDropProb) hihat[i] = 0;
  }

  return { steps: { kick, snare, hihat, openhat }, swing: style.swing, genre, seed };
}

/** Offset in seconds applied to a step for swing feel. Shared by playback and MIDI export. */
export function swingOffset(step: number, swing: number, sixteenthSeconds: number): number {
  return step % 2 === 1 ? swing * sixteenthSeconds * 0.6 : 0;
}
