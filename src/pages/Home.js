import React, { Component } from 'react';

import DocumentTitle from 'react-document-title';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';

import Stats from './Stats';
import Favorites from './Favorites';
import NewHome from './NewHome'

import {
    Link,
    Redirect
} from 'react-router-dom';


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
          username: '',
          platform: '',
          redirect: null
        };
    }


    componentDidMount() {
        this.setState({
            username: '',
            platform: 'xbl',
            redirect: null
        });
        if (localStorage.getItem("favoriteUser") != null) {
            let cachedUser = JSON.parse(localStorage.getItem("favoriteUser"));
            console.log(`/stats/${cachedUser.platform}/${cachedUser.username.replace("#", "%23")}`);
            this.setState({ redirect: `/stats/${cachedUser.platform}/${cachedUser.username.replace("#", "%23")}` });
        }
    }

    componentWillUnmount() {
    
    }

    redirectToPage(e) {
        e.preventDefault();
        console.log(`/stats/${this.state.platform}/${this.state.username.replace("#", "%23")}`);
        this.setState({ redirect: `/stats/${this.state.platform}/${this.state.username.replace("#", "%23")}` });
    }

    setUsername(e) {
        this.setState({
            username: e.target.value
        });
    } 

    setPlatform(e) {
        this.setState({
            platform: e.target.value
        });
    } 


    render() {
        if (this.state.redirect !== null) {
            return <NewHome />
        }
        return (
            <DocumentTitle className="page" title='Warzone Stats - Home'>
            <div className="page home" id="page">
                <Container className="searchBoxContainer">
                    <h1 className="pageTitle">Find a Player</h1>
                    <div class="searchBox">
                        <Form onSubmit={this.redirectToPage.bind(this)}>
                            <Form.Row>
                                    <Form.Group as={Col} xs={12} s={12} md={8} lg={8} controlId="formGridUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control onChange={ this.setUsername.bind(this) } value={this.state.username} type="user" placeholder="Enter username" />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridPlatform">
                                        <Form.Label>Platform</Form.Label>
                                        <Form.Control as="select" onChange={ this.setPlatform.bind(this) } defaultValue="xbl">
                                            <option value="xbl">Xbox</option>
                                            <option value="psn">Playstation</option>
                                            <option value="battle">Battle.net</option>
                                        </Form.Control>
                                    </Form.Group>
                            </Form.Row>
                            <div className="formButtonSearch">
                                <Button variant="primary" type="search">
                                    Search
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Container>
                <Favorites fromPage="Home" />
            </div>
            </DocumentTitle>
        );
    };
}

export default Home;