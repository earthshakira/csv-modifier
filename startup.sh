python3 manage.py makemigrations
python3 manage.py migrate
cd frontend
npm install
npm run relocate
cd ../
gunicorn core.wsgi --log-file -
