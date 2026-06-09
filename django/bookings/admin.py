"""Django admin settings for bookings."""
from django.contrib import admin

from bookings.models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'workshop', 'created_at')
    list_filter = ('created_at', 'workshop')
    search_fields = ('user__email', 'workshop__title')
    autocomplete_fields = ('user', 'workshop')
