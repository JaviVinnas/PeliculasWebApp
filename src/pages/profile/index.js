import {Button, Comment, Separator, Shell, TODO} from '../../components'
import {useComments, useMovie, useUser} from "../../hooks";
import {
    LocationMarkerOutline as LocationIcon,
    CalendarOutline as CalendarIcon,
    PlusOutline as PlusIcon,
} from '@graywolfai/react-heroicons'
import {useState} from "react";
import {StaticStarRating} from "../../components/input/StaticStarRating";

export default function Profile() {

    //obtenemos el usuario con id determinado
    const {user, create, update} = useUser();

    return <Shell className='p-4'>
        <img style={{height: '30rem'}}
             src={user?.picture ?? 'https://www.gravatar.com/avatar/?d=mp'}
             alt={`${user?.name} imagen`}
             className='absolute top-2 left-0 right-0 w-full object-cover filter blur transform scale-105'/>
        <UserHeader user={user}/>
        <h2 className = 'mt-4 font-bold text-2xl'>Últimos comentarios</h2>
        <Separator />
        <UserComments user={user}/>
    </Shell>
}

/**
 *
 * @param {ApiUser} user
 * @returns {JSX.Element}
 * @constructor
 */
function UserHeader({user}) {
    return <header className='mt-96 mb-8 mx-20 relative flex items-end pb-8 '>
        <img style={{aspectRatio: '1'}}
             src={user?.picture ?? 'https://www.gravatar.com/avatar/?d=mp'}
             alt={`${user?.name} imagen`}
             className='w-64 rounded-full shadow-xl z-40'/>
        <hgroup className='relative w-full -left-4 z-0'>
            <h1 className={`bg-black bg-opacity-50 backdrop-filter backdrop-blur text-right text-white text-6xl font-bold p-8`}>
                {user?.name ?? 'Sin nombre'}
            </h1>
            <div className='flex justify-items-center'>
                <div
                    className={`text-center justify-self-center flex items-center text-3xl font-semibold text-black italic w-full px-8 py-4`}>
                    <CalendarIcon className='w-8 h-8'/> <span className='ml-4'>{
                    (user?.birthday?.day ?? 'nada') + '/' +
                    (user?.birthday?.month ?? 'nada') + '/' +
                    (user?.birthday?.year ?? 'nada')
                }</span>
                </div>
                <div
                    className={`text-center justify-self-center flex items-center text-3xl font-semibold text-black italic w-full px-8 py-4`}>
                    <LocationIcon className='w-8 h-8'/> <span className='ml-4'>{user?.country ?? 'Sin ubicación'}</span>
                </div>
                <div
                    className={`text-right justify-self-center text-3xl font-semibold text-black italic w-full px-8 py-4`}>
                    {user?.email ?? 'Sin email'}
                </div>
            </div>
        </hgroup>
    </header>
}

/**
 *
 * @param {ApiUser} user
 * @returns {JSX.Element}
 * @constructor
 */
function UserComments({user}) {
    const [pageSize, setPageSize] = useState(5)
    const {comments, createComment} = useComments({filter: {user: user?.email}, pagination: {page: 0, size: pageSize}})

    const loadMoreComments = (evt) => {
        evt?.target?.blur()
        setPageSize(s => s+1)
    }

    if(comments?.content?.length === 0){
        return <div className='p-6 w-full rounded bg-gray-100 my-8'>
            <span className='text-s font-bold uppercase'>Sin comentarios todavía</span>
        </div>
    }else {
        return <section className='flex flex-col'>
                <ul className='w-full flex-1 grid flex flex-col gap-4 relative items-center '>
                    {comments?.content?.map(comment => <UserComment comment={comment} key={comment.id}/>)}
                </ul>
                <Button className='mt-5 h-20 rounded-full flex-none'
                        variant={'plain-secondary'}
                        disabled={!comments?.pagination?.hasNext}
                        onClick={loadMoreComments}
                >
                    <PlusIcon className='p-2 w-12 h-12 pointer-events-none'/>
                </Button>
            </section>

    }
}

/**
 *
 * @param {ApiAssessment} comment
 * @returns {JSX.Element}
 * @constructor
 */
function UserComment({comment}) {

    const {movie,update} = useMovie(comment.movie.id)

    return <li className={`w-full rounded-md bg-white overflow-hidden relative shadow-lg`}
               style={{aspectRatio: '5'}}
    >
        <article className='p-10 '>
            <div className='flex justify-between'>
                <div className=' flex-1 font-bold text-gray-800 '>
                    {movie?.title}
                </div>
                <div className='justify-self-end'>
                    <StaticStarRating rating={comment.rating}/>
                </div>
            </div>
            <div className='m-6'>
                {comment.comment}
            </div>
        </article>
    </li>
}


