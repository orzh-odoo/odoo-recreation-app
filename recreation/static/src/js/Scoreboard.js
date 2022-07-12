/** @odoo-module **/

import core from 'web.core';
import { useService } from "@web/core/utils/hooks";
import Score from './Score';
import Ranking from './Ranking';
import Upcoming from './Upcoming';

const { Component } = owl;
const { useListener } = require('web.custom_hooks');
const { useState } = owl.hooks;
const { onWillStart } = owl.hooks;

class Scoreboard extends Component {
    constructor() {
        super(...arguments);
        useListener('select-element', this._onSelectElement);
        useListener('deselect-element', this._onDeselectElement);
        useListener('save-element', this._onSaveElement);
        this.state = useState({
            selectedElementId: null,
            isEditMode: true,
        });
        this.scoreboardElements = [];
    }

    async setup() {
        this.ormService = useService("orm");
        onWillStart(async () => {
            const { scoreboardElements, teams, location, startTime } = await this.load();
            this.scoreboardElements = scoreboardElements;
            this.teams = teams;
            this.location = location;
            this.startTime = startTime;
        });
    }

    async load() {
        const scoreboardElements = await this.ormService.searchRead('recreation.scoreboard.element', [], []);
        const data = this.props.match
        const teams = await (await Promise.all(data.team_ids.map(id => this.ormService.searchRead('recreation.team', [['id', '=', id]], [])))).map(ele => ele[0]);
        const location = data.location_id[1];
        const startTime = data.start_time;
        return { scoreboardElements, teams, location, startTime };
    }

    get isScoreboardEmpty() {
        return this.activeScoreboardElements.length === 0;
    }
    get activeScoreboardElements() {
        let data = []
        // for (let record of this.scoreboardElements) {
        //     let element = {};

        //     element.id = record.id;
        //     element.type = record.element_type;
        //     element.teams = [];

        //     element.width = record.width;
        //     element.height = record.height;
        //     element.position_v = record.position_v;
        //     element.position_h = record.position_h;

        //     element.edit = element.id === this.state.selectedElementId;
        //     data.push(element)
        // }

        // return data;

        data = [
            {
                id: 1,
                type: 'score',
                scores: [
                    {
                        teamName: this.teams[0].name,
                        points: 5
                    },
                    {
                        teamName: this.teams[1].name,
                        points: 6
                    }
                ],
            },
            {
                id: 2,
                type: 'ranking',
                teams: [
                    {
                        id: 3,
                        rank: 1,
                        teamName: this.teams[0].name,
                        wins: this.teams[0].wins,
                        losses: this.teams[0].losses,
                        ties: this.teams[0].ties
                    },
                    {
                        id: 3,
                        rank: 2,
                        teamName: this.teams[1].name,
                        wins: this.teams[1].wins,
                        losses: this.teams[1].losses,
                        ties: this.teams[1].ties
                    }
                ]
            },
            {
                id: 3,
                type: 'upcoming',
                teams: [
                    {
                        id: 1,
                        teamName: this.teams[0].name,
                        location: this.location,
                        startTime: this.startTime
                    },
                    {
                        id: 2,
                        teamName: this.teams[1].name,
                        location: this.location,
                        startTime: this.startTime
                    }
                ]
            }
        ];
        for (let element of data) {
            element.edit = element.id === this.state.selectedElementId;
        }
        return data;
    }
    _onSelectElement(event) {
        const element = event.detail;
        if (this.state.isEditMode) {
            this.state.selectedElementId = element.id;
        }
    }
    _onDeselectElement() {
        this.state.selectedElementId = null;
    }
    async _create(element) {

    }
    async _onCreateElement(event) {
        const element = event.detail;
        await this._create(element);
    }
    async _save(element) {
        let data = {};
        data.position_v = element.position_v;
        data.position_h = element.position_h;
        if (element.height) data.height = element.height;
        if (element.width) data.width = element.width;
        this.ormService.write('recreation.scoreboard.element', [element.id], data)
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

export default Scoreboard;