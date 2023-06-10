from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from wikipedia_generation.environment import OPEN_API_KEY
from wikipedia_generation.scrape.scrape_web import scrape_links
from wikipedia_generation.scrape.extract import extract
from wikipedia_generation.scrape.rank import get_ranked_documents
from wikipedia_generation.scrape.filter import get_filtered_content
from wikipedia_generation.utils import logger
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import requests
import openai


class Scrape(APIView):
    def post(self, request) -> Response:
        try:
            name = request.data['name']
            institute = request.data['institute']
            search_entity = f'{name} {institute}'

            logger.info('SCRAPING STARTED FOR %s', search_entity)
            session = requests.Session()

            links = scrape_links(search_entity, quotes=True)
            logger.info('LINKS FETCHED')

            content_df = extract(links, session)
            session.close()
            logger.info('WEB EXTRACTION COMPLETE')

            ranked_df = get_ranked_documents(
                content_df, name, group_count=None)
            scraped_content = get_filtered_content(ranked_df)
            logger.info('SCRAPING COMPLETE')
            return Response(data=scraped_content, status=status.HTTP_200_OK)
        except Exception as exc:
            logger.error(exc)
            return Response(data=f'ERROR: {exc}', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Extract(APIView):
    def post(self, request) -> Response:
        name = request.data['name']
        # of the form [{text, source}, {text, source} ...]
        content = request.data['content']
        logger.info(f'GENERATING FACTOIDS FOR {name.upper()}')
        instruction = f'Generate information on {name} in the following format:\nName: {name}'
        openai.api_key = OPEN_API_KEY
        response = []
        for item in content:
            text = item['text']
            resp = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "user", "content": f'{text}\n{instruction}'}
                ],
                temperature=0,
            )
            factoids = resp['choices'][0]['message']['content'].strip()
            response.append({
                'text': factoids,
                'source': item['source']
            })
        return Response(data=response, status=status.HTTP_200_OK)


class Summarize(APIView):
    def post(self, request) -> Response:
        name = request.data['name']
        factoids = request.data['content']
        content = []
        for i, factoid in enumerate(factoids, start=1):
            content.append(
                f"{i}. Factoids:-\n{factoid['text']}\n{i}. Source:- {factoid['source']}")
        content = '\n'.join(content)
        instruction = f'Generate a biography on {name} in Wikipedia format using the factoids above with inline citations from the mentioned sources. Strictly generate content section-wise and return the output in wiki markup format only.'
        logger.info(f'SUMMARIZING INFORMATION FOR {name.upper()}')
        openai.api_key = OPEN_API_KEY
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": f'Name:{name}\n{factoids}\n{instruction}'}
            ],
            temperature=0,
        )
        content = response['choices'][0]['message']['content'].strip()
        return Response(data={'content': content}, status=status.HTTP_200_OK)
