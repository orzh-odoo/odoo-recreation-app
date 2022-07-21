/** @odoo-module **/

import Draggable from "./Draggable";
import Resizeable from "./Resizeable";
import ScoreboardElement from "./ScoreboardElement";


class BackgroundImage extends ScoreboardElement{
   
}

BackgroundImage.template = 'ranking'
BackgroundImage.components = {
    Draggable,
    Resizeable
}

export default BackgroundImage;