"""
The flask application package.
"""

from flask import Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = '123456'

import Hot_Pot.views


