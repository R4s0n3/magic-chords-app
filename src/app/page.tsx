'use client'
import { useEffect, useState } from "react";

export default function Home() {
  const [pickedChord, setPickedChord] = useState<string | null>(null)
  const [chordProgression, setChordProgression] = useState<string[] | null>(null)


  const chords = [
    'C', 'D', 'E', 'F', 'G', 'A', 'B',
    'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm',
  ];
  useEffect(() => {
    if(!pickedChord)return
    const majorScales: Record<string, string[]> = {
        'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
        'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
        'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
        'F': ['F', 'Gm', 'Am', 'B♭', 'C', 'Dm', 'Edim'],
        'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
        'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
        'B': ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim']
    };

    const minorScales: Record<string, string[]> = {
        'Cm': ['Cm', 'Ddim', 'E♭', 'Fm', 'Gm', 'A♭', 'B♭'],
        'Dm': ['Dm', 'Edim', 'F', 'Gm', 'Am', 'B♭', 'C'],
        'Em': ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D'],
        'Fm': ['Fm', 'Gdim', 'A♭', 'B♭m', 'Cm', 'D♭', 'E♭'],
        'Gm': ['Gm', 'Adim', 'B♭', 'Cm', 'Dm', 'E♭', 'F'],
        'Am': ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G'],
        'Bm': ['Bm', 'C#dim', 'D', 'Em', 'F#m', 'G', 'A']
    };

    function getFlat(chord: string): string {
      const note = chord.slice(0, -1); // Remove the chord quality (e.g., 'm', 'dim')
      const quality = chord.slice(-1); // Get the chord quality
      const flats: Record<string, string> = {
          'C': 'B♭', 'D': 'C#', 'E': 'D#', 'F': 'E♭', 'G': 'F#', 'A': 'A♭', 'B': 'B♭'
      };
      return flats[note] ? flats[note] + quality : chord;
  }

    function getRandomProgression(progressions: string[][]): string[] {
      const index = Math.floor(Math.random() * progressions.length);
      return progressions[index]?.filter(chord => chord !== undefined) ?? [];
  }

    function getChordProgression() {
        let scale: string[] = [];

        if (pickedChord?.endsWith('m')) {
            scale = minorScales[pickedChord ?? ""] ?? [];
        } else {
            scale = majorScales[pickedChord ?? ""] ?? [];
        }

        if (scale.length === 0) {
            setChordProgression(scale);
            return;
        }

        function tonic(): string {
          return validateChord(scale[0]);
      }
      
      function subdominant(): string {
          return validateChord(scale[3]);
      }
      
      function dominant(): string {
          return validateChord(scale[4]);
      }
      
      function sixth(): string {
          return validateChord(scale[5]);
      }
      
      function third(): string {
          return validateChord(scale[2]);
      }
      
      function second(): string {
          return validateChord(scale[1]);
      }
      
      function validateChord(chord: string | undefined): string {
        if(chord === undefined)() => console.log("chord is undefined")
          return chord ?? pickedChord ?? "";
      }

      
      function flat(noteIndex: number): string {
          return getFlat(scale[noteIndex] ?? "");
      }

      const majorProgressions: string[][] = [
        [tonic(), subdominant(), dominant(), tonic()],       // 0: I - IV - V - I
        [tonic(), sixth(), subdominant(), dominant()],       // 1: I - vi - IV - V
        [tonic(), dominant(), sixth(), subdominant()],       // 2: I - V - vi - IV
        [tonic(), third(), sixth(), subdominant()],          // 3: I - iii - vi - IV
        [tonic(), second(), subdominant(), tonic()],         // 4: I - ii - V - I
        [tonic(), third(), subdominant(), dominant()],       // 5: I - iii - IV - V
        [tonic(), second(), subdominant(), dominant()],     // 6: I - ii - IV - V
        [tonic(), subdominant(), second(), dominant()],     // 7: I - IV - ii - V
        // Add more progressions as needed
    ];
    

    const minorProgressions: string[][] = [
      [tonic(), subdominant(), dominant(), tonic()],   // 0: i - iv - V - i
      [tonic(), flat(3), flat(6), tonic()],            // 1: i - bIII - bVI - i
      [tonic(), flat(7), flat(6), tonic()],            // 2: i - bVII - bVI - i
      [tonic(), subdominant(), flat(7), tonic()],      // 3: i - iv - bVII - i
      [tonic(), flat(6), flat(7), tonic()],            // 4: i - bVI - bVII - i
      [tonic(), flat(3), subdominant(), tonic()],      // 5: i - bIII - iv - i
      [tonic(), flat(6), flat(3), tonic()],            // 6: i - bVI - bIII - i
      // Add more progressions as needed
  ];
  

        // Choose progression based on major or minor scale
        const progression = pickedChord?.endsWith('m') ? minorProgressions : majorProgressions;
        const selectedProgression = getRandomProgression(progression);

        setChordProgression(selectedProgression);
    }

    getChordProgression();

}, [pickedChord]);


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950 text-amber-50 gap-8 p-4 py-8">
     <h1 className="text-6xl font-black uppercase text-center text-amber-400">Magic Chords</h1>
     <p className="text-xl text-center">Choose any button to create your individual chords progression.</p>
     <div className="flex justify-between w-full max-w-xl gap-6">
     <div className="w-full flex-1 p-0 md:p-4 grid grid-cols-7 gap-2">
    {chords.map((chord,_) => 
    <button 
      onClick={() => setPickedChord(chord)}
      className="p-2 border transition border-amber-600 text-amber-50 hover:bg-amber-600/20 font-bold"
      key={_} 
      id={chord}
    >
      {chord}
    </button>
    )}
     </div>
     </div>
     <div className="w-full max-w-xl">
      <div className="flex gap-6 flex-col md:flex-row ">
      <div className="flex-1 p-2 md:aspect-square border border-amber-400/20 flex justify-center items-center">
          {
          pickedChord 
          ? 
          <button onClick={() => {
            setPickedChord(null)
            setChordProgression(null)
          }} className=" drop-shadow-md border p-4 border-amber-600 w-full h-full text-amber-50 bg-amber-600/20 hover:bg-amber-600/40 font-black text-2xl">{pickedChord}</button> 
          : 
          <span className="font-light text-xl md:text-sm p-4 text-center">Your picked chord will be displayed here.</span>
          }
      </div>
      <div className="flex-[3] border border-amber-400/20 p-2">
      {
          chordProgression 
          ? 
          <div  className="flex justify-between items-center w-full h-full text-amber-50 font-bold text-2xl gap-2">{chordProgression.map((cp,key) => <span className={` w-full p-2 h-full text-center flex justify-center items-center flex-1 bg-amber-400`} key={key}>{cp === "" ? pickedChord : cp}</span>)}</div> 
          : 
          <span className="font-light text-xl p-4 text-center w-full h-full justify-center items-center flex">Chord Progression goes here...</span>
          }
      </div>
      </div>
     </div>
     <span className="text-xs w-full max-w-xl"><b className=" text-red-400">disclaimer:</b> Please be advised that this tool is not a certified hit-making machine nor does it come with a guarantee of success. We also extend our sincerest apologies for any unintentional ear-related mishaps resulting from the use of this app.</span>
    </main>
  );
}
