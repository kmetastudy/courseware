# Generated by Django 5.0.1 on 2024-04-26 02:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('_cm', '0010_coursedetail_deliver'),
        ('_school', '0008_alter_mschoolsection_id_school'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mschoolcourse',
            name='course_title',
        ),
        migrations.AlterField(
            model_name='mschoolcourse',
            name='course',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='_cm.coursedetail'),
        ),
    ]
