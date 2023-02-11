from django.urls import path

from wikipedia_generation.views import Scrape, Extract, Summarize


urlpatterns = [
    path('scrape/', Scrape.as_view(), name='scrape'),
    path('extract/', Extract.as_view(), name='extract'),
    path('summarize/', Summarize.as_view(), name='summarize'),
]
