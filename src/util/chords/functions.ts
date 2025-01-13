import * as Tone from 'tone';// Create singleton instances outside the function
import { chordVoicings } from '../voicings';
import { synth } from '../synth';

export async function playChord(chord: ChordName, timing?: ChordTiming) {
  const voicing = chordVoicings[chord];
  if (!voicing?.open) {
    console.warn(`No voicing found for chord: ${chord}`);
    return;
  }

  const notes = voicing.open;
  const duration = timing?.duration ?? '2n';

  // Stagger the notes slightly for a more natural sound
  const now = Tone.now();
  notes.forEach((note, idx) => {
    synth.triggerAttackRelease(note, duration, now + idx * 0.03);
  });
}

export function resolveChordSymbol(symbol: string, scale: string[], root: string): string {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const index = romanNumerals.indexOf(symbol.toUpperCase());
  if (index === -1) return root;
  return scale[index] ?? root;
}
