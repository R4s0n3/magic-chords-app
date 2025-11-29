import * as Tone from "tone";
import { chordVoicings } from "../voicings";

// Converts a note (e.g., "C4") to MIDI number
function toMidi(note: string): number {
  return Tone.Frequency(note).toMidi();
}

/**
 * Calculates the total movement (in semitones) between two sets of notes.
 */
function calculateDistance(notesA: string[], notesB: string[]): number {
  if (!notesA.length || !notesB.length) return 999;

  // Sort by pitch
  const sortedA = [...notesA].sort((a, b) => toMidi(a) - toMidi(b));
  const sortedB = [...notesB].sort((a, b) => toMidi(a) - toMidi(b));

  let distance = 0;
  const len = Math.min(sortedA.length, sortedB.length);
  for (let i = 0; i < len; i++) {
    const noteA = sortedA[i];
    const noteB = sortedB[i];
    if (noteA && noteB) {
      distance += Math.abs(toMidi(noteA) - toMidi(noteB));
    }
  }
  return distance;
}

/**
 * Main function to smooth a progression.
 * It takes a list of chord names and returns the literal notes for each step,
 * optimizing for minimal movement.
 */
export function voiceLeadProgression(progression: string[]): string[][] {
  const result: string[][] = [];
  let previousNotes: string[] | null = null;

  progression.forEach((chord) => {
    // Get all available voicings for this chord from our dictionary
    const voicingData = chordVoicings[chord];
    if (!voicingData) {
      result.push([]);
      return;
    }

    // Candidates: Root, First, Second, Open
    const candidates = [
      voicingData.root,
      voicingData.first,
      voicingData.second,
      voicingData.open,
    ].filter((v) => v && v.length > 0);

    if (!previousNotes) {
      // First chord: Pick 'open' or 'root' as default anchor
      const firstVoicing = voicingData.open ?? voicingData.root ?? [];
      result.push(firstVoicing);
      previousNotes = firstVoicing;
      return;
    }

    // Find candidate with smallest distance to previousNotes
    let bestCandidate: string[] = candidates[0] ?? [];
    let minDist = Infinity;

    candidates.forEach((cand) => {
      if (!cand) return;
      const dist = calculateDistance(previousNotes!, cand);
      if (dist < minDist) {
        minDist = dist;
        bestCandidate = cand;
      }
    });

    result.push(bestCandidate);
    previousNotes = bestCandidate;
  });

  return result;
}
