# -*- coding: utf-8 -*-

from odoo import models, fields


class RecreationActivity(models.Model):

    _name = 'recreation.activity'
    _description = 'Recreation Activity'

    name = fields.Char(string='Activity Name', required=True)
    description = fields.Text(string='Activity Description')
    image = fields.Image(string='Image')
    rules = fields.Text(string='Rules')
    team_ids = fields.Many2many(comodel_name='recreation.team', relation='recreation_activity_team_join', column1='activity_id', column2='team_id', string='Teams')
    match_ids = fields.One2many(comodel_name='recreation.match', inverse_name='activity_id', string='Matches')
    location_ids = fields.Many2many(comodel_name='recreation.location', string='Locations')
    average_game_time = fields.Integer(string='Average Game Time in Minutes')
    score_increment_ids = fields.One2many(comodel_name='recreation.score.increment', inverse_name='activity_id', string='Score Increments')
    win_condition = fields.Selection(
        selection=[
            ('lowest', 'Lowest Score Wins'),
            ('highest', 'Highest Score Wins')
        ],
        string='Win Condition',
        default='highest'
    )

    #configuration fields
    min_team_size = fields.Integer(string="Min Team Size")
    max_team_size = fields.Integer(string="Max Team Size")
    custom_input = fields.Boolean(string="Toggle Custom Input")

    def new_match(self):
        new_match = self.env['recreation.match'].create({'activity_id': self.id})
        
        action = self.env.ref('recreation.launch_team_wizard').read()[0] 
        action['context'] = { 'start': True, 'match_id': new_match.id }
        return action


    def edit_scoreboard(self):
        action = self.env.ref('recreation.recreation_action_scoreboard').read()[0] 
        action['context'] = { 'edit': True, 'activity_id': self.id }
        return action
