import {FilmOutline} from '@graywolfai/react-heroicons'

export default function Logo({className = '', ...props}) {
    return <span {...props} className = {`flex justify-center items-center text-transparent whitespace-nowrap font-logo ${className} select-none bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 bg-clip-text`}>
        <FilmOutline className = 'transform rotate-6 w-12 h12 mr-4 text-red-500'/>
        watch IT
    </span>
}