import { Shell, TODO } from '../../components'
import {useUser} from "../../hooks";

export default function Profile() {

    //obtenemos el usuario con id determinado
    const {user, create, update} = useUser();

    return <Shell className = 'p-4'>
        <img style = {{ height: '30rem' }}
             src = { user?.picture ?? 'https://www.gravatar.com/avatar/?d=mp' }
             alt = { `${ user?.name } imagen` }
             className = 'absolute top-2 left-0 right-0 w-full object-cover filter blur transform scale-105' />
        <UserHeader user={user}/>
    </Shell>
}

function UserHeader({user}){
    return <header className = 'mt-96 mb-8 mx-20 relative flex items-end pb-8 '>
        <img style = {{ aspectRatio: '1' }}
             src = { user?.picture ?? 'https://www.gravatar.com/avatar/?d=mp' }
             alt = { `${ user?.name } imagen` }
             className = 'w-64 rounded-full shadow-xl z-40' />
        <hgroup className = 'relative w-full -left-4 z-0'>
            <h1 className = {`bg-black bg-opacity-50 backdrop-filter backdrop-blur text-right text-white text-6xl font-bold p-8`}>
                { user?.name ?? 'Sin nombre'}
            </h1>
            <q className={`block text-3xl font-semibold text-black italic w-full px-8 py-4 text-right`}>
                {user?.email ?? 'Sin email'}
            </q>
        </hgroup>
    </header>
}
