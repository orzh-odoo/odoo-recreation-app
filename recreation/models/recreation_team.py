# -*- coding: utf-8 -*-

from email.policy import default
from odoo import models, fields, api


class RecreationTeam(models.Model):
    _name = 'recreation.team'
    _description = 'Team for Recreation App'

    name = fields.Char(string='Team Name')
    activity_id = fields.Many2one(comodel_name='recreation.activity', string='Activities')
    team_member_ids = fields.Many2many(comodel_name='res.partner', string='Team Members')
    match_ids = fields.Many2many(comodel_name='recreation.match', string='Matches')
    rating = fields.Float(string='Rating', default=1000)
    wins = fields.Integer(compute='_compute_results')
    losses = fields.Integer(compute='_compute_results')
    ties = fields.Integer(compute='_compute_results')

    @api.depends('match_ids')
    def _compute_results(self):
        for team in self:
            wins, losses, ties = 0, 0, 0
            for match in self.match_ids:
                if match.status == 'done':
                    if match.winner == team:
                        wins += 1
                    elif not match.winner:
                        ties += 1
                    else:
                        losses += 1
            team.wins = wins
            team.losses = losses
            team.ties = ties