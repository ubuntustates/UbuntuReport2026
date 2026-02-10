import feedparser
from datetime import datetime
from django.core.management.base import BaseCommand
from newsfeeds.models import NewsArticle
from newsfeeds.utils import fetch_og_image  # ✅ import helper

CNN_FEEDS = {
    "top_stories": "http://rss.cnn.com/rss/cnn_topstories.rss",
    "world": "http://rss.cnn.com/rss/cnn_world.rss",
}


class Command(BaseCommand):
    help = "Fetch CNN News RSS feeds and store in the database"

    def handle(self, *args, **kwargs):
        total_added = 0
        total_skipped = 0

        for category, url in CNN_FEEDS.items():
            self.stdout.write(f"📡 Fetching {category} news from CNN...")
            feed = feedparser.parse(url)

            if not feed.entries:
                self.stdout.write(f"⚠️ No entries found for {category}. Skipping.")
                continue

            for entry in feed.entries:
                title = entry.get("title", "No title")
                link = entry.get("link")
                if not link:
                    continue  # skip invalid entry

                # Use summary or fallback
                summary = entry.get("summary", "")
                if not summary and "content" in entry:
                    summary = entry.content[0].value

                # Published date
                published_parsed = entry.get("published_parsed") or entry.get("updated_parsed")
                published_date = datetime(*published_parsed[:6]) if published_parsed else datetime.now()

                # Create or skip duplicate
                obj, created = NewsArticle.objects.get_or_create(
                    link=link,
                    defaults={
                        "category": category,
                        "title": title,
                        "summary": summary,
                        "published": published_date,
                        "source": "CNN",
                    },
                )

                if created:
                    # 🖼 Fetch OG image for new article
                    image_url = fetch_og_image(link)
                    if image_url:
                        obj.image = image_url
                        obj.save(update_fields=["image"])
                    self.stdout.write(f"🆕 Added: {title}")
                    total_added += 1
                else:
                    self.stdout.write(f"⏭ Skipped duplicate: {title}")
                    total_skipped += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"✅ CNN news fetched successfully! Added {total_added}, skipped {total_skipped}."
            )
        )
