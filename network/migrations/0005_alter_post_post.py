# Generated by Django 4.2.6 on 2023-11-13 22:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_rename_post_like_post_like_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='post',
            field=models.TextField(),
        ),
    ]