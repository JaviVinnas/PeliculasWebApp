import React, {useContext, useState} from 'react'
import {Redirect, Route} from 'react-router-dom'
import API from '../../api'

const AuthContext = React.createContext({
    isAuthenticated: false,
    errors: false,
    login: () => {},
    logout: () => {}
})
const client = API.instance()

export function SecuredApp({children}) {

    const [isAuthenticated, setIsAuthenticated] = useState(JSON.parse(localStorage.getItem('authenticated') || false))
    const [errors, setErrors] = useState(false)
    const login = async (user, pass) => {

        const loginSuccessful = await client.login(user, pass)
        localStorage.setItem('authenticated', JSON.stringify(loginSuccessful))
        setIsAuthenticated(loginSuccessful)
        setErrors(!loginSuccessful)
    }
    const logout = async () => {
        await client.logout()
        localStorage.setItem('authenticated', JSON.stringify(false))
        setIsAuthenticated(false)
        setErrors(false)
    }
    const context = { isAuthenticated, login, logout, errors }

    return <AuthContext.Provider value = { context } >
        { children }
    </AuthContext.Provider>

}

export function SecuredRoute({children, ...props}) {

    const {isAuthenticated} = useContext(AuthContext)
    return isAuthenticated ? <Route {...props}>{children}</Route> : <Redirect to = '/login' />

}

export default AuthContext
