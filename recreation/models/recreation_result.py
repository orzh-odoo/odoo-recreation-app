# -*- coding: utf-8 -*-

from odoo import models, fields


class RecreationResult(models.Model):
    _name = 'recreation.result'
    _description = 'Result for Recreation'

    match_id = fields.Many2one(comodel_name='recreation.match', string='Match')
    team_id = fields.Many2one(comodel_name='recreation.team', string='Team')
    score = fields.Integer(string='Score')