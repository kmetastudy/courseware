# Generated by Django 5.0.1 on 2024-04-25 07:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('_school', '0003_msection_course_id_school'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mschoolcourse',
            name='id_school',
        ),
        migrations.AddField(
            model_name='mschoolcourse',
            name='id_section',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='courses', to='_school.mschoolsection'),
        ),
    ]
