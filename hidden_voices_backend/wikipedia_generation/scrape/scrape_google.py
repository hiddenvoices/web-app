from serpapi import GoogleSearch
from googlesearch import search

PROPERTIES = ['full name', 'date of birth', 'place of birth', 'date of death', 'place of death', 'nationality', 'citizenship', 'education',
              'occupation', 'years active', 'known for', 'field', 'work institutions', 'sub-specialities', 'research', 'notable works', 'website', 'awards']
SKIPPED_WEBSITES = ['twitter.com', 'instagram.com', 'wikipedia',
                    'facebook.com', 'fb.com', 'linkedin.com', 'youtube.com', '.pdf']


def scrape_google_news(name, quotes=False):
    params = {
        'api_key': '42634eaddcbab45eb93b66c63a13c110b28c1e0c2da77c4443eda8f0090d2e56',
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
    property_results = [property_searching(
        name, prop, quotes) for prop in PROPERTIES]
    for result in property_results:
        results.extend(result)
    results = list(set(results))
    return discard_skipped_websites(results)
