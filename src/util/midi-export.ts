import { Midi } from "@tonejs/midi";
import type { VoicingType, PatternType } from "./chords/notes";
import type { DrumBeat } from "./drum-patterns";
import {
  renderChordEvents,
  renderBassEvents,
  renderDrumEvents,
  renderMelodyEvents,
} from "./composition";
import type { NoteEvent, RecordedNote } from "./composition";

export type StemType = "full" | "chords" | "bass" | "drums" | "melody";

export type ExportOptions = {
  progression: string[];
  bpm: number;
  voicing: VoicingType;
  pattern: PatternType;
  /** Layers included in the "full" export; single stems always export. */
  includeBass: boolean;
  includeDrums: boolean;
  drumBeat: DrumBeat | null;
  /** Notes recorded in the piano roll */
  melody: RecordedNote[];
};

function addEvents(midi: Midi, name: string, events: NoteEvent[], channel?: number) {
  const track = midi.addTrack();
  track.name = name;
  if (channel !== undefined) track.channel = channel;

  events.forEach((ev) => {
    try {
      const pitch =
        ev.midi !== undefined ? { midi: ev.midi } : { name: ev.name ?? "C4" };
      track.addNote({
        ...pitch,
        time: ev.time,
        duration: ev.duration,
        velocity: ev.velocity,
      });
    } catch (e) {
      console.warn(`Could not add note`, ev, e);
    }
  });
}

function download(midi: Midi, filename: string) {
  const array = midi.toArray();
  // Cast to ArrayBuffer to satisfy TypeScript's strict Blob typing
  const blob = new Blob([array.buffer as ArrayBuffer], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Assemble the composition as a MIDI object, rendered exactly as it plays in
 * the app (pattern timing, bassline, generated drum beat). `stem` picks a
 * single instrument stem, or "full" for a multitrack file that DAWs import
 * as separate tracks.
 */
export function buildMidi(stem: StemType, opts: ExportOptions): Midi | null {
  const { progression, bpm, voicing, pattern, includeBass, includeDrums, drumBeat, melody } = opts;
  if (progression.length === 0 && melody.length === 0) return null;

  const midi = new Midi();
  midi.header.tempos.push({ bpm, ticks: 0 });
  // Required after editing tempos; without it secondsToTicks never resolves
  midi.header.update();
  midi.header.name = "Magic Chords";

  const bars = progression.length;

  if ((stem === "chords" || stem === "full") && progression.length > 0) {
    addEvents(midi, "Chords", renderChordEvents(progression, voicing, pattern, bpm));
  }

  if ((stem === "melody" || stem === "full") && melody.length > 0) {
    addEvents(midi, "Melody", renderMelodyEvents(melody, bpm));
  }

  if ((stem === "bass" || (stem === "full" && includeBass)) && progression.length > 0) {
    addEvents(midi, "Bass", renderBassEvents(progression, bpm));
  }

  if ((stem === "drums" || (stem === "full" && includeDrums)) && drumBeat && bars > 0) {
    // Channel 10 (index 9) = General MIDI percussion
    addEvents(midi, "Drums", renderDrumEvents(drumBeat, bars, bpm), 9);
  }

  return midi.tracks.length > 0 ? midi : null;
}

export function downloadMidiStems(stem: StemType, opts: ExportOptions) {
  const midi = buildMidi(stem, opts);
  if (midi) download(midi, `magic-chords-${stem}-${opts.bpm}bpm.mid`);
}
