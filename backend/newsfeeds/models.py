from django.db import models
from .source_country_map import get_country_by_source  # helper to map source → country

class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class NewsArticle(models.Model):
    title = models.CharField(max_length=500)
    link = models.URLField(unique=True)
    published = models.DateTimeField()
    summary = models.TextField(blank=True)
    source = models.CharField(max_length=100, default="BBC")
    image = models.CharField(max_length=1000, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)

    # Only country now
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.source} | {self.title[:50]}"

    def save(self, *args, **kwargs):
        """
        Automatically assign a country based on the source using get_country_by_source.
        Only sets country if it's not already assigned.
        """
        if not self.country:
            country_obj = get_country_by_source(self.source)
            if country_obj:
                self.country = country_obj
        super().save(*args, **kwargs)
