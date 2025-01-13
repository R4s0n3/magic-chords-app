import * as Tone from 'tone';// Create singleton instances outside the function
export const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { 
      type: "square",    // Classic 8-bit square wave
    },
    envelope: {
      attack: 0.001,     // Super fast attack for that instant 8-bit feel
      decay: 0.05,       // Quick decay
      sustain: 0.3,      // Lower sustain for that punchy retro feel
      release: 0.1,      // Quick release for that classic gaming sound
    },
    volume: -30,
  }).toDestination();
  
  // BitCrusher for that lo-fi digital sound
  const bitCrusher = new Tone.BitCrusher(2).set({
    wet: 0.8
  });
  // Very subtle reverb (just to prevent it from being too dry)
  const reverb = new Tone.Reverb({
    decay: 0.8,
    wet: 0.1
  }).toDestination();
  
  // Adding a simple delay for some space
  const delay = new Tone.FeedbackDelay({
    delayTime: "16n",
    feedback: 0.2,
    wet: 0.1
  });
  
  // Chain the effects
  synth.chain(bitCrusher, delay, reverb);

// export function cleanup() {
//     synth.dispose();
//     reverb.dispose();
//     bitCrusher.dispose();
//     delay.dispose();
// }