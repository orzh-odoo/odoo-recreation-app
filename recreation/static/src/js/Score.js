/** @odoo-module **/

import Draggable from "./Draggable";
import Resizeable from "./Resizeable";
import ScoreboardElement from "./ScoreboardElement";
import TeamScore from "./TeamScore";


class Score extends ScoreboardElement {

}

Score.template = 'score'
Score.components = {
    Draggable,
    Resizeable,
    TeamScore
}

export default Score;