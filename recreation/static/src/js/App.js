/** @odoo-module **/

import { useService } from "@web/core/utils/hooks";
const { Component } = owl;
const { useState } = owl.hooks;
import core from 'web.core';
import MatchList from './MatchList'
import Scoreboard from './Scoreboard'

class App extends Component {
    state = useState({route: '/matchlist'})
    matchData = useState({})

    matchListButtonHandler = () =>{
        this.state.route = '/matchlist'
    }

    matchItemClickHandler = newMatchData => {
        this.state.route = '/scoreboard';
        this.matchData = newMatchData;
    }

    get checkMatchListRoute() {
        return this.state.route == '/matchlist';
    }

    get checkScoreBoardRoute() {
        return this.state.route == '/scoreboard';
    }

    get getMatchData(){
        return this.matchData;
    }
}

App.template = 'app';
App.components = {
    MatchList,
    Scoreboard
};

core.action_registry.add('recreation_app', App);

export default App