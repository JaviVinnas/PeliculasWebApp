

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
     * @param {String} email el identificador unívoco de cada usuario
     * @param {String} password su contraseña
     * @returns {Promise<boolean>} si las cosas fuero bien o mal
     */
    async login(email, password) {
        const result = await fetch("../api/login", {
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

    /**
     * Busca peliculas según los parámetros que se pasen por argumentos
     * @param {String} [genre=''] - el género de películas a buscar
     * @param {String} [title=''] - el fragmento de título por el que buscar
     * @param {String} [status=''] - el status por el que se desea buscar
     * @param {Object.<String,'asc'|'desc'>} [sort={}] - los criterios de ordenación de la búsqueda
     * @param {Number} [page=0] - la página que se desee obtener
     * @param {Number} [size=7] - el número de elementos que constendrá la página
     * @returns {Promise<{pagination: {hasPrevious: boolean, hasNext: boolean}, content: *[Object]}>} - el resultado de la búsqueda
     */
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


        let params = {page, size}

        if (genre !== '') {
            params = {...params, genre}
        }

        if (title !== '') {
            params = {...params, title}
        }
        if (status !== '') {
            params = {...params, status}
        }

        try {
            if (sort && Object.keys(sort).length === 0 && sort.constructor === Object) {
                params = {...params, sort: Object.keys(sort)[0] + ':' + Object.values(sort)[0].toLowerCase()}
            }
        } catch (ignore) {
        }

        const rawResult = await fetch('../api/movies?' + new URLSearchParams(params), {
            method: 'GET',
            headers: {'Authorization': localStorage.getItem('token')}
        }).catch(ex => console.error(`Error al buscar películas: ${ex}`))

        const bodyContent = await rawResult.json()

        let finalContent = {pagination: {hasNext: false, hasPrevious: false}, content: []}

        if (rawResult.status === 200) { // salió bien
            //construimos el objeto resultado
            finalContent.pagination.hasNext = !bodyContent.last
            finalContent.pagination.hasPrevious = !bodyContent.first
            finalContent.content = bodyContent.content
            //informamos del resultado
            console.log("buscar películas correcto", {params, content: bodyContent, finalContent})
            //lo devolvemos
            return finalContent;

        } else { //hubo un error en la búsqueda de películas
            //informamos del resultado
            console.error("Error a la hora de buscar películas en la API con los parámetros ", params, ". Descripción de error: ", bodyContent)
            return finalContent;
        }

        /*
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

         */


    }


    /**
     * Obtiene una película en concreto por su identificador
     * @param {Number} id el identificador numérico de la película
     * @returns {Promise<Object>} el objeto película encontrado encontrado
     */
    async findMovie(id) {


        const rawResult = await fetch(`../api/movies/${id}`, {
            method: 'GET',
            headers: {'Authorization': localStorage.getItem('token')}
        }).catch(ex => console.error(`Error al buscar una película con id ${id}: ${ex}`))

        const result = await rawResult.json()

        if (rawResult.status === 200) { //si salió bien
            console.log('Buscar películas correcto: ', result)

        } else {
            console.error("Error a la hora de buscar una película en la API con id ", id, ". Descripción de error: ", result)
        }

        return result
    }

    /**
     * Obtiene un usuario a partir de su email
     * @param {String} id el email del usuario
     * @returns {Promise<Object>} el objeto usuario que devuelve
     */
    async findUser(id) {

        const rawResult = await fetch(`../api/users/${id}`, {
            method: 'GET',
            headers: {'Authorization': localStorage.getItem('token')}
        }).catch(ex => console.error(`Error al buscar una película con id ${id}: ${ex}`))

        const result = await rawResult.json()

        if (rawResult.status === 200) {
            console.log('Buscar un usuario correcto: ', result)
        } else {
            console.error("Error a la hora de buscar un usuario en la API con id ", id, ". Descripción de error: ", result)
        }

        return result
    }

    /**
     * Obtiene una lista con comentarios según los criterios que se le pongan
     * @param {String} [movie=''] - el título de la película de la que se quieren sacar comentarios
     * @param {String} [user='']  - el usuario al cual van a pertenecer todos los comentarios buscados
     * @param {Object.<String,'asc'|'desc'>} [sort={}] - los criterios de ordenación de la búsqueda
     * @param {Number} [page=0] - la página que se desee obtener
     * @param {Number} [size=10] - el número de elementos que constendrá la página
     * @returns {Promise<{pagination: {hasPrevious: boolean, hasNext: boolean}, content: *[Object]}>} - el resultado de la búsqueda
     */
    async findComments(
        {
            filter: {movie = '', user = ''} = {movie: '', user: ''},
            sort = {},
            pagination: {page = 0, size = 10} = {page: 0, size: 10}
        } = {
            filter: {movie: '', user: ''},
            sort: {},
            pagination: {page: 0, size: 10}
        }
    ) {

        let finalContent = {pagination: {hasNext: false, hasPrevious: false}, content: []}

        if (movie === user) return finalContent

        const url = `../api/${movie !== '' ? `movies/${movie}` : `users/${user}`}/assessments`

        let params = {page, size}

        try {
            if (sort && Object.keys(sort).length === 0 && sort.constructor === Object) {
                params = {...params, sort: Object.keys(sort)[0] + ':' + Object.values(sort)[0].toLowerCase()}
            }
        } catch (ignore) {
        }

        const rawResult = await fetch(url, {
            method: 'GET',
            headers: {'Authorization': localStorage.getItem('token')}
        }).catch(ex => console.error(`Error al buscar comentarios: ${ex}`))

        const result = await rawResult.json()


        if (rawResult.status === 200) { // salió bien
            //construimos el objeto resultado
            finalContent.pagination.hasNext = !result.last
            finalContent.pagination.hasPrevious = !result.first
            finalContent.content = result.content
            //informamos del resultado
            console.log("buscar comentarios correcto", {params, content: result, finalContent})
            //lo devolvemos
            return finalContent;

        } else { //hubo un error en la búsqueda de películas
            //informamos del resultado
            console.error("Error a la hora de buscar comentarios en la API con los parámetros ", params, ". Descripción de error: ", result)
            return finalContent;
        }
    }

    /**
     * Crea un comentario en la aplicación
     * @param {Object} comment - el comentario a crear
     * @param {Number} comment.rating - la puntuación de la película
     * @param {String} comment.comment - crítica de la película
     * @param {Object} comment.movie - objeto película que se comenta
     * @param {String} comment.movie.id - identificador de la película
     * @param {Object} comment.user - objeto usuario que se enviará
     * @param {String} comment.user.email - email del usuario (su identificador)
     * @returns {Promise<{rating: Number, comment: String, movie: {id: String}, user: {email: String}}>}
     */
    async createComment(comment) {

        comment.user.email = localStorage.getItem('user')

        const rawResult = await fetch(`../api/assessments`, {
            method: 'POST',
            headers: {'Authorization': localStorage.getItem('token')},
            body: JSON.stringify(comment)
        }).catch(ex => console.error(`Error al buscar películas: ${ex}`))

        const bodyContent = await rawResult.json();

        if (rawResult.status === 201) {
            console.log('Creación de comentarios correcta. Argumento ->', comment, '. Resultado -> ', bodyContent)
            return rawResult.json()
        } else {
            console.error('Creación de comentarios errónea. Argumento ->', comment, '. Resultado -> ', bodyContent)
            comment.rating = 0
            comment.comment = 'Error al crear comentario'
            return comment
        }
    }

    async createUser(user) {
        console.log(user)
    }

    async updateUser(id, user) {
        console.log(user)
    }
}