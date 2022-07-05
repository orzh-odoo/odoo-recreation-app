# -*- coding: utf-8 -*-

from odoo import models, fields


class RecreationTeam(models.Model):
    _name = 'recreation.team'
    _description = 'Team for Recreation App'

    name = fields.Char(string='Team Name')
    activity_ids = fields.Many2many(comodel_name='recreation.activity', string='Activities')
    team_member_ids = fields.Many2many(comodel_name='res.partner', string='Team Members')
    match_ids = fields.Many2many(comodel_name='recreation.match', string='Matches')
    rating = fields.Float(string="Rating")
