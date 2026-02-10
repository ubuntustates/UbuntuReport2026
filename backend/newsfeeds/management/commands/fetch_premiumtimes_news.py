import feedparser
from datetime import datetime
from django.core.management.base import BaseCommand
from newsfeeds.models import NewsArticle
from newsfeeds.utils import fetch_og_image  # ✅ import image helper


PREMIUMTIMES_FEEDS = {
    "latest": "https://www.premiumtimesng.com/feed",
    "top-news": "https://www.premiumtimesng.com/news/top-news/feed",
    "more-news": "https://www.premiumtimesng.com/news/more-news/feed",
    "sports": "https://www.premiumtimesng.com/news/sports/feed",
    "business": "https://www.premiumtimesng.com/news/business/feed",
}


class Command(BaseCommand):
    help = "Fetch Premium Times Nigeria RSS feeds and store in the database"

    def handle(self, *args, **kwargs):
        total_added = 0
        total_skipped = 0

        for category, url in PREMIUMTIMES_FEEDS.items():
            self.stdout.write(f"📡 Fetching {category} news from Premium Times...")
            feed = feedparser.parse(url)

            if not feed.entries:
                self.stdout.write(f"⚠️ No entries found for {category}. Skipping.")
                continue

            for entry in feed.entries:
                title = entry.get("title", "No title")
                link = entry.get("link")
                if not link:
                    continue  # skip invalid entries

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
                        "source": "Premium Times",
                    },
                )

                if created:
                    # 🖼 Try to fetch the OG image from the article
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
                f"✅ Premium Times news fetched successfully! Added {total_added}, skipped {total_skipped}."
            )
        )
