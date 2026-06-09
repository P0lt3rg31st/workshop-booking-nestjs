# Generated for the Workshop Booking System homework project.

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('workshops', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to=settings.AUTH_USER_MODEL)),
                ('workshop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='workshops.workshop')),
            ],
            options={
                'ordering': ['-created_at', 'id'],
            },
        ),
        migrations.AddConstraint(
            model_name='booking',
            constraint=models.UniqueConstraint(fields=('user', 'workshop'), name='unique_booking_per_user_workshop'),
        ),
    ]
