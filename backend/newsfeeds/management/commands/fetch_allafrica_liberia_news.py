# newsfeeds/management/commands/fetch_allafrica_liberia_news.py

import feedparser
from datetime import datetime
from django.core.management.base import BaseCommand
from newsfeeds.models import NewsArticle
from newsfeeds.utils import fetch_og_image  # assuming this util exists

ALLAFRICA_LIBERIA_FEED_URL = "https://allafrica.com/tools/headlines/rdf/liberia/headlines.rdf"

class Command(BaseCommand):
    help = "Fetch AllAfrica Liberia RDF feed and store headlines in the database"

    def handle(self, *args, **kwargs):
        total_added = 0
        total_skipped = 0

        self.stdout.write("📡 Fetching AllAfrica Liberia news...")

        feed = feedparser.parse(ALLAFRICA_LIBERIA_FEED_URL)

        if not getattr(feed, 'entries', None):
            self.stdout.write("⚠️ No entries found for AllAfrica Liberia feed.")
            return

        for entry in feed.entries:
            title = entry.get("title", "No title")
            link = entry.get("link")
            if not link:
                continue

            # Try summary/description or fallback to title if none
            summary = entry.get("summary", "") or entry.get("description", "")
            # Some RDF feeds may only give title + link, so summary might be empty — that's okay.

            published_parsed = entry.get("published_parsed") or entry.get("updated_parsed")
            if published_parsed:
                published_date = datetime(*published_parsed[:6])
            else:
                # RSS‑1.0 / RDF may not include dates — fallback
                published_date = datetime.now()

            obj, created = NewsArticle.objects.get_or_create(
                link=link,
                defaults={
                    "category": "general",
                    "title": title,
                    "summary": summary,
                    "published": published_date,
                    "source": "AllAfrica Liberia",
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
