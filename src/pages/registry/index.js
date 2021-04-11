import {useContext} from 'react'
import {Redirect} from 'react-router-dom'

import AuthenticationContext from '../../context/auth'

import Logo from '../../components/logo'
import Link from '../../components/link'
import TODO from '../../components/todo'

export default function Login() {
    const { isAuthenticated } = useContext(AuthenticationContext)

    const submit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.target)

        console.log(data)
    }

    if (isAuthenticated)
        return <Redirect to='/' />
    else
        return <main className = 'w-screen h-screen grid place-items-center content-center bg-pattern' >
            <form className = 'bg-white rounded shadow-md p-4 flex flex-col text-indigo-900' onSubmit = {submit}>
                <Logo className = 'text-6xl'/>

                <TODO>Implementar formulario de registro</TODO>

            </form>
            <Link to='login'>Iniciar sesión</Link>
        </main>
}