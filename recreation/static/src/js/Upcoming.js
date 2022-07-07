/** @odoo-module **/

import Draggable from "./Draggable";
import Resizeable from "./Resizeable";

const { Component } = owl;


class Upcoming extends Component {

}

Upcoming.template = 'upcoming';
Upcoming.components = {
    Draggable,
    Resizeable
}

export default Upcoming;