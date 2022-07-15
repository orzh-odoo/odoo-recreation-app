# -*- coding: utf-8 -*-

from odoo import models, fields


class RecreationActivity(models.Model):

    _name = 'recreation.activity'
    _description = 'Recreation Activity'

    name = fields.Char(string='Activity Name')
    description = fields.Text(string='Activity Description')
    image = fields.Image(string='Image')
    rules = fields.Text(string='Rules')
    team_ids = fields.Many2many(comodel_name='recreation.team', relation='recreation_activity_team_join', column1='activity_id', column2='team_id', string='Teams')
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
        action['context'] = {'match':new_match}
        return action

    def add_rank_column(self):
        self.env.cr.execute("""
            ALTER TABLE recreation_activity_recreation_team_rel
            ADD rank INT;
        """)
