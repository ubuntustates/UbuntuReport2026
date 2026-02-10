# newsfeeds/pagination.py
from rest_framework.pagination import PageNumberPagination

class HttpsPagination(PageNumberPagination):
    page_size = 40

    def _force_https(self, url):
        """Convert http to https unless it's localhost."""
        if url and "localhost" not in url:
            return url.replace("http://", "https://")
        return url

    def get_next_link(self):
        url = super().get_next_link()
        return self._force_https(url)

    def get_previous_link(self):
        url = super().get_previous_link()
        return self._force_https(url)
