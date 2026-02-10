# newsfeeds/serializers.py

from rest_framework import serializers
from .models import NewsArticle
from bs4 import BeautifulSoup  # ✅ for cleaning HTML

class NewsArticleSerializer(serializers.ModelSerializer):
    summary = serializers.SerializerMethodField()  # <-- clean summary text
    country = serializers.CharField(source="country.name", read_only=True)

    class Meta:
        model = NewsArticle
        fields = [
            'id',
            'title',
            'link',
            'category',
            'country',
            'published',
            'summary',
            'source',
            'image',
        ]

    def get_summary(self, obj):
        """Strip HTML tags from summary."""
        if not obj.summary:
            return ""
        soup = BeautifulSoup(obj.summary, "html.parser")
        text = soup.get_text(separator=" ", strip=True)
        return text
