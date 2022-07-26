# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import ValidationError


class RecreationScoreIncrement(models.Model):
    _name = 'recreation.score.increment'

    name = fields.Char(string='Name', compute='_compute_name')
    value = fields.Integer(string='Value')
    activity_id = fields.Many2one(comodel_name='recreation.activity')

    @api.depends('value')
    def _compute_name(self):
        for record in self:
            record.name = str(record.value)

    @api.constrains('value')
    def _check_value(self):
        for record in self:
            if record.value <= 0:
                raise ValidationError('Increment value must be a positive integer')
