# Generated by Django 5.0.1 on 2024-04-25 07:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('_school', '0006_rename_id_course_mschoolcourse_course'),
    ]

    operations = [
        migrations.DeleteModel(
            name='mSection_Course',
        ),
    ]
