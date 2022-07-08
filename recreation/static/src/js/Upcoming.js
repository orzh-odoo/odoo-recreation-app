/** @odoo-module **/

import Draggable from "./Draggable";
import Resizeable from "./Resizeable";

const { Component } = owl;
const { useListener } = require('web.custom_hooks');
const { onPatched, onMounted } = owl.hooks;


class Upcoming extends Component {
    constructor() {
        super(...arguments);
        useListener('resize-end', this._onResizeEnd);
        useListener('drag-end', this._onDragEnd);
        onPatched(this._setElementStyle.bind(this));
        onMounted(this._setElementStyle.bind(this));
    }
    _setElementStyle() {
        const element = this.props.element;
        function unit(val) {
            return `${val}px`;
        }
        const style = {
            width: unit(element.width),
            height: unit(element.height),
            top: unit(element.position_v),
            left: unit(element.position_h),
        };
        if (element.color) {
            style.background = element.color;
        }
        Object.assign(this.el.style, style);
    }
    _onResizeEnd(event) {
        const { size, loc } = event.detail;
        const element = this.props.element;
        element.width = size.width;
        element.height = size.height;
        element.position_v = loc.top;
        element.position_h = loc.left;
        this.trigger('save-table', this.props.table);
    }
    _onDragEnd(event) {
        const { loc } = event.detail;
        const element = this.props.element;
        element.position_v = loc.top;
        element.position_h = loc.left;
        this.trigger('save-table', this.props.element);
    }
}

Upcoming.template = 'upcoming';
Upcoming.components = {
    Draggable,
    Resizeable
}

export default Upcoming;