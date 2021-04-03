import React, { Component } from 'react';

import { NavLink } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome'

class Header extends Component {
    render() {
        return (
            <div className="header">
                <Row>
                    <Col><h1 className="logoText">Warzone Ranks</h1></Col>
                    <Col xs={8}>
                    <Navbar collapseOnSelect expand="lg">
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto navLinks">
                                <NavLink to="/"><p>Search Players</p></NavLink>
                                <NavLink to="/about"><p>About</p></NavLink>
                            </Nav>
                            <Nav>
                            </Nav>
                        </Navbar.Collapse>
                        </Navbar>
                    </Col>
                   
                </Row>
            </div>
        );
    }
}

export default Header;