# Generated by Django 4.2.6 on 2023-11-12 21:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_post_likes'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Likes',
            new_name='Like',
        ),
    ]
