from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from wikipedia_generation.environment import PPLX_API_KEY
from wikipedia_generation.scrape.scrape_web import scrape_links
from wikipedia_generation.scrape.extract import extract
from wikipedia_generation.scrape.rank import get_ranked_documents
from wikipedia_generation.scrape.filter import get_filtered_content
from wikipedia_generation.utils import logger, send_email, get_factoid_prompt
import requests
import time
import json


class Scrape(APIView):
    def post(self, request) -> Response:
        try:
            name = request.data['name']
            institute = request.data['institute']
            email = request.data['email']
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

            send_email(email, name)
            logger.info('EMAIL SENT TO USER')
            return Response(data=scraped_content, status=status.HTTP_200_OK)
        except Exception as exc:
            logger.error(exc)
            return Response(data=f'ERROR: {exc}', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Extract(APIView):
    def post(self, request) -> Response:
        name = request.data['name']
        URL = 'https://api.perplexity.ai/chat/completions'
        model = 'pplx-7b-chat'
        headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': f'Bearer {PPLX_API_KEY}'
        }
        # of the form [{text, source}, {text, source} ...]
        content = request.data['content']
        logger.info(f'GENERATING FACTOIDS FOR {name.upper()}')
        response = []
        for item in content:
            text = item['text']
            start_time = time.time()
            payload = {
                'model': model,
                'messages': [
                    {
                        'role': 'user',
                        'content': get_factoid_prompt(name, text)
                    }
                ],
                'temperature': 0
            }
            resp = requests.post(URL, json=payload, headers=headers)
            end_time = time.time()
            factoids = json.loads(resp.text)[
                'choices'][0]['message']['content']
            response.append({
                'text': factoids,
                'source': item['source']
            })
            time.sleep(max(20.1 - (end_time - start_time), 0))
        return Response(data=response, status=status.HTTP_200_OK)


class Summarize(APIView):
    def post(self, request) -> Response:
        name = request.data['name']
        factoids = request.data['content']
        URL = 'https://api.perplexity.ai/chat/completions'
        model = 'pplx-7b-chat'
        headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'authorization': f'Bearer {PPLX_API_KEY}'
        }
        content = []
        for i, factoid in enumerate(factoids, start=1):
            content.append(
                f"{i}. Factoids:-\n{factoid['text']}\n{i}. Source:- {factoid['source']}")
        content = '\n'.join(content)
        instruction = f'Generate a biography on {name} in Wikipedia format using the factoids above with inline citations from the mentioned sources. Strictly generate content section-wise and return the output in wiki markup format only.'
        logger.info(f'SUMMARIZING INFORMATION FOR {name.upper()}')
        payload = {
            'model': model,
            'messages': [
                {
                    'role': 'user',
                    'content': f'Name:{name}\n{factoids}\n{instruction}'
                }
            ],
            'temperature': 0
        }
        response = requests.post(URL, json=payload, headers=headers)
        content = json.loads(response.text)[
            'choices'][0]['message']['content'].strip()
        return Response(data={'content': content}, status=status.HTTP_200_OK)
