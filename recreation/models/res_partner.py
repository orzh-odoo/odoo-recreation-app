# -*- coding: utf-8 -*-

from odoo import models, fields


class ResPartner(models.Model):
    _inherit = 'res.partner'

    recreation_rating_ids = fields.One2many(string='Recreation Ratings', comodel_name='recreation.rating', inverse_name='participant_id')