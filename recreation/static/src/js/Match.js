/** @odoo-module **/

import { useService } from "@web/core/utils/hooks";

const { Component } = owl;
const { useState } = owl.hooks;
const { onWillStart } = owl.hooks;

class Match extends Component {
    setup() {
        this.ormService = useService("orm");
        onWillStart(async () => {
            const { name, winner_id, activity, results, teams, location, startTime } = await this.load();
            this.name = name;
            this.winner_id = winner_id;
            this.activity = activity;
            this.results = results;
            this.teams = teams;
            this.location = location;
            this.startTime = startTime;
        });
    }

    async load() {
        const data = this.props.data
        const name = data.name;
        const winner_id = data.winner[0]
        const activity = data.activity_id[1];
        const results = await (await Promise.all(data.result_ids.map(id => this.ormService.searchRead('recreation.result', [['id', '=', id]], [])))).map(ele => ele[0]);
        const teams = await (await Promise.all(results.map(result => this.ormService.searchRead('recreation.team', [['id', '=', result.team_id[0]]], [])))).map(ele => ele[0]);
        const location = data.location_id[1];
        const startTime = data.start_time;
        return { name, winner_id, activity, results, teams, location, startTime };
    }

    get getName() {
        return this.name;
    }

    get getActivity() {
        return this.activity;
    }

    get getStartTime() {
        return this.startTime;
    }

    get getResults() {
        let results = [];
        for (let result of this.results){
            results.push({
                id: result.id,
                team_id: result.team_id[0],
                teamName: result.team_id[1],
                points: result.score
            })
        }
        return results;
    }

    get getWinnerId() {
        return this.winner_id;
    }

    onClick = () => {
        this.props.onClick(this.props.data)
    }
}

Match.template = 'match';

export default Match;