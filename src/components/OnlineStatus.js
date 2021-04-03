var React = require('react');
var FontAwesome = require('react-fontawesome');


class OnlineStatus extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        local: null,
        activision: null
      };
    }
  
    componentDidMount() {
      fetch("https://wzapi.parkersmith.io/ping")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              local: result.local,
              activision: result.activision,
              isLoaded: true
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              local: false,
              activision: false,
              isLoaded: true,
              error
            });
            console.log(error);
          }
        )
      setInterval(() => {
        fetch("https://wzapi.parkersmith.io/ping")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              local: result.local,
              activision: result.activision,
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              local: false,
              activision: false,
              error
            });
            console.log(error);
          }
        )
      }, 60000)
    }
  
    render() {
      const { local, activision, isLoaded } = this.state;
      var localDiv;
      var activisionDiv;
      if (!isLoaded) {
        return <FontAwesome 
        name='spinner-third'
        spin
        size='2x'
        style={{ color: '#fff', 'margin-top': '15px' }} />;
      } else {
        if (local) {
            localDiv = <FontAwesome 
            name='check-circle'
            style={{ color: 'green' }}/>;
        } else {
            localDiv = <FontAwesome 
            name='times-circle'
            style={{ color: '#e83b3b' }} />
        }

        if (activision) {
            activisionDiv = <FontAwesome 
            name='check-circle'
            style={{ color: 'green' }}/>;
        } else {
            activisionDiv = <FontAwesome 
            name='times-circle'
            style={{ color: '#e83b3b' }} />;
        }

        return (
            <div className="onlineStatus" style={{'margin-top': '8px'}}>
                <span>API: {localDiv}</span>
                <br></br>
                <span>Activision API: {activisionDiv}</span>
            </div>
        )
      }
    }
  }

  export default OnlineStatus;