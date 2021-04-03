import React, { Component } from 'react';

import DocumentTitle from 'react-document-title';

import { Container, Row, Col, Button } from 'react-bootstrap';

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
                <h1>404 - Not Found</h1>
            </div>
            </DocumentTitle>
        );
    };
}

export default NotFound;