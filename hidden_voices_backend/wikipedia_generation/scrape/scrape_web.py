import requests
from serpapi import GoogleSearch
from googlesearch import search
from wikipedia_generation.environment import GOOGLE_API_KEY, AZURE_API_KEY
from wikipedia_generation.utils import logger


# PROPERTIES = ['full name', 'date of birth', 'place of birth', 'date of death', 'place of death', 'nationality', 'citizenship', 'education',
#               'occupation', 'years active', 'known for', 'field', 'work institutions', 'sub-specialities', 'research', 'notable works', 'website', 'awards']
# TODO: USE PROPERTIES WHEN RUNNING A BACKGROUND JOB
PROPERTIES = ['']
SKIPPED_WEBSITES = ['twitter.com', 'instagram.com', 'wikipedia',
                    'facebook.com', 'fb.com', 'linkedin.com', 'youtube.com', '.pdf']


def scrape_google_news(name, quotes=False):
    params = {
        'api_key': GOOGLE_API_KEY,
        'engine': 'google',
        'q': name if not quotes else f'"{name}"',
        'gl': 'in',
        'tbm': 'nws'
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    links = []
    for result in results['news_results']:
        links.append(result['link'])
    return links


def property_searching(name, prop, quotes=False, num=2, stop=2, pause=15):
    query = name if not quotes else f'"{name}"'
    query = query + f' {prop}'
    results = []
    for result in search(query, tld="com", num=num, stop=stop, pause=pause):
        results.append(result)
    logger.info('LINKS FOR PROPERTY %s FETCHED FOR ENTITY %s', prop, name)
    return results


def scrape_bing(name):
    base_url = 'https://api.bing.microsoft.com/v7.0/search'
    headers = {'Ocp-Apim-Subscription-Key': AZURE_API_KEY}

    params = {
        'q': name,
        'count': 10,
        'offset': 0,
        'mkt': 'en-US',
        'safeSearch': 'Moderate'
    }

    response = requests.get(base_url, headers=headers, params=params)
    data = response.json()
    logger.info('BING SCRAPING COMPLETE')
    results = [result['url'] for result in data['webPages']
               ['value']] if 'webPages' in data else []

    return results


def discard_skipped_websites(results):
    filtered_results = []
    for result in results:
        skip = False
        for link in SKIPPED_WEBSITES:
            if link in result:
                skip = True
                break
        if not skip:
            filtered_results.append(result)

    return filtered_results


def scrape_links(name, quotes=False):
    results = scrape_google_news(name, quotes)
    logger.info('SERPAPI LINK FETCHING COMPLETE')
    property_results = [property_searching(
        name, prop, quotes) for prop in PROPERTIES]
    for result in property_results:
        results.extend(result)
    results.extend(scrape_bing(name))
    results = list(set(results))
    return discard_skipped_websites(results)
