import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import type { VoicingType } from "./chords/functions";
import { chordVoicings } from "./voicings";

export function downloadMidi(
  progression: string[],
  bpm: number,
  voicingType: VoicingType = "open",
) {
  const midi = new Midi();
  const track = midi.addTrack();

  track.name = "Magic Chords";
  track.instrument.name = "Piano";

  // Correct way to set tempo in some versions or just add a tempo event
  midi.header.tempos.push({ bpm: bpm, ticks: 0 });

  progression.forEach((chord, index) => {
    const voicing = chordVoicings[chord];
    const notes = voicing ? voicing[voicingType] || voicing.open : [];

    notes.forEach((noteName) => {
      const secondsPerBeat = 60 / bpm;
      const duration = secondsPerBeat * 4;
      const time = index * duration;

      try {
        track.addNote({
          midi: Tone.Frequency(noteName).toMidi(),
          time: time,
          duration: duration,
          velocity: 0.7,
        });
      } catch (e) {
        console.warn(`Could not parse note ${noteName}`, e);
      }
    });
  });

  const array = midi.toArray();
  // Cast to ArrayBuffer to satisfy TypeScript's strict Blob typing
  const blob = new Blob([array.buffer as ArrayBuffer], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `magic-chords-${bpm}bpm.mid`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
