# Generated by Django 5.0.1 on 2024-03-22 02:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('_cm', '0006_alter_courselanding_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='coursedetail',
            old_name='id_course',
            new_name='courseId',
        ),
        migrations.RenameField(
            model_name='coursedetail',
            old_name='course_summary',
            new_name='courseSummary',
        ),
        migrations.RenameField(
            model_name='coursedetail',
            old_name='course_title',
            new_name='courseTitle',
        ),
        migrations.RenameField(
            model_name='coursedetail',
            old_name='descript',
            new_name='desc',
        ),
        migrations.RenameField(
            model_name='coursedetail',
            old_name='is_test',
            new_name='isTest',
        ),
    ]
