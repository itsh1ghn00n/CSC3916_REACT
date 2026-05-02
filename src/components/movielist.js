import React, { Component } from 'react';
import { fetchMovies } from "../actions/movieActions";
import { setMovie } from "../actions/movieActions";
import {connect} from 'react-redux';
import {Image, Nav} from 'react-bootstrap';
import { Carousel } from 'react-bootstrap';
import { BsStarFill} from 'react-icons/bs'
import {LinkContainer} from 'react-router-bootstrap';

class MovieList extends Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchMovies());
    }

    handleSelect(selectedIndex, e) {
        const {dispatch} = this.props;
        dispatch(setMovie(this.props.movies[selectedIndex]));
    }

    handleClick = (movie) => {
        const {dispatch} = this.props;
        dispatch(setMovie(movie));
    }

    render() {
        const MovieList = ({ movieList }) => {
        if (!movieList) {
            return <div>Loading....</div>;
        }

        return (
            <div className="movie-row-container">
                {movieList.map((movie) => (
                    <LinkContainer
                    key={movie._id}
                    to={'/movie/' + movie._id}
                    onClick={() => this.handleClick(movie)}
                    >
                    <div className="movie-card">
                        <img src={movie.imageUrl} alt={movie.title} />

                        <div className="movie-overlay">
                        <h4>{movie.title}</h4>
                        <p>⭐ {movie.avgRating?.toFixed(1)}</p>
                        </div>
                    </div>
                    </LinkContainer>
                ))}
                </div>
        );
        };
        return (
            <MovieList movieList={this.props.movies} />
        )
    }
}

const mapStateToProps = state => {
    return {
        movies: state.movie.movies
    }
}

export default connect(mapStateToProps)(MovieList);

