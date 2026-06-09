"""ViewSet for public and admin workshop operations."""
from rest_framework.viewsets import ModelViewSet

from common.permissions import IsAdminOrReadOnly
from workshops.models import Workshop
from workshops.serializers import WorkshopSerializer


class WorkshopViewSet(ModelViewSet):
    """Public read API and admin-only write API for workshops."""

    serializer_class = WorkshopSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        # Prefetch bookings so calculated counters do not cause an N+1 problem.
        return Workshop.objects.prefetch_related('bookings').all()
