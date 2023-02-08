from django.apps import AppConfig


class WikipediaGenerationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'wikipedia_generation'

    def ready(self):
        import wikipedia_generation.utils
