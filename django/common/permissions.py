"""Reusable API permission classes."""
from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminRole(BasePermission):
    """Allows access only to users with application admin role."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (getattr(user, 'role', None) == 'ADMIN' or user.is_staff)
        )


class IsAdminOrReadOnly(BasePermission):
    """Public read access and admin-only write access."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (getattr(user, 'role', None) == 'ADMIN' or user.is_staff)
        )


class IsOwnerOrAdmin(BasePermission):
    """Object-level permission for user-owned resources."""

    def has_object_permission(self, request, view, obj):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (obj.user_id == user.id or getattr(user, 'role', None) == 'ADMIN')
        )
