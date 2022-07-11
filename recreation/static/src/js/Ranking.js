/** @odoo-module **/

import Draggable from "./Draggable";
import Resizeable from "./Resizeable";
import ScoreboardElement from "./ScoreboardElement";


class Ranking extends ScoreboardElement{
   
}

Ranking.template = 'ranking'
Ranking.components = {
    Draggable,
    Resizeable
}

export default Ranking;