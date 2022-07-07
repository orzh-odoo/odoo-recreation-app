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
                scores: [
                    {
                        teamName: 'Team Awsome',
                        points: 5
                    },
                    {
                        teamName: 'Team Cool',
                        points: 6
                    }
                ]
            },
            {
                id: 2,
                type: 'ranking',
                teams: [
                    {
                        id: 3,
                        rank: 1,
                        teamName: 'Team Awsome',
                        wins: 1,
                        losses: 0,
                        ties: 1
                    },
                    {
                        id: 3,
                        rank: 2,
                        teamName: 'Team Cool',
                        wins: 0,
                        losses: 1,
                        ties: 1
                    }
                ]
            }
        ];
    }
}

Scoreboard.template = 'scoreboard';
Scoreboard.components = {
    Ranking,
    Score
};

core.action_registry.add('recreation_scoreboard', Scoreboard);

export default Scoreboard;