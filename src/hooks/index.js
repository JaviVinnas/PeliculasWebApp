import { useEffect, useState } from 'react'
import API from '../api'

export function useMovies(query = {}) {
    const [data, setData] = useState({ content: [], pagination: { hasNext: false, hasPrevious: false }})
    const queryString = JSON.stringify(query)

    useEffect(() => {
        API.instance()
            .findMovies(JSON.parse(queryString))
            .then(setData)
    }, [queryString])

    return data
}

export function useMovie(id = '') {
    const [data, setData] = useState({})

    useEffect(() => {
        API.instance()
            .findMovie(id)
            .then(setData)
    }, [id])

    return data
}

export function useUser(id = null) {
    const [data, setData] = useState([])
    const user = id === null ? localStorage.getItem('user') : id

    useEffect(() => {
        API.instance()
            .findUser(user)
            .then(user => {
                setData(user)
            })
    }, [user])

    return data
}

export function useComments(query = {}){
    const [data, setData] = useState({ content: [], pagination: { hasNext: false, hasPrevious: false }})
    const queryString = JSON.stringify(query)

    useEffect(() => {
        API.instance()
            .findComments(JSON.parse(queryString))
            .then(setData)
    }, [queryString])

    const create = comment => {
        API.instance()
            .createComment(comment)
            .then( () => {
                API.instance()
                    .findCommentsForMovie(query)
                    .then(setData)
            })
    }

    return {
        comments: data,
        createComment: create
    }
}