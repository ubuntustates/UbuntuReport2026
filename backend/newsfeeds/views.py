from rest_framework import viewsets, filters
from .models import NewsArticle, Country
from .serializers import NewsArticleSerializer
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from django.utils import timezone
from django.db.models import Value
from django.db.models.functions import Lower, Replace
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


def normalize_source(value: str) -> str:
    """Lowercase and remove all whitespace, e.g. 'The Guardian' -> 'theguardian'."""
    return value.strip().lower().replace(' ', '')


class NewsArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET endpoints for NewsArticle
    Supports filtering by:
      - category, source, search
      - sources: comma-separated list of normalized source names
        e.g. ?sources=bbc,vanguard,channels,theguardian
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

        # --- Multi-source filter (normalized: lowercase, no spaces) ---
        sources_param = self.request.query_params.get('sources')
        if sources_param:
            normalized_sources = [
                normalize_source(s) for s in sources_param.split(',') if s.strip()
            ]
            if normalized_sources:
                queryset = queryset.annotate(
                    normalized_source=Replace(
                        Lower('source'), Value(' '), Value('')
                    )
                ).filter(normalized_source__in=normalized_sources)
            else:
                queryset = queryset.none()

        # --- Existing time_frame logic ---
        time_frame = self.request.query_params.get('time_frame')

        if not time_frame:
            return queryset

        now = timezone.now()

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
                if len(tf) == 7 and '-' in tf:
                    year, month = map(int, tf.split('-'))
                    start = timezone.make_aware(datetime.datetime(year, month, 1))
                    if month == 12:
                        end = timezone.make_aware(datetime.datetime(year + 1, 1, 1))
                    else:
                        end = timezone.make_aware(datetime.datetime(year, month + 1, 1))
                    queryset = queryset.filter(published__gte=start, published__lt=end)

                elif len(tf) == 4:
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





from django.db.models import Value
from django.db.models.functions import Lower, Replace

# Fixed set of sources for this endpoint (normalized: lowercase, no spaces)
TOP_SOURCES = ['bbc', 'cnn', 'vanguard', 'channels']


@api_view(['GET'])
def top_sources_recent_news(request):
    """
    Returns news from BBC, CNN, Vanguard, and Channels published in the last 2 hours.
    """
    cutoff = timezone.now() - timedelta(hours=2)

    queryset = (
        NewsArticle.objects.annotate(
            normalized_source=Replace(Lower('source'), Value(' '), Value(''))
        )
        .filter(
            normalized_source__in=TOP_SOURCES,
            published__gte=cutoff,
        )
        .order_by('-published')
    )

    paginator = HttpsPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = NewsArticleSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)