/** @odoo-module **/

import Draggable from "./Draggable";
import Resizeable from "./Resizeable";

const { Component } = owl;

class Score extends Component{
}

Score.template = 'score'
Score.components = {
    Draggable,
    Resizeable
}

export default Score;