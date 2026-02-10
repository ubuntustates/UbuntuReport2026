FOR AUTOMATIC FETCHING


Restart your Celery worker:
    celery -A emergency_news worker -l info
Restart Celery Beat (if running separately):
    celery -A emergency_news beat -l info
Trigger the task manually (optional, to test):
    python manage.py shell

    from newsfeeds.tasks import fetch_bbc_news, fetch_cnn_news, fetch_vanguard_news, fetch_aljazeera_news, fetch_guardian_news, fetch_channelstv_news, fetch_premiumtimes_news,fetch_allafrica_news, fetch_modernghana_news, fetch_myjoyonline_news, fetch_ghheadlines_news

fetch_bbc_news.delay()
fetch_cnn_news.delay()
fetch_vanguard_news.delay()
fetch_aljazeera_news.delay()
fetch_guardian_news.delay()
fetch_channelstv_news.delay()
fetch_premiumtimes_news.delay()
fetch_allafrica_news.delay()
fetch_modernghana_news.delay()
fetch_myjoyonline_news.delay()
fetch_ghheadlines_news.delay()

