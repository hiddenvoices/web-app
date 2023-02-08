from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from wikipedia_generation.scrape.scrape_google import scrape_links
from wikipedia_generation.scrape.extract import extract
from wikipedia_generation.scrape.rank import get_ranked_documents
from wikipedia_generation.scrape.filter import get_filtered_content
from wikipedia_generation.utils import logger
import requests


class Scrape(APIView):
    def post(self, request) -> Response:
        name = request.data['name']
        logger.info(f'SCRAPING STARTED FOR {name}')
        session = requests.Session()

        links = scrape_links(name, quotes=True)
        logger.info(f'GOOGLE LINKS FETCHED')

        content_df = extract(links, session)
        session.close()
        logger.info(f'WEB EXTRACTION COMPLETE')

        ranked_df = get_ranked_documents(content_df, name, group_count=None)
        scraped_content = get_filtered_content(ranked_df)
        logger.info(f'SCRAPING COMPLETE')

        return Response(data={'name': name, 'content': scraped_content}, status=status.HTTP_200_OK)
