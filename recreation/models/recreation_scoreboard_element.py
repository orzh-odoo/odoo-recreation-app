# -*- coding: utf-8 -*-

from odoo import models, fields


class RecreationScoreboardElement(models.Model):
    _name = 'recreation.scoreboard.element'

    activity_id = fields.Many2one(comodel_name='recreation.activity', string='Activity')
    position_h = fields.Float(string='Horizontal Position')
    position_v = fields.Float(string='Vertical Position')
    height = fields.Float(string='Height')
    width = fields.Float(string='Width')
    image = fields.Image()
    element_type = fields.Selection(
        string='Element Type',
        selection=[
            ('score', 'Score'),
            ('ranking', 'Ranking'),
            ('upcoming', 'Upcoming'),
            ('photo', 'Photo')
        ]
    )