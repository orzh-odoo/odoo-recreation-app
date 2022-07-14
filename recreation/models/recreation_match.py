# -*- coding: utf-8 -*-

from itertools import combinations
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
    result_ids = fields.One2many(comodel_name='recreation.result', inverse_name='match_id', string='Results')
    location_id = fields.Many2one(comodel_name='recreation.location', string='Location')
    attending_members = fields.Many2many(comodel_name='res.partner', string='Attending Members')
    winner = fields.Many2one(comodel_name='recreation.team', string='Winner', compute='_compute_winner')
    status = fields.Selection(
        string='Status',
        selection=[
            ('draft', 'Draft'),
            ('in_progress', 'In-Progress'),
            ('done', 'Done')
        ]
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

            max_score = 0
            team_id = None
            for team in match.result_ids:
                if team.score > max_score:
                    max_score = team.score
                    team_id = team.team_id
            match.winner = team_id

    @api.depends('activity_id')
    def _compute_activity_time(self):
        for match in self:
            if match.activity_id:
                match.activity_time = match.activity_id.average_game_time

    def _inverse_activity_time(self):
        return

    def end_game(self):
        if self.status != 'done':
            self.status = 'done'
            for combination in combinations(self.result_ids, 2):
                expected = 1 / (1 + (10 ** (combination[1].team_id.rating - combination[0].team_id.rating)))
                pass

    def start_game(self):
        self.status = 'in_progress'


