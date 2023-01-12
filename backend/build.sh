#!/bin/bash

python3.9 -m pip install -r requirements.txt


python3.9 manage.py makemigrations --noinput
python3.9 manage.py migrate --noinput

