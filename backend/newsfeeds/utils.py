import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from django.conf import settings

def fetch_og_image(url):
    """
    Extracts a representative image for a news article using:
    1. Open Graph (<meta property="og:image">)
    2. Twitter cards (<meta name="twitter:image">)
    3. First <img> tag in the body (fallback)
    Always returns a valid image URL (never None).
    """
    

    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(url, headers=headers, timeout=5)
        if res.status_code != 200:
            return fallback

        soup = BeautifulSoup(res.text, "html.parser")

        # 1️⃣ Open Graph
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            return og_image["content"]

        # 2️⃣ Twitter Card
        twitter_img = soup.find("meta", attrs={"name": "twitter:image"})
        if twitter_img and twitter_img.get("content"):
            return twitter_img["content"]

        # 3️⃣ First <img> tag
        img_tag = soup.find("img", src=True)
        if img_tag:
            src = img_tag["src"]
            if src.startswith("//"):
                return f"https:{src}"
            elif src.startswith("/"):
                return urljoin(url, src)
            else:
                return src

    except Exception as e:
        print("⚠️ OG Image fetch failed:", e)

    # Fallback if all else fails
    return settings.FALLBACK_NEWS_IMAGE
