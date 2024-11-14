# Generated by Django 4.1 on 2024-11-12 21:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify_data', '0006_spotifywrapped_remove_spotifyuser_llama_description_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='duowrapped',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='spotifywrapped',
            name='user',
            field=models.CharField(default=0, max_length=100, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='duowrapped',
            name='user2',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.RemoveField(
            model_name='duowrapped',
            name='user1',
        ),
    ]
