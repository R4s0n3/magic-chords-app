import { useEffect, useState } from "react";
import { jazzProgressions } from "./voicings";
import { minorScales, majorScales } from "./chords/statics";
import { resolveChordSymbol } from "./chords/functions";

export function useChordProgression(pickedChord: string | null) {
    const [progression, setProgression] = useState<string[]>([]);

    useEffect(() => {
      if (!pickedChord) {
        setProgression([]);
        return;
    }

      const isMinor = pickedChord.endsWith('m');
      const progressionType = isMinor ? 'minor' : 'major';
      const style = 'basic';
  
      try {
        const availableProgressions = jazzProgressions[progressionType][style];
        const randomIndex = Math.floor(Math.random() * availableProgressions.length);
        const randomProgression = availableProgressions[randomIndex];
        
        const scale = isMinor ? minorScales[pickedChord] : majorScales[pickedChord];
        if (!scale) throw new Error(`No scale found for ${pickedChord}`);
  
        const resolvedProgression = randomProgression?.map(symbol => 
          resolveChordSymbol(symbol, scale, pickedChord)
        );
  
        setProgression(resolvedProgression ?? []);
      } catch (error) {
        console.error('Error generating progression:', error);
        setProgression([]);
      }

    
    }, [pickedChord]);
  
    return progression;
}