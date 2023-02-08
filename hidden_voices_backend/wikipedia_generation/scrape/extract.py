from wikipedia_generation.utils import logger
from bs4 import BeautifulSoup
import re
import pandas as pd


def extract_paragraphs(content):
    soup = BeautifulSoup(content, 'html.parser')
    paragraph_content = []
    for para in soup.find_all("p"):
        paragraph_content.append(para.get_text().strip())
    return '\n'.join(paragraph_content)


def process(text):
    characters = {
        "\u2019": "'",
        "\u2013": " - ",
        "\u2014": " - ",
        "\u00a0": " ",
        "\u00e2\u0080\u0093": " - ",
        "\u00e2\u0080\u0099": "'",
        "`": "'"
    }
    for key, value in characters.items():
        text = text.replace(key, value)
    text = re.sub('\n\s*', '\n', text)
    text = re.sub('\t\s*', '\t', text)
    text = re.sub(' +', ' ', text)
    return text.encode("ascii", "ignore").decode().strip()


def extract(links, session):
    successful_links = []
    link_content = []
    for link in links:
        try:
            response = session.get(link, headers={"User-Agent": "Mozilla/5.0"})
            content = extract_paragraphs(response.text)
            successful_links.append(link)
            link_content.append(process(content))
        except Exception:
            logger.warning(f'EXTRACTION FAILED FOR LINK: {link}')

    df = pd.DataFrame()
    df['Link'] = successful_links
    df['Content'] = link_content
    df['Length'] = [len(content) for content in df['Content']]
    df.sort_values(by=['Length'], inplace=True)
    df = df.reset_index().drop('index', axis=1)
    return df
