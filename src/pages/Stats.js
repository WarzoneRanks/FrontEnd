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
          error: null,
          isHome: null,
          homeText: " Mark as my profile",
          isFav: null,
          favText: " Add to favorites",
          minutesLeft: 10,
          secondsLeft: 0
        };
    }

    updateStats() {
        if (localStorage.getItem("favoriteUser") != null) {
          let cachedUser = JSON.parse(localStorage.getItem("favoriteUser"));
          if (this.props.match.params.username == cachedUser.username && this.props.match.params.platform == cachedUser.platform) {
            this.setState({isHome: true, "homeText": ""});
            console.log('is home');
          } else {
            this.setState({isHome: false, "homeText": " Mark as my profile"});
            console.log('is not home');
          }
        }

        if (localStorage.getItem("favorites") != null) {
          let cachedUsers = JSON.parse(localStorage.getItem("favorites"));
          let username = this.props.match.params.username;
          let platform = this.props.match.params.platform;
          console.log(username, platform);
          let isFav = false;
          cachedUsers.favorites.map(function(o) {
            console.log(o.username, o.platform);
            if (o.username == username && o.platform == platform) {
              isFav = true;
            } 
          });
          if (isFav) {
            this.setState({isFav: true, "favText": ""});
            console.log('is fav');
          } else {
            this.setState({isFav: false, "favText": " Add to favorites"});
            console.log('is not fav');
          }
        }
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
        function millisToMinutesAndSeconds(millis) {
          var minutes = Math.floor(millis / 60000);
          var seconds = ((millis % 60000) / 1000).toFixed(0);
          let timeLeft = {
            minutes: minutes,
            seconds: seconds
          };
          return timeLeft;
        }
        if (localStorage.getItem(`${this.props.match.params.platform}/${this.props.match.params.username}/matches`) != null) {
          console.log("Match Cache Exists");
          var cachedStats = JSON.parse(localStorage.getItem(`${this.props.match.params.platform}/${this.props.match.params.username}/matches`));
          if (Date.now() - cachedStats.timeGrabbed < 600000) {
            let difference = Date.now() - cachedStats.timeGrabbed;
            let timeLeft = millisToMinutesAndSeconds(600000 - difference);
            this.setState({
              minutesLeft: timeLeft.minutes,
              secondsLeft: timeLeft.seconds
            });
          } else {
            this.setState({
              minutesLeft: 10,
              secondsLeft: 0
            });

          }
        }
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
        this.refreshTimer = setInterval(() => {
          const { secondsLeft, minutesLeft } = this.state
          if (secondsLeft > 0) {
            this.setState(({ secondsLeft }) => ({
              secondsLeft: secondsLeft - 1
            }))
          }
          if (secondsLeft === 0) {
            if (minutesLeft === 0) {
              this.updateStats();
            } else {
              this.setState(({ minutesLeft }) => ({
                minutesLeft: minutesLeft - 1,
                secondsLeft: 59
              }))
            }
          }
        }, 1000);
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
        let makeHomeUser = () => {
          if (this.state.isHome) {
            localStorage.removeItem('favoriteUser');
            this.setState({isHome: false, homeText: " Mark as my profile"});
          } else {
            let favoriteUser = {
              username: this.state.username,
              platform: this.state.platform
            };
            localStorage.setItem('favoriteUser', JSON.stringify(favoriteUser));
            this.setState({isHome: true, homeText: ""});
          
          }
        }

        let makeFavoriteUser = () => {
          let username = this.state.username;
          let platform = this.state.platform;
          if (this.state.isFav) {
            let counter = -1;
            let index;
            let cachedUsers = JSON.parse(localStorage.getItem("favorites"));
            let workingArray = cachedUsers.favorites;
            workingArray.map(function(o) {
              counter = counter + 1;
              if (o.username == username && o.platform == platform) {
                index = counter;
              } 
            });
            workingArray.splice(index, 1);
            if (workingArray.length != 0) {
              let newJson = {
                favorites: workingArray
              }
              localStorage.setItem("favorites", JSON.stringify(newJson));
            } else {
              localStorage.removeItem("favorites");
            }
            this.setState({isFav: false, favText: " Add to favorites"});
          } else {
            if (localStorage.getItem("favorites") != null) {
              let cachedUsers = JSON.parse(localStorage.getItem("favorites"));
              let workingArray = cachedUsers.favorites;
              let favoriteUser = {
                username: username,
                platform: platform
              };
              workingArray.push(favoriteUser);
              let newJson = {
                favorites: workingArray
              }
              localStorage.setItem("favorites", JSON.stringify(newJson));
            } else {
              let workingArray = [];
              let favoriteUser = {
                username: username,
                platform: platform
              };
              workingArray.push(favoriteUser);
              let newJson = {
                favorites: workingArray
              }
              localStorage.setItem("favorites", JSON.stringify(newJson));
            }
            this.setState({isFav: true, favText: ""});
          }
        }
        const { platform, username, error, stats, matches, isLoading, minutesLeft, secondsLeft} = this.state;



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
                    <div className="pageError">
                      <p>Working on pulling your data...</p>
                      <p>Load time are longer than normal currently as we rank stats live</p>
                    </div>
                </div>
                </DocumentTitle>
            );
        } else {
            let pageName = `Warzone Stats - ${username}`;
            return (
                <DocumentTitle className="page" title={pageName}>
                <div className="page home" id="page">
                    <h1 className="username"><span className="level">{stats.level}</span> {username.replace("%23", "#")} 
                      <div className="refreshTimer">
                        <p><i className="far fa-clock"></i> {minutesLeft}:{ secondsLeft < 10 ? `0${ secondsLeft }` : secondsLeft }</p>
                      </div>
                    </h1>
                    <div className="userOptions">
                      <span onClick={makeHomeUser} className={`makeHomeB fav-${this.state.isHome}`}><i className="fal fa-home"></i>{this.state.homeText}</span>
                      <span onClick={makeFavoriteUser} className={`makeFav favo-${this.state.isFav}`}><i className="far fa-star"></i>{this.state.favText}</span>
                    </div>
                    
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