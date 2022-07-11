/** @odoo-module **/

import core from 'web.core';
import { useService } from "@web/core/utils/hooks";
import Score from './Score';
import Ranking from './Ranking';
import Upcoming from './Upcoming';

const { Component } = owl;
const { useListener } = require('web.custom_hooks');
const { useState } = owl.hooks;


class Scoreboard extends Component{
    constructor(){
        super(...arguments);
        useListener('select-element', this._onSelectElement);
        useListener('deselect-element', this._onDeselectElement);
        this.state = useState({
            selectedElementId: null,
            isEditMode: true,
        });
    }
    setup() {
        this.ormService = useService("orm");
    }

    get isScoreboardEmpty() { 
        return this.activeScoreboardElements.length === 0; 
    }
    get activeScoreboardElements() {
        let data = [
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
                ],
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