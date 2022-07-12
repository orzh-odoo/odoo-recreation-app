/** @odoo-module **/

const { Component } = owl;
const { useState } = owl.hooks;

class Match extends Component {
    onClick = () => {
        this.props.onClick(this.props.data)
    }
}

Match.template = 'match';

export default Match;