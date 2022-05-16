python3 mange.py makemigrations
python3 mange.py migrate
gunicorn nameOfProject.wsgi --log-file -
