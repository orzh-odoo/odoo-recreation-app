/** @odoo-module **/

import { useService } from "@web/core/utils/hooks";

const { Component } = owl;
const { useListener } = require('web.custom_hooks');
const { useState } = owl.hooks;


class TeamScore extends Component{
    constructor() {
        super(...arguments);
        useListener('increment-score', this._onIncrementScore);
        useListener('decrement-score', this._onDecrementScore);
        this.state = useState({
            scoreIncrement: 1,
        });
    }
    setup() {
        this.ormService = useService("orm");
    }
    async _onIncrementScore(event) {
        const increment = event.detail;
        if (increment) {
            this.props.score.points += increment;
        }
        else {
            this.props.score.points += this.state.scoreIncrement;
        }
        this.ormService.write('recreation.result', [this.props.score.id], {score: this.props.score.points});
        this.render();
    }
    async _onDecrementScore(event) {
        const increment = event.detail;
        if (increment) {
            this.props.score.points -= increment;
        }
        else {
            this.props.score.points -= this.state.scoreIncrement;
        }
        this.ormService.write('recreation.result', [this.props.score.id], {score: this.props.score.points});
        this.render();
    }
}

TeamScore.template = 'team-score'


export default TeamScore;