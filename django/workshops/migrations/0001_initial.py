# Generated for the Workshop Booking System homework project.

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Workshop',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('starts_at', models.DateTimeField()),
                ('duration_minutes', models.PositiveIntegerField()),
                ('capacity', models.PositiveIntegerField()),
                ('location', models.CharField(blank=True, max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['starts_at', 'id'],
            },
        ),
    ]
