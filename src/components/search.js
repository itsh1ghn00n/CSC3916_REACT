import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSearch, setMovie } from '../actions/movieActions';
import { Form, Button, Card, Row, Col, Image, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsStarFill } from 'react-icons/bs';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            statusMessage: ''
        };
    }

    handleChange = (event) => {
        this.setState({ query: event.target.value, statusMessage: '' });
    }

    handleSearch = (event) => {
        event.preventDefault();
        const query = this.state.query.trim();
        if (!query) {
            this.setState({ statusMessage: 'Please enter a movie title or actor name to search.' });
            return;
        }

        this.props.dispatch(fetchSearch(query));
    }

    render() {
        const { searchResults, loggedIn } = this.props;
        return (
            <div className="search-page p-3">
                <Card className="mb-4">
                    <Card.Body>
                        <Card.Title>Search Movies</Card.Title>
                        {!loggedIn && <Alert variant="warning">You must log in before searching movies.</Alert>}
                        <Form onSubmit={this.handleSearch}>
                            <Form.Row>
                                <Col xs={12} md={10} className="mb-2">
                                    <Form.Control
                                        placeholder="Search by title or actor"
                                        value={this.state.query}
                                        onChange={this.handleChange}
                                        disabled={!loggedIn}
                                    />
                                </Col>
                                <Col xs={12} md={2}>
                                    <Button type="submit" disabled={!loggedIn} block>Search</Button>
                                </Col>
                            </Form.Row>
                        </Form>
                        {this.state.statusMessage && <Alert className="mt-3" variant="danger">{this.state.statusMessage}</Alert>}
                    </Card.Body>
                </Card>
                <div>
                    {searchResults && searchResults.length > 0 ? (
                        <div className="movie-grid">
                            {searchResults.map((movie) => (
                                <div key={movie._id} className="movie-card">
                                <Link
                                    to={`/movie/${movie._id}`}
                                    onClick={() => this.props.dispatch(setMovie(movie))}
                                >
                                    <img src={movie.imageUrl} alt={movie.title} />
                                    <div className="movie-overlay">
                                    <h5>{movie.title}</h5>
                                    <p>⭐ {movie.avgRating?.toFixed(1) || 'N/A'}</p>
                                    </div>
                                </Link>
                                </div>
                            ))}
                            </div>
                    ) : (
                        <div>No search results yet.</div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    searchResults: state.movie.searchResults,
    loggedIn: state.auth.loggedIn
});

export default connect(mapStateToProps)(Search);
