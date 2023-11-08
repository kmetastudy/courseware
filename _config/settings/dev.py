# Load defaults in order to then add/override with dev-only settings
from .defaults import *

DEBUG = True

SECRET_KEY = 'django-insecure-*qainn4r-6s!u7byikl-74um76^3cx+7^p@=8dl06dqv%l*or%'

# django-debug-toolbar
INSTALLED_APPS.append('debug_toolbar')

INTERNAL_IPS = [
    "127.0.0.1",
]
