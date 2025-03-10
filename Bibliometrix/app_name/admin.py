# from django.contrib import admin
# from import_export.admin import ImportExportModelAdmin
# from .models import PaperRank

# # Register your models here.

# @admin.register(PaperRank)
# class PaperRankAdmin(admin.ModelAdmin):
#     list_display = (
#         'Authors', 
#         'Authors_full_names', 
#         'Author_ID', 
#         'Title', 
#         'Year', 
#         'Source_title', 
#         'Volume', 
#         'Issue', 
#         'Art_No', 
#         'Page_start', 
#         'Page_end',
#         'Page_count', 
#         'Citations', 
#         'DOI', 
#         'Link',
#         'Affiliations',
#         'Authors_with_Affiliations',
#         'Abstract',
#         'Author_Keywords',
#         'Index_Keywords',
#         'Molecular_Sequence_Numbers',
#         'Chemicals',
#         'Tradenames',
#         'Manufacturers',
#         'Funding_Details',
#         'Funding_Texts',
#         'Reference',
#         'Correspondence_Address',
#         'Editors',
#         'Publisher',
#         'Sponsors',
#         'Conference_name',
#         'Conference_date',
#         'Conference_location',
#         'Conference_code',
#         'ISSN',
#         'ISBN',
#         'CODEN',
#         'PubMed_ID',
#         'Language', 
#         'Abbreviated_Source_Title',
#         'Document', 
#         'Publication_Stage',
#         'Open_Access',
#         'Source',
        
#     )


# from django.contrib import admin
# from .models import PaperRank

# @admin.register(PaperRank)
# class PaperRankAdmin(admin.ModelAdmin):
#     list_display = [
#         'authors',
#         'author_full_names',
#         'author_id',
#         'title',
#         'year',
#         'source_title',
#         'volume',
#         'issue',
#         'art_no',
#         'page_start',
#         'page_end',
#         'page_count',
#         'citations',
#         'doi',
#         'link',
#         'affiliations',
#         'authors_with_affiliations',
#         'abstract',
#         'author_keywords',
#         'index_keywords',
#         'molecular_sequence_numbers',
#         'chemicals',
#         'tradenames',
#         'manufacturers',
#         'funding_details',
#         'funding_texts',
#         'reference',
#         'correspondence_address',
#         'editors',
#         'publisher',
#         'sponsors',
#         'conference_name',
#         'conference_date',
#         'conference_location',
#         'conference_code',
#         'issn',
#         'isbn',
#         'coden',
#         'pubmed_id',
#         'language',
#         'abbreviated_source_title',
#         'document',
#         'publication_stage',
#         'open_access',
#         'source'
#     ]
#     search_fields = ['title', 'authors', 'author_full_names']
#     list_filter = ['year', 'language', 'open_access']

from django.contrib import admin
from .models import PaperRank

@admin.register(PaperRank)
class PaperRankAdmin(admin.ModelAdmin):
    list_display = [
        'Authors',
        'Authors_full_names',
        'Author_ID',
        'Title',
        'Year',
        'Source_title',
        'Volume',
        'Issue',
        'Art_No',
        'Page_start',
        'Page_end',
        'Page_count',
        'Citations',
        'DOI',
        'Link',
        'Affiliations',
        'Authors_with_Affiliations',
        'Abstract',
        'Author_Keywords',
        'Index_Keywords',
        'Molecular_Sequence_Numbers',
        'Chemicals',
        'Tradenames',
        'Manufacturers',
        'Funding_Details',
        'Funding_Texts',
        'Reference',
        'Correspondence_Address',
        'Editors',
        'Publisher',
        'Sponsors',
        'Conference_name',
        'Conference_date',
        'Conference_location',
        'Conference_code',
        'ISSN',
        'ISBN',
        'CODEN',
        'PubMed_ID',
        'Language',
        'Abbreviated_Source_Title',
        'Document',
        'Publication_Stage',
        'Open_Access',
        'Source'
    ]
    search_fields = ['Title', 'Authors', 'Authors_full_names']
    list_filter = ['Year', 'Language', 'Open_Access']