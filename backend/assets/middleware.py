import json
from django.utils.deprecation import MiddlewareMixin
from .models import APILog


class APILoggingMiddleware(MiddlewareMixin):
    """Middleware to log all API requests and responses"""
    
    def process_request(self, request):
        # Store request body for logging
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                request._body_copy = request.body.decode('utf-8')
            except:
                request._body_copy = ''
        else:
            request._body_copy = ''
        return None
    
    def process_response(self, request, response):
        # Only log API endpoints
        if request.path.startswith('/api/'):
            try:
                # Get user
                user = request.user if request.user.is_authenticated else None
                
                # Get IP address
                x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                if x_forwarded_for:
                    ip_address = x_forwarded_for.split(',')[0]
                else:
                    ip_address = request.META.get('REMOTE_ADDR')
                
                # Get response body (limit size)
                try:
                    if hasattr(response, 'content'):
                        response_body = response.content.decode('utf-8')[:5000]
                    else:
                        response_body = ''
                except:
                    response_body = ''
                
                # Create log entry
                APILog.objects.create(
                    user=user,
                    endpoint=request.path,
                    method=request.method,
                    status_code=response.status_code,
                    request_body=getattr(request, '_body_copy', '')[:5000],
                    response_body=response_body,
                    ip_address=ip_address
                )
            except Exception as e:
                # Don't break the response if logging fails
                print(f"API Logging Error: {e}")
        
        return response
