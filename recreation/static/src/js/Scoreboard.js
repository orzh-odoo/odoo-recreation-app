/** @odoo-module **/

import AbstractAction from 'web.AbstractAction';
import core from 'web.core';


const Scoreboard = AbstractAction.extend({
    contentTemplate: 'scoreboard',
})

core.action_registry.add('recreation_scoreboard', Scoreboard);

export default Scoreboard;