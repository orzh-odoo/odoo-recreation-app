# -*- coding: utf-8 -*-

from odoo import models, fields


class RecreationMatch(models.Model):
    _name = 'recreation.match'
    _description = 'Matches for Recreation App'

    name = fields.Char(string="Name")
    activity_id = fields.Many2one(comodel_name='recreation.activity', string='Activity')
    team_ids = fields.Many2many(comodel_name='recreation.team', string='Teams')
    start_time = fields.Datetime(string='Start Time')
    end_time = fields.Datetime(string='End Time')
    activity_time = fields.Integer(string='Activity Time')
    result_ids = fields.One2many(comodel_name='recreation.result', inverse_name='match_id', string='Results')
    location_id = fields.Many2one(comodel_name='recreation.location', string='Location')
    attending_members = fields.Many2many(comodel_name='res.partner', string='Attending Members')
    child = fields.Many2one(comodel_name='recreation.match', string='Child')
    winner = fields.Many2one(comodel_name='recreation.team', string='Winner')
    