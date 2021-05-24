/**
 * @typedef {import('../../api/index.js').ApiPageFriendships} ApiPageFriendships
 * @typedef {import('../../api/index.js').ApiFriendship} ApiFriendship
 * @typedef {import('../../api/index.js').ApiUser} ApiUser
 */

import {Link, Separator, Shell} from '../../components'
import {useFriendships, useUser} from "../../hooks";
import {
    ArrowCircleLeftOutline as Back,
    CalendarOutline as CalendarIcon, LocationMarkerOutline as LocationIcon,
    PencilAltOutline as Edit,
    CheckCircleOutline as CheckIcon
} from "@graywolfai/react-heroicons";

const defaultAvatarImageURL = 'https://www.gravatar.com/avatar/?d=mp'

export default function Friends() {

    //obtenemos el usuario con id determinado
    const {user, create, update} = useUser();

    const {friendships, acceptFriendship} = useFriendships(user.email)

    return <Shell className='p-4'>


        <img style={{height: '30rem'}}
             src={user?.picture ?? defaultAvatarImageURL}
             alt={`${user?.name} imagen`}
             className='absolute top-2 left-0 right-0 w-full object-cover filter blur transform scale-105'/>


        <Link variant='primary'
              className='rounded-full absolute text-white top-4 left-8 flex items-center pl-2 pr-4 py-2 gap-4'
              to='/'
        >
            <Back className='w-8 h-8'/>
            <span>Volver</span>
        </Link>

        <Link variant='primary'
              className='rounded-full absolute text-white top-4 right-8 flex items-center px-2 py-2 gap-4'
              to={`/profile/edit`}
        >
            <Edit className='w-8 h-8'/>
        </Link>
        <UserHeader user={user}/>
        <SectionTitle title='Solicitudes de amistad'/>
        <PendingFriendShips friendships={friendships} acceptFriendship={acceptFriendship} user={user}/>
        <SectionTitle title='Amigos'/>
        <EffectiveFriendships friendships={friendships} user={user}/>
    </Shell>
}

function SectionTitle({title = 'Sin sección de título'}) {
    return <> <h2 className='mt-4 font-bold text-2xl'>{title}</h2>
        <Separator/>
    </>

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
             src={user?.picture ?? defaultAvatarImageURL}
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
 * @param {ApiPageFriendships} friendships - página con las amistades
 * @param {function(friendshipId:string): ApiFriendship} - callback de actualización de amistades
 * @param {ApiUser} user - usuario principal
 * @constructor
 */
function PendingFriendShips({friendships, acceptFriendship, user}) {

    const pendingFriendships = friendships.content
        .filter(friendship => friendship.friend === user.email && !friendship.confirmed)

    if (pendingFriendships.length === 0) {
        return <div className='p-4 w-full rounded bg-gray-300 text-black flex flex-col'>
            <span className='text-s font-bold m-2'>No hay solicitudes de amistad pendientes</span>
        </div>
    } else {
        return <section className='w-full flex-1 grid grid-cols-5 gap-2 relative items-center justify-center'>
            {pendingFriendships.map(friendship => <PendingFriendship friendship={friendship}
                                                                     acceptFriendship={acceptFriendship}
                                                                     key={friendship.id}/>)}
        </section>
    }


}

/**
 *
 * @param {ApiFriendship} friendship
 * @param {function(friendshipId:string): ApiFriendship} - callback de actualización de amistades
 * @constructor
 */
function PendingFriendship({friendship, acceptFriendship}) {
    return <article className='w-full rounded-md bg-white rounded-md shadow flex flex-col content-center'>
        <div className='flex-1 m-4 text-center font-bold'>{friendship.user}</div>
        <CheckIcon className='flex-auto m-4 p-1 h-12 w-12 place-self-center hover:cursor-pointer'
                   onClick={() => acceptFriendship(friendship.id)}/>
    </article>
}

/**
 *
 * @param {ApiPageFriendships} friendships
 * @param {ApiUser} user
 * @constructor
 */
function EffectiveFriendships({friendships, user}) {
    //amistades confirmadas
    const confirmedFriendships = friendships.content.filter(friendship => friendship.confirmed)
    if (confirmedFriendships.length === 0) {
        return <div className='p-4 w-full rounded bg-gray-300 text-black flex flex-col'>
            <span className='text-s font-bold m-2'>Todavía no tienes ningún amigo</span>
        </div>
    } else {
        return <section className='w-full flex-1 grid grid-cols-5 gap-2 relative items-center justify-center'>
            {confirmedFriendships.map(friendship => <EffectiveFriendship friendship={friendship} localUser={user} key={friendship.id}/>)}
        </section>
    }
}

/**
 *
 * @param {ApiFriendship} friendship
 * @param {ApiUser} localUser
 * @constructor
 */
function EffectiveFriendship({friendship, localUser}) {
    return <article className='w-full rounded-md bg-white rounded-md shadow flex flex-col content-center'>
        <div className={'flex-1 m-4 text-center font-bold'}>{friendship.user === localUser.email ? friendship.friend : friendship.user}</div>
        <div className={'flex-1 m-4 text-center'}>{`Sois amigos desde ${friendship.since.day}/${friendship.since.month}/${friendship.since.year}`}</div>
    </article>
}