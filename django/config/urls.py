"""Root URL configuration for the API."""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from bookings.views import BookingViewSet
from workshops.views import WorkshopViewSet

router = DefaultRouter()
router.register('workshops', WorkshopViewSet, basename='workshop')
router.register('bookings', BookingViewSet, basename='booking')


def health_check(request):
    """Simple endpoint for Docker and manual API checks."""
    return JsonResponse(
        {'status': 'ok', 'service': 'workshop-booking-system-django'}
    )


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health-check'),
    path('api/auth/', include('accounts.urls')),
    path('api/', include(router.urls)),
]
