import * as Tone from "tone";

// Dedicated lead synth for live playing / recorded melody playback,
// kept separate from the chord synth so it can be mixed independently.
let melodySynth: Tone.PolySynth | null = null;
let melodyVolumeDb = -6;

export async function setupMelodySynth() {
  if (melodySynth) return;

  await Tone.start();

  melodySynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0.5, release: 0.4 },
    volume: melodyVolumeDb,
  }).toDestination();
}

// Works before setup too: the value is stored and applied on creation
export function setMelodyVolume(db: number) {
  melodyVolumeDb = db;
  if (melodySynth) melodySynth.volume.value = db;
}

const toNote = (midi: number) => Tone.Frequency(midi, "midi").toNote();

export function melodyNoteOn(midi: number, velocity = 0.8) {
  melodySynth?.triggerAttack(toNote(midi), undefined, velocity);
}

export function melodyNoteOff(midi: number) {
  melodySynth?.triggerRelease(toNote(midi));
}

export function releaseAllMelody() {
  melodySynth?.releaseAll();
}

export function playMelodyNote(
  midi: number,
  duration: number,
  time: number,
  velocity: number,
) {
  melodySynth?.triggerAttackRelease(toNote(midi), duration, time, velocity);
}
