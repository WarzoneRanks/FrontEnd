import './App.css';

import Header from './components/Header';
import { Container, Row, Col } from 'react-bootstrap';

import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import Home from './pages/Home';
import Stats from './pages/Stats';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Famous from './pages/Famous';
import Recent from './pages/Recent';
import UserMatch from './pages/UserMatch';
import NewHome from './pages/NewHome';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
            <Header />
            <div className="row">
              <div className="col-lg-3 col-md-12 col-12 hiddenMobile statsDiv">
                <h1 className="sub pad">Players</h1>
                <Favorites fromPage="Home" />
                <Recent fromPage="Home" />
              </div>
              <div className="col-lg-9 col-md-12 col-12 mainSection">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/stats/:platform/:username" component={Stats} />
                <Route path='/about' component={About}/>
                <Route path='/newHome' component={NewHome}/>
                <Route path='/search' component={Search}/>
                <Route path='/famous' component={Famous}/>
                <Route path='/favorites' component={Favorites}/>
                <Route path='/match/:place/:matchID' component={UserMatch}/>
                <Route path='/404' component={NotFound}/>
                <Route render={() => (
                  <Redirect to="/404"/>
                )}/>
              </Switch>
              </div>
            </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
