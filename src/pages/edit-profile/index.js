import {Button, Comment, Input, Link, Separator, Shell, TODO} from '../../components'
import {useComments, useMovie, useUser} from "../../hooks";
import {
    LocationMarkerOutline as LocationIcon,
    CalendarOutline as CalendarIcon,
    PlusOutline as PlusIcon, ArrowCircleLeftOutline as Back, PencilAltOutline as Edit, SaveOutline as Save,
} from '@graywolfai/react-heroicons'
import {useEffect, useState} from "react";
import {StaticStarRating} from "../../components/input/StaticStarRating";

const defaultAvatarImageURL = 'https://www.gravatar.com/avatar/?d=mp'

export default function EditProfile() {

    const [dummyUser, setDummyUser] = useState('')
    //obtenemos el usuario con id determinado
    const {user, create, update} = useUser();

    useEffect(() => {
        setDummyUser({...user})
    }, [user])


    const handleUserUpdate = (event) => {
        event.preventDefault()
        update(dummyUser)
    }

    return <Shell className='p-4'>
        <img style={{height: '30rem'}}
             src={user?.picture ?? defaultAvatarImageURL}
             alt={`${user?.name} imagen`}
             className='absolute top-2 left-0 right-0 w-full object-cover filter blur transform scale-105'/>


        <Link variant = 'primary'
              className = 'rounded-full absolute text-white top-4 left-8 flex items-center pl-2 pr-4 py-2 gap-4'
              to = '/profile'
        >
            <Back className = 'w-8 h-8'/>
            <span>Volver</span>
        </Link>

        <form onSubmit={handleUserUpdate}>

            <button type='submit' className='rounded-full absolute top-8 right-8 text-white flex items-center px-2 py-2 gap-4
                      bg-gradient-to-br from-pink-500 to-yellow-500 via-red-500
                      hover:from-green-500 hover:to-blue-500 hover:via-teal-500
                      focus:from-green-500 focus:to-blue-500 focus:via-teal-500'>
                <Save className='w-8 h-8 '/>
            </button>

        <UserEditHeader user={dummyUser} setUser={setDummyUser}/>
        </form>
    </Shell>
}


function UserEditHeader({user, setUser}) {

    const handleImageURLModification = (evt) => {
        let userModified = {...user}
        userModified.picture = evt.target.value
        setUser(userModified)
    }

    const handleCountryModification = (evt) => {
        let userModified = {...user}
        userModified.country = evt.target.value
        setUser(userModified)
    }

    const handleNameModification = (evt) => {
        let userModified = {...user}
        userModified.name = evt.target.value
        setUser(userModified)
    }


    return <header className='mt-96 mb-8 mx-20 relative flex items-end pb-8 '>
        <Input type='text' name='imageURL' value={user?.picture ?? ''} variant='primary' label='imageURL' onChange={handleImageURLModification}/>

        <hgroup className='relative w-full -left-4 z-0'>
            <div className={`bg-white bg-opacity-50 backdrop-filter backdrop-blur text-right text-6xl font-bold p-8`}>
                <Input type='text' name='Nombre de usuario' value={user?.name ?? ''} variant='primary' label='Nombre de usuario' onChange={handleNameModification}/>
            </div>
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
                    <Input type='text' name='imageURL' value={user?.country ?? ''} variant='primary' label='imageURL' onChange={handleCountryModification}/>
                </div>
                <div
                    className={`text-right justify-self-center text-3xl font-semibold text-black italic w-full px-8 py-4`}>
                    {user?.email ?? 'Sin email'}
                </div>
            </div>
        </hgroup>
    </header>
}


