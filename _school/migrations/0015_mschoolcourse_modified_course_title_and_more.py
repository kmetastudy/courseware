# Generated by Django 5.0.1 on 2024-05-29 03:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('_school', '0014_alter_mschoolcourse_options_mschoolcourse_sequence'),
    ]

    operations = [
        migrations.AddField(
            model_name='mschoolcourse',
            name='modified_course_title',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='mschoolcourse',
            name='modified_thumnail',
            field=models.TextField(blank=True, null=True),
        ),
    ]
