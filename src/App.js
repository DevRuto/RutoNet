import React, { Component } from 'react';

import './sass/style.scss';
import NavBar from "./components/NavBar";
import Home from './pages/home/index';
import KzStats from './pages/kzstats/index';
import Gokz from './pages/kzstats/gokz';
import KzTimer from './pages/kzstats/kztimer';
import Replay from './pages/replay/index';

import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Container} from 'bloomer';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Container>
                        <NavBar/>
                    </Container>
                    <Route exact={true} path='/' component={Home}/>
                    <Route exact={true} path='/kzstats' component={KzStats} />
                    <Route exact={true} path='/kzstats/gokz' component={Gokz} />
                    <Route exact={true} path='/kzstats/kztimer' component={KzTimer} />
                    <Route exact={true} path='/replay' component={Replay} />
                </div>
            </Router>
        );
    }
}

export default App;
