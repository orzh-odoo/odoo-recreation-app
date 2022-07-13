# -*- coding: utf-8 -*-

from odoo import models, fields, api


class RecreationRating(models.Model):
    _name = 'recreation.rating'

    participant_id = fields.Many2one(string='Participant', comodel_name='res.partner')
    activity_id = fields.Many2one(string='Activity', comodel_name='recreation.activity')
    rating_value = fields.Float(string='Rating')