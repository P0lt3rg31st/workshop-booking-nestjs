"""Booking domain model."""
from django.conf import settings
from django.db import models

from workshops.models import Workshop


class Booking(models.Model):
    """A user's reservation for a workshop."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
    )
    workshop = models.ForeignKey(
        Workshop,
        on_delete=models.CASCADE,
        related_name='bookings',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at', 'id']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'workshop'],
                name='unique_booking_per_user_workshop',
            )
        ]

    def __str__(self) -> str:
        return f'{self.user_id} -> {self.workshop_id}'
