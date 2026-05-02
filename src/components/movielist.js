import React, { Component } from 'react';
import { fetchMovies, setMovie } from "../actions/movieActions";
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

class MovieList extends Component {

    componentDidMount() {
        this.props.dispatch(fetchMovies());
    }

    handleClick = (movie) => {
        this.props.dispatch(setMovie(movie));
    }

    render() {
        const { movies } = this.props;

        if (!movies) {
            return <div style={{ color: "white" }}>Loading...</div>;
        }

        return (
            <div>
                <h2 style={{ color: "white", marginLeft: "20px" }}>
                    XMBc Movie List
                </h2>

                <div className="movie-grid">
                    {movies.map((movie) => (
                        <LinkContainer
                            key={movie._id}
                            to={`/movie/${movie._id}`}
                            onClick={() => this.handleClick(movie)}
                        >
                            <div className="movie-card">
                                <img src={movie.imageUrl} alt={movie.title} />

                                <div className="movie-overlay">
                                    <h5>{movie.title}</h5>
                                    <p>⭐ {movie.avgRating?.toFixed(1) || 'N/A'}</p>
                                </div>
                            </div>
                        </LinkContainer>
                    ))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    movies: state.movie.movies
});

export default connect(mapStateToProps)(MovieList);