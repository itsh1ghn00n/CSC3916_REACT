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
            <Card>
                <Card.Header>Movie Detail</Card.Header>
                <Card.Body>
                    <Image className="image" src={this.props.selectedMovie.imageUrl} thumbnail />
                </Card.Body>
                <ListGroup>
                    <ListGroupItem><h4>{this.props.selectedMovie.title}</h4></ListGroupItem>
                    <ListGroupItem>
                        {Array.isArray(this.props.selectedMovie.actors) ? this.props.selectedMovie.actors.map((actor, i) =>
                            <p key={i}>
                                <b>{actor.actorName}</b> {actor.characterName}
                            </p>) : 'No cast information available.'}
                    </ListGroupItem>
                    <ListGroupItem><h4><BsStarFill/> {this.props.selectedMovie.avgRating || 0}</h4></ListGroupItem>
                </ListGroup>
                <Card.Body>
                    <h5>Reviews</h5>
                    { reviews.length === 0 && <p>No reviews yet. Be the first to add one.</p> }
                    {reviews.map((review, i) =>
                        <Card key={i} className="mb-2">
                            <Card.Body>
                                <Card.Title>{review.username}</Card.Title>
                                <Card.Text>{review.review}</Card.Text>
                                <Card.Text><BsStarFill /> {review.rating}</Card.Text>
                            </Card.Body>
                        </Card>
                    )}
                </Card.Body>
                <Card.Body>
                    <h5>Submit a Review</h5>
                    {!this.props.loggedIn && <Alert variant="warning">You must be signed in to submit a review.</Alert>}
                    {this.state.statusMessage && <Alert variant={this.state.statusVariant}>{this.state.statusMessage}</Alert>}
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="rating">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control as="select" value={this.state.rating} onChange={this.handleChange} disabled={!this.props.loggedIn}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="review">
                            <Form.Label>Review</Form.Label>
                            <Form.Control as="textarea" rows={3} value={this.state.review} onChange={this.handleChange} disabled={!this.props.loggedIn} />
                        </Form.Group>
                        <Button type="submit" variant="primary" disabled={!this.props.loggedIn}>Submit Review</Button>
                    </Form>
                </Card.Body>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedMovie: state.movie.selectedMovie,
        loggedIn: state.auth.loggedIn
    }
}

export default connect(mapStateToProps)(MovieDetail);

