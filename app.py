import pandas as pd
import numpy as np
import matplotlib
from matplotlib import pyplot as pt
import os
from os import environ
from dotenv import load_dotenv
from flask import Flask, render_template, jsonify
import gunicorn
import psycopg2
import sys
import geojson 
import json
load_dotenv('.env')

app = Flask(__name__)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://aaron2:Aaron040222@localhost:5432/ants_db'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "finalprojectkey"

@app.route('/')
def index():
   return render_template("index.html")

@app.route('/load_data', methods=['GET'])
def load_data():
    # con = psycopg2.connect("host='ec2-54-243-67-199.compute-1.amazonaws.com' dbname='dkquqt7elufn8' user='pduzwrnjceizrb' password='735761eac08e9ed3b7e26b75e08284c93646930ea3c19a1dc7bf5a9d97371be1'")  
    # cur = con.cursor()
    # cur.execute("""select * from ants_data""")
    # row_headers=[x[0] for x in cur.description]
    # rv = cur.fetchall()
    # json_data=[]
    # for result in rv:
    #     json_data.append(dict(zip(row_headers,result)))
    # return jsonify(json_data)
    with open ('ants_data.geojson') as f:
        data = json.load(f)
    return jsonify(data)
if __name__ == '__main__':
   app.run(debug=True)
