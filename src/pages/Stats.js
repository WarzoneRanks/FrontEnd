import React, { Component } from 'react';

import DocumentTitle from 'react-document-title';

import { Container, Row, Col, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Matches from '../components/Matches';

import {
    Link
} from 'react-router-dom';


class Stats extends Component {

    constructor(props) {
        super(props);
        this.state = {
          platform: null,
          username: null,
          stats: {
              level: null,
              kd: null,
              wins: null,
              gamesPlayed: null,
              weekly: {
                kd: null,
                kills: null,
                killsPerGame: null
              }
          },
          matches: null,
          isLoading: true,
          error: null
        };
    }

    updateStats() {
        fetch("https://wzapi.parkersmith.io/ping")
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
        if (localStorage.getItem(`${this.props.match.params.platform}/${this.props.match.params.username}`) != null) {
          console.log("Match Cache Exists");
          var cachedStats = JSON.parse(localStorage.getItem(`${this.props.match.params.platform}/${this.props.match.params.username}`));
          if (Date.now() - cachedStats.timeGrabbed < 600000) {
            console.log("Using cache");
            console.log(cachedStats.timeGrabbed);
            this.setState({
              stats: cachedStats,
              error: null,
              isLoading: false
            });
          } else {
            console.log("Fetching new because time");
            fetch(`https://wzapi.parkersmith.io/stats/${this.props.match.params.platform}/${this.props.match.params.username}`)
            .then(res => res.json())
            .then(
              (result) => {
                if (!result.error) {
                    var stats = {
                        timeGrabbed: Date.now(),
                        level: result.data.level,
                        kd: result.data.kd,
                        wins: result.data.wins,
                        gamesPlayed: result.data.gamesPlayed,
                        killsPerGame: result.data.killsPerGame,
                        weekly: {
                          kd: result.data.weekly.kd,
                          kills: result.data.weekly.kills,
                          killsPerGame: result.data.weekly.killsPerGame
                        },
                        ranking: {
                          kd: {
                            rank: result.data.ranking.kd.rank,
                            class: result.data.ranking.kd.class,
                            percentage: result.data.ranking.kd.percentage
                          },
                          wins: {
                            rank: result.data.ranking.wins.rank,
                            class: result.data.ranking.wins.class,
                            percentage: result.data.ranking.wins.percentage
                          },
                          killsPerGame: {
                            rank: result.data.ranking.killsPerGame.rank,
                            class: result.data.ranking.killsPerGame.class,
                            percentage: result.data.ranking.killsPerGame.percentage
                          }
                        }
                    }
                    this.setState({
                      stats: stats,
                      error: null,
                      isLoading: false
                    });
                    localStorage.setItem(`${this.props.match.params.platform}/${this.props.match.params.username}`, JSON.stringify(stats));
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
            )
          }
        } else {
          console.log("Fetching new because doesn't exist");
          fetch(`https://wzapi.parkersmith.io/stats/${this.props.match.params.platform}/${this.props.match.params.username}`)
          .then(res => res.json())
          .then(
            (result) => {
              if (!result.error) {
                  var stats = {
                      timeGrabbed: Date.now(),
                      level: result.data.level,
                      kd: result.data.kd,
                      wins: result.data.wins,
                      gamesPlayed: result.data.gamesPlayed,
                      killsPerGame: result.data.killsPerGame,
                      weekly: {
                        kd: result.data.weekly.kd,
                        kills: result.data.weekly.kills,
                        killsPerGame: result.data.weekly.killsPerGame
                      },
                      ranking: {
                        kd: {
                          rank: result.data.ranking.kd.rank,
                          class: result.data.ranking.kd.class,
                          percentage: result.data.ranking.kd.percentage
                        },
                        wins: {
                          rank: result.data.ranking.wins.rank,
                          class: result.data.ranking.wins.class,
                          percentage: result.data.ranking.wins.percentage
                        },
                        killsPerGame: {
                          rank: result.data.ranking.killsPerGame.rank,
                          class: result.data.ranking.killsPerGame.class,
                          percentage: result.data.ranking.killsPerGame.percentage
                        }
                      }
                  }
                  this.setState({
                    stats: stats,
                    error: null,
                    isLoading: false
                  });
                  localStorage.setItem(`${this.props.match.params.platform}/${this.props.match.params.username}`, JSON.stringify(stats));
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
          )
        }
        

        /*fetch(`https://wzapi.parkersmith.io/stats/${this.props.match.params.platform}/${this.props.match.params.username}/matches`)
        .then(res => res.json())
        .then(
          (result) => {
            if (!result.error) {
                console.log(result.data);
                this.setState({
                  matches: result.data,
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
        )*/
    }

    componentWillMount() {
        this.setState({
            platform: this.props.match.params.platform,
            username: this.props.match.params.username
        })
        this.updateStats();
    }

    componentDidUpdate(prevProps) {
        if (this.state.platform !== this.props.match.params.platform || this.state.username !== this.props.match.params.username ) {
          this.setState({ 
            platform: this.props.match.params.platform,
            username: this.props.match.params.username,
            isLoading: true
          });
          this.updateStats();
        }
    }

    componentWillUnmount() {
    
    }


    render() {
        const { platform, username, error, stats, matches, isLoading} = this.state;
        if (error != null) {
            return (
                <DocumentTitle className="page" title="Warzone Stats - Stats">
                <div className="page home" id="page">
                    <div className="pageError">
                      <p>An error has occured..</p>
                      <p>{error}</p>
                    </div>
                </div>
                </DocumentTitle>
            );
        } else if (isLoading) {
            return (
                <DocumentTitle className="page" title='Warzone Stats - Stats'>
                <div className="page home center m-t-20" id="page">
                    <FontAwesome 
                    name='spinner-third'
                    spin
                    size='2x'
                    className="m-t-20"
                    style={{ color: '#fff', 'marginTop': '15px', 'textAlign': 'center', 'margin': 'auto'}} />
                </div>
                </DocumentTitle>
            );
        } else {
            let pageName = `Warzone Stats - ${username}`;
            return (
                <DocumentTitle className="page" title={pageName}>
                <div className="page home" id="page">
                    <h1 className="username"><span className="level">{stats.level}</span> {username.replace("%23", "#")}</h1>
                    <div className="statsDiv container-fluid">
                      <h1 className="sub">Lifetime</h1>
                      <Row>
                        <div className="col-12 col-md-4 col-lg-4 marginBottom10">
                          <div className={`stat stat-bigger m-h-130 ${stats.ranking.kd.class}`}>
                            <h1 className="mid statTitle">k/d</h1>
                            <h1 className={`mid statBox ${stats.ranking.kd.class}-text`}>{stats.kd}</h1>
                            <h1 className="mid statRanking">{stats.ranking.kd.rank}</h1>
                            <div className="bottom">{stats.ranking.kd.percentage}</div>
                          </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-4">
                          <div className={`stat stat-bigger m-h-130 ${stats.ranking.wins.class}`}>
                            <h1 className="mid statTitle">wins</h1>
                            <h1 className={`mid statBox ${stats.ranking.wins.class}-text`}>{stats.wins}</h1>
                            <h1 className="mid statRanking">{stats.ranking.wins.rank}</h1>
                            <div className="bottom">{stats.ranking.wins.percentage}</div>
                          </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-4">
                          <div className={`stat stat-bigger m-h-130 ${stats.ranking.killsPerGame.class}`}>
                            <h1 className="mid statTitle">kills/game</h1>
                            <h1 className={`mid statBox ${stats.ranking.killsPerGame.class}-text`}>{stats.killsPerGame}</h1>
                            <h1 className="mid statRanking">{stats.ranking.killsPerGame.rank}</h1>
                            <div className="bottom">{stats.ranking.killsPerGame.percentage}</div>
                          </div>
                        </div>
                      </Row>
                      <h1 className="sub pad">Weekly</h1>
                      <Row>
                        <Col>
                          <div className="stat m-small gray">
                            <div className="bottom">k/d</div>
                            <h1 className="mid"><span>{stats.weekly.kd}{stats.weekly.kd > stats.kd && <FontAwesome 
                          name='long-arrow-up'
                          style={{ color: '#27ae60', 'fontSize': '21px', 'paddingLeft': '3px', 'paddingRight': '3px'}} />}{stats.weekly.kd < stats.kd && <FontAwesome 
                            name='long-arrow-down'
                            style={{ color: '#c0392b', 'fontSize': '21px', 'paddingLeft': '3px', 'paddingRight': '3px'}} />}</span></h1>
                          </div>
                        </Col> 
                        <Col>
                          <div className="stat m-small gray">
                            <div className="bottom">kills</div>
                            <h1 className="mid"><span>{stats.weekly.kills}</span></h1>
                          </div>
                        </Col>
                        <Col>
                          <div className="stat m-small gray">
                            <div className="bottom">kills/game</div>
                            <h1 className="mid"><span>{stats.weekly.killsPerGame}{stats.weekly.killsPerGame > stats.killsPerGame && <FontAwesome 
                          name='long-arrow-up'
                          style={{ color: '#27ae60', 'fontSize': '21px', 'paddingLeft': '3px', 'paddingRight': '3px'}} />}{stats.weekly.killsPerGame < stats.killsPerGame && <FontAwesome 
                            name='long-arrow-down'
                            style={{ color: '#c0392b', 'fontSize': '21px', 'paddingLeft': '3px', 'paddingRight': '3px'}} />}</span></h1>
                          </div>
                        </Col>
                      </Row>
                      <h1 className="sub pad">Matches</h1>
                      
                      <Matches platform={platform} username={username}></Matches>
                    </div>
                </div>
                </DocumentTitle>
            );
        }
    };
}

export default Stats;