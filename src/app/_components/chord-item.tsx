import { playChord } from "@/util/chords/functions"
import { setupSynth } from "@/util/synth"
import { useState } from "react"

type ChordItemProps = {
    chord: ChordName
    pickedChord: ChordName
}

export default function ChordItem (props: ChordItemProps){
    const {chord, pickedChord} = props
    const [isInitialized, setIsInitialized] = useState(false)

    async function handleClickedChordItem(){
        if (!isInitialized) {
            await setupSynth()
            setIsInitialized(true)
        }
        await playChord(chord ?? pickedChord)
    }

    return <button 
        className={`w-full p-2 h-full text-center flex justify-center items-center transition-all duration-500 flex-1 bg-gradient-to-br from-amber-400 to-amber-300 hover:to-amber-500`}
        onClick={handleClickedChordItem}
    >
        {chord ?? pickedChord ?? "pause"}
    </button>
}