# Generated by Django 5.0.1 on 2024-05-09 02:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('_school', '0012_mschoolsection_sequence'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mschoolnotice',
            name='id_school',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notice', to='_school.mschool'),
        ),
    ]