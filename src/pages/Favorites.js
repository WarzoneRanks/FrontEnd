import React, { Component } from 'react';

import DocumentTitle from 'react-document-title';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';

import Stats from './Stats';

import {
    Link,
    Redirect
} from 'react-router-dom';


class Favorites extends Component {

    constructor(props) {
        super(props);
        this.state = {
          username: '',
          platform: '',
          favorites: null,
          redirect: null
        };
    }


    componentDidMount() {
        this.setState({
            username: '',
            platform: 'xbl',
            favorites: null,
            redirect: null
        });
        if (localStorage.getItem("favorites") != null) {
            let cachedUsers = JSON.parse(localStorage.getItem("favorites"));
            console.log(cachedUsers);
            this.setState({
                favorites: cachedUsers.favorites
            });
        }
    }

    componentWillUnmount() {
    
    }

    redirectToPage() {
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

    renderFavorites() {
        console.log(this.state.favorites);
        function getPlatformIcon(platform) {
            switch(platform) {
                case "xbl": 
                    return "xbox";
                    break;
                case "psn": 
                    return "playstation";
                    break;
                case "battle": 
                    return "battle-net";
                    break;
            }
        }

        

        if (this.state.favorites != null) {
            return  this.state.favorites.map(function(o) {
                return (
                    <div className="favorite">
                        <p><i className={`fab fa-${getPlatformIcon(o.platform)}`}></i> {o.username.replace("%23", "#")}</p>
                        <a href={`/stats/${o.platform}/${o.username}`}><button className="btn btn-success">Visit Profile</button></a>
                    </div>
                )
            });
        } else {
            return (
                <div className="pageError">
                      <h3>You have no favorites!</h3>
                      <p>Add some by clicking the <i className="far fa-star"></i> next to a users profile</p>
                </div>
            );
        }
    }


    render() {
        if (this.state.redirect !== null) {
            return <Redirect to={this.state.redirect} />
        }
        let title = "Favorites";
        if (this.props.fromPage != null) {
            title = this.props.fromPage;
        }
        return (
            <DocumentTitle className="page" title={`Warzone Stats - ${title}`}>
            <div className="page home" id="page">
                <h1 className="pageTitle aboutPageTitle">Favorite Users</h1>
                <div className="favorites">
                    {this.renderFavorites()}
                </div>
            </div>
            </DocumentTitle>
        );
    };
}

export default Favorites;