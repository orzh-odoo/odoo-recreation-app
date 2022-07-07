/** @odoo-module **/

import core from 'web.core';
import Score from './Score';
import Ranking from './Ranking';

const { Component } = owl;

class Scoreboard extends Component{

    get isScoreboardEmpty() { 
        return false; 
    }
    get activeScoreboardElements() {
        return [
            {
                id: 1,
                type: 'score',
                teamName: 'Team Awsome',
                score: 5

            },
            {
                id: 2,
                type: 'ranking',
                teams: [
                    {
                        id: 3,
                        teamName: 'Team Awsome',
                        wins: 1,
                        losses: 0
                    },
                    {
                        id: 3,
                        teamName: 'Team Cool',
                        wins: 0,
                        losses: 1
                    }
                ]
            }
        ];
    }
}

Scoreboard.template = 'scoreboard'
Scoreboard.components = {
    Ranking,
    Score
}

core.action_registry.add('recreation_scoreboard', Scoreboard);

export default Scoreboard;