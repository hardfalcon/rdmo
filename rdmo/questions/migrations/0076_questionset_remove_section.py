# Generated by Django 3.2.14 on 2022-12-08 09:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0075_data_migration'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='question',
            options={'ordering': ('page', 'questionset', 'order'), 'verbose_name': 'Question', 'verbose_name_plural': 'Questions'},
        ),
        migrations.AlterModelOptions(
            name='questionset',
            options={'ordering': ('page', 'questionset', 'order'), 'verbose_name': 'Question set', 'verbose_name_plural': 'Question set'},
        ),
        migrations.RemoveField(
            model_name='questionset',
            name='section',
        ),
    ]
