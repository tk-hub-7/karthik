"""
WSGI config for military_ams project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'military_ams.settings')

application = get_wsgi_application()
