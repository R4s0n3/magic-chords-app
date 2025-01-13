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
        className={`w-full p-2 h-full text-center flex justify-center items-center flex-1 bg-amber-400`}
        onClick={handleClickedChordItem}
    >
        {chord ?? pickedChord ?? "pause"}
    </button>
}