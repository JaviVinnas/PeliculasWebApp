import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {ChevronLeftOutline as Left, ChevronRightOutline as Right} from '@graywolfai/react-heroicons'

import {Button} from '../'

import {useMovies} from '../../hooks'
import {StaticStarRating} from "../input/StaticStarRating";

/**
 * @typedef {import('../../api/index.js').ApiPageAssessmets} ApiPageAssessmets
 * @typedef {import('../../api/index.js').ApiAssessment} ApiAssessment
 */

/**
 *
 * @param {ApiPageAssessmets} comments - la página de comentarios correspondiente
 * @param {function} setPageNum - callback para poner el número de página
 * @returns {JSX.Element|null}
 * @constructor
 */
export function CommentList({comments, setPageNum}) {

    const nextPage = evt => {
        evt?.target?.blur();
        setPageNum(p => p + 1)
    }
    const prevPage = evt => {
        evt?.target?.blur();
        setPageNum(p => p - 1 >= 0 ? p - 1 : 0)
    }

    if (comments?.content?.length === 0)
        return <div className='p-4 w-full rounded bg-gray-100 my-8'>
            <span className='text-xs font-bold uppercase'>Sin comentarios todavía</span>
        </div>
    else
        return <>
            <section className={`p-4 w-full mx-auto`}>
                <div className='w-full flex items-center gap-4'>
                    <Button className='h-80'
                            variant={'plain-secondary'}
                            disabled={!comments?.pagination?.hasPrevious}
                            onClick={prevPage}>
                        <Left className='w-6 h-6 pointer-events-none'/>
                    </Button>
                    <ul className='w-full flex-1 grid grid-cols-2 gap-2 relative items-center justify-center'>
                        {comments?.content?.map(comment => <Comment comment={comment} key={comment.id}/>)}
                    </ul>
                    <Button className='h-80'
                            variant={'plain-secondary'}
                            disabled={!comments?.pagination?.hasNext}
                            onClick={nextPage}>
                        <Right className='w-6 h-6 pointer-events-none'/>
                    </Button>
                </div>
            </section>

        </>

}

/**
 *
 * @param {ApiAssessment} comment
 * @constructor
 */
function Comment({comment}) {
    return <li className={`w-full rounded-md bg-white overflow-hidden relative shadow-lg`}
               style={{aspectRatio: '6/3'}}
    >
        <article className='p-2'>
            <div className='flex justify-between content-center'>
                <div className=' flex-1 font-bold text-gray-800'>
                    {comment?.user?.email}
                </div>
                <div className='flex-1'>
                    <StaticStarRating rating={comment.rating}/>
                </div>
            </div>
            <div>
                {comment.comment}
            </div>
        </article>
    </li>
}