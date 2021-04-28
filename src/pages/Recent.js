import React, { Component } from 'react';

import DocumentTitle from 'react-document-title';


import {
    Link,
    Redirect
} from 'react-router-dom';


class Recent extends Component {

    constructor(props) {
        super(props);
        this.state = {
          username: '',
          platform: '',
          recent: null,
          redirect: null
        };
    }

    getRecents = () => {
        if (localStorage.getItem("recent") != null) {
            let cachedUsers = JSON.parse(localStorage.getItem("recent"));
            this.setState({
                recent: cachedUsers.recent
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
        this.getRecents();
        setInterval(this.getRecents, 1000);
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
            }
        }

        

        if (this.state.recent != null) {
            return  this.state.recent.map(function(o) {
                return (
                    <Link key={`${o.platform}/${o.username}`}  to={`/stats/${o.platform}/${o.username}`}>
                        <div className="favorite">
                            <p><i className={`fab fa-${getPlatformIcon(o.platform)}`}></i> {o.username.replace("%23", "#")}</p>
                        </div>
                    </Link>
                )
            });
        } else {
            return (
                <div>
                     
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
            <div className="page home" id="page">
                <h1 className="pageTitle aboutPageTitle">Recent Users</h1>
                <div className="favorites">
                    {this.renderFavorites()}
                </div>
            </div>
        );
    };
}

export default Recent;