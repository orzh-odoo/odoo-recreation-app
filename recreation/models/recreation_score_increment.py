# -*- coding: utf-8 -*-

from odoo import models, fields, api


class RecreationScoreIncrement(models.Model):
    _name = 'recreation.score.increment'

    name = fields.Char(string='Name', compute='_compute_name')
    value = fields.Integer(string='Value')
    activity_id = fields.Many2one(comodel_name='recreation.activity')

    @api.depends('value')
    def _compute_name(self):
        for record in self:
            record.name = str(record.value)
