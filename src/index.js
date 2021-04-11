import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import ReactFontLoader from 'react-font-loader'

import { SecuredApp, SecuredRoute } from './context/auth'
import Login from './pages/login'
import Register from './pages/registry'
import Movies from './pages/movies'

import './styles.css'
import Movie from "./pages/movie";

ReactDOM.render(
    <React.StrictMode>
        <SecuredApp>
            <ReactFontLoader url = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap' />
            <ReactFontLoader url = 'https://fonts.googleapis.com/css2?family=Modak&display=swap' />
            <Router>
                <Switch>
                    <Route path = '/login'>
                        <Login />
                    </Route>
                    <Route path = '/register'>
                        <Register />
                    </Route>
                    <SecuredRoute path = { `/movies/:id` } >
                        <Movie />
                    </SecuredRoute>
                    <SecuredRoute path = '/movies'>
                        <Movies />
                    </SecuredRoute>
                    <Redirect to = '/movies' />
                </Switch>
            </Router>
        </SecuredApp>
    </React.StrictMode>,
    document.getElementById('root')
);
