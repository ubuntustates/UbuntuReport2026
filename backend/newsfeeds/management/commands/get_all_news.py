# newsfeeds/management/commands/get_all_news.py
from django.core.management.base import BaseCommand
import newsfeeds.tasks  # import the module where tasks live
from newsfeeds.tasks import NEWS_COMMANDS

class Command(BaseCommand):
    help = "Trigger all news fetching Celery tasks"

    def handle(self, *args, **kwargs):
        for cmd_name in NEWS_COMMANDS:
            # get the dynamically created task from the tasks module
            task = getattr(newsfeeds.tasks, cmd_name, None)
            if task:
                task.delay()
                self.stdout.write(self.style.SUCCESS(f"Triggered {cmd_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Task {cmd_name} not found in newsfeeds.tasks"))
