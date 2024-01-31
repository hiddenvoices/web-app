from django.core.mail import EmailMessage
from django.conf import settings
import logging
import warnings

warnings.filterwarnings('ignore', category=DeprecationWarning)
warnings.filterwarnings('ignore', category=FutureWarning)
logger = logging.getLogger(__name__)


def send_email(recipient, name):
    mail = EmailMessage(
        subject=f'[Hidden Voices] Scraped Dataset for {name}',
        body=f'Dear recipient,\nPFA the scraped dataset for {name}.\n\nRegards,\nHidden Voices Team',
        from_email=settings.EMAIL_HOST_USER,
        to=[recipient]
    )
    mail.attach_file('data.csv')
    mail.send()


def get_factoid_prompt(name, paragraph):
    return f"""A factoid is a json-like data structure that captures details of a specific person from a given text. For example:
Text input:
Andrew Yan-Tak Ng is a British-American computer scientist and technology entrepreneur focusing on machine learning and artificial intelligence (AI). Ng was a cofounder and head of Google Brain and was the former Chief Scientist at Baidu, building the company's Artificial Intelligence Group into a team of several thousand people.
Factoid output (keys for the factoid can vary depending on the text):
{{
	"nationality": ["British", "American"],
	"profession": ["Computer scientist", "Technology entrepreneur"],
	"areas of focus": ["Machine learning", "Artificial intelligence"],
	"experience": [
		{{
			"company": "Google Brain",
			"designation": ["Cofounder", "Head"]
		}},
		{{
			"company": "Baidu",
			"designation": ["Former Chief Scientist"],
			"remarks": "Built the company's Artificial Intelligence Group into a team of several thousand people."
		}}
	]
}}

Generate a factoid for {name} for the following text. IMPORTANT - Do not include any details not present in the text:
{paragraph}
"""
