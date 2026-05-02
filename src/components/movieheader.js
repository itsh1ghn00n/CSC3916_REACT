import React, { Component } from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {connect} from 'react-redux';
import {logoutUser} from "../actions/authActions";

class MovieHeader extends Component {
    logout() {
        this.props.dispatch(logoutUser());
    }

    render() {
        return (
            <div>
                <Navbar expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand>
                        XMBc Movie Reviews
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">

                        <Nav className="me-auto">
                            <LinkContainer to="/movielist">
                                <Nav.Link disabled={!this.props.loggedIn}>Movie List</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/search">
                                <Nav.Link disabled={!this.props.loggedIn}>Search</Nav.Link>
                            </LinkContainer>

                            <LinkContainer to={'/movie/' + (this.props.selectedMovie ? this.props.selectedMovie._id : '')}>
                                <Nav.Link disabled={!this.props.loggedIn || !this.props.selectedMovie}>
                                    Movie Detail
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>

                        <Nav className="ml-auto">
                            {this.props.loggedIn && (
                                <Navbar.Text style={{ marginRight: '30px' }}>
                                    {this.props.username}
                                </Navbar.Text>
                            )}

                            {this.props.loggedIn ? (
                                <Nav.Link onClick={this.logout.bind(this)}>Logout</Nav.Link>
                            ) : (
                                <LinkContainer to="/signin">
                                    <Nav.Link>Login</Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loggedIn : state.auth.loggedIn,
        username : state.auth.username,
        selectedMovie: state.movie.selectedMovie
    }
}

export default connect(mapStateToProps)(MovieHeader);