from rest_framework import viewsets, filters
from .models import NewsArticle, Country
from .serializers import NewsArticleSerializer
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .pagination import HttpsPagination
import datetime
from datetime import timedelta

# Custom FilterSet for NewsArticle
class NewsArticleFilter(FilterSet):
    country = CharFilter(field_name='country__name', lookup_expr='iexact')
    source = CharFilter(field_name='source', lookup_expr='icontains')
    category = CharFilter(field_name='category', lookup_expr='icontains')

    class Meta:
        model = NewsArticle
        fields = ['country', 'source', 'category']


class NewsArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET endpoints for NewsArticle
    Supports filtering by:
      - category, source, search
      - flexible time_frame filters:
        today, yesterday, last_7_days, last_30_days
        this_week, last_week
        this_month, last_month
        this_year, last_year
        YYYY-MM (month) or YYYY (year)
    """
    queryset = NewsArticle.objects.all().order_by('-published')
    serializer_class = NewsArticleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = NewsArticleFilter
    search_fields = ['title', 'category', 'summary', 'source', 'country__name']
    pagination_class = HttpsPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        time_frame = self.request.query_params.get('time_frame')

        if not time_frame:
            return queryset

        now = timezone.now()

        # Helper functions
        def start_of_week(dt):
            return dt - timedelta(days=dt.weekday())

        def start_of_month(dt):
            return dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        def start_of_year(dt):
            return dt.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

        tf = time_frame.lower()

        try:
            if tf == 'today':
                start = now.replace(hour=0, minute=0, second=0, microsecond=0)
                queryset = queryset.filter(published__gte=start)

            elif tf == 'yesterday':
                start = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
                end = start + timedelta(days=1)
                queryset = queryset.filter(published__gte=start, published__lt=end)

            elif tf == 'last_7_days':
                start = now - timedelta(days=7)
                queryset = queryset.filter(published__gte=start)

            elif tf == 'last_30_days':
                start = now - timedelta(days=30)
                queryset = queryset.filter(published__gte=start)

            elif tf == 'this_week':
                start = start_of_week(now)
                queryset = queryset.filter(published__gte=start)

            elif tf == 'last_week':
                start = start_of_week(now) - timedelta(weeks=1)
                end = start + timedelta(weeks=1)
                queryset = queryset.filter(published__gte=start, published__lt=end)

            elif tf == 'this_month':
                start = start_of_month(now)
                queryset = queryset.filter(published__gte=start)

            elif tf == 'last_month':
                start_this_month = start_of_month(now)
                last_month_end = start_this_month
                last_month_start = (last_month_end - timedelta(days=1)).replace(day=1)
                queryset = queryset.filter(published__gte=last_month_start, published__lt=last_month_end)

            elif tf == 'this_year':
                start = start_of_year(now)
                queryset = queryset.filter(published__gte=start)

            elif tf == 'last_year':
                start = start_of_year(now.replace(year=now.year - 1))
                end = start_of_year(now)
                queryset = queryset.filter(published__gte=start, published__lt=end)

            else:
                # Parse YYYY-MM or YYYY
                if len(tf) == 7 and '-' in tf:  # e.g., "2025-11"
                    year, month = map(int, tf.split('-'))
                    start = timezone.make_aware(datetime.datetime(year, month, 1))
                    if month == 12:
                        end = timezone.make_aware(datetime.datetime(year + 1, 1, 1))
                    else:
                        end = timezone.make_aware(datetime.datetime(year, month + 1, 1))
                    queryset = queryset.filter(published__gte=start, published__lt=end)

                elif len(tf) == 4:  # e.g., "2025"
                    year = int(tf)
                    start = timezone.make_aware(datetime.datetime(year, 1, 1))
                    end = timezone.make_aware(datetime.datetime(year + 1, 1, 1))
                    queryset = queryset.filter(published__gte=start, published__lt=end)

                else:
                    queryset = queryset.none()

        except Exception:
            queryset = queryset.none()

        return queryset


@api_view(['GET'])
def categories_list(request):
    """Returns a sorted list of unique categories"""
    categories = (
        NewsArticle.objects.values_list('category', flat=True)
        .distinct()
        .order_by('category')
    )
    return Response(list(categories))


@api_view(['GET'])
def countries_list(request):
    countries = (
        Country.objects.filter(newsarticle__isnull=False)
        .distinct()
        .values('id', 'name')
        .order_by('name')
    )
    return Response(list(countries))
