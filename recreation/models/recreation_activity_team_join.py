# -*- coding: utf-8 -*-

from odoo import models, fields


class ActivityTeamJoin(models.Model):
    _name = 'recreation.activity.team.join'
    _description = 'Recreation Activity Team Join Table'
    _table = 'recreation_activity_team_join'

    activity_id = fields.Many2one(comodel_name='recreation.activity', index=True, required=True, ondelete='cascade')
    team_id = fields.Many2one(comodel_name='recreation.team', index=True, required=True, ondelete='cascade')
    rank = fields.Integer(string='Rank')