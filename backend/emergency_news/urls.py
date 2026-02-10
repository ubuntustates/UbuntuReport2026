from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Emergency News API",
        default_version='v1',
        description="Aggregated emergency and breaking news from multiple sources.",
        contact=openapi.Contact(email="support@chiadetech.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,  # 👈 ensures schema is visible without login
    permission_classes=(permissions.AllowAny,),  # 👈 prevents redirect to admin login
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("newsfeeds.urls")),

    # ✅ Swagger & ReDoc routes
    re_path(r"^swagger(?P<format>\.json|\.yaml)$",
            schema_view.without_ui(cache_timeout=0),
            name="schema-json"),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0),
         name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0),
         name="schema-redoc"),
]
