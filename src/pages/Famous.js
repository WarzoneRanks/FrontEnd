import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import DocumentTitle from 'react-document-title';

import { Container, Row, Col, Button } from 'react-bootstrap';
import BigWhiteLogo from '../assets/images/Logo-Big-White.svg';

import {
    Link
} from 'react-router-dom';


export default class Matches extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            famousPlayers: null,
            isLoading: true,
            error: null
        }
    }

    updateStats() {
        fetch("https://app.warzoneranks.app/ping")
        .then(res => res.json())
        .then(
          (result) => {
            this.updateStatsPush();
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            let APIerror = "We are currently experiencing some API issues, please try again soon..";
            this.setState({
                error: APIerror,
                isLoading: false
            });
          }
        )
    }

    updateStatsPush() {
        fetch(`https://app.warzoneranks.app/stats/famous`)
                .then(res => res.json())
                .then(
                (result) => {
                    if (!result.error) {
                        this.setState({
                            famousPlayers: result.data,
                            error: null,
                            isLoading: false
                        });
                    } else {
                        this.setState({
                        error: result.msg,
                        isLoading: false
                        });
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                    error,
                    isLoading: false
                    });
                    console.log(error);
                }
            );
    }

    componentWillMount() {
        this.updateStats();
    }

    componentDidUpdate(prevProps) {
        if (this.state.famousPlayers == null) {
            this.setState({ 
                isLoading: true
            });
            this.updateStats();
        }
    }
    

    renderRows() {
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
        return  this.state.famousPlayers.map(function(o) {
           return (
               <div className="col-12 col-md-4 col-lg-4">
                <div className="famousPlayer">
                    <img src={o.picture}></img>
                    <h1>{o.name}</h1>
                    <p><i className={`fab fa-${getPlatformIcon(o.platform)}`}></i> {o.username.replace("%23", "#").replace("%25", "#")}</p>
                    <div className="socials">
                        <a target="_blank" href={`https://twitch.tv/${o.social.twitch}`}><i className="fab fa-twitch"></i></a>
                        <a target="_blank" href={`https://twitter.com/${o.social.twitter}`}><i className="fab fa-twitter"></i></a>
                    </div>
                    <Link to={`/stats/${o.platform}/${o.username}`}><button className="btn btn-success">Visit Profile</button></Link>
                </div>
               </div>
           )
        });
    }

    render() {
        if (this.state.error != null) {
            return (     
                <DocumentTitle className="page" title='Warzone Stats - Famous Players'>
                <div className="page home" id="page">
                    <div className="pageError">
                      <p>An error has occured..</p>
                      <p>{this.state.error}</p>
                    </div>
                </div>
                </DocumentTitle>
            );
        } else if (this.state.isLoading) {
            return (
                <DocumentTitle className="page" title='Warzone Stats - Famous Players'>
                    <div className="page home center m-t-20" id="page">
                        <FontAwesome 
                        name='spinner-third'
                        spin
                        size='2x'
                        className="m-t-20"
                        style={{ color: '#fff', 'marginTop': '15px', 'textAlign': 'center', 'margin': 'auto'}} />
                        <div className="pageError">
                        <p>Working on pulling your data...</p>
                        <p>Load time are longer than normal currently as we rank stats live</p>
                        </div>
                    </div>
                </DocumentTitle>
            );
        } else {
            return (
                <DocumentTitle className="page home" title='Warzone Stats - Famous Players'>
                    <div className="page home center m-t-20" id="page">
                        <h1 className="pageTitle aboutPageTitle">Famous Players</h1>
                        <div className="famousPlayers row">
                            {this.renderRows()}
                        </div>
                    </div>
                </DocumentTitle>
            );
        }
    }
}
