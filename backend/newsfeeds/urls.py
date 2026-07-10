from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewsArticleViewSet, categories_list, countries_list, top_sources_recent_news, world_recent_news, sport_recent_news

router = DefaultRouter()
router.register(r'news', NewsArticleViewSet, basename='news')

urlpatterns = [
    path('categories/', categories_list, name='categories-list'),
    path('countries/', countries_list, name='countries-list'),
    path('news/top-sources-recent/', top_sources_recent_news, name='top-sources-recent'),  # must come before router include
    path('news/world-recent/', world_recent_news, name='world-recent'),
    path('news/sport-recent/', sport_recent_news, name='sport-recent'),

    path('', include(router.urls)),
]