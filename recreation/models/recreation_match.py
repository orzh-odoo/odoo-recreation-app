# -*- coding: utf-8 -*-

from odoo import models, fields, api


class RecreationMatch(models.Model):
    _name = 'recreation.match'
    _description = 'Matches for Recreation App'

    name = fields.Char(string="Name")
    activity_id = fields.Many2one(comodel_name='recreation.activity', string='Activity')
    team_ids = fields.Many2many(comodel_name='recreation.team', string='Teams')
    start_time = fields.Datetime(string='Start Time')
    end_time = fields.Datetime(string='End Time')
    activity_time = fields.Integer(string='Activity Time')
    result_ids = fields.One2many(comodel_name='recreation.result', inverse_name='match_id', string='Results')
    location_id = fields.Many2one(comodel_name='recreation.location', string='Location')
    attending_members = fields.Many2many(comodel_name='res.partner', string='Attending Members')
    child = fields.Many2one(comodel_name='recreation.match', string='Next Match')
    winner = fields.Many2one(comodel_name='recreation.team', string='Winner')
    status = fields.Selection(
        string='Status',
        selection=[
            ('draft', 'Draft'),
            ('in_progress', 'In-Progress'),
            ('done', 'Done')
        ]
    )
    team_names = fields.Char(compute='_compute_team_names')

    @api.depends('team_ids')
    def _compute_team_names(self):
        for match in self:
            names = []
            for team in match.team_ids:
                names.append(team.name)
            match.team_names = ', '.join(names)

