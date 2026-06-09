"""Serializers for workshop CRUD operations."""
from django.utils import timezone
from rest_framework import serializers

from workshops.models import Workshop


class WorkshopSerializer(serializers.ModelSerializer):
    """Represents a workshop with calculated booking information."""

    booked_seats = serializers.SerializerMethodField()
    available_seats = serializers.SerializerMethodField()

    class Meta:
        model = Workshop
        fields = (
            'id',
            'title',
            'description',
            'starts_at',
            'duration_minutes',
            'capacity',
            'location',
            'booked_seats',
            'available_seats',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'booked_seats', 'available_seats', 'created_at', 'updated_at')

    def get_booked_seats(self, obj):
        return obj.bookings.count()

    def get_available_seats(self, obj):
        return max(obj.capacity - obj.bookings.count(), 0)

    def validate_starts_at(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError('Workshop date must be in the future.')
        return value

    def validate_capacity(self, value):
        if self.instance and value < self.instance.bookings.count():
            raise serializers.ValidationError(
                'Capacity cannot be lower than the number of existing bookings.'
            )
        return value
