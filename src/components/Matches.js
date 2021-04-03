import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class Matches extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            platform: null,
            username: null,
            matches: null,
            isLoading: true,
            error: null
        }
    }

    updateStats() {
        this.updateStatsPush();
    }

    updateStatsPush() {
        if (localStorage.getItem(`${this.props.platform}/${this.props.username}/matches`) != null) {
            console.log("Match Cache Exists");
            var cachedStats = JSON.parse(localStorage.getItem(`${this.props.platform}/${this.props.username}/matches`));
            if (Date.now() - cachedStats.timeGrabbed < 600000) {
                this.setState({
                    matches: cachedStats.data,
                    error: null,
                    isLoading: false
                });
            } else {
                console.log("Match Fetching new because time");
                fetch(`https://wzapi.parkersmith.io/stats/${this.props.platform}/${this.props.username}/matches`)
                .then(res => res.json())
                .then(
                (result) => {
                    if (!result.error) {
                        console.log(result.data);
                        var results = {
                            data: result.data,
                            timeGrabbed: Date.now(),
                        }
                        this.setState({
                            matches: result.data,
                            error: null,
                            isLoading: false
                        });
                        localStorage.setItem(`${this.props.platform}/${this.props.username}/matches`, JSON.stringify(results));
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
            console.log("Match Fetching new because doesn't exist");
            fetch(`https://wzapi.parkersmith.io/stats/${this.props.platform}/${this.props.username}/matches`)
                .then(res => res.json())
                .then(
                (result) => {
                    if (!result.error) {
                        console.log(result.data);
                        var results = {
                            data: result.data,
                            timeGrabbed: Date.now(),
                        }
                        this.setState({
                            matches: result.data,
                            error: null,
                            isLoading: false
                        });
                        localStorage.setItem(`${this.props.platform}/${this.props.username}/matches`, JSON.stringify(results));
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
    }

    componentWillMount() {
        this.setState({
            platform: this.props.platform,
            username: this.props.username
        })
        this.updateStats();
    }

    componentDidUpdate(prevProps) {
        if (this.state.platform !== this.props.platform || this.state.username !== this.props.username ) {
            this.setState({ 
              platform: this.props.platform,
              username: this.props.username,
              isLoading: true
            });
            this.updateStats();
          }
    }
    

    renderRows() {
        function convertGameName(name) {
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

        function convertDate(epoch) {
            var d = new Date(0); 
            d.setUTCSeconds(epoch);
            var dateString = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
            return dateString;

        }

        function isWin(placement) {
            if (placement == 1) {
                return "rank win";
            } else {
                return "rank";
            }

        }

        return  this.state.matches.map(function(o) {
            if (o.mode.includes("br_br")) {
                return (
                    <div className="stat match gray" id={"match-" + o.matchID}>
                        <div className="title">{convertGameName(o.mode)} <span className="date">{convertDate(o.utcStartSeconds)}</span></div>
                        <div className={isWin(o.playerStats.teamPlacement)}>{o.playerStats.teamPlacement}</div>
                        <div className={`lobbyRank ${o.ranking.class}`}>{o.ranking.rank}</div>
                        <div className="matchStats">
                            <div class="matchStat">
                                <h1>Kills</h1>
                                <p>{o.playerStats.kills}</p>
                            </div>
                            <div class="matchStat">
                                <h1>Damage</h1>
                                <p>{o.playerStats.damageDone}</p>
                            </div>
                            <div class="matchStat extraStat">
                                <h1>Score</h1>
                                <p>{o.playerStats.score}</p>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="stat match gray alt-match" id={"match-" + o.matchID}>
                        <div className="title">{convertGameName(o.mode)} <span className="date">{convertDate(o.utcStartSeconds)}</span></div>
                        <div className={isWin(o.playerStats.teamPlacement)}>{o.playerStats.teamPlacement}</div>
                        <div className={`lobbyRank ${o.ranking.class}`}>{o.ranking.rank}</div>
                        <div className="matchStats">
                            <div class="matchStat">
                                <h1>Kills</h1>
                                <p>{o.playerStats.kills}</p>
                            </div>
                            <div class="matchStat">
                                <h1>Damage</h1>
                                <p>{o.playerStats.damageDone}</p>
                            </div>
                            <div class="matchStat extraStat">
                                <h1>Score</h1>
                                <p>{o.playerStats.score}</p>
                            </div>
                        </div>
                    </div>
                )
            }
        });
    }

    render() {
        if (this.state.error != null) {
            return (     
                <div className="page home" id="page">
                    <div className="pageError">
                      <p>An error has occured..</p>
                      <p>{this.state.error}</p>
                    </div>
                </div>
            );
        } else if (this.state.isLoading) {
            return (
                <div className="page home center m-t-20" id="page">
                    <FontAwesome 
                    name='spinner-third'
                    spin
                    size='2x'
                    className="m-t-20"
                    style={{ color: '#fff', 'marginTop': '15px', 'textAlign': 'center', 'margin': 'auto'}} />
                </div>
            );
        } else {
            return (
                <div className="matches">
                {this.renderRows()}
                </div>
            );
        }
    }
}
