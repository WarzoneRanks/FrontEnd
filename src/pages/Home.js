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
                  <div className="container-fluid">
                      <div className="row">
                          <div className="col-lg-8 col-md-8 col-12">
                              <div className="statsDiv">
                                <div className="welcomeDiv ">
                                    <h1 className="pageTitle">Welcome to WZ Ranks Beta!</h1>
                                    <h1 className="subTitle">First Steps</h1>
                                    <p>The first step is marking your profile as your home page! Use the search bar above to find your profile and click "Mark as my profile". </p>
                                    <p>Once you've done this you will have your profile on your home page and you'll be able to use WZ Ranks just as before.</p>

                                    <h1 className="subTitle">What's new?</h1>
                                    <p>We've added a whole bunch of new features including recent profiles, search history, display options, verified players, and much more.</p>
                                    <p>Please keep in mind this is only the beta stages and we are open to feedback, you can give us feedback by joining our discord.</p>
                                    
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-12">

                            </div>
                        </div>
                    </div>
            </div>
            </DocumentTitle>
        );
    };
}

export default Home;