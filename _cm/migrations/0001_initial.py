# Generated by Django 4.1.5 on 2023-11-08 07:23

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='courseDetail',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.TextField(blank=True, null=True)),
                ('summary', models.TextField(blank=True, null=True)),
                ('desc', models.TextField(blank=True, null=True)),
                ('year', models.IntegerField(default=0)),
                ('school', models.TextField(blank=True, null=True)),
                ('grade', models.IntegerField(default=0)),
                ('semester', models.IntegerField(default=0)),
                ('subject', models.TextField(blank=True, null=True)),
                ('publisher', models.TextField(blank=True, null=True)),
                ('difficulty', models.TextField(blank=True, null=True)),
                ('duration', models.IntegerField(default=0)),
                ('cost', models.IntegerField(default=0)),
            ],
        ),
    ]