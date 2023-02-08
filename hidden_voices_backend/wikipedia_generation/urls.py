from django.urls import path

from wikipedia_generation.views import Scrape


urlpatterns = [
    path('scrape/', Scrape.as_view(), name='scrape')
]
