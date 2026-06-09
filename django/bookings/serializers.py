"""Serializers for booking operations and business validation."""
from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework import serializers

from accounts.serializers import UserSerializer
from bookings.models import Booking
from workshops.models import Workshop
from workshops.serializers import WorkshopSerializer


class BookingSerializer(serializers.ModelSerializer):
    """Represents a booking and validates booking rules."""

    user = UserSerializer(read_only=True)
    workshop = WorkshopSerializer(read_only=True)
    workshop_id = serializers.PrimaryKeyRelatedField(
        queryset=Workshop.objects.all(),
        source='workshop',
        write_only=True,
    )

    class Meta:
        model = Booking
        fields = ('id', 'user', 'workshop', 'workshop_id', 'created_at')
        read_only_fields = ('id', 'user', 'workshop', 'created_at')

    def validate_workshop_id(self, workshop):
        request = self.context['request']
        user = request.user

        if workshop.starts_at <= timezone.now():
            raise serializers.ValidationError('Cannot book a past workshop.')

        if Booking.objects.filter(user=user, workshop=workshop).exists():
            raise serializers.ValidationError('You have already booked this workshop.')

        if workshop.bookings.count() >= workshop.capacity:
            raise serializers.ValidationError('Workshop capacity has been reached.')

        return workshop

    def create(self, validated_data):
        request = self.context['request']
        workshop = validated_data['workshop']

        # Re-check capacity inside a transaction to keep the rule in one place.
        with transaction.atomic():
            locked_workshop = Workshop.objects.select_for_update().get(pk=workshop.pk)
            if locked_workshop.bookings.count() >= locked_workshop.capacity:
                raise serializers.ValidationError(
                    {'workshop_id': 'Workshop capacity has been reached.'}
                )
            try:
                return Booking.objects.create(
                    user=request.user,
                    workshop=locked_workshop,
                )
            except IntegrityError as exc:
                raise serializers.ValidationError(
                    {'workshop_id': 'You have already booked this workshop.'}
                ) from exc
