# -*- coding: utf-8 -*-

{
    'name': 'Recreation',
    'summary': 'Manage office recreation activities',
    'description': 'Manage office recreation activities',
    'author': 'Odoo',
    'website': 'https://www.odoo.com',
    'category': 'human_resources',
    'license': 'OPL-1',
    'version': '0.1',
    'depends': ['base'],
    'data': [
        'views/recreation_menuitems.xml',
        'security/ir.model.access.csv',
        'views/recreation_location_views.xml',
        'views/recreation_activity_views.xml',
        'views/recreation_team_views.xml'
    ]
}