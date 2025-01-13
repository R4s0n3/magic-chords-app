'use client'
import { useState } from "react";
import { chords} from "@/util/chords/statics";
import ChordItem from "./_components/chord-item";

import { useChordProgression } from "@/util/chord-hook";

export default function Home() {
  const [pickedChord, setPickedChord] = useState<string | null>(null)

  const progression = useChordProgression(pickedChord)

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
      <div className="w-full text-center mb-4">Click the buttons to make a sound!</div>
      <div className="flex gap-6 flex-col md:flex-row ">

      <div className="flex-1 p-2 md:aspect-square border border-amber-400/20 flex justify-center items-center">
          {
          pickedChord 
          ? 
          <button onClick={() => {
            setPickedChord(null)
          }} className=" drop-shadow-md border p-4 border-amber-600 w-full h-full text-amber-50 bg-amber-600/20 hover:bg-amber-600/40 font-black text-2xl">{pickedChord}</button> 
          : 
          <span className="font-light text-xl md:text-sm p-4 text-center">Your picked chord will be displayed here.</span>
          }
      </div>
      <div className="flex-[3] border border-amber-400/20 p-2">
      {
          progression 
          ? 
          <div  className="flex justify-between items-center w-full h-full text-amber-50 font-bold text-2xl gap-2">{progression.map((cp,idx) => <ChordItem key={idx} pickedChord={pickedChord as ChordName} chord={cp as ChordName} />)}</div> 
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
