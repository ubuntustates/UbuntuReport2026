import feedparser
from datetime import datetime
from django.core.management.base import BaseCommand
from newsfeeds.models import NewsArticle
from newsfeeds.utils import fetch_og_image  # ✅ Make sure this exists and works

BBC_FEEDS = {
    "top_stories": "https://feeds.bbci.co.uk/news/rss.xml",
    "world": "https://feeds.bbci.co.uk/news/world/rss.xml",
    "africa": "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
    "business": "https://feeds.bbci.co.uk/news/business/rss.xml",
    "technology": "https://feeds.bbci.co.uk/news/technology/rss.xml",
}

class Command(BaseCommand):
    help = "Fetch BBC News RSS feeds and store in the database"

    def handle(self, *args, **kwargs):
        total_added = 0
        total_skipped = 0

        for category, url in BBC_FEEDS.items():
            self.stdout.write(f"📡 Fetching {category}...")
            feed = feedparser.parse(url)

            if not feed.entries:
                self.stdout.write(f"⚠️ No entries found for {category}. Skipping.")
                continue

            for entry in feed.entries:
                title = entry.get("title", "No title")
                link = entry.get("link")
                if not link:
                    continue  # skip entries without a link

                # Use summary or fallback to content
                summary = entry.get("summary", "")
                if not summary and "content" in entry:
                    summary = entry.content[0].value

                # Parse publication date
                published_parsed = entry.get("published_parsed")
                published_date = datetime(*published_parsed[:6]) if published_parsed else datetime.now()

                # Create or get existing article
                obj, created = NewsArticle.objects.get_or_create(
                    link=link,
                    defaults={
                        "category": category,
                        "title": title,
                        "summary": summary,
                        "published": published_date,
                        "source": "BBC",  # ✅ Explicitly set source
                    }
                )

                if created:
                    # 🖼 Fetch OG image only for new articles
                    image_url = fetch_og_image(link)
                    if image_url:
                        obj.image = image_url
                        obj.save(update_fields=["image"])

                    self.stdout.write(f"🆕 Added: {title}")
                    total_added += 1
                else:
                    total_skipped += 1

        self.stdout.write(self.style.SUCCESS(
            f"✅ BBC news fetched successfully! Added {total_added} new articles, skipped {total_skipped} existing ones."
        ))