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
