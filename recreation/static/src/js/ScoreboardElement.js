/** @odoo-module **/

const { Component } = owl;
const { useListener } = require('web.custom_hooks');
const { onPatched, onMounted } = owl.hooks;

class ScoreboardElement extends Component{
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
            top: unit(element.position_v),
            left: unit(element.position_h),
        };
        if (element.width > 0) style.width = unit(element.width);
        if (element.height > 0) style.height = unit(element.height);
        if (element.color) {
            style.background = element.color;
        }
        if (element.edit) {
            this.el.firstChild.classList.add('drag-handle')
        }
        else {
            this.el.firstChild.classList.remove('drag-handle')
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
        this.trigger('save-element', this.props.element);
    }
    _onDragEnd(event) {
        const { loc } = event.detail;
        const element = this.props.element;
        element.position_v = loc.top;
        element.position_h = loc.left;
        this.trigger('save-element', this.props.element);
    }
}

export default ScoreboardElement;