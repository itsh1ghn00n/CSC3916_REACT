import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMovie, submitReview } from "../actions/movieActions";
import { Card, ListGroup, ListGroupItem, Form, Button, Alert } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs'
import { Image } from 'react-bootstrap';

class MovieDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: '5',
            review: '',
            statusMessage: '',
            statusVariant: 'success'
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        if (!this.props.selectedMovie || this.props.selectedMovie._id !== this.props.movieId || !this.props.selectedMovie.movieReviews) {
            dispatch(fetchMovie(this.props.movieId));
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { rating, review } = this.state;

        if (!review.trim()) {
            this.setState({ statusMessage: 'Please enter a review comment.', statusVariant: 'danger' });
            return;
        }

        const reviewData = {
            movieId: this.props.movieId,
            rating: Number(rating),
            review: review.trim()
        };

        const { dispatch } = this.props;
        dispatch(submitReview(reviewData)).then((res) => {
            if (res && res.success) {
                this.setState({
                    statusMessage: 'Review submitted successfully.',
                    statusVariant: 'success',
                    review: '','rating':'5'
                });
            } else {
                this.setState({ statusMessage: 'Unable to submit review. Please try again.', statusVariant: 'danger' });
            }
        }).catch(() => {
            this.setState({ statusMessage: 'Unable to submit review. Please try again.', statusVariant: 'danger' });
        });
    }

    render() {
        if (!this.props.selectedMovie) {
            return <div>Loading....</div>
        }

        const reviews = this.props.selectedMovie.movieReviews || [];

        return (
            <div className="page-container">
                <div className="movie-detail-container">
                
                {/* TOP SECTION */}
                <div className="movie-hero">
                <img 
                    className="movie-poster"
                    src={this.props.selectedMovie.imageUrl} 
                    alt={this.props.selectedMovie.title}
                />

                <div className="movie-info">
                    <h1>{this.props.selectedMovie.title}</h1>

                    <h4>{this.props.selectedMovie.genre}</h4>
                    <h4>
                    <BsStarFill /> {this.props.selectedMovie.avgRating?.toFixed(1) || 0}
                    </h4>

                    <h5>Cast</h5>
                    {Array.isArray(this.props.selectedMovie.actors) ? (
                    this.props.selectedMovie.actors.map((actor, i) => (
                        <p key={i}>
                        <strong>{actor.actorName}</strong> as {actor.characterName}
                        </p>
                    ))
                    ) : (
                    <p>No cast info</p>
                    )}
                </div>
                </div>

                <div className="reviews-section">
                <h3>Reviews</h3>

                {reviews.length === 0 && <p>No reviews yet.</p>}

                <div className="reviews-grid">
                    {reviews.map((review, i) => (
                        <div key={i} className="review-card">
                            <strong>{review.username}</strong>
                            <p>{review.review}</p>
                            <span>⭐ {review.rating}</span>
                        </div>
                    ))}
                </div>
                </div>

                {/* REVIEW FORM */}
                <div className="review-form">
                <h3>Submit a Review</h3>

                {!this.props.loggedIn && (
                    <Alert variant="warning">
                    You must be signed in to submit a review.
                    </Alert>
                )}

                {this.state.statusMessage && (
                    <Alert variant={this.state.statusVariant}>
                    {this.state.statusMessage}
                    </Alert>
                )}

                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                        as="select"
                        value={this.state.rating}
                        onChange={this.handleChange}
                        disabled={!this.props.loggedIn}
                    >
                        {[1,2,3,4,5].map(n => (
                        <option key={n} value={n}>{n}</option>
                        ))}
                    </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="review">
                    <Form.Label>Review</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={this.state.review}
                        onChange={this.handleChange}
                        disabled={!this.props.loggedIn}
                    />
                    </Form.Group>

                    <Button type="submit" disabled={!this.props.loggedIn}>
                    Submit Review
                    </Button>
                </Form>
                </div>
            </div>
            </div>
            );
    }
}

const mapStateToProps = state => {
    return {
        selectedMovie: state.movie.selectedMovie,
        loggedIn: state.auth.loggedIn
    }
}

export default connect(mapStateToProps)(MovieDetail);

