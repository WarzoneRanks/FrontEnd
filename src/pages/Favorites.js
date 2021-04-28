import React, { Component } from 'react';

import DocumentTitle from 'react-document-title';


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

    getFavorites = () => {
        if (localStorage.getItem("favorites") != null) {
            let cachedUsers = JSON.parse(localStorage.getItem("favorites"));
            this.setState({
                favorites: cachedUsers.favorites
            });
        }
    }


    componentDidMount() {
        this.setState({
            username: '',
            platform: 'xbl',
            favorites: null,
            redirect: null
        });
        this.getFavorites();
        setInterval(this.getFavorites, 1000);
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
                default:
                    break;
            }
        }

        

        if (this.state.favorites != null) {
            return  this.state.favorites.map(function(o) {
                return (
                    <Link key={`${o.platform}/${o.username}`} to={`/stats/${o.platform}/${o.username}`}>
                        <div className="favorite">
                            <p><i className={`fab fa-${getPlatformIcon(o.platform)}`}></i> {o.username.replace("%23", "#")}</p>
                        </div>
                    </Link>
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