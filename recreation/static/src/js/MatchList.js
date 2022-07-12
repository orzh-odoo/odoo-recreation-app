/** @odoo-module **/

import { useService } from "@web/core/utils/hooks";

const { Component } = owl;
const { useState, onWillStart } = owl.hooks;
import Match from './Match';

class MatchList extends Component {
    setup(){
        this.ormService = useService("orm");
        onWillStart(async () => {
            const matches = await this.load();
            this.matches = useState(matches)
        });
    }

    async load(){
        const matches = await this.ormService.searchRead('recreation.match', [], []);
        return matches
    }

    get activeMatchElements(){
        return this.matches
    }
}

MatchList.template = 'matchlist';
MatchList.components = {
    Match
};

export default MatchList;