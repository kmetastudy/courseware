# Generated by Django 4.1.5 on 2024-02-29 08:37

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('_cm', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coursedetail',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
