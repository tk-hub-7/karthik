"""
ASGI config for military_ams project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'military_ams.settings')

application = get_asgi_application()
