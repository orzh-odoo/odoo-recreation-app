/** @odoo-module **/

import { useService } from "@web/core/utils/hooks";
import Draggable from "./Draggable";
import Resizeable from "./Resizeable";
import ScoreboardElement from "./ScoreboardElement";

const { useListener } = require('web.custom_hooks');


class Score extends ScoreboardElement {
    constructor() {
        super(...arguments);
        useListener('increment-score', this._onIncrementScore);
        useListener('decrement-score', this._onDecrementScore);
    }
    setup() {
        this.ormService = useService("orm");
    }
    async _onIncrementScore(event) {
        const resultId = event.detail;
        const i = this.props.element.scores.findIndex((res) => res.id == resultId);
        this.props.element.scores[i].points += 1;
        this.ormService.write('recreation.result', [resultId], {score: this.props.element.scores[i].points});
        this.render();
    }
    async _onDecrementScore(event) {
        const resultId = event.detail;
        const i = this.props.element.scores.findIndex((res) => res.id == resultId);
        this.props.element.scores[i].points -= 1;
        this.ormService.write('recreation.result', [resultId], {score: this.props.element.scores[i].points});
        this.render();
    }
    

}

Score.template = 'score'
Score.components = {
    Draggable,
    Resizeable
}

export default Score;