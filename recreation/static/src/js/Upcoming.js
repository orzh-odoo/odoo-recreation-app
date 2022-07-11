/** @odoo-module **/

import Draggable from "./Draggable";
import Resizeable from "./Resizeable";
import ScoreboardElement from "./ScoreboardElement";

const { Component } = owl;
const { useListener } = require('web.custom_hooks');
const { onPatched, onMounted } = owl.hooks;


class Upcoming extends ScoreboardElement {

}

Upcoming.template = 'upcoming';
Upcoming.components = {
    Draggable,
    Resizeable
}

export default Upcoming;