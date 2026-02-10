# newsfeeds/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewsArticleViewSet, categories_list, countries_list

router = DefaultRouter()
router.register(r'news', NewsArticleViewSet, basename='news')

urlpatterns = [
    path('categories/', categories_list, name='categories-list'),
    path('countries/', countries_list, name='countries-list'),

    path('', include(router.urls)),
]
