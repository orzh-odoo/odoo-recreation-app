/** @odoo-module **/

import core from 'web.core';
import { useService } from "@web/core/utils/hooks";
import Score from './Score';
import Ranking from './Ranking';
import Upcoming from './Upcoming';
import Popup from './Popup';

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
        useListener('rematch', this._onRematch);
        useListener('exit-scoreboard', this._onExitScoreboard);
        useListener('toggle-element', this._toggleElement);
        this.state = useState({
            selectedElement: {
                id: null,
                type: null
            },
            isEditMode: !!this.props.action.context.edit,
            scoreStartIndex: 0,
        });
        this.scoreboardElements = {};
    }

    async setup() {
        this.ormService = useService("orm");
        this.actionService = useService("action");
        onWillStart(async () => {
            let match, results, teams, location, startTime, nextMatch, nextTeams, nextStartTime, customIncrement, winner;
            if (!this.state.isEditMode) {
                ({ match, results, teams, location, startTime, nextMatch, nextTeams, nextStartTime, customIncrement, winner } = await this.load());
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
            this.state.match = match;
            this.results = results;
            this.teams = teams;
            this.location = location;
            this.startTime = startTime;
            this.nextMatch = nextMatch;
            this.nextTeams = nextTeams;
            this.nextStartTime = nextStartTime;
            this.customIncrement = customIncrement
            this.state.winner = winner;
            await this.fetchScoreboardElements()
        });
    }

    async loadRender() {
        let { match, results, teams, location, startTime, nextMatch, nextTeams, nextStartTime, customIncrement, winner } = await this.load();
        this.state.match = match;
        this.results = results;
        this.teams = teams;
        this.location = location;
        this.startTime = startTime;
        this.nextMatch = nextMatch;
        this.nextTeams = nextTeams;
        this.nextStartTime = nextStartTime;
        this.customIncrement = customIncrement
        this.winner = winner;
        await this.fetchScoreboardElements()
    }

    async load() {
        const match = (await this.ormService.read('recreation.match', [this.props.action.context.active_id], []))[0];
        const results = await this.ormService.read('recreation.result', match.result_ids, []);
        const teams = await this.ormService.read('recreation.team', results.map(r => r.team_id[0]), []);
        const customIncrement = (await this.ormService.read('recreation.activity', [match.activity_id[0]], ['custom_input']))[0].custom_input
        const location = match.location_id[1];
        const startTime = match.start_time;
        const winner = match.winner[1];
<<<<<<< HEAD
        let nextMatch, nextResults, nextStartTime;
        if (this.props.action.context.next_match) {
            nextMatch = (await this.ormService.read('recreation.match', [this.props.action.context.next_match], []))[0];
            nextResults = await this.ormService.read('recreation.result', nextMatch.result_ids, []);
            nextStartTime = nextMatch.start_time;
        }
        else {
            nextMatch, nextResults, nextStartTime = false;
=======
        let nextMatch, nextTeams, nextStartTime;
        const nextMatchId = await this.ormService.call('recreation.match', 'find_next_match', [this.props.action.context.active_id])
        if (nextMatchId){
            nextMatch = (await this.ormService.read('recreation.match', [nextMatchId], []))[0];
            nextTeams = await this.ormService.read('recreation.team', nextMatch.team_ids, []);
            nextStartTime = nextMatch.start_time;
        }
        else{
            nextMatch, nextTeams, nextStartTime = false;
>>>>>>> refs/remotes/origin/main
        }
        return { match, results, teams, location, startTime, nextMatch, nextTeams, nextStartTime, customIncrement, winner };
    }

    async fetchScoreboardElements() {
        const scoreboardElements = await this.ormService.searchRead('recreation.scoreboard.element', [['activity_id', '=', this.state.match.activity_id[0]]], []);
        for (let element of scoreboardElements) {
            this.scoreboardElements[element.element_type] = element
        }
    }

    get isScoreboardEmpty() {
        return this.activeScoreboardElements.length === 0;
    }

    get getWinner() {
        return this.winner;
    }

    get activeScoreboardElements() {
        let data = []
        let elements = this.scoreboardElements
        for (let record in elements) {
            if (elements[record]) {
                let element = {};

                element.id = elements[record].id;
                element.type = elements[record].element_type;
                element.teams = [];
                element.scores = [];
                element.upcoming = {};

                element.width = elements[record].width;
                element.height = elements[record].height;
                element.position_v = elements[record].position_v;
                element.position_h = elements[record].position_h;

                if (element.type == 'ranking') {
                    let teams = [];
                    for (let i = 0; i < this.results.length; i++) {
                        teams.push({
                            id: this.results[i].team_id[0],
                            teamName: this.results[i].team_id[1],
                            wins: this.teams[i].wins,
                            losses: this.teams[i].losses,
                            ties: this.teams[i].ties
                        })
                    }
                    teams.sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    element.teams = teams.map((ele, idx) => { return { ...ele, rank: idx + 1 } })
                }
<<<<<<< HEAD
                else if (element.type == 'score') {
                    element.customIncrement = this.customIncrement;
                    for (let result of this.results) {
                        element.scores.push({
                            id: result.id,
                            teamName: result.team_id[1],
                            points: result.score
                        })
=======
                teams.sort((a, b) => (a.wins > b.wins ? -1 : 1))
                element.teams = teams.map((ele, idx) => {return {...ele, rank: idx + 1}})
            }
            else if (element.type == 'score') {
                element.customIncrement = this.customIncrement;
                for (let result of [...this.results.slice(this.state.scoreStartIndex), ...this.results.slice(0, this.state.scoreStartIndex)]){
                    element.scores.push({
                        id: result.id,
                        teamName: result.team_id[1],
                        points: result.score
                    })
                }
            }
            else if (element.type == 'upcoming') {
                if (this.nextMatch){
                    element.upcoming = {
                        teams: this.nextTeams.map(team => team.name),
                        startTime: this.nextStartTime,
                        nextMatch: true
>>>>>>> refs/remotes/origin/main
                    }
                }
                else if (element.type == 'upcoming') {
                    if (this.nextMatch) {
                        element.upcoming = {
                            teams: this.nextResults.map(team => team.team_id[1]),
                            startTime: this.nextStartTime,
                            nextMatch: true
                        }
                    }
                    else {
                        element.upcoming = {
                            nextMatch: false
                        }
                    }
                }

                element.edit = element.id === this.state.selectedElement.id;
                data.push(element)
            }
        }

        return data;
    }

    triggerBack = () => {
        history.back();
    }

    _toggleElement(event) {
        const element = event.detail;
        if (this.scoreboardElements[element]){
            this._remove(element)
        }
        else{
            this._create(element)
        }
    }

    _onSelectElement(event) {
        const element = event.detail;
        if (this.state.isEditMode) {
            this.state.selectedElement.id = element.id;
            this.state.selectedElement.type = element.type
        }
    }
    _onDeselectElement() {
        this.state.selectedElement.id = null;
        this.state.selectedElement.type = null;
    }
    async _create(elementType) {
        const newElemId = await this.ormService.create('recreation.scoreboard.element', {
            'element_type': elementType,
            'activity_id': this.state.match.activity_id[0]
        });
        const newElem = (await this.ormService.read('recreation.scoreboard.element', [newElemId], []))[0];
        this.scoreboardElements[elementType] = newElem;
        this.render();
    }
    async _remove(element) {
        this.ormService.unlink('recreation.scoreboard.element', [this.scoreboardElements[element].id]);
        this.scoreboardElements[element] = null;
        this.render();
    }
    async _save(element) {
        let data = {};
        data.position_v = element.position_v;
        data.position_h = element.position_h;
        if (element.height) data.height = element.height;
        if (element.width) data.width = element.width;
        this.ormService.write('recreation.scoreboard.element', [element.id], data);
        this.scoreboardElements[element.type] = { ...this.scoreboardElements[element.type], ...data }
    }
    async _onSaveElement(event) {
        const element = event.detail;
        await this._save(element);
    }
    async _onExitScoreboard() {
        this.ormService.call('recreation.match', 'close_scoreboard', [this.state.match.id]).then(res => {
            this.actionService.doAction(res)
        })
    }
    async reorder() {
        this.results = await this.ormService.read('recreation.result', this.state.match.result_ids, []);
        this.state.scoreStartIndex = (this.state.scoreStartIndex + 1) % this.results.length;
        this.render();
    }
    async endGame() {
        await this.ormService.call('recreation.match', 'end_game', [this.state.match.id])
        this.loadRender()
    }
    async _onRematch() {
        const newMatch = await this.ormService.call('recreation.match', 'copy', [this.state.match.id]);
        this.ormService.call('recreation.match', 'start_game', [newMatch]).then(res => {
            this.actionService.doAction(res)
        })
    }
}

Scoreboard.template = 'scoreboard';
Scoreboard.components = {
    Ranking,
    Score,
    Upcoming,
    Popup
};

core.action_registry.add('recreation_app', Scoreboard);

export default Scoreboard;