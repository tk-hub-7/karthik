from rest_framework import permissions
from .models import UserRole


class IsAdmin(permissions.BasePermission):
    """Allow access only to admin users"""
    
    def has_permission(self, request, view):
        try:
            return request.user.role.role == 'admin'
        except (AttributeError, UserRole.DoesNotExist):
            return False


class IsBaseCommander(permissions.BasePermission):
    """Allow access only to base commanders"""
    
    def has_permission(self, request, view):
        try:
            return request.user.role.role == 'base_commander'
        except (AttributeError, UserRole.DoesNotExist):
            return False


class IsLogisticsOfficer(permissions.BasePermission):
    """Allow access only to logistics officers"""
    
    def has_permission(self, request, view):
        try:
            return request.user.role.role == 'logistics_officer'
        except (AttributeError, UserRole.DoesNotExist):
            return False


class BaseAccessPermission(permissions.BasePermission):
    """
    Custom permission to restrict access based on user's assigned base.
    - Admins have access to all bases
    - Base commanders only have access to their assigned base
    - Logistics officers have access to all bases but with limited operations
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        try:
            user_role = request.user.role
            
            # Admin has full access
            if user_role.role == 'admin':
                return True
            
            # Get the base from the object
            base = None
            if hasattr(obj, 'base'):
                base = obj.base
            elif hasattr(obj, 'from_base'):
                # For transfers, check both bases
                if user_role.assigned_base not in [obj.from_base, obj.to_base]:
                    return False
                return True
            elif obj.__class__.__name__ == 'Base':
                base = obj
            
            # Base commander can only access their assigned base
            if user_role.role == 'base_commander':
                return base == user_role.assigned_base
            
            # Logistics officer has access but with operation restrictions
            # (handled in views)
            return True
            
        except (AttributeError, UserRole.DoesNotExist):
            return False


class CanModifyAssignments(permissions.BasePermission):
    """Only admins and base commanders can modify assignments"""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
            
        try:
            return request.user.role.role in ['admin', 'base_commander']
        except (AttributeError, UserRole.DoesNotExist):
            return False
