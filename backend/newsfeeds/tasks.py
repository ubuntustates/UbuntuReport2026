from celery import shared_task
from django.core.management import call_command
from django.utils import timezone
from datetime import timedelta
from .models import NewsArticle
from .news_commands import NEWS_COMMANDS




# Dynamically create @shared_task for each command
def make_task(cmd_name):
    @shared_task(name=cmd_name)
    def task():
        call_command(cmd_name)
    return task

for cmd in NEWS_COMMANDS:
    globals()[cmd] = make_task(cmd)


@shared_task(name="cleanup_old_news")
def cleanup_old_news():
    cutoff_date = timezone.now() - timedelta(days=31)
    NewsArticle.objects.filter(published__lt=cutoff_date).delete()
