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
    'demo': [
        'demo/recreation_location_demo.xml',
        'demo/recreation_activity_demo.xml',
        'demo/recreation_team_demo.xml',
        'demo/recreation_result_demo.xml',
        'demo/recreation_match_demo.xml',
    ],
    'data': [
        'views/recreation_menuitems.xml',
        'views/recreation_match_views.xml',
        'security/ir.model.access.csv',
        'views/recreation_location_views.xml',
        'views/recreation_activity_views.xml',
        'views/recreation_team_views.xml',
        'views/recreation_result_views.xml'
    ]
}