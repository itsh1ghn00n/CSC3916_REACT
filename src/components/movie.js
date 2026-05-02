import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovie } from "../actions/movieActions";
import MovieDetail from "../components/moviedetail"

function Movie() {
    const params = useParams();
    const movieId = params.movieId;
    const dispatch = useDispatch();
    const selectedMovie = useSelector(state => state.movie.selectedMovie);

    useEffect(() => {
        if (!selectedMovie || selectedMovie._id !== movieId) {
            dispatch(fetchMovie(movieId));
        }
    }, [movieId, selectedMovie, dispatch]);

    return (<MovieDetail movieId={movieId} />)
}

export default Movie;