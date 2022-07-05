# -*- coding: utf-8 -*-

from odoo import models, fields


class RecreationActivity(models.Model):

    _name = 'recreation.activity'
    _description = 'Recreation Activity'

    name = fields.Char(string='Activity Name')
    description = fields.Char(string='Activity Description')
    rules = fields.Char(string='Rules')
    teams = fields.Many2many(comodel_name='recreation.team', string='Teams')
    matches = fields.One2many(comodel_name='recreation.match', inverse_name='activity_id',string='Matches')
    locations = fields.Many2many(comodel_name='recreation.location', string='Locations')
    average_game_time = fields.Integer(string='Average Game Time in Minutes')

