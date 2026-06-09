"""Workshop domain model."""
from django.db import models


class Workshop(models.Model):
    """A master class that users can book."""

    title = models.CharField(max_length=150)
    description = models.TextField()
    starts_at = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField()
    capacity = models.PositiveIntegerField()
    location = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['starts_at', 'id']

    def __str__(self) -> str:
        return f'{self.title} at {self.starts_at}'
