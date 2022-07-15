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
        useListener('create-element', this._onCreateElement);
        useListener('remove-element', this._onRemoveElement);
        this.state = useState({
            selectedElementId: null,
            isEditMode: !!this.props.action.context.edit,
        });
        this.scoreboardElements = [];
    }

    async setup() {
        this.ormService = useService("orm");
        onWillStart(async () => {
            let match, results, teams, location, startTime;
            if (!this.state.isEditMode) {
                ({ match, results, teams, location, startTime } = await this.load());
            }
            else {
                match = {
                    id: 1,
                    activity_id: [this.props.action.context.activity_id]
                }
                results = [
                    {
                        id: 1,
                        team_id: [1, "Team Name"],
                        score: 100
                    },
                    {
                        id: 2,
                        team_id: [2, "Team Name"],
                        score: 100
                    }
                ]
                teams = [
                    {
                        id: 1,
                        name: 'Team Name',
                        wins: 0,
                        losses: 0,
                        ties: 0
                    },
                    {
                        id: 2,
                        name: 'Team Name',
                        wins: 0,
                        losses: 0,
                        ties: 0
                    }
                ]
                location = 'Location of Activity';
                startTime = '4:00 PM';
            }
            this.match = match;
            this.results = results;
            this.teams = teams;
            this.location = location;
            this.startTime = startTime;
            await this.fetchScoreboardElements()
        });
    }

    async load() {
        const match = (await this.ormService.read('recreation.match', [this.props.action.context.match], []))[0];
        const results = await this.ormService.read('recreation.result', match.result_ids, []);
        const teams = await this.ormService.read('recreation.team', results.map(r => r.team_id[0]), []);
        const location = match.location_id[1];
        const startTime = match.start_time;
        return { match, results, teams, location, startTime };
    }

    async fetchScoreboardElements() {
        const scoreboardElements = await this.ormService.searchRead('recreation.scoreboard.element', [['activity_id', '=', this.match.activity_id[0]]], []);
        this.scoreboardElements = scoreboardElements;
    }

    get isScoreboardEmpty() {
        return this.activeScoreboardElements.length === 0;
    }

    get activeScoreboardElements() {
        let data = []
        for (let record of this.scoreboardElements){
            let element = {};

            element.id = record.id;
            element.type = record.element_type;
            element.teams = [];
            element.scores = [];

            element.width = record.width;
            element.height = record.height;
            element.position_v = record.position_v;
            element.position_h = record.position_h;

            if (element.type == 'ranking') {
                let teams = [];
                for (let i = 0; i < this.results.length; i++){
                    teams.push({
                        id: this.results[i].team_id[0],
                        teamName: this.results[i].team_id[1],
                        wins: this.teams[i].wins,
                        losses: this.teams[i].losses,
                        ties: this.teams[i].ties
                    })
                }
                teams.sort((a, b) => (a.wins > b.wins ? -1 : 1))
                element.teams = teams.map((ele, idx) => {return {...ele, rank: idx + 1}})
            }
            else if (element.type == 'score') {
                for (let result of this.results){
                    element.scores.push({
                        id: result.id,
                        teamName: result.team_id[1],
                        points: result.score
                    })
                }
            }
            else if (element.type == 'upcoming') {
                element.teams = [
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
                ];
            }

            element.edit = element.id === this.state.selectedElementId;
            data.push(element)
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
    async _create(elementType) {
        const newElemId = await this.ormService.create('recreation.scoreboard.element', {
            'element_type': elementType,
            'activity_id': this.match.activity_id[0]
        });
        const newElem = (await this.ormService.read('recreation.scoreboard.element', [newElemId], []))[0];
        this.scoreboardElements.push(newElem);
        this.render();
    }
    async _onCreateElement(event) {
        const element = event.detail;
        await this._create(element);
    }
    async _remove(elementId) {
        this.ormService.unlink('recreation.scoreboard.element', [elementId]);

        const i = this.scoreboardElements.findIndex((elem) => elem.id == elementId)
        if (i > -1) this.scoreboardElements.splice(i, 1);
        this.render();
    }
    async _onRemoveElement(event) {
        if (this.state.selectedElementId) {
            await this._remove(this.state.selectedElementId)
        }        
    }
    async _save(element) {
        let data = {};
        data.position_v = element.position_v;
        data.position_h = element.position_h;
        if (element.height) data.height = element.height;
        if (element.width) data.width = element.width;
        this.ormService.write('recreation.scoreboard.element', [element.id], data);
        
        const i = this.scoreboardElements.findIndex((elem) => elem.id == element.id)
        this.scoreboardElements[i] = {...this.scoreboardElements[i], ...data}
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

core.action_registry.add('recreation_app', Scoreboard);

export default Scoreboard;