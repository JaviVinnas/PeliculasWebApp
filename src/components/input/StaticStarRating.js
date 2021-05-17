import {FilmOutline as StarIcon} from '@graywolfai/react-heroicons'
import {useState} from "react";

export function StaticStarRating({rating = 0} = {rating: 0}) {

    return (
        <div className='flex'>
            {Array.from({length: 10}, (v, i) => (
                <Star
                    starId={i + 1}
                    key={`star_${i + 1}`}
                    marked={rating >= i + 1}
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