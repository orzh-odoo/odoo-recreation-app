/** @odoo-module **/

import Draggable from "./Draggable";
import Resizeable from "./Resizeable";
import ScoreboardElement from "./ScoreboardElement";


class Photo extends ScoreboardElement{
   
}

Photo.template = 'photo'
Photo.components = {
    Draggable,
    Resizeable
}

export default Photo;