import React, { Component } from 'react';

import { NavLink } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome'

import LogoSmall from '../assets/images/Logo-Small-White.svg';

class Header extends Component {
    render() {
        return (
            <div className="header">
                    <h1 className="logoText"><NavLink to="/"><img src={LogoSmall}></img></NavLink></h1>
                    <Navbar collapseOnSelect expand="lg">
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto navLinks">
                                <NavLink to="/search"><p>Search Players</p></NavLink>
                                <NavLink to="/about"><p>About</p></NavLink>
                                <NavLink to="/favorites"><p>Favorites</p></NavLink>
                                <div className="extra-nav">
                                    <a href="https://www.buymeacoffee.com/parkersm1" target="_blank"><p><i class="far fa-coffee-togo"></i></p></a>
                                    <a href="https://discord.gg/A3d8kYpQ24" target="_blank"><p><i className="fab fa-discord"></i></p></a>
                                </div>

                            </Nav>
                            <Nav>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                   
            </div>
        );
    }
}

export default Header;