# Generated by Django 5.0.1 on 2024-08-02 09:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('_cm', '0016_banner_seq_alter_banner_link'),
    ]

    operations = [
        migrations.AddField(
            model_name='banner',
            name='image_mobile',
            field=models.ImageField(blank=True, null=True, upload_to='banners/'),
        ),
    ]
