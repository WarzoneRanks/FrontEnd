import React, { Component } from 'react';

import DocumentTitle from 'react-document-title';

import { Container, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Matches from '../components/Matches';
import toast from 'react-hot-toast';

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
          favText: " Favorite",
          minutesLeft: 10,
          secondsLeft: 0,
          displayOption: false
        };

        let baseURL = "https://app.warzoneranks.app";

        if (process.env.NODE_ENV == "development" || window.location.href.includes("beta.warzoneranks.app")) {
          baseURL = "https://app.warzoneranks.app/dev";
        }

        this.baseURL = baseURL;
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

        if (localStorage.getItem("recent") != null) {
          let recentUsersData = JSON.parse(localStorage.getItem("recent"));
          let username = this.props.match.params.username;
          let platform = this.props.match.params.platform;
          let recentUsers = recentUsersData.recent;
          let alreadyInList = false;
          let indexOfUser = 0;
          let counter = -1;
          recentUsers.map(function (o) {
            counter = counter + 1;
            if (o.username == username && o.platform == platform) {
              alreadyInList = true;
              indexOfUser = counter;
            }
          });
          if (alreadyInList) {
            recentUsers.splice(indexOfUser, 1);
            console.log("Trying to add " + {
              username: username,
              platform: platform
            })
            recentUsers.unshift({
              username: username,
              platform: platform
            });
            console.log("After adding: " + recentUsers);
          } else {
            if (recentUsers.length == 5) {
              recentUsers.pop();
            }
            console.log("Trying to add " + {
              username: username,
              platform: platform
            })
            recentUsers.unshift({
              username: username,
              platform: platform
            });
            console.log("After adding: " + recentUsers);
          }
          let newRecentJson = {
            recent: recentUsers
          }
          localStorage.setItem("recent", JSON.stringify(newRecentJson));
        } else {
          let username = this.props.match.params.username;
          let platform = this.props.match.params.platform;
          let recentUsers = [];
          recentUsers.unshift({
            username: username,
            platform: platform
          });
          let newRecentJson = {
            recent: recentUsers
          }
          localStorage.setItem("recent", JSON.stringify(newRecentJson));
        }

        if (localStorage.getItem("searches") != null) {
          let searchUsersData = JSON.parse(localStorage.getItem("searches"));
          let username = this.props.match.params.username;
          let platform = this.props.match.params.platform;
          let searchedUsers = searchUsersData.searches;
          let alreadyInList = false;
          let indexOfUser = 0;
          let counter = -1;
          searchedUsers.map(function (o) {
            counter = counter + 1;
            if (o.username == username && o.platform == platform) {
              alreadyInList = true;
              indexOfUser = counter;
            }
          });
          if (alreadyInList) {
            searchedUsers.splice(indexOfUser, 1);
            console.log("Trying to add " + {
              username: username,
              platform: platform
            })
            searchedUsers.unshift({
              username: username,
              platform: platform
            });
            console.log("After adding: " + searchedUsers);
          } else {
            if (searchedUsers.length == 100) {
              searchedUsers.pop();
            }
            console.log("Trying to add " + {
              username: username,
              platform: platform
            })
            searchedUsers.unshift({
              username: username,
              platform: platform
            });
            console.log("After adding: " + searchedUsers);
          }
          let newSearchedJson = {
            searches: searchedUsers
          }
          localStorage.setItem("searches", JSON.stringify(newSearchedJson));
        } else {
          let username = this.props.match.params.username;
          let platform = this.props.match.params.platform;
          let searchedUsers = [];
          searchedUsers.unshift({
            username: username,
            platform: platform
          });
          let newSearchedJson = {
            searches: searchedUsers
          }
          localStorage.setItem("searches", JSON.stringify(newSearchedJson));
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
            this.setState({isFav: false, "favText": " Favorite"});
            console.log('is not fav');
          }
        }
        fetch(`${this.baseURL}/ping`)
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
            fetch(`${this.baseURL}/stats/${this.props.match.params.platform}/${this.props.match.params.username}`)
            .then(res => res.json())
            .then(
              (result) => {
                if (!result.error) {
                    var stats = {
                        timeGrabbed: Date.now(),
                        roles: result.data.roles,
                        social: result.data.social,
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
          fetch(`${this.baseURL}/stats/${this.props.match.params.platform}/${this.props.match.params.username}`)
          .then(res => res.json())
          .then(
            (result) => {
              if (!result.error) {
                  var stats = {
                      timeGrabbed: Date.now(),
                      level: result.data.level,
                      roles: result.data.roles,
                      social: result.data.social,
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
        

        /*fetch(`https://app.warzoneranks.app/stats/${this.props.match.params.platform}/${this.props.match.params.username}/matches`)
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
            toast.success("No longer marked as your profile");
          } else {
            let favoriteUser = {
              username: this.state.username,
              platform: this.state.platform
            };
            localStorage.setItem('favoriteUser', JSON.stringify(favoriteUser));
            this.setState({isHome: true, homeText: ""});
            toast.success("Marked as your profile");
          
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
            this.setState({isFav: false, favText: " Favorite"});
            toast.success("Removed from favorites");
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
            toast.success("Added to favorites");
          }
        }

        let allActive = "";
        let brActive = "active";

        if (this.state.displayOption == true) {
            allActive = "active";
            brActive = "";
        } else {
            allActive = "";
            brActive = "active";
        }

        let showAll = () => {
            if (this.state.displayOption != true) {
                this.setState({
                    displayOption: true
                });
                allActive = "active";
                brActive = "";
            }
        }

        let showBR = () => {
            if (this.state.displayOption != false) {
                this.setState({
                    displayOption: false
                });
                allActive = "";
                brActive = "active";
            }
        }

        let userRoles = () => {
          return  this.state.stats.roles.map((o) => {
            if (o.roleID != 3) {
              return (
                <OverlayTrigger
                  key={'owner'}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`tooltip-owner`}>
                      <strong>{o.name}</strong>
                    </Tooltip>
                  }
                >
                  <div className={`siteRole ${o.class}`}>
                    <i className={o.className}></i>
                  </div>
                </OverlayTrigger>
              );
            }
          });
        }

        let verification = () => {
          return  this.state.stats.roles.map((o) => {
            if (o.roleID == 3) {
              return (
                <OverlayTrigger
                  key={'owner'}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`tooltip-owner`}>
                      <strong>{o.name}</strong>
                    </Tooltip>
                  }
                >
                  <div className={`${o.class}`}>
                    <i className={o.className}></i>
                  </div>
                </OverlayTrigger>
              );
                }
          });
        }

        let socials = () => {
          return  this.state.stats.social.map((o) => {
              if (o.name == "twitch") {
                return (
                  <a className="twitch social" target="_blank" href={`https://twitch.tv/${o.username}`}>
                    <i className="fab fa-twitch"></i>
                  </a>
                );
              }
              if (o.name == "twitter") {
                return (
                  <a className="twitter social" target="_blank" href={`https://twitter.com/${o.username}`}>
                    <i className="fab fa-twitter"></i>
                  </a>
                );
              }
          });
        }

        const { platform, username, error, stats, matches, isLoading, minutesLeft, secondsLeft} = this.state;



        if (error != null) {
          return (
              <DocumentTitle className="page" title='Warzone Stats - Stats'>
              <div className="page home" id="page">
                  <div className="container-fluid">
                      <div className="row">
                          <div className="col-lg-8 col-md-8 col-12">
                              <div className="statsDiv ">
                                  <div className="pageError">
                                    <p>An error has occured..</p>
                                    <p>{error}</p>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="col-lg-4 col-md-4 col-12">
                              <div className="statsDiv">
                                  <h1 className="sub pad">Uh oh!</h1>
                                  <div className="statsBox">
                                      <div className="mainStats">
                                          <h1 className="username">An error occured</h1>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              </DocumentTitle>
          );
      } else if (isLoading) {
          return (
              <DocumentTitle className="page" title='Warzone Stats - Stats'>
              <div className="page home" id="page">
                  <div className="container-fluid">
                      <div className="row">
                          <div className="col-lg-8 col-md-8 col-12">
                              <div className="statsDiv ">
                                  <h1 className="sub pad">{username.replace("%23", "#")}'s Matches</h1>
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
                          </div>
                          
                          <div className="col-lg-4 col-md-4 col-12">
                              <div className="statsDiv">
                                  <h1 className="sub pad">{username.replace("%23", "#")}'s Stats</h1>
                                  <div className="statsBox">
                                      <div className="mainStats">
                                          <h1 className="username">{username.replace("%23", "#")}</h1>
                                      </div>
                                  </div>
                                  <FontAwesome 
                                          name='spinner-third'
                                          spin
                                          size='2x'
                                          className="m-t-20"
                                          style={{ color: '#fff', 'marginTop': '15px', 'textAlign': 'center', 'margin': 'auto'}} />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              </DocumentTitle>
          );
      } else {
          let pageName = `Warzone Stats - Home`;
          return (
              <DocumentTitle className="page" title={pageName}>
              <div className="page home" id="page">
                  <div className="container-fluid">
                      <div className="row">
                          <div className="col-lg-8 col-md-8 col-12">
                              <div className="statsDiv ">
                                  <h1 className="sub pad">{username.replace("%23", "#")}'s Matches</h1>
                                  
                                  <Matches displayAlt={this.state.displayOption} platform={platform} username={username}></Matches>
                              </div>
                          </div>
                          
                          <div className="col-lg-4 col-md-4 col-12">
                              <div className="statsDiv">
                                  <h1 className="sub pad">{username.replace("%23", "#")}'s Stats</h1>
                                  <div className="statsBox first">
                                      <div className="mainStats">
                                          <h1 className="username">{userRoles()} {username.replace("%23", "#")} {verification()}</h1>
                                          <div className="socials">
                                            {socials()}
                                          </div>
                                          <div className="userOptions">
                                              <span onClick={makeHomeUser} className={`makeHomeB fav-${this.state.isHome}`}><i className="fal fa-home"></i>{this.state.homeText}</span>
                                              <span onClick={makeFavoriteUser} className={`makeFav favo-${this.state.isFav}`}><i className="far fa-star"></i>{this.state.favText}</span>
                                          </div>
                                          <div className="refreshTimer">
                                              <p><i className="far fa-clock"></i> {minutesLeft}:{ secondsLeft < 10 ? `0${ secondsLeft }` : secondsLeft }</p>
                                          </div>
                                          <div className="matchOptions">
                                            <div onClick={showAll} className={`matchOption ${allActive}`}>All</div>
                                            <div onClick={showBR} className={`matchOption ${brActive}`}>Just BR</div>
                                        </div>
                                      </div>
                                  </div>
                                  <div className="statsBox">
                                      <h1 className="statsTitle">
                                          Lifetime
                                      </h1>
                                      <div className="rankedStat">
                                          <h1>K/D</h1>
                                          <p>{stats.kd}</p>
                                          <p className={`ranking ${stats.ranking.kd.class}`}>{stats.ranking.kd.rank} - {stats.ranking.kd.percentage}</p>
                                      </div>
                                      <div className="rankedStat">
                                          <h1>Wins</h1>
                                          <p>{stats.wins}</p>
                                          <p className={`ranking ${stats.ranking.wins.class}`}>{stats.ranking.wins.rank} - {stats.ranking.wins.percentage}</p>
                                      </div>
                                      <div className="rankedStat">
                                          <h1>Kills/Game</h1>
                                          <p>{stats.killsPerGame}</p>
                                          <p className={`ranking ${stats.ranking.killsPerGame.class}`}>{stats.ranking.killsPerGame.rank} - {stats.ranking.killsPerGame.percentage}</p>
                                      </div>
                                  </div>

                                  <div className="statsBox">
                                      <h1 className="statsTitle">
                                          Weekly
                                      </h1>
                                      <div className="rankedStat">
                                          <h1>K/D</h1>
                                          <p><span>{stats.weekly.kd}{stats.weekly.kd > stats.kd && <FontAwesome 
                        name='long-arrow-up'
                        style={{ color: '#27ae60', 'fontSize': '21px', 'paddingLeft': '3px', 'paddingRight': '3px'}} />}{stats.weekly.kd < stats.kd && <FontAwesome 
                          name='long-arrow-down'
                          style={{ color: '#c0392b', 'fontSize': '21px', 'paddingLeft': '3px', 'paddingRight': '3px'}} />}</span></p>
                                      </div>
                                      <div className="rankedStat">
                                          <h1>Kills</h1>
                                          <p>{stats.weekly.kills}</p>
                                      </div>
                                      <div className="rankedStat">
                                          <h1>Kills/Game</h1>
                                          <p><span>{stats.weekly.killsPerGame}{stats.weekly.killsPerGame > stats.killsPerGame && <FontAwesome 
                        name='long-arrow-up'
                        style={{ color: '#27ae60', 'fontSize': '21px', 'paddingLeft': '3px', 'paddingRight': '3px'}} />}{stats.weekly.killsPerGame < stats.killsPerGame && <FontAwesome 
                          name='long-arrow-down'
                          style={{ color: '#c0392b', 'fontSize': '21px', 'paddingLeft': '3px', 'paddingRight': '3px'}} />}</span></p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              </DocumentTitle>
          );
      }
  };
}

export default Stats;