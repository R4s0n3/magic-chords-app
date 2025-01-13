import * as Tone from 'tone';// Create singleton instances outside the function

let synth: Tone.PolySynth;
let bitCrusher: Tone.BitCrusher;
let reverb: Tone.Reverb;
let delay: Tone.FeedbackDelay;

export async function setupSynth() {
  // Start audio context
  await Tone.start();
  
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { 
      type: "square",
    },
    envelope: {
      attack: 0.001,
      decay: 0.05,
      sustain: 0.3,
      release: 0.1,
    },
    volume: -30,
  }).toDestination();

  bitCrusher = new Tone.BitCrusher(2).set({
    wet: 0.8
  });

  reverb = new Tone.Reverb({
    decay: 0.8,
    wet: 0.1
  }).toDestination();

  delay = new Tone.FeedbackDelay({
    delayTime: "16n",
    feedback: 0.2,
    wet: 0.1
  });

  synth.chain(bitCrusher, delay, reverb);
 
}

export { synth };
