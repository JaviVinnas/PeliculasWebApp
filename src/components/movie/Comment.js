import {StaticStarRating} from "../input/StaticStarRating";


/**
 *
 * @param {ApiAssessment} comment
 * @constructor
 */
export function Comment({comment}) {
    return <li className={`w-full rounded-md bg-white overflow-hidden relative shadow-lg`}
               style={{aspectRatio: '6/3'}}
    >
        <article className='p-4'>
            <div className='flex justify-between content-center'>
                <div className=' flex-1 font-bold text-gray-800 m-2'>
                    {comment?.user?.email}
                </div>
                <div className='flex-1'>
                    <StaticStarRating rating={comment.rating}/>
                </div>
            </div>
            <div className='m-6'>
                {comment.comment}
            </div>
        </article>
    </li>
}