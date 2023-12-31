# Generated by Django 4.2.4 on 2023-08-27 10:08

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('teamname', models.CharField(max_length=20)),
                ('color', models.CharField(choices=[('#F44336', '#F44336'), ('#E91E63', '#E91E63'), ('#9C27B0', '#9C27B0'), ('#673AB7', '#673AB7'), ('#3F51B5', '#3F51B5'), ('#2196F3', '#2196F3'), ('#03A9F4', '#03A9F4'), ('#00BCD4', '#00BCD4'), ('#009688', '#009688'), ('#4CAF50', '#4CAF50'), ('#8BC34A', '#8BC34A'), ('#CDDC39', '#CDDC39'), ('#FFEB3B', '#FFEB3B'), ('#FFC107', '#FFC107'), ('#FF9800', '#FF9800'), ('#FF5722', '#FF5722')], default='#9C27B0', max_length=20)),
            ],
        ),
    ]
