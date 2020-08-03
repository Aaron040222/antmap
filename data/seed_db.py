# Import csv to postgresql db

import psycopg2
import pandas as pd

conn = psycopg2.connect("host=ec2-54-243-67-199.compute-1.amazonaws.com dbname=dkquqt7elufn8 user=pduzwrnjceizrb password=735761eac08e9ed3b7e26b75e08284c93646930ea3c19a1dc7bf5a9d97371be1")
#conn = psycopg2.connect("host=localhost dbname=ants_db user=postgres password=Aaron040222")
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS ants_data;")

cur.execute('''CREATE TABLE ants_data (
    id SERIAL PRIMARY KEY NOT NULL,
    accepted_name TEXT NOT NULL,
    accepted_rank TEXT NOT NULL,
    max_ma FLOAT NOT NULL,
    abund_value INTEGER NOT NULL,
    lng FLOAT NOT NULL,
    lat FLOAT NOT NULL,
    cc TEXT NOT NULL);''')

conn.commit()

df_users = pd.read_csv('./data/ants_data.csv', index_col=0)
for idx, u in df_users.iterrows():

    # Data cleaning

    q = cur.execute(
        '''INSERT INTO ants_data (accepted_name, accepted_rank, max_ma, abund_value, lng, lat, cc) VALUES (%s,%s,%s,%s,%s,%s,%s)''',
        (u.accepted_name, u.accepted_rank, u.max_ma, u.abund_value, u.lng, u.lat, u.cc)
    )
    conn.commit()

cur.close()
conn.close()
