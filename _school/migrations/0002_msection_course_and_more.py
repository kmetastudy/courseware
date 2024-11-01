# Generated by Django 5.0.1 on 2024-04-25 03:04

import django.utils.timezone
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('_school', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='mSection_Course',
            fields=[
                ('created_date', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('id_section', models.UUIDField(blank=True, null=True)),
                ('id_course', models.UUIDField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
                'default_manager_name': 'objects',
            },
        ),
        migrations.RenameField(
            model_name='mschoolcourse',
            old_name='id_section',
            new_name='id_school',
        ),
    ]
