# newsfeeds/management/commands/fetch_allafrica_news.py

import feedparser
from datetime import datetime
from django.core.management.base import BaseCommand
from newsfeeds.models import NewsArticle
from newsfeeds.utils import fetch_og_image  # ensure this exists

ALLAFRICA_FEED = "https://allafrica.com/tools/headlines/rdf/africa/headlines.rdf"


class Command(BaseCommand):
    help = "Fetch AllAfrica Africa Headlines RSS feed and store in the database"

    def handle(self, *args, **kwargs):
        self.stdout.write("📡 Fetching AllAfrica Africa Headlines...")

        feed = feedparser.parse(ALLAFRICA_FEED)

        if not feed.entries:
            self.stdout.write("⚠️ No entries found. Exiting.")
            return

        total_added = 0
        total_skipped = 0

        for entry in feed.entries:
            title = entry.get("title", "No title")
            link = entry.get("link")
            if not link:
                continue

            # Summary / description
            summary = entry.get("summary", "")
            if not summary and "content" in entry:
                summary = entry.content[0].value

            # Publication date
            published_parsed = entry.get("published_parsed") or entry.get("updated_parsed")
            published_date = (
                datetime(*published_parsed[:6])
                if published_parsed
                else datetime.now()
            )

            # Store in DB
            obj, created = NewsArticle.objects.get_or_create(
                link=link,
                defaults={
                    "category": "africa",
                    "title": title,
                    "summary": summary,
                    "published": published_date,
                    "source": "AllAfrica",
                }
            )

            if created:
                # Fetch OG image only for new items
                image_url = fetch_og_image(link)
                if image_url:
                    obj.image = image_url
                    obj.save(update_fields=["image"])

                self.stdout.write(f"🆕 Added: {title}")
                total_added += 1
            else:
                total_skipped += 1

        self.stdout.write(self.style.SUCCESS(
            f"✅ AllAfrica news fetched successfully! Added {total_added} new articles, skipped {total_skipped} existing ones."
        ))
