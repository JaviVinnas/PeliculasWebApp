import {FilmOutline as StarIcon} from '@graywolfai/react-heroicons'
import {useState} from "react";

export function StarRating({value = 0 || null} = {value: 0}) {

    const [rating, setRating] = useState(parseInt(value) || 0) //la valoración actual
    const [selection, setSelection] = useState(0); //la selección

    const hoveOver = event => {
        let val = 0
        if (event && event.target && event.target.getAttribute('starId')) {
            val = event.target.getAttribute('starId')
        }
        setSelection(val)
    }

    return (
        <div
            onMouseOut={() => hoveOver(null)}
            onClick={event => setRating(event.target.getAttribute('starId') || rating)}
            onMouseOver={hoveOver}
        >
            {Array.from({length: 10}, (v, i) => (
                <Star
                    starId={i + 1}
                    key={`star_${i + 1}`}
                    marked={selection ? selection >= i + 1 : rating >= i + 1}
                />
            ))}

        </div>
    )

}

const Star = ({size = 'w-8 h-8', marked = false, starId = 0} = {size: 'w-8 h-8', marked: false, starId: 0}) => {
    return (
        <StarIcon starId={starId}
                  className={`transform rotate-6 mr-4 ${size} ${marked ? 'text-red-500' : 'text-gray-500'}`}/>

    )
}