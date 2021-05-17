import {FilmOutline as StarIcon} from '@graywolfai/react-heroicons'
import {useState} from "react";

export function StarRating({rating = 0 || null, setRating = (() => {}) || null} = {rating: 0, setRating: null}) {

    const [selection, setSelection] = useState(0); //la selección cuando pasas el ratón encima

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
            className='flex'
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

const Star = ({size = 'w-8 h-8 p-1.5 mr-2', marked = false, starId = 0} = {size: 'w-8 h-8', marked: false, starId: 0}) => {
    return (
        <StarIcon starId={starId}
                  className={`transform rounded-full rotate-6 text-white ${size} ${marked ? 'bg-red-500' : 'bg-gray-500'}`}/>
    )
}
