# -*- coding: utf-8 -*-

from odoo import models, fields


class RecreationActivity(models.Model):

    _name = 'recreation.activity'
    _description = 'Recreation Activity'

    name = fields.Char(string='Activity Name')
    description = fields.Text(string='Activity Description')
    rules = fields.Text(string='Rules')
    team_ids = fields.Many2many(comodel_name='recreation.team', string='Teams')
    match_ids = fields.One2many(comodel_name='recreation.match', inverse_name='activity_id', string='Matches')
    location_ids = fields.Many2many(comodel_name='recreation.location', string='Locations')
    average_game_time = fields.Integer(string='Average Game Time in Minutes')

