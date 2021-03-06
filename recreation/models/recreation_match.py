# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import timedelta


class RecreationMatch(models.Model):
    _name = 'recreation.match'
    _description = 'Matches for Recreation App'

    
    name = fields.Char(string='Name', compute='_default_name', store=True, readonly=False)
    activity_id = fields.Many2one(comodel_name='recreation.activity', string='Activity', required=True)
    start_time = fields.Datetime(string='Start Time', copy=False)
    end_time = fields.Datetime(string='End Time', compute='_compute_end_time', inverse='_inverse_end_time', store=True, copy=False)
    activity_time = fields.Integer(string='Activity Time', compute='_compute_activity_time', inverse='_inverse_activity_time', store=True, copy=False)
    team_ids = fields.Many2many(string='Teams', comodel_name='recreation.team', copy=True)
    result_ids = fields.One2many(comodel_name='recreation.result', inverse_name='match_id', string='Results', readonly=True, copy=False)
    location_id = fields.Many2one(comodel_name='recreation.location', string='Location')
    winner = fields.Many2one(comodel_name='recreation.team', string='Winner', compute='_compute_winner')
    status = fields.Selection(
        string='Status',
        selection=[
            ('draft', 'Draft'),
            ('in_progress', 'In-Progress'),
            ('done', 'Done')
        ],
        default='draft',
        required=True,
        copy=False
    )
    team_names = fields.Char(compute='_compute_team_names')

    @api.depends('team_ids')
    def _compute_team_names(self):
        for match in self:
            names = []
            for team in match.team_ids:
                names.append(team.name)
            match.team_names = ', '.join(names)

    @api.depends('start_time', 'activity_time')
    def _compute_end_time(self):
        for match in self:
            if not (match.start_time and match.activity_time):
                match.end_time = match.start_time
            else:
                duration = timedelta(minutes=match.activity_time)
                match.end_time = match.start_time + duration

    def _inverse_end_time(self):
        for match in self:
            if match.start_time and match.end_time:
                match.activity_time = (match.end_time - match.start_time).total_seconds()/60
                
    @api.depends('result_ids')
    def _compute_winner(self):
        for match in self:
            if match.status != 'done':
                match.winner = False
                continue

            best_score = None
            team_id = None
            for team in match.result_ids:
                if team.score == best_score:
                    team_id = None
                if best_score is None or (match.activity_id.win_condition == 'highest' and team.score > best_score) or (match.activity_id.win_condition == 'lowest' and team.score < best_score):
                    best_score = team.score
                    team_id = team.team_id
            match.winner = team_id

    @api.depends('activity_id')
    def _compute_activity_time(self):
        for match in self:
            if match.activity_id:
                match.activity_time = match.activity_id.average_game_time

    def _inverse_activity_time(self):
        return

    def open_scoreboard(self):
        action = self.env.ref('recreation.recreation_action_scoreboard').read()[0] 
        action['context'] = {'active_id': self.id}
        return action

    def close_scoreboard(self):
        action = {
            'name': 'Close Scoreboard',
            'type': 'ir.actions.act_window',
            'res_model': 'recreation.match',
            'view_mode': 'form',
            'views': [[False, 'form']],
            'res_id': self.id,
            'target': 'main'
        }
        return action

    def end_game(self):
        if self.status != 'in_progress':
            return

        self.end_time = fields.Datetime.now()
        self.status = 'done'

    def start_game(self):
        if self.status != 'draft':
            return

        for team in self.team_ids:
            self.env['recreation.result'].create({
                'match_id': self.id,
                'team_id': team.id
            })

        self.start_time = fields.Datetime.now()
        self.status = 'in_progress'

        return self.open_scoreboard()

    def find_next_match(self):
        next_match = False
        future_matches = self.search([('start_time', '>', self.start_time), ('location_id.id', '=', self.location_id.id)])
        if len(future_matches) > 0:
            next_match = min(future_matches, key=lambda match: match.start_time).id
        return next_match


    @api.depends('activity_id', 'team_ids')
    def _default_name(self):
        names = []
        for result in self.team_ids:
            names.append(result.name)
        if self.activity_id.name:
            self.name = self.activity_id.name + ' / ' +' vs. '.join(names)
        else:
            self.name = ''
