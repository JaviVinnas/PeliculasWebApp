import DATA from './data'

let __instance = null

export default class API {
    #token = sessionStorage.getItem('token') || null

    static instance() {
        if (__instance == null)
            __instance = new API()

        return __instance
    }

    /**
     * Función que hace el loguin del usuario en la API
     * @param email el identificador unívoco de cada usuario
     * @param password su contraseña
     * @returns {Promise<boolean>} si las cosas fuero bien o mal
     */
    async login(email, password) {
        const result = await fetch("api/login", {
            method: 'post',
            body: JSON.stringify({email, password})
        }).catch(ex => console.error(`Error al llamar a la API en el login ${ex}`))

        if (result.status === 200) {
            localStorage.setItem('user', email);
            this.#token = result.headers.get("Authentication");
            localStorage.setItem('token', this.#token);
            return true;
        } else {
            return false;
        }
    }

    async logout() {
        this.#token = null
        localStorage.clear()
        return true
    }

    async findMovies(
        {
            filter: {genre = '', title = '', status = ''} = {genre: '', title: '', status: ''},
            sort = {},
            pagination: {page = 0, size = 7} = {page: 0, size: 7}
        } = {
            filter: {genre: '', title: '', status: ''},
            sort: {},
            pagination: {page: 0, size: 7}
        }
    ) {


        let params = {page,size}

        if(genre !== ''){
            params = {...params, genre}
        }

        if(title !== ''){
            params = {...params, title}
        }
        if(status !== ''){
            params = {...params, status}
        }
        if(sort !== {}){
            params = {...params,sort: Object.keys(sort)[0] + ':' + Object.values(sort)[0].toLowerCase()}
        }

        console.log(params)

        const rawResult = await fetch('/api/movies?' + new URLSearchParams(params), {
            method: 'GET',
            headers: {'Authorization': localStorage.getItem('token')}
        }).catch(ex => console.error(`Error al buscar todas las películas: ${ex}`))

        if(rawResult.status >= 200 && rawResult.status < 300){ //si lo obtenemos
            const content = await rawResult.json()
            console.log(content)
        }else if(rawResult.status === 404){ //si la búsqueda no obtuvo ningún resultado

        }


        return new Promise(resolve => {
            const filtered = DATA.movies
                ?.filter(movie => movie.title.toLowerCase().includes(title.toLowerCase() || ''))
                ?.filter(movie => genre !== '' ? movie.genres.map(genre => genre.toLowerCase()).includes(genre.toLowerCase()) : true)
                ?.filter(movie => movie.status.toLowerCase().includes(status.toLowerCase() || ''))

            const data = {
                content: filtered?.slice(size * page, size * page + size),
                pagination: {
                    hasNext: size * page + size < filtered.length,
                    hasPrevious: page > 0
                }
            }

            resolve(data)
        })
    }

    async findMovie(id) {
        return DATA.movies.find(movie => movie.id === id)
    }

    async findUser(id) {
        return new Promise(resolve => {
            const user = DATA.users.find(user => user.email === id)

            resolve(user)
        })
    }

    async findComments(
        {
            filter: {movie = '', user = ''} = {movie: '', user: ''},
            sort,
            pagination: {page = 0, size = 10} = {page: 0, size: 10}
        } = {
            filter: {movie: '', user: ''},
            sort: {},
            pagination: {page: 0, size: 10}
        }
    ) {
        return new Promise(resolve => {
            const filtered = DATA.comments
                ?.filter(comment => comment?.movie?.id === movie)

            const data = {
                content: filtered?.slice(size * page, size * page + size),
                pagination: {
                    hasNext: size * page + size < filtered.length,
                    hasPrevious: page > 0
                }
            }

            resolve(data)
        })
    }

    async createComment(comment) {
        return new Promise(resolve => {
            DATA.comments.unshift(comment)

            resolve(true)
        })
    }

    async createUser(user) {
        console.log(user)
    }

    async updateUser(id, user) {
        console.log(user)
    }
}