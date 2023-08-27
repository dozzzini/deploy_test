# Generated by Django 4.2.4 on 2023-08-27 09:50

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("teams", "0003_alter_team_color"),
    ]

    operations = [
        migrations.AlterField(
            model_name="team",
            name="members",
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]
