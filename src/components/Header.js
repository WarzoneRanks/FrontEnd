import React, { Component } from 'react';

import { NavLink, Link, Redirect } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav, Form, FormControl, Button, InputGroup } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import toast from 'react-hot-toast';

import LogoSmall from '../assets/images/Logo-Small-White.svg';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';


class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
          username: '',
          platform: '',
          redirect: null,
          displaySearch: false,
          displayHasHash: false,
          displayNoHash: true,
          searches: null
        };
    }

    updateSearchHistory = () => {
        if (localStorage.getItem("searches") != null) {
            let cachedUsers = JSON.parse(localStorage.getItem("searches"));
            this.setState({
                searches: cachedUsers.searches
            });
        }
        this.renderSearches();
    }


    componentDidMount() {
        this.setState({
            username: '',
            platform: 'xbl',
            redirect: null
        });
        this.updateSearchHistory();
        setInterval(this.updateSearchHistory, 1000);
    }

    componentWillUnmount() {
    
    }

    redirectToPage(e) {
        e.preventDefault();
    }

    handleInputFocus = () => {
        if (this.state.username.length > 0) {
            this.setState({ displaySearch: true });
        }
    };
    
    handleInputBlur = () => {
        setTimeout(() => {
            this.setState({ displaySearch: false });
        }, 200)
    };

    clearHistory = () => {
        console.log("Clearing search history");
        localStorage.removeItem("searches");
        this.setState({
            searches: null
        });
        this.renderSearches();
        toast.success('Cleared search history!');
    }

    setUsername(e) {
        if (e.target.value.length > 0) {
            this.setState({ displaySearch: true });
        } else {
            this.setState({ displaySearch: false });
        }
        this.setState({
            username: e.target.value
        });
        if (e.target.value.includes("#")) {
            this.setState({
                displayNoHash: false,
                displayHasHash: true
            });
        } else {
            this.setState({
                displayNoHash: true,
                displayHasHash: false
            });
        }
    } 

    setPlatform(e) {
        this.setState({
            platform: e.target.value
        });
    } 

    renderSearches() {
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


        if (this.state.searches != null) {
            return  this.state.searches.map((o) => {
                if (o.username.includes("%23")) {
                    return(
                        <Link className={`display-${this.state.displayHasHash}`} to={`/stats/${o.platform}/${o.username.replace("#", "%23")}`}>
                            <div className="searchOption">
                                <h1><i className={`fab fa-${getPlatformIcon(o.platform)}`}></i> Search for <span className="searchTerm">{o.username.replace("%23", "#")}</span></h1>
                            </div>
                        </Link>
                    )
                } else {
                    return(
                        <Link className={`display-${this.state.displayNoHash}`} to={`/stats/${o.platform}/${o.username}`}>
                            <div className="searchOption">
                                <h1><i className={`fab fa-${getPlatformIcon(o.platform)}`}></i> Search for <span className="searchTerm">{o.username}</span></h1>
                            </div>
                        </Link>
                    )
                }
            });
        }
    }

    render() {
        if (this.state.redirect !== null) {
            return <Redirect to={this.state.redirect} />
        }
        if (false) {
        return (
            <div className="header">
                    <h1 className="logoText"><NavLink to="/"><img src={LogoSmall}></img> <span className="badge badge-dark">BETA</span></NavLink></h1>
                    <Navbar collapseOnSelect expand="lg">
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto navLinks">
                                <NavLink to="/search"><p><i className="fa fa-search"></i><div>Search</div></p></NavLink>
                                <NavLink to="/about"><p><i className="fa fa-question"></i><div>About</div></p></NavLink>
                                <NavLink to="/"><p><i className="fa fa-home"></i><div>Home</div></p></NavLink>
                                <NavLink to="/favorites"><p><i className="fa fa-star"></i><div>Favorites</div></p></NavLink>
                                <NavLink to="/famous"><p><i className="fa fa-microphone"></i> <div>Famous</div></p></NavLink>
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
        } else {
            return (
                <div className="header">
                        <h1 className="logoText"><NavLink to="/"><img src={LogoSmall}></img> <span className="badge badge-dark">BETA</span></NavLink></h1>
                        <div className="row">
                            <div className="col-3"></div>
                            <div className="col-9 mainSection">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-lg-8 col-md-12 col-12">
                                            <div class="statsDiv navMargin">
                                                <Form inline className="searchForm" onSubmit={this.redirectToPage.bind(this)}>
                                                    <InputGroup>
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text>
                                                            <i className="fa fa-search"></i>
                                                            </InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <FormControl onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} onChange={ this.setUsername.bind(this) } value={this.state.username} type="text" placeholder="Search" className="noOutline mr-sm-2 searchField" />
                                                    </InputGroup>
                                                </Form>
                                                <div className={`searchOptions display-${this.state.displaySearch}`}>
                                                    <Link onClick={this.clearInput} className={`display-${this.state.displayNoHash}`} to={`/stats/xbl/${this.state.username}`}>
                                                        <div className="searchOption">
                                                            <h1><i className="fab fa-xbox"></i> Search for <span className="searchTerm">{this.state.username}</span></h1>
                                                        </div>
                                                    </Link>
                                                    <Link onClick={this.clearInput} className={`display-${this.state.displayNoHash}`} to={`/stats/psn/${this.state.username}`}>
                                                        <div className="searchOption">
                                                            <h1><i className="fab fa-playstation"></i> Search for <span className="searchTerm">{this.state.username}</span></h1>
                                                        </div>
                                                    </Link>
                                                    <Link onClick={this.clearInput} className={`display-${this.state.displayHasHash}`} to={`/stats/battle/${this.state.username.replace("#", "%23")}`}>
                                                        <div className="searchOption">
                                                            <h1><i className="fab fa-battle-net"></i> Search for <span className="searchTerm">{this.state.username}</span></h1>
                                                        </div>
                                                    </Link>
                                                    <p className="dropdownSubtext">Search History • <span onClick={this.clearHistory}>Clear History</span></p>
                                                    {this.renderSearches()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                       
                </div>
            );
        }
    }
}

export default Header;