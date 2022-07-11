/** @odoo-module **/

import Draggable from "./Draggable";
import Resizeable from "./Resizeable";
import ScoreboardElement from "./ScoreboardElement";


class Score extends ScoreboardElement {

}

Score.template = 'score'
Score.components = {
    Draggable,
    Resizeable
}

export default Score;