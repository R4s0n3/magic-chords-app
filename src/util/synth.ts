import * as Tone from 'tone';

let synth: Tone.PolySynth;
let bassSynth: Tone.MonoSynth;
let bitCrusher: Tone.BitCrusher;
let reverb: Tone.Reverb;
let delay: Tone.FeedbackDelay;
let chorus: Tone.Chorus;

export type SynthParams = {
  oscillatorType: "sine" | "square" | "sawtooth" | "triangle" | "fatsine1" | "fatsawtooth";
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  volume: number;
};

export type EffectParams = {
  bitCrusher: { wet: number; bits: number };
  reverb: { wet: number; decay: number };
  delay: { wet: number; delayTime: string; feedback: number };
  chorus: { wet: number; depth: number; frequency: number };
};

// Default params
const currentSynthParams: SynthParams = {
  oscillatorType: "fatsine1",
  envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }, // Sharper attack
  volume: -8 // Lower volume to mix better with bass
};

export async function setupSynth() {
  if (synth) return; 
  
  await Tone.start();
  
  // Main Poly Synth (Chords)
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: currentSynthParams.oscillatorType },
    envelope: currentSynthParams.envelope,
    volume: currentSynthParams.volume,
  }).toDestination();

  // Bass Synth
  bassSynth = new Tone.MonoSynth({
    oscillator: { type: "fatsawtooth" },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 0.5 },
    filterEnvelope: { attack: 0.001, decay: 0.1, sustain: 0.2, release: 1, baseFrequency: 200, octaves: 2.6 },
    volume: -4
  }).toDestination();

  bitCrusher = new Tone.BitCrusher(4).set({ wet: 0 });
  reverb = new Tone.Reverb({ decay: 2, wet: 0.2 }).toDestination();
  delay = new Tone.FeedbackDelay({ delayTime: "8n.", feedback: 0.3, wet: 0.1 });
  chorus = new Tone.Chorus({ frequency: 4, delayTime: 2.5, depth: 0.5, wet: 0 }).start();

  // Chain effects to Chords only (Keep bass clean-ish)
  synth.chain(bitCrusher, chorus, delay, reverb);
  // Bass can have its own chain or just go dry/reverb. Let's send bass to reverb a bit.
  bassSynth.connect(reverb);
}

export function getSynth() { return synth; }
export function getBassSynth() { return bassSynth; }

export function updateSynth(params: Partial<SynthParams>) {
  if (!synth) return;
  
  if (params.oscillatorType) {
    synth.set({ oscillator: { type: params.oscillatorType } });
    currentSynthParams.oscillatorType = params.oscillatorType;
  }
  if (params.envelope) {
    synth.set({ envelope: params.envelope });
    currentSynthParams.envelope = { ...currentSynthParams.envelope, ...params.envelope };
  }
  if (params.volume !== undefined) {
    synth.set({ volume: params.volume });
    currentSynthParams.volume = params.volume;
  }
}

export function updateEffects(params: Partial<EffectParams>) {
  if (!bitCrusher || !reverb || !delay || !chorus) return;

  if (params.bitCrusher) bitCrusher.set(params.bitCrusher);
  if (params.reverb) reverb.set(params.reverb);
  if (params.delay) delay.set(params.delay);
  if (params.chorus) chorus.set(params.chorus);
}

// Keep exports for backward compat if needed, but getters are preferred
export { synth, bassSynth, bitCrusher, reverb, delay, chorus };
