import * as Tone from "tone";
import { DRUM_STEPS, swingOffset } from "./drum-patterns";
import type { DrumBeat } from "./drum-patterns";

// Re-export the pure generation API so UI code can import everything from here
export { generateDrumBeat, swingOffset } from "./drum-patterns";
export type { DrumBeat, DrumInstrument } from "./drum-patterns";

// ---- Live playback synths ----

let kickSynth: Tone.MembraneSynth | null = null;
let snareSynth: Tone.NoiseSynth | null = null;
let hihatSynth: Tone.NoiseSynth | null = null;
let openhatSynth: Tone.NoiseSynth | null = null;
let drumBus: Tone.Volume | null = null;

let drumsVolumeDb = 0;

// Works before setup too: the value is stored and applied when the bus is created
export function setDrumsVolume(db: number) {
  drumsVolumeDb = db;
  if (drumBus) drumBus.volume.value = db;
}

export async function setupDrums() {
  if (kickSynth) return;

  await Tone.start();

  // Master bus for the whole kit so the mixer can control drums with one fader
  drumBus = new Tone.Volume(drumsVolumeDb).toDestination();

  kickSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 6,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.4 },
    volume: -2,
  }).connect(drumBus);

  const snareFilter = new Tone.Filter(1800, "bandpass").connect(drumBus);
  snareSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
    volume: -6,
  }).connect(snareFilter);

  const hatFilter = new Tone.Filter(8000, "highpass").connect(drumBus);
  hihatSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
    volume: -14,
  }).connect(hatFilter);

  const openhatFilter = new Tone.Filter(7000, "highpass").connect(drumBus);
  openhatSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.3, sustain: 0 },
    volume: -16,
  }).connect(openhatFilter);
}

/** Schedule one bar of the beat starting at `time` (Transport seconds). */
export function playDrumBar(beat: DrumBeat, time: number) {
  if (!kickSynth || !snareSynth || !hihatSynth || !openhatSynth) return;

  const sixteenth = Tone.Time("16n").toSeconds();

  for (let i = 0; i < DRUM_STEPS; i++) {
    const t = time + i * sixteenth + swingOffset(i, beat.swing, sixteenth);

    const kickVel = beat.steps.kick[i];
    if (kickVel) kickSynth.triggerAttackRelease("C1", "8n", t, kickVel);

    const snareVel = beat.steps.snare[i];
    if (snareVel) snareSynth.triggerAttackRelease("16n", t, snareVel);

    const hatVel = beat.steps.hihat[i];
    if (hatVel) hihatSynth.triggerAttackRelease("32n", t, hatVel);

    const openVel = beat.steps.openhat[i];
    if (openVel) openhatSynth.triggerAttackRelease("8n", t, openVel);
  }
}
