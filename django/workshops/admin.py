"""Django admin settings for workshops."""
from django.contrib import admin

from workshops.models import Workshop


@admin.register(Workshop)
class WorkshopAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'starts_at', 'capacity', 'location')
    list_filter = ('starts_at',)
    search_fields = ('title', 'description', 'location')
    ordering = ('starts_at',)
