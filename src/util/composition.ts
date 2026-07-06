import {
  getChordNotes,
  getRootFromChord,
  shiftOctave,
} from "./chords/notes";
import type { VoicingType, PatternType } from "./chords/notes";
import { swingOffset } from "./drum-patterns";
import type { DrumBeat } from "./drum-patterns";

/**
 * Pure renderers that turn the current composition into timed note events.
 * They mirror the live Tone.js scheduling in chords/functions.ts and
 * drums.ts exactly, so exported MIDI stems match what the app plays.
 */

export type NoteEvent = {
  /** Pitch name (e.g. "C4") for melodic tracks, or GM MIDI number for drums */
  name?: string;
  midi?: number;
  time: number; // seconds
  duration: number; // seconds
  velocity: number; // 0..1
};

/** A note recorded in the piano roll. Times are in beats so they survive BPM changes. */
export type RecordedNote = {
  id: string;
  midi: number;
  start: number; // beats from loop start
  duration: number; // beats
  velocity: number; // 0..1
};

export function renderMelodyEvents(
  notes: RecordedNote[],
  bpm: number,
): NoteEvent[] {
  const beat = 60 / bpm;
  return notes.map((n) => ({
    midi: n.midi,
    time: n.start * beat,
    duration: n.duration * beat,
    velocity: n.velocity,
  }));
}

export function renderChordEvents(
  progression: string[],
  voicingType: VoicingType,
  pattern: PatternType,
  bpm: number,
): NoteEvent[] {
  const beat = 60 / bpm;
  const bar = beat * 4;
  const sixteenth = beat / 4;
  const events: NoteEvent[] = [];

  progression.forEach((chord, barIdx) => {
    const notes = getChordNotes(chord, voicingType);
    if (notes.length === 0) return;

    const barStart = barIdx * bar;

    switch (pattern) {
      case "pad":
        notes.forEach((name) =>
          events.push({ name, time: barStart, duration: bar, velocity: 0.8 }),
        );
        break;

      case "arp-up":
      case "arp-down": {
        const ordered = pattern === "arp-down" ? [...notes].reverse() : notes;
        for (let i = 0; i < 16; i++) {
          const name = ordered[i % ordered.length];
          if (name)
            events.push({
              name,
              time: barStart + i * sixteenth,
              duration: sixteenth,
              velocity: 0.6,
            });
        }
        break;
      }

      case "pulse":
        for (let i = 0; i < 4; i++) {
          notes.forEach((name) =>
            events.push({
              name,
              time: barStart + i * beat,
              duration: sixteenth,
              velocity: 0.7,
            }),
          );
          if (i % 2 === 1) {
            notes.forEach((name) =>
              events.push({
                name,
                time: barStart + i * beat + beat / 2,
                duration: sixteenth / 2,
                velocity: 0.4,
              }),
            );
          }
        }
        break;

      case "melody": {
        notes.forEach((name) =>
          events.push({ name, time: barStart, duration: bar, velocity: 0.3 }),
        );

        const highNotes = notes.length >= 3 ? notes.slice(1) : notes;
        const melodyNotes = highNotes.map((n) => shiftOctave(n, 1));
        const motifTimes = [0, 0.75, 1.5, 2.25, 3.0, 3.5];
        const motifIndices = [0, 1, 2, 1, 2, 0];

        motifTimes.forEach((t, i) => {
          const noteIdx = motifIndices[i % motifIndices.length] ?? 0;
          const name = melodyNotes[noteIdx % melodyNotes.length];
          if (name)
            events.push({
              name,
              time: barStart + t * beat,
              duration: beat / 2,
              velocity: 0.8,
            });
        });
        break;
      }

      case "strum":
      default:
        notes.forEach((name, idx) =>
          events.push({
            name,
            time: barStart + idx * 0.04,
            duration: bar,
            velocity: 0.8,
          }),
        );
        break;
    }
  });

  return events;
}

export function renderBassEvents(
  progression: string[],
  bpm: number,
): NoteEvent[] {
  const beat = 60 / bpm;
  const bar = beat * 4;
  const events: NoteEvent[] = [];

  progression.forEach((chord, barIdx) => {
    const root = getRootFromChord(chord);
    if (!root) return;

    const barStart = barIdx * bar;
    events.push({ name: `${root}2`, time: barStart, duration: beat, velocity: 0.9 });
    events.push({ name: `${root}2`, time: barStart + 1.5 * beat, duration: beat / 2, velocity: 0.9 });
    events.push({ name: `${root}3`, time: barStart + 3 * beat, duration: beat / 2, velocity: 0.9 });
  });

  return events;
}

// General MIDI percussion map (channel 10)
const GM_DRUMS = { kick: 36, snare: 38, hihat: 42, openhat: 46 } as const;

export function renderDrumEvents(
  beat: DrumBeat,
  bars: number,
  bpm: number,
): NoteEvent[] {
  const beatSec = 60 / bpm;
  const bar = beatSec * 4;
  const sixteenth = beatSec / 4;
  const events: NoteEvent[] = [];

  for (let b = 0; b < bars; b++) {
    for (let i = 0; i < 16; i++) {
      const t = b * bar + i * sixteenth + swingOffset(i, beat.swing, sixteenth);

      (Object.keys(GM_DRUMS) as (keyof typeof GM_DRUMS)[]).forEach((inst) => {
        const vel = beat.steps[inst][i];
        if (vel)
          events.push({
            midi: GM_DRUMS[inst],
            time: t,
            duration: sixteenth,
            velocity: vel,
          });
      });
    }
  }

  return events;
}
