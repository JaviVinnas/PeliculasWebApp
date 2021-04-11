import { Link as RouterLink } from 'react-router-dom'

export default function Link({className = '', to, children, ...props}) {
    return <RouterLink className = { `text-teal-700 underline font-bold text-sm mt-4 no-underline outline-none 
                                      hover:underline hover:text-red-500
                                      focus:underline focus:text-red-500
                                      ${className}`}
                 to = {to}
                 {...props}>
        {children}
    </RouterLink>
}