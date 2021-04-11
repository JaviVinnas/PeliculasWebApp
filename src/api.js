const FAKE = {
    users: {
        'test@test.com': '1234'
    },
    movies: {}
}

let __instance = null

export default class API {
    #token = sessionStorage.getItem('token') || null

    static instance() {
        if(__instance == null)
            __instance = new API()

        return __instance
    }

    async login(user, pass) {
        // TODO fetch from API and if successful, store token from response headers

        if(FAKE.users[user] === pass) {
            localStorage.setItem('token', 'TEST TOKEN')
            this.#token = 'TEST TOKEN'
            return true
        } else {
            return false
        }
    }

    async logout() {
        // TODO invalidate token in server???

        localStorage.removeItem('token')
        this.#token = null
        return true
    }
}