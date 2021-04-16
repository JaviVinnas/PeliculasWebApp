import { useContext } from 'react'
import { Redirect } from 'react-router-dom'

import { AuthenticationContext } from '../../context'

import { Logo, Link, TODO } from '../../components'

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
        return <main className = 'w-screen h-screen grid place-items-center content-center bg-pattern-1' >
            <form className = 'bg-white rounded shadow p-8 flex flex-col text-teal-900'
                  onSubmit = { submit }
                  autoComplete = 'off'>
                <Logo className = 'text-6xl mb-8' logoSize = 'w-12 h-12'/>
                <TODO>Implementar formulario de registro</TODO>
            </form>
            <Link to='login' variant = 'plain-secondary'>Iniciar sesión</Link>
        </main>
}