import { useContext } from 'react'
import AuthenticationContext from '../../context/auth'

export default function Shell({children}) {
    const { logout } = useContext(AuthenticationContext)
    return <section className = 'grid'>
        <aside>
            <nav>
                <button onClick={logout}>Salir</button>
            </nav>
        </aside>
        <main> { children } </main>
    </section>
}