import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { playChord, playBass } from './chords/functions';
import type { VoicingType, PatternType } from './chords/functions';
import { setupSynth } from './synth';

export function useSequencer(
    progression: string[], 
    bpm = 120, 
    voicing: VoicingType = 'open',
    pattern: PatternType = 'strum',
    enableBass = false
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const partRef = useRef<Tone.Part | null>(null);

  useEffect(() => {
     Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
      if (partRef.current) {
          partRef.current.dispose();
          partRef.current = null;
      }

      if (progression.length === 0) return;

      const events = progression.map((chord, i) => ({
          time: `${i}:0:0`, 
          chord: chord,
          idx: i
      }));

      partRef.current = new Tone.Part((time, value) => {
          const chordName = value.chord as ChordName;
          
          void playChord(chordName, { time, duration: '1m' }, voicing, pattern);
          
          if (enableBass) {
              void playBass(chordName, { time, duration: '1m' });
          }
          
          Tone.Draw.schedule(() => {
              setCurrentStep(value.idx);
          }, time);
      }, events).start(0);

      partRef.current.loop = true;
      partRef.current.loopEnd = `${progression.length}:0:0`;

      return () => {
          partRef.current?.dispose();
      };
  }, [progression, voicing, pattern, enableBass]);

  const togglePlay = async () => {
      await setupSynth();
      await Tone.start();
      
      if (isPlaying) {
          Tone.Transport.stop();
          setCurrentStep(-1);
      } else {
          Tone.Transport.start();
      }
      setIsPlaying(!isPlaying);
  };

  const stop = () => {
      Tone.Transport.stop();
      setCurrentStep(-1);
      setIsPlaying(false);
  };

  return { isPlaying, togglePlay, stop, currentStep };
}
