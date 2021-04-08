import React, { Component } from 'react';

import DocumentTitle from 'react-document-title';

import { Container, Row, Col, Button } from 'react-bootstrap';
import BigWhiteLogo from '../assets/images/Logo-Big-White.svg';

import {
    Link
} from 'react-router-dom';


class NotFound extends Component {

    componentDidMount() {

    }

    componentWillUnmount() {
    
    }


    render() {
        return (
            <DocumentTitle className="page" title='Warzone Stats - 404'>
            <div className="page home" id="page">
                <div className="aboutImage">
                    <img src={BigWhiteLogo}></img>
                </div>
                <div className="aboutPageContainer">
                    <h2>Who we are</h2>
                    <p>Hi there! My name is Parker and I'm a highschool student who enjoys development and is a huge warzone fan. I've played warzone almost since the start and have really enjoyed the game. I was a huge advocate for SBMM Warzone and the hard work they did. It allowed for there to be an equal playing field for streamers and players to see the kinds of lobbies everyone was being put in and it allowed for players to be able to see how their k/d, wins, etc stacks up against others.</p>
                    
                    <h2>What we want to do</h2>
                    <p>The whole point of this site is just to allow players to be able to use the functionality that SBMM Warzone had (apart from lobby rankings, read below), this includes ranking of stats like k/d, wins, etc, along with allowing a simple and basic interface to see match history that many other sites don't offer as they can be cluttered and hard to see the basic stats you are looking for. SBMM Warzone has been shut down by Activision due to a C&D put out by activision lawyers who had privacy concerns. You can read more about their story on their <a className="aboutLink" target="_blank" href="https://sbmmwarzone.com">website</a>.</p>
                    
                    <h2>Why are there no lobby rankings yet?</h2>
                    <p>Unfortunately Activision has decided to limit their API to now allow for non-partners to view the lifetime k/d's of players from their match history. You must know what platform the user is on and cannot do a global search like you could do before. This is most likely due to the fact that they don't want players data to be shared, however, this is not a problem after the update they put out several months ago which made players data private by default.</p>

                    <h2>Will there ever be lobby ranking?</h2>
                    <p>The hope is that SBMM Warzone can get in touch with Activision and sort out things so that their site can come back online, in the mean time though I will be spending time attempting to create a way for lobbies to be ranked with the limited API usage that is allowed now.</p>
                </div>
            </div>
            </DocumentTitle>
        );
    };
}

export default NotFound;