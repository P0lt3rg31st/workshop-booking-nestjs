"""User model with application roles."""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model used by the booking system."""

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        USER = 'USER', 'User'

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.USER,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self) -> str:
        return f'{self.email} ({self.role})'
