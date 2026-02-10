# newsfeeds/management/utils/populate_countries.py

from django.core.management.base import BaseCommand
from newsfeeds.models import Country
from newsfeeds.source_country_map import SOURCE_COUNTRY_MAP

class Command(BaseCommand):
    help = "Populate Country table from SOURCE_COUNTRY_MAP"

    def handle(self, *args, **kwargs):
        for country_name in SOURCE_COUNTRY_MAP.keys():
            obj, created = Country.objects.get_or_create(name=country_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Added {country_name}'))
