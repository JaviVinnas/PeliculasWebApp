import {useParams} from 'react-router-dom'
import {
    ArrowCircleLeftOutline as Back,
    AtSymbolOutline,
    FingerPrintOutline,
    SaveOutline as Save
} from '@graywolfai/react-heroicons'
import ReactPlayer from 'react-player'

import {Shell, Link, TODO, Separator, CommentList, Button, Input, Logo, TextArea, StarRating} from '../../components'

import {useMovie, useComments} from '../../hooks'

import Disney from './icons/disney_plus.png'
import Play from './icons/google_play.png'
import HBO from './icons/hbo.png'
import ITunes from './icons/itunes.png'
import Netflix from './icons/netflix.png'
import Prime from './icons/prime_video.png'
import Youtube from './icons/youtube.png'
import {useEffect, useState} from "react";

/**
 * @typedef {import('../../api/index.js').ApiFilm} ApiFilm
 */

const backdrop = movie => {
    const backdrop = movie?.resources?.find(res => res?.type === 'BACKDROP')?.url
    const poster = movie?.resources?.find(res => res?.type === 'POSTER')?.url

    return backdrop ? backdrop : poster
}
const poster = movie => movie?.resources?.find(res => res?.type === 'POSTER')?.url

export default function EditMovie() {
    const {id} = useParams()
    console.log('Id obtenido para editar -> ', id)
    const {movie, update} = useMovie(id)
    console.log('Película obtenido para editar -> ', movie)
    //states para los campos de la película
    const [argumento, setArgumento] = useState('')
    const [recursos, setRecursos] = useState([])
    useEffect(() => {
        console.log("EFECTO")
        setRecursos(movie.resources)
        setArgumento(movie.overview)
    }, [movie])

    console.log('Estado del argumento -> ', argumento)
    console.log('Estado del los recursos -> ', recursos)

    const handleFilmUpdate = (event) => {
        event.preventDefault()
        let updatedMovie = {...movie}
        updatedMovie.resources = recursos
        updatedMovie.overview = argumento
        update(updatedMovie)
    }

    return <Shell>
        <img style={{height: '36rem'}}
             src={backdrop(movie)}
             alt={`${movie.title} backdrop`}
             className='absolute top-2 left-0 right-0 w-full object-cover filter blur transform scale-105'/>

        <Link variant='primary'
              className='rounded-full absolute text-white top-4 left-8 flex items-center pl-2 pr-4 py-2 gap-4'
              to={`/movies/${id}`}
        >
            <Back className='w-8 h-8'/>
            <span>Volver</span>
        </Link>



        <form onSubmit={handleFilmUpdate}>
            <button type='submit' className='rounded-full absolute top-8 right-8 text-white flex items-center px-2 py-2 gap-4
                      bg-gradient-to-br from-pink-500 to-yellow-500 via-red-500
                      hover:from-green-500 hover:to-blue-500 hover:via-teal-500
                      focus:from-green-500 focus:to-blue-500 focus:via-teal-500'>
                <Save className='w-8 h-8 '/>
            </button>


            <div className='mx-auto w-full max-w-screen-2xl p-8'>
                <Header movie={movie}/>
                <Info movie={movie} argumento={argumento} setArgumento={setArgumento}/>
                <View movie={movie} recursos={recursos} setRecursos={setRecursos}/>
                <Cast movie={movie}/>
            </div>
        </form>
    </Shell>
}

function Header({movie}) {
    return <header className='mt-64 relative flex items-end pb-8 mb-8'>
        <img style={{aspectRatio: '2/3'}}
             src={poster(movie)}
             alt={`${movie.title} poster`}
             className='w-64 rounded-lg shadow-xl z-20'/>
        <hgroup className='flex-1'>
            <h1 className={`bg-black bg-opacity-50 backdrop-filter backdrop-blur 
                                          text-right text-white text-6xl font-bold
                                          p-8`}>
                {movie.title}
            </h1>
            <Tagline movie={movie}/>
        </hgroup>
    </header>
}

function Info({
                  movie,
                  argumento = '',
                  setArgumento = (() => {
                  })
              }) {
    return <div className='grid grid-cols-5 gap-4'>
        <div className='col-span-4'>
            <h2 className='font-bold text-2xl text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-4 shadow'>
                Argumento
            </h2>
            <TextArea
                className='border-black m-2 my-8'
                name='hola'
                onChange={evt => setArgumento(evt.target.value)}
                value={argumento}
            />
        </div>
        <div className='text-right'>
            <dl className='space-y-2'>
                <CrewMember movie={movie} job='Director' label='Dirección'/>
                <CrewMember movie={movie} job='Producer' label='Producción'/>
                <CrewMember movie={movie} job='Screenplay' label='Guión'/>
                <CrewMember movie={movie} job='Original Music Composer' label='Banda sonora'/>
            </dl>
        </div>
    </div>
}

function View({movie, recursos = [], setRecursos = (()=>{})}) {

    const urlTrailer = recursos.find(recurso => recurso?.type === 'TRAILER')?.url

    const resursosSinTrailer = recursos.filter(recurso => recurso?.type !== 'TRAILER')


    return <div className='flex gap-4 mt-8'>
        <div className='w-80 z-10'>
            <Links movie={movie} resources={recursos} setResources={setRecursos}/>
        </div>
        <div style={{
            aspectRatio: '16/9'
        }}
             className='flex-1 ml-8 mt-8 bg-pattern-2 flex items-center justify-center z-20'>
            <Input labelClassName='w-full mx-4' type='text' value={urlTrailer || ''} onChange={evt => {
                //metemos la url en el array otra vez
                setRecursos( evt.target.value === '' ? resursosSinTrailer : [ {url: evt.target.value, type: 'TRAILER'}, ...resursosSinTrailer])
            }
            }/>
        </div>
    </div>
}

function Cast({movie}) {
    return <>
        <h2 className='mt-16 font-bold text-2xl'>Reparto principal</h2>
        <Separator/>
        <ul className='w-full grid grid-cols-10 gap-2 overflow-hidden'>
            {
                movie?.cast?.slice(0, 10).map(person => <CastMember key={person.name} person={person}/>)
            }
        </ul>
    </>
}

function CastMember({person}) {
    return <li className='overflow-hidden'>
        <img src={person?.picture}
             alt={`${person.name} profile`}
             className='w-full object-top object-cover rounded shadow'
             style={{aspectRatio: '2/3'}}/>
        <span className='font-bold block'> {person?.name} </span>
        <span className='text-sm block'> {person?.character} </span>
    </li>
}


function Tagline({movie}) {
    if (movie.tagline) {
        return <q className={`block text-3xl font-semibold text-black italic w-full px-8 py-4 text-right`}>
            {movie.tagline}
        </q>
    } else {
        return <span className='block text-3xl font-semibold py-4'>&nbsp;</span>
    }
}

function CrewMember({movie, job, label}) {
    const people = movie?.crew?.filter(p => p.job === job)

    if (people?.length !== 0)
        return <div>
            <dt className='font-bold text-sm'>{label}</dt>
            {people?.map(p => <dd className='text-sm' key={`${job}/${p.id}`}>{p.name}</dd>)}
        </div>
    else return null
}

//aquí vienen TODOS los recursos
function Links({movie, resources = [], setResources=(()=>{})}) {

    const [selectedPlatform, setSelectedPlatform] = useState('NETFLIX')
    //recursos que no son POSTER, BACKDROP ni TRAILER
    const filteredResources = resources?.filter(r => !['POSTER', 'BACKDROP', 'TRAILER'].includes(r.type))

    let links

    if (filteredResources?.length === 0) {
        links = <span className='block p-8 text-center bg-gray-300 font-bold'>
            No se han encontrado enlaces!
        </span>
    } else {
        links = <ul className='space-y-4'>
            {
                filteredResources?.map(r => <PlatformLink key={r.type} type={r.type} url={r.url}/>)
            }
        </ul>
    }


    return <>
        <h2 className='font-bold text-2xl'>Ver ahora</h2>
        <Separator/>
        <div className='flex my-5'>
            <div>
                <select value={selectedPlatform} onChange={e => setSelectedPlatform(e.target.value)} className='font-bold rounded-lg p-5 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500'>
                    <option value='NETFLIX'>Netflix</option>
                    <option value='AMAZON_PRIME'>Amazon prime</option>
                    <option value='DISNEY_PLUS'>Disney Plus</option>
                    <option value='ITUNES'>Itunes</option>
                    <option value='HBO'>HBO</option>
                    <option value='YOUTUBE'>YouTube</option>
                    <option value='GOOGLE_PLAY'>Google Play</option>
                </select>
            </div>
            <div>
                <Input labelClassName='w-full mx-4' className='bg-gray-400' type='text' value={resources?.find( r => r?.type === selectedPlatform)?.url || ''} onChange={evt => {
                    //obtenemos el array de recursos salvo el actual que estemos editando
                    const otherResources = resources.filter(resource => resource.type !== selectedPlatform)
                    setResources( evt.target.value === '' ? otherResources : [ {url: evt.target.value, type: selectedPlatform}, ...otherResources])
                }
                }/>
            </div>
        </div>
        {links}
    </>
}

function PlatformLink({type = '', url = '', ...props}) {
    switch (type) {
        case 'DISNEY_PLUS':
            return <a target='_blank'
                      rel='noreferrer'
                      href={url}
                      className={`flex items-center space-x-2 overflow-hidden h-16 w-full bg-white
                                    transform transition duration-200 
                                    hover:translate-x-8 hover:scale-105`}>
                <img src={Disney} alt='Disney+ logo'
                     className='rounded-lg w-16 h-16'
                />
                <span className='font-bold'>
                    Reproducir en
                </span>
            </a>
        case 'GOOGLE_PLAY':
            return <a target='_blank'
                      rel='noreferrer'
                      href={url}
                      className={`flex items-center space-x-2 overflow-hidden h-16 w-full bg-white
                                    transform transition duration-200 
                                    hover:translate-x-8 hover:scale-105`}>
                <img src={Play} alt='Google Play logo'
                     className='rounded-lg w-16 h-16'
                />
                <span className='font-bold'>
                    Reproducir en Google Play
                </span>
            </a>
        case 'HBO':
            return <a target='_blank'
                      rel='noreferrer'
                      href={url}
                      className={`flex items-center space-x-2 overflow-hidden h-16 w-full bg-white
                                    transform transition duration-200 
                                    hover:translate-x-8 hover:scale-105`}>
                <img src={HBO} alt='HBO logo'
                     className='rounded-lg w-16 h-16'
                />
                <span className='font-bold'>
                    Reproducir en HBO
                </span>
            </a>
        case 'ITUNES':
            return <a target='_blank'
                      rel='noreferrer'
                      href={url}
                      className={`flex items-center space-x-2 overflow-hidden h-16 w-full bg-white
                                    transform transition duration-200 
                                    hover:translate-x-8 hover:scale-105`}>
                <img src={ITunes} alt='iTunes logo'
                     className='rounded-lg w-16 h-16'
                />
                <span className='font-bold'>
                    Reproducir en iTunes
                </span>
            </a>
        case 'NETFLIX':
            return <a target='_blank'
                      rel='noreferrer'
                      href={url}
                      className={`flex items-center space-x-2 overflow-hidden h-16 w-full bg-white
                                    transform transition duration-200 
                                    hover:translate-x-8 hover:scale-105`}>
                <img src={Netflix} alt='Netflix logo'
                     className='rounded-lg w-16 h-16'
                />
                <span className='font-bold'>
                    Reproducir en Netflix
                </span>
            </a>
        case 'AMAZON_PRIME':
            return <a target='_blank'
                      rel='noreferrer'
                      href={url}
                      className={`flex items-center space-x-2 overflow-hidden h-16 w-full bg-white
                                    transform transition duration-200 
                                    hover:translate-x-8 hover:scale-105`}>
                <img src={Prime} alt='Prime Video logo'
                     className='rounded-lg w-16 h-16'
                />
                <span className='font-bold'>
                    Reproducir en Prime Video
                </span>
            </a>
        case 'YOUTUBE':
            return <a target='_blank'
                      rel='noreferrer'
                      href={url}
                      className={`flex items-center space-x-2 overflow-hidden h-16 w-full bg-white
                                    transform transition duration-200 
                                    hover:translate-x-8 hover:scale-105`}>
                <img src={Youtube} alt='YouTube logo'
                     className='rounded-lg w-16 h-16'
                />
                <span className='font-bold'>
                    Reproducir en YouTube
                </span>
            </a>
        default:
            return null
    }
}

function Trailer({movie, ...props}) {
    const trailer = movie?.resources?.find(r => r.type === 'TRAILER')

    if (trailer)
        return <ReactPlayer url={trailer.url} {...props} />
    else
        return <span
            className='text-white text-xl font-semibold p-8 backdrop-filter backdrop-blur bg-red-500 bg-opacity-30'>No se han encontrado trailers!</span>
}