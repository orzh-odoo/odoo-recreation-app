/** @odoo-module **/

import core from 'web.core';
import { useService } from "@web/core/utils/hooks";
import Score from './Score';
import Ranking from './Ranking';
import Upcoming from './Upcoming';

const { Component } = owl;
const { onWillStart } = owl.hooks;

class Scoreboard extends Component {

    async setup() {
        this.ormService = useService("orm");
        onWillStart(async () => {
            const { teams, location, startTime } = await this.load();
            this.teams = teams;
            this.location = location;
            this.startTime = startTime;
        });
    }

    async load() {
        const data = await this.ormService.searchRead('recreation.match', [['activity_id.name', '=', 'Darts']], []);
        const teams = await (await Promise.all(data[0].team_ids.map(id => this.ormService.searchRead('recreation.team', [['id', '=', id]], [])))).map(ele => ele[0].name);
        const location = data[0].location_id[1]
        const startTime = data[0].start_time;
        return { teams, location, startTime };
    }

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
                        teamName: this.teams[0],
                        points: 5
                    },
                    {
                        teamName: this.teams[1],
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
                        teamName: this.teams[0],
                        wins: 1,
                        losses: 0,
                        ties: 1
                    },
                    {
                        id: 3,
                        rank: 2,
                        teamName: this.teams[1],
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
                        teamName: this.teams[0],
                        location: this.location,
                        startTime: this.startTime
                    },
                    {
                        id: 2,
                        teamName: this.teams[1],
                        location: this.location,
                        startTime: this.startTime
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