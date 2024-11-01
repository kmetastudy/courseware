# Generated by Django 4.1.5 on 2024-02-29 05:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='courseDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('courseId', models.TextField(blank=True, editable=False, null=True)),
                ('courseTitle', models.TextField(blank=True, null=True)),
                ('courseSummary', models.TextField(blank=True, null=True)),
                ('desc', models.TextField(blank=True, null=True)),
                ('thumnail', models.TextField(blank=True, null=True)),
                ('year', models.IntegerField(default=0)),
                ('school', models.TextField(blank=True, null=True)),
                ('grade', models.IntegerField(default=0)),
                ('semester', models.IntegerField(default=0)),
                ('subject', models.TextField(blank=True, null=True)),
                ('publisher', models.TextField(blank=True, null=True)),
                ('isTest', models.BooleanField(default=False)),
                ('difficulty', models.IntegerField(blank=True, null=True)),
                ('producer', models.TextField(blank=True, null=True)),
                ('duration', models.IntegerField(default=0)),
                ('price', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='courseLanding',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('courseId', models.UUIDField()),
                ('subject', models.TextField(blank=True, null=True)),
            ],
        ),
    ]
