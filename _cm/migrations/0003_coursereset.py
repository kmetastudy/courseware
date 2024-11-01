# Generated by Django 5.0.1 on 2024-03-22 01:16

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('_cm', '0002_alter_coursedetail_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseReset',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('id_course', models.UUIDField(blank=True, editable=False, null=True)),
                ('course_title', models.TextField(blank=True, null=True)),
                ('course_summary', models.TextField(blank=True, null=True)),
                ('descript', models.TextField(blank=True, null=True)),
                ('thumnail', models.TextField(blank=True, null=True)),
                ('year', models.IntegerField(default=0)),
                ('school', models.TextField(blank=True, null=True)),
                ('grade', models.IntegerField(default=0)),
                ('semester', models.IntegerField(default=0)),
                ('subject', models.TextField(blank=True, null=True)),
                ('publisher', models.TextField(blank=True, null=True)),
                ('is_test', models.BooleanField(default=False)),
                ('difficulty', models.IntegerField(blank=True, null=True)),
                ('producer', models.TextField(blank=True, null=True)),
                ('duration', models.IntegerField(default=0)),
                ('price', models.IntegerField(default=0)),
            ],
        ),
    ]
