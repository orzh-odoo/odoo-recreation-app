# -*- coding: utf-8 -*-

from odoo import fields, models


class RecreationTeamWizard(models.TransientModel):
    _name = 'recreation.team.wizard'
    _description = 'Wizard: Add Teams to a New Match'

    def _default_match(self):
        return self.env.context['match_id'] or self.env['recreation.match'].browse(self._context.get('active_id'))

    match_id = fields.Many2one(comodel_name='recreation.match', string='Match', default=_default_match)

    def _get_domain(self):
        return f"[('size', '<=', {self.match_id.activity_id.max_team_size}), ('size', '>=', {self.match_id.activity_id.min_team_size})]"

    team_ids = fields.Many2many(comodel_name='recreation.team', string='Teams', domain=_get_domain)

    def save_teams(self):
        for team in self.team_ids:
            self.env['recreation.result'].create({
                'match_id': self.match_id.id,
                'team_id': team.id
            })
        if self.env.context['start']:
            return self.match_id.start_game()
        




