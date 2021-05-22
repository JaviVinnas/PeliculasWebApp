import {useEffect, useState} from 'react'

import API from '../api'

export function useMovies(query = {}) {
    const [data, setData] = useState({content: [], pagination: {hasNext: false, hasPrevious: false}})
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

    const update = movie => API.instance()
        .updateMovie(movie)
        .then(setData)

    return {
        movie: data,
        update
    }
}

export function useUser(id = null) {
    const [data, setData] = useState([])
    const userId = id === null ? localStorage.getItem('user') : id

    useEffect(() => {
        API.instance()
            .findUser(userId)
            .then(setData)
    }, [userId])

    const create = user => API.instance()
        .createUser(user)
        .then(setData)

    const update = (user) => API.instance()
        .updateUser(user)
        .then(setData)

    return {
        user: data,
        create,
        update
    }
}

/**
 * @typedef {import('../api/index.js').ApiPageAssessmets} ApiPageAssessmets
 * @typedef {import('../api/index.js').ApiAssessment} ApiAssessment
 */

/**
 *
 * @param query
 * @returns {{comments: ApiPageAssessmets, createComment: function(ApiAssessment): void}}
 */
export function useComments(query = {}) {

    const [data, setData] = useState({content: [], pagination: {hasNext: false, hasPrevious: false}})
    const queryString = JSON.stringify(query)

    //
    useEffect(() => {
        API.instance()
            .findComments(JSON.parse(queryString))
            .then(setData)
    }, [queryString])

    const create = comment => {
        API.instance()
            .createComment(comment)
            .then(() => {
                API.instance()
                    .findComments(query)
                    .then(setData)
            })
    }

    return {
        comments: /**@type ApiPageAssessmets}*/ (data),
        createComment: create
    }
}