# emergency_news/celery.py

import os
from celery import Celery
from celery.schedules import crontab
from django.conf import settings


from newsfeeds.news_commands import NEWS_COMMANDS


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emergency_news.settings')

# Use REDIS_URL from environment first (Docker), fallback to settings
REDIS_URL = os.getenv("REDIS_URL", getattr(settings, "REDIS_URL", "redis://localhost:6379/0"))

app = Celery('emergency_news', broker=REDIS_URL, backend=REDIS_URL)

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()


# Hourly news fetch schedule
app.conf.beat_schedule = {
    f'{task}-every-hour': {
        'task': task,
        'schedule': crontab(minute=0, hour='*'),
    } for task in NEWS_COMMANDS
}

app.conf.beat_schedule.update({
    'cleanup-old-news-daily': {
        'task': 'cleanup_old_news',
        'schedule': crontab(hour=0, minute=30),  # every day at 00:30
    },
})
