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

    return data
}

export function useUser(id = null) {
    const [data, setData] = useState([])
    const userId = id === null ? localStorage.getItem('user') : id

    useEffect(() => {
        API.instance()
            .findUser(userId)
            .then(user => {
                setData(user)
            })
    }, [userId])

    const create = user => API.instance()
        .createUser(user)
        .then(user => setData(user))

    const update = user => API.instance()
        .updateUser(id, user)
        .then(user => setData(user))

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
            .then(result => setData({
                content: result.content,
                pagination: {
                    hasNext: result.pagination.hasnext,
                    hasPrevious: result.pagination.hasPrevious
                }
            }))
    }, [queryString])

    const create = comment => {
        API.instance()
            .createComment(comment)
            .then(() => {
                API.instance()
                    .findComments(query)
                    .then(result => setData({
                        content: result.content,
                        pagination: {
                            hasNext: result.pagination.hasnext,
                            hasPrevious: result.pagination.hasPrevious
                        }
                    }))
            })
    }

    return {
        comments: /**@type ApiPageAssessmets}*/ {
            content: data.content,
            pagination: {
                hasNext: data.pagination.hasnext,
                hasPrevious: data.pagination.hasPrevious
            }
        },
        createComment: create
    }
}