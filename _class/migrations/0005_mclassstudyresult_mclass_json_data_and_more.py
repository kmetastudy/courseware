# Generated by Django 4.1.5 on 2024-03-26 09:37

from django.db import migrations, models
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('_class', '0004_msinglecourseclass_end_date_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='mClassStudyResult',
            fields=[
                ('created_date', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('type', models.IntegerField(default=0)),
                ('subtype', models.IntegerField(default=0)),
                ('title', models.CharField(blank=True, max_length=300, null=True)),
                ('order', models.IntegerField(default=0)),
                ('index', models.IntegerField(default=0)),
                ('progress', models.IntegerField(default=0)),
                ('point', models.IntegerField(default=0)),
                ('properties', models.TextField(blank=True, null=True)),
                ('json_data', models.TextField(blank=True, null=True)),
                ('id_student', models.UUIDField(null=True)),
                ('id_class', models.UUIDField()),
                ('id_course', models.UUIDField()),
                ('id_instance', models.UUIDField(blank=True, null=True)),
                ('id_base_course', models.UUIDField(blank=True, null=True)),
                ('id_ref_course', models.UUIDField(blank=True, null=True)),
                ('id_clinic_course', models.UUIDField(blank=True, null=True)),
                ('invalid', models.BooleanField(default=False)),
                ('version', models.IntegerField(default=0)),
            ],
            options={
                'abstract': False,
                'default_manager_name': 'objects',
            },
        ),
        migrations.AddField(
            model_name='mclass',
            name='json_data',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='mclasscontentassign',
            name='id_instance',
            field=models.UUIDField(blank=True, null=True),
        ),
    ]
