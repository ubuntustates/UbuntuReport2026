# newsfeeds/management/commands/fetch_terangatimesn_news.py

import feedparser
from datetime import datetime
from django.core.management.base import BaseCommand
from newsfeeds.models import NewsArticle
from newsfeeds.utils import fetch_og_image  # assuming this util exists

TERANGATIMESN_FEED_URL = "https://www.terangatimesn.com/xml/syndication.rss"

class Command(BaseCommand):
    help = "Fetch TerangaTimesN RSS feed and store articles in the database"

    def handle(self, *args, **kwargs):
        total_added = 0
        total_skipped = 0

        self.stdout.write("📡 Fetching TerangaTimesN news...")

        feed = feedparser.parse(TERANGATIMESN_FEED_URL)

        if not feed.entries:
            self.stdout.write("⚠️ No entries found for TerangaTimesN feed.")
            return

        for entry in feed.entries:
            title = entry.get("title", "No title")
            link = entry.get("link")
            if not link:
                continue

            summary = entry.get("summary", "")
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
                    "source": "TerangaTimesN",
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
