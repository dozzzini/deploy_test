#!/bin/sh

# migrate 실행
python manage.py migrate

# 원하는 추가 명령 실행
# 예: gunicorn 실행
gunicorn --bind 0:8000 config.wsgi:application
