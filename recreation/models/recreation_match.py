# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import timedelta


class RecreationMatch(models.Model):
    _name = 'recreation.match'
    _description = 'Matches for Recreation App'

    name = fields.Char(string="Name")
    activity_id = fields.Many2one(comodel_name='recreation.activity', string='Activity')
    start_time = fields.Datetime(string='Start Time')
    end_time = fields.Datetime(string='End Time', compute='_compute_end_time', inverse='_inverse_end_time', store=True)
    activity_time = fields.Integer(string='Activity Time', compute='_compute_activity_time', inverse='_inverse_activity_time', store=True)
    result_ids = fields.One2many(comodel_name='recreation.result', inverse_name='match_id', string='Results', readonly=True)
    location_id = fields.Many2one(comodel_name='recreation.location', string='Location')
    attending_members = fields.Many2many(comodel_name='res.partner', string='Attending Members')
    winner = fields.Many2one(comodel_name='recreation.team', string='Winner', compute='_compute_winner')
    status = fields.Selection(
        string='Status',
        selection=[
            ('draft', 'Draft'),
            ('in_progress', 'In-Progress'),
            ('done', 'Done')
        ],
        default='draft'
    )
    team_names = fields.Char(compute='_compute_team_names')

    @api.depends('result_ids')
    def _compute_team_names(self):
        for match in self:
            names = []
            for result in match.result_ids:
                names.append(result.team_id.name)
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
        action['context'] = {'match':self.id, 'next_match': self.find_next_match().id if self.find_next_match() else False}
        return action

    def end_game(self):
        if self.status != 'in_progress':
            return

        self.end_time = fields.Datetime.now()
        self.status = 'done'

    def start_game(self):
        if self.status != 'draft':
            return

        self.start_time = fields.Datetime.now()
        self.status = 'in_progress'

        return self.open_scoreboard()

    def find_next_match(self):
        next_match = False
        future_matches = self.search([('start_time', '>', self.start_time), ('location_id.id', '=', self.location_id.id)])
        if len(future_matches) > 0:
            next_match = min(future_matches, key=lambda match: match.start_time)
        return next_match


