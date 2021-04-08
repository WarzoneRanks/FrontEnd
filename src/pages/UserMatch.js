import React, { Component } from 'react';

import DocumentTitle from 'react-document-title';

import { Container, Row, Col, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import {
    Link
} from 'react-router-dom';


class Match extends Component {

    constructor(props) {
        super(props);
        this.state = {
          matchID: null,
          place: null,
          isLoading: true,
          error: null,
          matchStats: null,
          displayOption: 0
        };
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
        fetch(`https://app.warzoneranks.app/matches/fullMatch/${this.props.match.params.matchID}`)
            .then(res => res.json())
            .then(
              (result) => {
                if (!result.error) {
                    let playersCounted = result.data.ranking.players;
                    let accuracy = (playersCounted / 115) * 100;
                    let newPlayers = result.data.allPlayers;
                    let medianKD = Number.parseFloat(result.data.ranking.averageKD);
                    let averageKD = Number.parseFloat(result.data.ranking.averageKD_avg);
                    var matchStats = {
                        allPlayers: newPlayers,
                        timeGrabbed: Date.now(),
                        mode: result.data.mode,
                        start: result.data.startTime,
                        ranking: {
                            medianKD: medianKD.toFixed(2),
                            averageKD: averageKD.toFixed(2),
                            rank: result.data.ranking.rank,
                            class: result.data.ranking.class,
                            percentage: result.data.ranking.percentage,
                            chart: result.data.ranking.kdChart,
                            accuracy: accuracy.toFixed(0)
                        }
                    }
              
                    this.setState({
                      matchStats: matchStats,
                      error: null,
                      isLoading: false
                    });
                    localStorage.setItem(`/match/${this.props.match.params.matchID}`, JSON.stringify(matchStats));
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
        this.setState({
            matchID: this.props.match.params.matchID,
            place: this.props.match.params.place
        })
        this.updateStats();
    }

    componentDidUpdate(prevProps) {
        if (this.state.matchID !== this.props.match.params.matchID) {
          this.setState({ 
            matchID: this.props.match.params.matchID,
            place: this.props.match.params.place,
            isLoading: true
          });
          this.updateStats();
        }
    }

    componentWillUnmount() {
    
    }

    renderTeam() {
        let isWin = (placement) => {
            if (placement == 1) {
                return "place win";
            } else {
                return "place";
            }

        }
        let place = this.state.place;
        return this.state.matchStats.allPlayers.map(function(p) {
            if (p.metadata.placement.value == place) {
                if (p.attributes.lifeTimeStats != null) {
                    let headshot = (p.stats.headshots.value / p.stats.kills.value) * 100;
                    if (Number.isNaN(headshot)) {
                        headshot = 0.00;
                    }
                    return (
                        <tr className="playerT">
                            <th className="playerName"><div className={isWin(p.metadata.placement.value)}>{p.metadata.placement.value}</div> {p.metadata.platformUserHandle}</th>
                            <th>{p.stats.kills.value}</th>
                            <th>{p.attributes.lifeTimeStats.kdRatio}</th>
                            <th>{p.stats.damageDone.value}</th>
                            <th>{p.stats.deaths.value}</th>
                            <th>{headshot.toFixed(2)}%</th>
                        </tr>
                    );
                } else {
                    let headshot = (p.stats.headshots.value / p.stats.kills.value) * 100;
                    if (Number.isNaN(headshot)) {
                        headshot = 0.00;
                    }
                    return (
                        <tr className="playerT">
                            <th className="playerName"><div className={isWin(p.metadata.placement.value)}>{p.metadata.placement.value}</div> {p.metadata.platformUserHandle}</th>
                            <th>{p.stats.kills.value}</th>
                            <th>{p.stats.kdRatio.displayValue} <span className="tag"><i class="fad fa-hourglass"></i></span></th>
                            <th>{p.stats.damageDone.value}</th>
                            <th>{p.stats.deaths.value}</th>
                            <th>{headshot.toFixed(2)}%</th>
                        </tr>
                    );
                }
            }
        });
    }


    renderPlayers() {
        let isWin = (placement) => {
            if (placement == 1) {
                return "place win";
            } else {
                return "place";
            }

        }

        return this.state.matchStats.allPlayers.map(function(p) {
            if (p.attributes.lifeTimeStats != null) {
                let headshot = (p.stats.headshots.value / p.stats.kills.value) * 100;
                if (Number.isNaN(headshot)) {
                    headshot = 0.00;
                }
                return (
                    <tr className="playerT">
                        <th className="playerName"><div className={isWin(p.metadata.placement.value)}>{p.metadata.placement.value}</div> {p.metadata.platformUserHandle}</th>
                        <th>{p.stats.kills.value}</th>
                        <th>{p.attributes.lifeTimeStats.kdRatio}</th>
                        <th>{p.stats.damageDone.value}</th>
                        <th>{p.stats.deaths.value}</th>
                        <th>{headshot.toFixed(2)}%</th>
                    </tr>
                );
            } else {
                let headshot = (p.stats.headshots.value / p.stats.kills.value) * 100;
                if (Number.isNaN(headshot)) {
                    headshot = 0.00;
                }
                return (
                    <tr className="playerT">
                        <th className="playerName"><div className={isWin(p.metadata.placement.value)}>{p.metadata.placement.value}</div> {p.metadata.platformUserHandle}</th>
                        <th>{p.stats.kills.value}</th>
                        <th>{p.stats.kdRatio.displayValue} <span className="tag"><i class="fad fa-hourglass"></i></span></th>
                        <th>{p.stats.damageDone.value}</th>
                        <th>{p.stats.deaths.value}</th>
                        <th>{headshot.toFixed(2)}%</th>
                    </tr>
                );
            }
        });
    }

    renderMatchStats() {
        

        if (this.state.displayOption == 0) {
            return (
                <div>
                    <h1 className="sub pad">YOUR TEAM</h1>
                    <table className="playersTable">
                        <tr className="top">
                            <th>NAME</th>
                            <th>KILLS</th>
                            <th>K/D</th>
                            <th>DMG</th>
                            <th>DEATHS</th>
                            <th>HEADSHOT %</th>
                        </tr>
                        {this.renderTeam()}

                    </table>

                    <h1 className="sub pad">ALL PLAYERS</h1>
                    <table className="playersTable">
                        <tr className="top">
                            <th>NAME</th>
                            <th>KILLS</th>
                            <th>K/D</th>
                            <th>DMG</th>
                            <th>DEATHS</th>
                            <th>HEADSHOT %</th>
                        </tr>
                        {this.renderPlayers()}

                    </table>

                </div>
            );
        } else {
            return (
                <div>
                    <div className="pageError">
                      <p>Oops!</p>
                      <p>Teams are coming soon!</p>
                    </div>
                </div>
            );
        }
    }


    render() {
        const { matchID, error, isLoading, matchStats } = this.state;

        let convertGameName = (name) => {
            let newName = name;
            switch(name) {
                case "br_brquads":
                    newName = "BR Quads";
                break;
                case "br_brtrios":
                    newName = "BR Trios";
                break;
                case "br_brduos":
                    newName = "BR Duos";
                break;
                case "br_brsolo":
                    newName = "BR Solo";
                break;
                case "br_dmz_plndtrios":
                    newName = "Plunder Trios";
                break;
                case "br_kingslayer_kingsltrios":
                    newName = "KS Trios"
                break;
                default:
            }
            return newName;
        }

        let teamActive = "";
        let playersActive = "active";

        if (this.state.displayOption == 1) {
            teamActive = "active";
            playersActive = "";
        } else {
            teamActive = "";
            playersActive = "active";
        }

        let showTeams = () => {
            if (this.state.displayOption != 1) {
                this.setState({
                    displayOption: 1
                });
                teamActive = "active";
                playersActive = "";
            }
        }

        let showPlayers = () => {
            if (this.state.displayOption != 0) {
                this.setState({
                    displayOption: 0
                });
                teamActive = "";
                playersActive = "active";
            }
        }

        let convertNumToDay = (num) => {
            switch(num) {
                case 0: 
                    return "Sunday";
                    break;
                case 1:
                    return "Monday";
                    break;
                case 2:
                    return "Tuesday";
                    break;
                case 3:
                    return "Wednesday";
                    break;
                case 4: 
                    return "Thursday";
                    break;
                case 5:
                    return "Friday";
                    break;
                case 6:
                    return "Saturday";
                    break;
            }
        }

        let convertDate = (epoch) => {
            var d = new Date(0); 
            d.setUTCSeconds(epoch);
            var dateString = convertNumToDay(d.getDay()) + " " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getYear() + " • " + d.getHours() + ":" + d.getMinutes();
            return dateString;

        }

        let isWin = (placement) => {
            if (placement == 1) {
                return "rank win";
            } else {
                return "rank";
            }

        }

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
                      <p>Working on pulling match data...</p>
                      <p>Load time are longer than normal currently as we rank stats live</p>
                    </div>
                </div>
                </DocumentTitle>
            );
        } else {
            let pageName = `Warzone Stats - Match #${this.state.matchID}`;
            return (
                <DocumentTitle className="page" title={pageName}>
                <div className="page home" id="page">
                    <h1 className="username">{convertGameName(`${matchStats.mode}`)}</h1>
                    <h1 className="date">{convertDate(`${matchStats.start}`)}</h1>
                    <div className="statsDiv container-fluid">
                      <Row>
                        <div className="col-12 col-md-4 col-lg-4">
                          <div className={`stat matchDifficulty stat-bigger m-h-130 ${matchStats.ranking.class}`}>
                            <h1 className="mid statTitle">DIFFICULTY</h1>
                            <h1 className="mid statRanking">{matchStats.ranking.rank}</h1>
                            <div className="mid statDif"><div className={`percent ${matchStats.ranking.chart}`}></div></div>
                            <div className="bottom">{matchStats.ranking.percentage}</div>
                          </div>
                        </div>
                        <div className="col-12 col-md-8 col-lg-8">
                            <div className="matchOptions">
                                <div onClick={showPlayers} className={`matchOption ${playersActive}`}>Players</div>
                                <div onClick={showTeams} className={`matchOption ${teamActive}`}>Teams</div>
                            </div>
                            <Row>
                                <div className="col-12 col-md-4 col-lg-4">
                                    <div className={`stat bigMatchStat m-h-130 gray`}>
                                        <h1 className="mid statTitle">MEDIAN K/D</h1>
                                        <h1 className="mid statRanking">{matchStats.ranking.medianKD}</h1>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-lg-4">
                                    <div className={`stat bigMatchStat m-h-130 gray`}>
                                        <h1 className="mid statTitle">AVERAGE K/D</h1>
                                        <h1 className="mid statRanking">{matchStats.ranking.averageKD}</h1>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-lg-4">
                                    <div className={`stat bigMatchStat m-h-130 gray`}>
                                        <h1 className="mid statTitle">ACCURACY</h1>
                                        <h1 className="mid statRanking">{matchStats.ranking.accuracy}%</h1>
                                    </div>
                                </div>
                            </Row>
                        </div>
                        
                      </Row>
                      
                      {this.renderMatchStats()}
                      

                    </div>
                </div>
                </DocumentTitle>
            );
        }
    };
}

export default Match;