import React, { Component } from 'react';

import DocumentTitle from 'react-document-title';


import {
    Link,
    Redirect
} from 'react-router-dom';


class Social extends Component {

    constructor(props) {
        super(props);
        this.state = {
          username: '',
          platform: '',
          recent: null,
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
                <h1 className="pageTitle aboutPageTitle">Social</h1>
                <div className="favorites">
                    <a target="_blank" href="https://discord.gg/A3d8kYpQ24">
                        <div className="favorite">
                            <p><i className={`fab fa-discord`}></i> Join our discord</p>
                        </div>
                    </a>
                    <a target="_blank" href="https://twitter.com/WZRanks">
                        <div className="favorite">
                            <p><i className={`fab fa-twitter`}></i> Follow our twitter</p>
                        </div>
                    </a>
                </div>
            </div>
        );
    };
}

export default Social;