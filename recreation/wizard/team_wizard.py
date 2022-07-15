# -*- coding: utf-8 -*-

from odoo import fields, models


class RecreationTeamWizard(models.TransientModel):
    _name = 'recreation.team.wizard'
    _description = 'Wizard: Add Teams to a New Match'

    def _default_match(self):
        return self.env['recreation.match'].browse(self._context.get('active_id'))

    match_id = fields.Many2one(comodel_name='recreation.match', string='Match', default=_default_match)

    team_ids = fields.Many2many(comodel_name='recreation.team', string='Teams')

    def save_teams(self):
        for team in self.team_ids:
            self.env['recreation.result'].create({
                'match_id': self.match_id.id,
                'team_id': team.id
            })



