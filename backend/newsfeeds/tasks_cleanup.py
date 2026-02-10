from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import NewsArticle

@shared_task(name="cleanup_old_news")
def cleanup_old_news():
    cutoff_date = timezone.now() - timedelta(days=31)
    deleted_count, _ = NewsArticle.objects.filter(
        published__lt=cutoff_date
    ).delete()

    return f"Deleted {deleted_count} old news articles"
