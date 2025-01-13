import { playChord } from "@/util/chords/functions"

type ChordItemProps = {
    chord: ChordName
    pickedChord: ChordName
}

export default function ChordItem (props: ChordItemProps){
    const {chord, pickedChord} = props
    async function handleClickedChordItem(){
        await playChord(chord ?? pickedChord)
    }
    return <button 
        className={` w-full p-2 h-full text-center flex justify-center items-center flex-1 bg-amber-400`}
        onClick={handleClickedChordItem}
        >
    {chord ?? pickedChord ?? "pause"}
    </button>

}