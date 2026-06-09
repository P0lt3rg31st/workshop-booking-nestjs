"""ViewSet for user booking operations."""
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from bookings.models import Booking
from bookings.serializers import BookingSerializer
from common.permissions import IsOwnerOrAdmin


class BookingViewSet(ModelViewSet):
    """Users can create, read and cancel their own bookings."""

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        queryset = Booking.objects.select_related('user', 'workshop').prefetch_related(
            'workshop__bookings'
        )
        user = self.request.user
        if getattr(user, 'role', None) == 'ADMIN' or user.is_staff:
            return queryset
        return queryset.filter(user=user)

    def perform_create(self, serializer):
        serializer.save()
