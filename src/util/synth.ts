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
      type: "fatsine1",
    },
    envelope: {
      attack: 0.001,
      decay: 0.05,
      sustain: 0.123,
      release: 0.1,
    },
    volume: -5,
  }).toDestination();

  bitCrusher = new Tone.BitCrusher(2).set({ // Increased bit depth from 4 to 8
    wet: 0.2
  });

  reverb = new Tone.Reverb({
    decay: 0.1,
    wet: 0.001
  }).toDestination();

  delay = new Tone.FeedbackDelay({
    delayTime: "2n",
    feedback: 0,
    wet: 0.01
  });

  synth.chain(bitCrusher, delay, reverb);
 
}

export { synth };
