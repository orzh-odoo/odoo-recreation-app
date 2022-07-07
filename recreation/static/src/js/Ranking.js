/** @odoo-module **/

import Draggable from "./Draggable";
import Resizeable from "./Resizeable";

const { Component } = owl;

class Ranking extends Component{
}

Ranking.template = 'ranking'
Ranking.components = {
    Draggable,
    Resizeable
}

export default Ranking;