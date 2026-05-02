import actionTypes from '../constants/actionTypes';
//import runtimeEnv from '@mars/heroku-js-runtime-env'
const env = process.env;

function authHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `jwt ${token}` } : {})
    };
}

function moviesFetched(movies) {
    return {
        type: actionTypes.FETCH_MOVIES,
        movies: movies
    }
}

function movieFetched(movie) {
    return {
        type: actionTypes.FETCH_MOVIE,
        selectedMovie: movie
    }
}

function moviesSearched(searchResults) {
    return {
        type: actionTypes.SEARCH_MOVIES,
        searchResults: searchResults
    }
}

function movieSet(movie) {
    return {
        type: actionTypes.SET_MOVIE,
        selectedMovie: movie
    }
}

export function setMovie(movie) {
    return dispatch => {
        dispatch(movieSet(movie));
    }
}

export function fetchSearch(query) {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/movies/search`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ query }),
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            dispatch(moviesSearched(res));
        }).catch((e) => console.log(e));
    }
}

export function submitReview(reviewData) {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(reviewData),
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            dispatch(fetchMovie(reviewData.movieId));
            dispatch(fetchMovies());
            return res;
        }).catch((e) => console.log(e));
    }
}

export function fetchMovie(movieId) {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/movies/${movieId}`, {
            method: 'GET',
            headers: authHeaders(),
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            dispatch(movieFetched(res));
        }).catch((e) => console.log(e));
    }
}

export function fetchMovies() {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/movies`, {
            method: 'GET',
            headers: authHeaders(),
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            dispatch(moviesFetched(res));
        }).catch((e) => console.log(e));
    }
}