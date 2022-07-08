/** @odoo-module **/

import core from 'web.core';
import Score from './Score';
import Ranking from './Ranking';
import Upcoming from './Upcoming';

const { Component } = owl;

class Scoreboard extends Component{

    get isScoreboardEmpty() { 
        return this.activeScoreboardElements.length === 0; 
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
            },
            {
                id: 3,
                type: 'upcoming',
                teams: [
                    {
                        id: 1,
                        teamName: "Team Awesome",
                        location: "Break Room",
                        startTime: "2:00 PM"
                    },
                    {
                        id: 2,
                        teamName: "Team Awesome",
                        location: "Break Room",
                        startTime: "2:30 PM"
                    }
                ]
            }
        ];
    }
    async _save(element) {
        // TODO: save the element
    }
    async _onSaveElement(event) {
        const element = event.detail;
        await this._save(element);
    }
}

Scoreboard.template = 'scoreboard';
Scoreboard.components = {
    Ranking,
    Score,
    Upcoming
};

core.action_registry.add('recreation_scoreboard', Scoreboard);

export default Scoreboard;