# newsfeeds/management/commands/fetch_lecalame_news.py

import feedparser
from datetime import datetime
from django.core.management.base import BaseCommand
from newsfeeds.models import NewsArticle
from newsfeeds.utils import fetch_og_image

LECALAME_FEED_URL = "https://www.lecalame.info/?q=rss.xml"

class Command(BaseCommand):
    help = "Fetch Le Calame RSS feed and store articles in the database (if feed available)"

    def handle(self, *args, **kwargs):
        total_added = 0
        total_skipped = 0

        self.stdout.write("📡 Fetching Le Calame news...")

        feed = feedparser.parse(LECALAME_FEED_URL)

        if not hasattr(feed, 'entries') or not feed.entries:
            self.stdout.write("⚠️ No entries found — maybe feed invalid or unavailable.")
            return

        for entry in feed.entries:
            title = entry.get("title", "No title")
            link = entry.get("link")
            if not link:
                continue

            summary = entry.get("summary", "") or entry.get("description", "")
            if not summary and "content" in entry:
                summary = entry.content[0].value

            published_parsed = entry.get("published_parsed") or entry.get("updated_parsed")
            if published_parsed:
                published_date = datetime(*published_parsed[:6])
            else:
                published_date = datetime.now()

            obj, created = NewsArticle.objects.get_or_create(
                link=link,
                defaults={
                    "category": "general",
                    "title": title,
                    "summary": summary,
                    "published": published_date,
                    "source": "Le Calame",
                }
            )

            if created:
                image_url = fetch_og_image(link)
                if image_url:
                    obj.image = image_url
                    obj.save(update_fields=["image"])
                self.stdout.write(f"🆕 Added: {title}")
                total_added += 1
            else:
                total_skipped += 1

        self.stdout.write(self.style.SUCCESS(
            f"✅ Done! Added {total_added} new articles, skipped {total_skipped} existing ones."
        ))
