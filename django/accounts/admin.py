"""Django admin settings for users."""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from accounts.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'email', 'username', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'username')
    ordering = ('id',)
    fieldsets = UserAdmin.fieldsets + (
        ('Application role', {'fields': ('role',)}),
    )
