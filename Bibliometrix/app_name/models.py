from django.db import models

class PaperRank(models.Model):
    Authors = models.TextField(default="Unknown Authors")
    Authors_full_names = models.TextField(default="Unknown Authors")
    Author_ID = models.CharField(max_length=2000, default="Unknown",verbose_name="Author ID")  # Assuming it's a string of IDs
    Title = models.CharField(max_length=2000, default="Unknown Title")
    Year = models.CharField(max_length=5, default="0000")
    Source_title = models.CharField(max_length=2000, default="Unknown Source")
    Volume = models.CharField(max_length=2000, default="N/A")
    Issue = models.CharField(max_length=2000, default="N/A")
    Art_No = models.CharField(max_length=2000, null=True, blank=True)  # Article number might not always be available
    Page_start = models.CharField(max_length=2000, default="N/A")
    Page_end = models.CharField(max_length=2000, default="N/A")
    Page_count = models.CharField(max_length=2000)  # Page count as an integer
    Citations = models.CharField(max_length=2000, null=True, blank=True)  # Increased length
    DOI = models.CharField(max_length=2000, null=True, blank=True)
    Link = models.CharField(max_length=2000, null=True, blank=True)
    Affiliations = models.TextField(default="Unknown Affiliations")
    Authors_with_Affiliations = models.TextField(null=True, blank=True)
    Abstract = models.TextField(null=True, blank=True)
    Author_Keywords = models.TextField(null=True, blank=True)
    Index_Keywords = models.TextField(null=True, blank=True)
    Molecular_Sequence_Numbers = models.CharField(max_length=2000, null=True, blank=True)
    Chemicals = models.TextField(null=True, blank=True)
    Tradenames = models.TextField(null=True, blank=True)
    Manufacturers = models.TextField(null=True, blank=True)
    Funding_Details = models.TextField(null=True, blank=True)
    Funding_Texts = models.TextField(null=True, blank=True)
    Reference = models.TextField(null=True, blank=True)
    Correspondence_Address = models.TextField(null=True, blank=True)
    Editors = models.TextField(null=True, blank=True)
    Publisher = models.TextField(default="Unknown Publisher")
    Sponsors = models.TextField(null=True, blank=True)
    Conference_name = models.TextField(null=True, blank=True)
    Conference_date = models.CharField(max_length= 2000, null=True, blank=True)
    Conference_location = models.TextField(null=True, blank=True)
    Conference_code = models.CharField(max_length=2000, null=True, blank=True)
    ISSN = models.CharField(max_length=2000, null=True, blank=True)
    ISBN = models.CharField(max_length=2000, null=True, blank=True)
    CODEN = models.CharField(max_length=2000, null=True, blank=True)
    PubMed_ID = models.CharField(max_length=2000, null=True, blank=True)
    Language = models.CharField(max_length=2000, default="Unknown Language")
    Abbreviated_Source_Title = models.CharField(max_length=2000, null=True, blank=True)
    Document = models.TextField(default="null")
    Publication_Stage = models.CharField(max_length=2000, null=True, blank=True)
    Open_Access = models.CharField(max_length=2000, default=False)
    Source = models.CharField(max_length=2000, null=True, blank=True)
    EID = models.CharField(max_length=2000, null=True, blank=True)

    def str(self):
        return self.Title