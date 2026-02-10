# newsfeeds/management/commands/fetch_modernghana_news.py

import feedparser
from datetime import datetime
from django.core.management.base import BaseCommand
from newsfeeds.models import NewsArticle
from newsfeeds.utils import fetch_og_image

MODERN_GHANA_FEEDS = {
    "news": "https://rss.modernghana.com/news.xml",
    "sports": "https://rss.modernghana.com/sports.xml",
    "entertainment": "https://rss.modernghana.com/entertainment.xml",
    "lifestyle": "https://rss.modernghana.com/lifestyle.xml",
}

class Command(BaseCommand):
    help = "Fetch Modern Ghana News RSS feeds and store in the database"

    def handle(self, *args, **kwargs):
        total_added = 0
        total_skipped = 0

        for category, url in MODERN_GHANA_FEEDS.items():
            self.stdout.write(f"📡 Fetching {category}...")
            feed = feedparser.parse(url)

            if not feed.entries:
                self.stdout.write(f"⚠️ No entries found for {category}. Skipping.")
                continue

            for entry in feed.entries:
                title = entry.get("title", "No title")
                link = entry.get("link")
                if not link:
                    continue  # Skip entries without a link

                summary = entry.get("summary", "")
                if not summary and "content" in entry:
                    summary = entry.content[0].value

                published_parsed = entry.get("published_parsed") or entry.get("updated_parsed")
                published_date = datetime(*published_parsed[:6]) if published_parsed else datetime.now()

                obj, created = NewsArticle.objects.get_or_create(
                    link=link,
                    defaults={
                        "category": category,
                        "title": title,
                        "summary": summary,
                        "published": published_date,
                        "source": "Modern Ghana",
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
