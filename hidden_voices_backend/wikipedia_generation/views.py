from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from wikipedia_generation.environment import API_KEY
from wikipedia_generation.scrape.scrape_google import scrape_links
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


class Extract(APIView):
    def post(self, request) -> Response:
        name = request.data['name']
        content = request.data['content']
        instruction = f'Generate triplets of the form {{object, verb, predicate}} on {name} from the text above.'
        logger.info(f'GENERATING TRIPLETS FOR {name.upper()}')
        openai.api_key = API_KEY
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f'{content}\n{instruction}',
            temperature=0.7,
            max_tokens=256,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        triples = response['choices'][0]['text'].strip()
        triples = self.__format_triples(triples)
        return Response(data={'triples': triples}, status=status.HTTP_200_OK)

    def __format_triples(self, triples) -> str:
        stop_words = set(stopwords.words('english'))
        sentences = triples.split('\n')

        filtered_content = []
        for sentence in sentences:
            word_tokens = word_tokenize(sentence)
            filtered_sentence = [
                w for w in word_tokens if w.lower() not in stop_words]
            filtered_content.append(' '.join(filtered_sentence))
        return '\n'.join(filtered_content)


class Summarize(APIView):
    def post(self, request) -> Response:
        name = request.data['name']
        triples = request.data['triples']
        instruction = f'Summarize information about {name} from the triples above.'
        logger.info(f'SUMMARIZING INFORMATION FOR {name.upper()}')
        openai.api_key = API_KEY
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f'{triples}\n{instruction}',
            temperature=0.7,
            max_tokens=256,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        content = response['choices'][0]['text'].strip()
        return Response(data={'content': content}, status=status.HTTP_200_OK)
