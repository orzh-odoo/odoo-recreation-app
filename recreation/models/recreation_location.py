# -*- coding: utf-8 -*-

from odoo import models, fields


class RecreationLocation(models.Model):

    _name = 'recreation.location'
    _description = 'Recreation Location'

    name = fields.Char(string='Location Name')
    activity_ids = fields.Many2many(comodel_name='recreation.activity', string='Activities')
    match_ids = fields.One2many(comodel_name='recreation.match', inverse_name='location_id', string='Matches')
