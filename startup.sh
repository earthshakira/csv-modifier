mkdir staticfiles
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic
gunicorn core.wsgi -b 0.0.0.0:$(PORT)--log-file -
