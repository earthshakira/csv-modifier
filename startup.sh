python3 manage.py makemigrations
python3 manage.py migrate
gunicorn core.wsgi --log-file -
