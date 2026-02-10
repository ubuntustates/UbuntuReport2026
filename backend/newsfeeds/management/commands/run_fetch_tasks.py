# newsfeeds/management/commands/get_all_news.py
from django.core.management.base import BaseCommand
import newsfeeds.tasks
from newsfeeds.tasks import NEWS_COMMANDS

class Command(BaseCommand):
    help = "Trigger all news fetching Celery tasks"

    def handle(self, *args, **kwargs):
        for cmd_name in NEWS_COMMANDS:
            task = getattr(newsfeeds.tasks, cmd_name, None)
            if task:
                task.delay()
                self.stdout.write(self.style.SUCCESS(f"Task {cmd_name} triggered successfully."))
            else:
                self.stdout.write(self.style.WARNING(f"Task {cmd_name} not found."))
