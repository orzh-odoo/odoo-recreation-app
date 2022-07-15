# -*- coding: utf-8 -*-

from odoo import models, fields


class RecreationActivity(models.Model):

    _name = 'recreation.activity'
    _description = 'Recreation Activity'

    name = fields.Char(string='Activity Name')
    description = fields.Text(string='Activity Description')
    image = fields.Image(string='Image')
    rules = fields.Text(string='Rules')
    team_ids = fields.Many2many(comodel_name='recreation.team', string='Teams')
    match_ids = fields.One2many(comodel_name='recreation.match', inverse_name='activity_id', string='Matches')
    location_ids = fields.Many2many(comodel_name='recreation.location', string='Locations')
    average_game_time = fields.Integer(string='Average Game Time in Minutes')

    #configuration fields
    min_team_size = fields.Integer(string="Min Team Size")
    max_team_size = fields.Integer(string="Max Team Size")
    custom_input = fields.Boolean(string="Toggle Custom Input")

    def new_match(self):
        new_match = self.env['recreation.match'].create({'activity_id': self.id})
        action = self.env.ref('recreation.recreation_action_scoreboard').read()[0] 
        action['context'] = {'match':new_match.id}
        return action

    def edit_scoreboard(self):
        action = self.env.ref('recreation.recreation_action_scoreboard').read()[0] 
        action['context'] = { 'edit': True, 'activity_id': self.id, 'match': self.match_ids[0].id }
        return action