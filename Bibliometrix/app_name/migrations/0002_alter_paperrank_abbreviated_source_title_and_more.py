# Generated by Django 4.2.17 on 2025-01-16 22:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app_name", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="paperrank",
            name="Abbreviated_Source_Title",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Affiliations",
            field=models.TextField(default="Unknown Affiliations"),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Art_No",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Author_ID",
            field=models.CharField(default="Unknown", max_length=2000),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Authors",
            field=models.TextField(default="Unknown Authors"),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="CODEN",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Citations",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Conference_code",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Conference_date",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Conference_location",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Conference_name",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="DOI",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Document",
            field=models.TextField(default="null"),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="ISBN",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="ISSN",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Issue",
            field=models.CharField(default="N/A", max_length=2000),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Language",
            field=models.CharField(default="Unknown Language", max_length=2000),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Link",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Molecular_Sequence_Numbers",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Open_Access",
            field=models.CharField(default=False, max_length=2000),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Page_count",
            field=models.CharField(max_length=2000),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Page_end",
            field=models.CharField(default="N/A", max_length=2000),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Page_start",
            field=models.CharField(default="N/A", max_length=2000),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="PubMed_ID",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Publication_Stage",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Publisher",
            field=models.TextField(default="Unknown Publisher"),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Source",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Source_title",
            field=models.CharField(default="Unknown Source", max_length=2000),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Title",
            field=models.CharField(default="Unknown Title", max_length=2000),
        ),
        migrations.AlterField(
            model_name="paperrank",
            name="Volume",
            field=models.CharField(default="N/A", max_length=2000),
        ),
    ]
