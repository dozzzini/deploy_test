# Generated by Django 4.2.4 on 2023-08-26 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('teams', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='team',
            name='color',
            field=models.CharField(max_length=20),
        ),
    ]
