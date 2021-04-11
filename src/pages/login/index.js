import {useContext} from 'react'
import {Redirect} from 'react-router-dom'
import {AtSymbolOutline, FingerPrintOutline} from '@graywolfai/react-heroicons'

import AuthenticationContext from '../../context/auth'

import Logo from '../../components/logo'
import Button from '../../components/button'
import Input from '../../components/input'
import Link from '../../components/link'

export default function Login() {
    const { login, isAuthenticated, errors } = useContext(AuthenticationContext)

    const submit = async (event) => {
        event.preventDefault()

        const data = new FormData(event.target)
        await login(data.get('user'), data.get('password'))
    }

    if(isAuthenticated)
        return <Redirect to = '/' />
    else
        return <main className = 'w-screen h-screen grid place-items-center content-center bg-pattern' >
            <form className = 'bg-white rounded shadow p-8 flex flex-col text-teal-900'
                  onSubmit = {submit}
                  autoComplete = 'off'>
                <Logo className = 'text-6xl mb-8'/>
                <Input type = 'email' name = 'user' label = 'Usuario' before = {AtSymbolOutline} errors = {errors} />
                <Input type = 'password' name = 'password' label = 'Contraseña' before = {FingerPrintOutline} errors = {errors}/>
                <Button type = 'submit'>Entrar</Button>
            </form>
            <Link to='register'>Crear nueva cuenta</Link>
        </main>
}