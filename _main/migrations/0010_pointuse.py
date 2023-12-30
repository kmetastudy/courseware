# Generated by Django 4.1.5 on 2023-12-26 08:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('_main', '0009_points'),
    ]

    operations = [
        migrations.CreateModel(
            name='PointUse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='결제명')),
                ('desired_amount', models.PositiveIntegerField(editable=False, verbose_name='결제금액')),
                ('buyer_name', models.CharField(editable=False, max_length=100, verbose_name='구매자 이름')),
                ('pay_method', models.CharField(choices=[('point', '포인트')], default='point', max_length=20, verbose_name='결제수단')),
                ('pay_status', models.CharField(choices=[('ready', '결제 준비'), ('paid', '결제 완료'), ('cancelled', '결제 취소'), ('failed', '결제 실패')], default='ready', max_length=20, verbose_name='결제상태')),
                ('is_paid_ok', models.BooleanField(db_index=True, default=False, editable=False, verbose_name='결제성공 여부')),
                ('order', models.ForeignKey(db_constraint=False, on_delete=django.db.models.deletion.CASCADE, to='_main.order')),
            ],
        ),
    ]