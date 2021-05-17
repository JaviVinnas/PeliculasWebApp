import {useState} from 'react'
import {Link} from 'react-router-dom'
import {ChevronLeftOutline as Left, ChevronRightOutline as Right} from '@graywolfai/react-heroicons'

import {Button} from '../'

import {useMovies} from '../../hooks'

/**
 * @typedef {import('../../api/index.js').ApiPageAssessmets} ApiPageAssessmets
 * @typedef {import('../../api/index.js').ApiAssessment} ApiAssessment
 */

/**
 *
 * @param {ApiPageAssessmets} comments - la página de comentarios correspondiente
 * @returns {JSX.Element|null}
 * @constructor
 */
export function CommentList({comments}) {

    const [page, setPage] = useState(0)

    const nextPage = evt => {
        evt?.target?.blur();
        setPage(page => page + 1)
    }
    const prevPage = evt => {
        evt?.target?.blur();
        setPage(page => page - 1)
    }

    if (comments?.content?.length === 0)
        return <div className = 'p-4 w-full rounded bg-gray-100 my-8'>
            <span className = 'text-xs font-bold uppercase'>Sin comentarios todavía</span>
        </div>
    else
        return <section className={`p-4 w-full mx-auto`}>
            <div className='w-full flex items-center gap-4'>
                <Button className='rounded-full'
                        variant={'plain-secondary'}
                        disabled={!comments?.pagination?.hasPrevious}
                        onClick={prevPage}>
                    <Left className='w-6 h-6 pointer-events-none'/>
                </Button>
                <ul className='w-full flex-1 grid grid-cols-7 gap-2 relative items-center justify-center'>
                    {comments?.content?.map(comment => <Comment comment={comment} key={comment.id}/>)}
                </ul>
                <Button className='rounded-full'
                        variant={'plain-secondary'}
                        disabled={!comments?.pagination?.hasnext}
                        onClick={nextPage}>
                    <Right className='w-6 h-6 pointer-events-none'/>
                </Button>
            </div>
        </section>
}

/**
 *
 * @param {ApiAssessment} comment
 * @constructor
 */
function Comment({comment}) {
    return <li className={`w-full transition transform cursor-pointer rounded-md bg-white overflow-hidden relative shadow
                             hover:scale-125 hover:shadow-md hover:z-20
                           `}
               style={{aspectRatio: '2/3'}}
    >
        <article>
            <div>
                {comment.rating}
            </div>
            <div>
                {comment.comment}
            </div>
            <div>
                {comment?.user?.email}
            </div>
        </article>

    </li>
}

function Poster({className = '', movie}) {
    return <li className={`w-full transition transform cursor-pointer rounded-md bg-white overflow-hidden relative shadow
                             hover:scale-125 hover:shadow-md hover:z-20
                             ${className}`}
               style={{aspectRatio: '2/3'}}
    >
        <Link to={`/movies/${movie.id}`}>
            <img className='w-full h-full object-cover'
                 src={movie.resources.find(res => res.type === 'POSTER').url}
                 alt={`${movie.title} poster`}/>
        </Link>
    </li>
}