//definimos los tipos de datos de la API

/**
 * @typedef ApiDate - reperesentación de una fecha en la API
 * @property {Number} day - día del año
 * @property {Number} month - mes del año
 * @property {Number} year - año
 */

/**
 * @typedef ApiUser - representación del usuario en la API
 * @property {String} email - el email del usuario identificador
 * @property {String} name - el nombre del usuario
 * @property {String} country - el pais del usuario
 * @property {String} picture - la foto de perfil del usuario
 * @property {Date} birthday - el cumpleaños del usuario
 * @property {ApiDate} password - la contraseña del usuario
 * @property {Array.<String>} roles - los roles que tiene el usuario en el sistema
 *
 */

/**
 * @typedef ApiCrew - representación de los involucrados en la película en la API
 * @property {String} id - identificador de la persona
 * @property {String} name - nombre de la persona
 * @property {String} country - país de origen de la persona
 * @property {String} picture - foto de la persona
 * @property {String} biography - biografía de la persona
 * @property {String} biography - biografía de la persona
 * @property {ApiDate} birthday - fecha de nacimiento la persona
 * @property {ApiDate} deathDay - fecha de fallecimiento la persona
 * @property {String} job - ocupación de la persona
 */

/**
 * @typedef ApiCast - representación de los involucrados en la película en la API
 * @property {String} id - identificador de la persona
 * @property {String} name - nombre de la persona
 * @property {String} country - país de origen de la persona
 * @property {String} picture - foto de la persona
 * @property {String} biography - biografía de la persona
 * @property {String} biography - biografía de la persona
 * @property {ApiDate} birthday - fecha de nacimiento la persona
 * @property {ApiDate} deathDay - fecha de fallecimiento la persona
 * @property {String} character - personaje que representan en la película
 */

/**
 * @typedef ApiProducer - representación de una productora cinematográfica en la API
 * @property {String} name - nombre de la productora
 * @property {String} logo - logo de la productora
 * @property {String} country - país de origen de la productora
 */

/**
 * @typedef ApiResource - representación de un recurso en la película en la API
 * @param {String} URL - ruta al recurso
 * @param {
 * 'POSTER',
 * 'BACKDROP',
 * 'TRAILER',
 * 'NETFLIX',
 * 'AMAZON_PRIME',
 * 'DISNEY_PLUS',
 * 'ITUNES',
 * 'HBO',
 * 'YOUTUBE',
 * 'GOOGLE_PLAY',
 * 'TORRENT'
 * } type - tipo de recurso al que nos referimos
 */

/**
 * @typedef ApiCollection - representación de colecciones de recursos en la API
 * @param {String} name - nombre de la colección
 * @param {Array.<ApiResource>} resources - los recursos de la colección
 */

/**
 * @typedef ApiFilm - representación de una película en la api
 * @property {String} id - el identificador de la película
 * @property {String} title - el título de la película
 * @property {String} overview - sinposis de la película
 * @property {String} tagline - sinopsis corta de la película
 * @property {ApiCollection} collection - colección de recursos de la película
 * @property {Array.<String>} genres - géneros de la película
 * @property {ApiDate} releaseDate - fecha en la que se estrenó
 * @property {Array.<String>} keywords - keywords de la película
 * @property {Array.<ApiProducer>} producers - productoras de la película
 * @property {Array.<ApiCrew>} crew - empleados varios de la película
 * @property {Array.<ApiCast>} cast - actores de la película
 * @property {Array.<ApiResource>} resources - recursos de la película
 * @property {Number} budget - presupuesto de la película
 * @property {'RUMORED', 'PLANNED', 'PRODUCTION', 'POSTPRODUCTION', 'RELEASED', 'CANCELLED'} status - estado de la película
 * @property {Number} runtime - runtime de la película
 * @property {Number} revenue - recaudación de la película
 */

/**
 * @typedef ApiPageFilms - representación de una página con películas de la API
 * @property {Array.<ApiFilm>} content - el contenido de la página
 * @property {Boolean} pagination.hasPrevious - si tiene página anterior
 * @property {Boolean} pagination.hasnext - si tiene página siguiente
 */

/**
 * @typedef ApiPageUsers - representación de una página con usuarios de la API
 * @property {Array.<ApiUser>} content - el contenido de la página
 * @property {Boolean} pagination.hasPrevious - si tiene página anterior
 * @property {Boolean} pagination.hasnext - si tiene página siguiente
 */

/**
 * @typedef ApiAssessment - representación de un comentario en la api
 * @property {String} id - el identificador del comentario
 * @property {ApiFilm} movie - película que se comenta
 * @property {ApiUser} user - usuario que comenta
 * @property {Number} rating - valoración del usuario (1-10)
 * @property {String} comment - comentario del usuario
 */

/**
 * @typedef ApiPageAssessmets - representación de una página con usuarios de la API
 * @property {Array.<ApiAssessment>} content - el contenido de la página
 * @property {Boolean} pagination.hasPrevious - si tiene página anterior
 * @property {Boolean} pagination.hasnext - si tiene página siguiente
 */


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
        const result = await fetch("http://localhost:3000/api/login", {
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
     * @returns {Promise<ApiPageFilms>} - el resultado de la búsqueda
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

        const rawResult = await fetch('http://localhost:3000/api/movies?' + new URLSearchParams(params), {
            method: 'GET',
            headers: {'Authorization': localStorage.getItem('token')}
        }).catch(ex => console.error(`Error al buscar películas: ${ex}`))

        const bodyContent = await rawResult.json()


        let finalContent = /** @type {ApiPageFilms}*/ ({pagination: {hasNext: false, hasPrevious: false}, content: []})

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
    }


    /**
     * Obtiene una película en concreto por su identificador
     * @param {Number} id el identificador numérico de la película
     * @returns {Promise<ApiFilm>} el objeto película encontrado encontrado
     */
    async findMovie(id) {


        const rawResult = await fetch(`http://localhost:3000/api/movies/${id}`, {
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
     * Actualiza una película en la base de datos
     * @param {ApiFilm} movie el identificador numérico de la película
     * @returns {Promise<ApiFilm>} el objeto película encontrado encontrado
     */
    async updateMovie(movie) {
        const rawResult = await fetch('http://localhost:3000/api/movies', {
            method: 'PUT',
            headers: {'Authorization': localStorage.getItem('token'), 'Content-Type': 'application/json;charset=UTF-8'},
            body: JSON.stringify(movie)
        }).catch(ex => console.error(`Error al actualizar la película ${movie}`))

        const result = await rawResult.json()

        if (rawResult.status === 200) { //si salió bien
            console.log('Actualizar película correcto: ', result)

        } else {
            console.error("Error a la hora de actualizar la película ", movie, ". Descripción de error: ", result)
        }

        return result
    }

    /**
     * Obtiene un usuario a partir de su email
     * @param {String} id el email del usuario
     * @returns {Promise<ApiUser>} el objeto usuario que devuelve
     */
    async findUser(id) {

        const rawResult = await fetch(`http://localhost:3000/api/users/${id}`, {
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
     * @returns {Promise<ApiPageAssessmets>} - el resultado de la búsqueda
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

        let finalContent = /** @type {ApiPageAssessmets}*/ ({
            pagination: {hasNext: false, hasPrevious: false},
            content: []
        })

        if (movie === user) return finalContent

        const url = `http://localhost:3000/api/${movie !== '' ? `movies/${movie}` : `users/${user}`}/assessments`

        let params = {page, size}

        try {
            if (sort && Object.keys(sort).length === 0 && sort.constructor === Object) {
                params = {...params, sort: Object.keys(sort)[0] + ':' + Object.values(sort)[0].toLowerCase()}
            }
        } catch (ignore) {
        }

        const rawResult = await fetch(url + '?' + new URLSearchParams(params), {
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
     * @param {ApiAssessment} comment - el comentario a crear
     * @returns {Promise<ApiAssessment>} - el comentario creado
     */
    async createComment(comment) {

        comment.user.email = localStorage.getItem('user')

        //convertimos puntuación en número
        comment.rating = Number.parseInt(comment.rating)
        const request = {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(comment)
        }

        const rawResult = await fetch(`http://localhost:3000/api/assessments`, request).catch(ex => console.error(`Error al buscar películas: ${ex}`))

        if (rawResult.status === 201) {
            const bodyContent = await rawResult.json();
            console.log('Creación de comentarios correcta. Argumento ->', request, '. Resultado -> ', bodyContent)
            return bodyContent
        } else {
            console.error('Creación de comentarios errónea. Argumento ->', request, '. Resultado -> ', rawResult)
            comment.rating = -1
            comment.comment = 'Error al crear comentario'
            return comment
        }
    }


    /**
     * Crea un objeto usuario pasado por argumentos
     * @param {ApiUser} user - el usuario que se desee crear
     * @returns {Promise<ApiUser>} - la respuesta que da la api a que se introduzaca un nuevo usuario
     */
    async createUser(user) {
        //preparamos la consulta

        const rawResult = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {'Authorization': localStorage.getItem('token')},
            body: JSON.stringify(user)
        })

        if (rawResult.status === 201) { //si las cosas fueron bien
            const bodyContent = await rawResult.json();
            console.log('Creación del usuario correcta. Argumento ->', user, '. Resultado -> ', bodyContent)
            return bodyContent
        } else {
            console.error('Creación del usuario errónea. Argumento ->', user, '. Resultado -> ', rawResult)
            user.email = 'ERROR'
            return user
        }
    }

    /**
     * Modifica al propio usuario de la app
     * @param {ApiUser} user - el objeto usuario actualizado
     * @returns {Promise<ApiUser>} - el objeto usuario modificado que devuelva la api
     */
    async updateUser(user) {
        const rawResult = await fetch('http://localhost:3000/api/users', {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(user)
        })

        if (rawResult.status === 200) { //si las cosas fueron bien
            const bodyContent = await rawResult.json();
            console.log('Modificación del usuario correcta. Argumento ->', user, '. Resultado -> ', bodyContent)
            return bodyContent
        } else {
            console.error('Modificación del usuario errónea. Argumento ->', user, '. Resultado -> ', rawResult)
            user.email = 'ERROR'
            return user
        }

    }
}