# Generated by Django 5.0.1 on 2024-04-29 04:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('_school', '0011_mschoolnotice_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='mschoolsection',
            name='sequence',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]