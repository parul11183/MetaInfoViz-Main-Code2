# from django.http import JsonResponse, HttpResponse
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# import pandas as pd
# from .models import PaperRank
# import re
# from django.db import transaction
# from wordcloud import WordCloud
# from collections import Counter
# import matplotlib.pyplot as plt
# import base64
# from django.db.models import Min, Max, Count
# import io
# from .serializers import PaperRankSerializer
# from django.http import JsonResponse
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# import google.generativeai as genai
# from dotenv import load_dotenv
# import os
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from openai import OpenAI
# import os

# # Load environment variables
# load_dotenv()

# # Configure Gemini with API key from .env
# genai.configure(api_key=os.getenv('GEMINI_API_KEY'))



# # class OpenAISummarizer:
# #     def __init__(self):
# #         self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# #     def generate_summary(self, prompt):
# #         try:
# #             response = self.client.chat.completions.create(
# #                 model="gpt-3.5-turbo",
# #                 messages=[
# #                     {"role": "system", "content": "You are a data analysis expert specializing in publication trends."},
# #                     {"role": "user", "content": prompt}
# #                 ],
# #                 max_tokens=300
# #             )
# #             return response.choices[0].message.content.strip()
# #         except Exception as e:
# #             raise ValueError(f"OpenAI API error: {str(e)}")

# # Create the model with your specified configuration
# generation_config = {
#     "temperature": 1,
#     "top_p": 0.95,
#     "top_k": 40,
#     "max_output_tokens": 8192,
#     "response_mime_type": "text/plain",
# }

# model = genai.GenerativeModel(
#     model_name="gemini-1.5-flash",
#     generation_config=generation_config,
# )


# selected_columns = []

# @api_view(['POST'])
# def send_column_mappings(request):
#     global column_mappings
#     global selected_columns

#     # Check if mappings are provided
#     if 'mappings' not in request.data:
#         return Response({"error": "No column mappings provided"}, status=status.HTTP_400_BAD_REQUEST)
    
#     if 'columns' not in request.data:
#         return Response({"error": "No selected columns provided"}, status=status.HTTP_400_BAD_REQUEST)
    
#     columns = request.data.get('columns', [])
#     selected_columns = columns


#     # Update the column mappings
#     column_mappings = request.data['mappings']

#     return Response({"message": "Column mappings updated successfully", "selected_columns": selected_columns, "mappings": column_mappings}, status=status.HTTP_200_OK)


# @api_view(['POST'])
# def upload_csv(request):
    
#     if 'files' not in request.FILES:
#         return Response({"error": "No files uploaded"}, status=status.HTTP_400_BAD_REQUEST)

#     files = request.FILES.getlist('files')
#     data_frames = []

#     try:
#         # Process all files
#         for file in files:
#             df = pd.read_csv(file,encoding='utf-8-sig')
#             data_frames.append(df)

#         combined_df = pd.concat(data_frames, ignore_index=True)
#         columns = combined_df.columns.tolist()
        
#         return Response({"message": "Files uploaded and processed successfully", "columns": columns}, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['POST'])
# def upload_csv2(request):
#     global selected_columns, column_mappings

#     if 'files' not in request.FILES:
#         return Response({"error": "No files uploaded"}, status=status.HTTP_400_BAD_REQUEST)

#     files = request.FILES.getlist('files')
#     data_frames = []

#     try:
#         for file in files:
#             print(f"Processing file: {file.name}")
#             try:
#                 df = pd.read_csv(file, encoding='utf-8-sig')
#             except UnicodeDecodeError:
#                 df = pd.read_csv(file, encoding='latin1')  # Fallback encoding

#             # Apply column mappings if available
#             if column_mappings:
#                 df.rename(columns=column_mappings, inplace=True)

#             # Filter columns if selected
#             if selected_columns:
#                 valid_columns = [col for col in selected_columns if col in df.columns]
#                 df = df[valid_columns]

#             # Append the processed DataFrame to the list
#             data_frames.append(df)

#         # Ensure there's data to process
#         if not data_frames:
#             return Response({"error": "No valid data to process"}, status=status.HTTP_400_BAD_REQUEST)

#         # Combine all DataFrames
#         combined_df = pd.concat(data_frames, ignore_index=True)
#         print(f"Total rows: {len(combined_df)}")

#         # Process and save the combined DataFrame
#         success = process_and_save_dataframe(combined_df)

#         if success:
#             return Response({"message": "Files uploaded and processed successfully"}, status=status.HTTP_200_OK)
#         else:
#             return Response({"error": "Failed to process data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     except Exception as e:
#         return Response({"error": f"Error processing file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# def process_and_save_dataframe(df):
#     # Example function to process and save the dataframe to the database
#     rows = []
#     for _, row in df.iterrows():
#         print("Starting data processing...")
#     field_mapping = {
#         'Authors': 'Authors',
#         'Author full names': 'Authors_full_names',
#         'Author(s) ID': 'Author_ID',
#         'Title': 'Title',
#         'Year': 'Year',
#         'Source title': 'Source_title',
#         'Volume': 'Volume',
#         'Issue': 'Issue',
#         'Art. No.': 'Art_No',
#         'Page start': 'Page_start',
#         'Page end': 'Page_end',
#         'Page count': 'Page_count',
#         'Cited by': 'Citations',
#         'DOI': 'DOI',
#         'Link': 'Link',
#         'Affiliations': 'Affiliations',
#         'Authors with affiliations': 'Authors_with_Affiliations',
#         'Abstract': 'Abstract',
#         'Author Keywords': 'Author_Keywords',
#         'Index Keywords': 'Index_Keywords',
#         'Molecular Sequence Numbers': 'Molecular_Sequence_Numbers',
#         'Chemicals/CAS': 'Chemicals',
#         'Tradenames': 'Tradenames',
#         'Manufacturers': 'Manufacturers',
#         'Funding Details': 'Funding_Details',
#         'Funding Texts': 'Funding_Texts',
#         'References': 'Reference',
#         'Correspondence Address': 'Correspondence_Address',
#         'Editors': 'Editors',
#         'Publisher': 'Publisher',
#         'Sponsors': 'Sponsors',
#         'Conference name': 'Conference_name',
#         'Conference date': 'Conference_date',
#         'Conference location': 'Conference_location',
#         'Conference code': 'Conference_code',
#         'ISSN': 'ISSN',
#         'ISBN': 'ISBN',
#         'CODEN': 'CODEN',
#         'PubMed ID': 'PubMed_ID',
#         'Language of Original Document': 'Language',
#         'Abbreviated Source Title': 'Abbreviated_Source_Title',
#         'Document Type': 'Document',
#         'Publication Stage': 'Publication_Stage',
#         'Open Access': 'Open_Access',
#         'Source': 'Source',
#         'EID': 'EID'
#     }
#     # Save all rows to the database
#     rows = []
#     for index, row in df.iterrows():
#         data = {}
#         for csv_col, model_field in field_mapping.items():
#             if csv_col in df.columns:
#                 value = row[csv_col]
                
#                 # Handle empty values
#                 if pd.isna(value) or value == '':
#                     if model_field == 'Authors':
#                         value = row.get('Authors', 'Unknown Authors')
#                     elif model_field == 'Year':
#                         value = row.get('Year', '0000')
#                     elif model_field == 'Title':
#                         value = row.get('Title', 'Unknown Title')
#                     else:
#                         value = ''
                
#                 # Handle special cases
#                 if model_field == 'Open_Access':
#                     value = str(value).strip().lower() == 'true'
#                 elif model_field in ['Page_count', 'Citations']:
#                     value = int(float(value)) if value and str(value).replace('.', '').isdigit() else 0
                
#                 data[model_field] = value

#         if index == 0:
#             print("Sample processed row:", data)

#         try:
#             paper_rank = PaperRank(**data)
#             rows.append(paper_rank)
#         except Exception as e:
#             print(f"Error creating record at row {index}: {str(e)}")
#             continue

#     try:
#         # Clear existing records
#         PaperRank.objects.all().delete()
        
#         # Bulk create new records
#         with transaction.atomic():
#             created = PaperRank.objects.bulk_create(rows)
#             print(f"Successfully created {len(created)} records")
#             return True
#     except Exception as e:
#         print(f"Error in bulk create: {str(e)}")
#         return False

# @api_view(['GET'])
# def get_data(request):
#     try:
#         # Check if any files have been uploaded in this session
#         if not selected_columns:
#             return Response([], status=status.HTTP_200_OK)

#         papers = PaperRank.objects.all()
#         serializer = PaperRankSerializer(papers, many=True)

#                 # Filter the serialized data to include only selected columns
#         filtered_data = [
#             {col: item[col] for col in selected_columns if col in item}
#             for item in serializer.data
#         ]   
        

    
#         return Response(filtered_data, status=status.HTTP_200_OK)
#     except Exception as e:
#         print(f"Error in get_data: {str(e)}")
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# # @api_view(['GET'])
# # def get_data(request):
# #     # Fetch all PaperRank records from the database
# #     papers = PaperRank.objects.all()
    
# #     # Serialize the records to JSON format
# #     serializer = PaperRankSerializer(papers, many=True)
    
# #     # Return the serialized data
# #     return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(['DELETE'])
# def delete_all_records(request):
#     try:
#         # Delete all records in the PaperRank table
#         PaperRank.objects.all().delete()
#         return Response({"message": "All records deleted successfully."}, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

# @api_view(['POST'])
# def generate_summary(request):
#     try:
#         data = request.data
#         if not data or 'prompt' not in data:
#             return Response({
#                 "error": "No prompt provided"
#             }, status=400)

#         try:
#             # Start a chat session and send the message
#             chat_session = model.start_chat(history=[])
#             response = chat_session.send_message(
#                 data['prompt'],
#                 safety_settings=[
#                     {
#                         "category": "HARM_CATEGORY_HARASSMENT",
#                         "threshold": "BLOCK_MEDIUM_AND_ABOVE"
#                     }
#                 ]
#             )
            
#             if not response or not response.text:
#                 return Response({
#                     "error": "Empty response from AI model"
#                 }, status=500)
            
#             return Response({
#                 "summary": response.text.strip()
#             })

#         except Exception as model_error:
#             print(f"Error during Gemini API call: {str(model_error)}")
#             return Response({
#                 "error": f"AI model error: {str(model_error)}"
#             }, status=500)

#     except Exception as e:
#         print(f"Unexpected error in generate_summary view: {str(e)}")
#         return Response({
#             "error": f"Server error: {str(e)}"
#         }, status=500)
    
# # @api_view(['POST'])
# # def generate_summary(request):
# #     try:
# #         data = request.data
        
# #         if not data or 'prompt' not in data:
# #             return Response({"error": "No prompt provided"}, status=400)

# #         try:
# #             summarizer = OpenAISummarizer()
# #             summary = summarizer.generate_summary(data['prompt'])
            
# #             return Response({
# #                 "summary": summary
# #             })

# #         except ValueError as ve:
# #             return Response({"error": str(ve)}, status=500)

# #     except Exception as e:
# #         return Response({"error": f"Server error: {str(e)}"}, status=500)

# @api_view(['GET'])
# def csv_summary(request):
#     try:
#         total_papers = PaperRank.objects.count()
#         year_min = PaperRank.objects.exclude(Year='0000').aggregate(Min('Year'))['Year__min']
#         year_max = PaperRank.objects.exclude(Year='0000').aggregate(Max('Year'))['Year__max']

#         # Fetch all author lists from the database
#         all_authors = PaperRank.objects.values_list('Authors', flat=True)

#         # Create a set to store unique authors
#         unique_authors = set()

#         # Iterate over all author lists
#         for author_list in all_authors:
#             if author_list:  # Ensure the author list is not empty or None
#                 # Remove square brackets, quotes, and any unnecessary characters
#                 cleaned_author_list = re.sub(r'[\[\]\'"]', '', author_list)
#                 print(cleaned_author_list)

#                 # Split the cleaned author list by commas (since they are comma-separated)
#                 authors = [author.strip() for author in cleaned_author_list.split(";")]
#                 unique_authors.update(author for author in authors if author.lower() != "unknown authors")

#         # Get the number of unique authors
#         num_unique_authors = len(unique_authors)

#         all_publisher = PaperRank.objects.values_list('Publisher', flat=True)
#         unique_publisher = set()

#         for publisher_list in all_publisher:
#             if publisher_list:
#                 publishers = [publisher.strip() for publisher in re.split(r';\s*', publisher_list)]
#                 unique_publisher.update(publisher for publisher in publishers if publisher.lower() != "unknown publisher")
#         num_unique_publishers = len(unique_publisher)

#         all_affiliation = PaperRank.objects.values_list('Affiliations', flat=True)
#         unique_affiliation = set()
#         for affiliation_list in all_affiliation:
#             if affiliation_list:
#                 affiliations = [affiliation.strip() for affiliation in re.split(r';\s*',affiliation_list)]
#                 unique_affiliation.update(affiliation for affiliation in affiliations if affiliation.lower() != "unknown affiliation")

#         num_unique_affiliation = len(unique_affiliation)

#         document_type_counts = PaperRank.objects.values('Document').annotate(count=Count('Document'))
#         language_counts = PaperRank.objects.values('Language').annotate(count=Count('Language'))

#         summary = {
#             "total_papers": total_papers,
#             "year_range": f"{year_min} - {year_max}",
#             "num_unique_authors": num_unique_authors,
#             "num_unique_publishers": num_unique_publishers,
#             "num_unique_affiliation": num_unique_affiliation,
#             "document_type_counts": {item['Document']: item['count'] for item in document_type_counts},
#             "languages": {item['Language']: item['count'] for item in language_counts}
#         }
        
#         return Response(summary, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)






# @api_view(['GET'])
# def get_chart_data(request):
#     try:
#         data = PaperRank.objects.all()
#         serializer = PaperRankSerializer(data, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# def get_papers(request):
#     papers = PaperRank.objects.all()
#     serializer = PaperRankSerializer(papers, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(['GET'])
# def most_relevant_authors(request):
#     authors = PaperRank.objects.values('Authors').annotate(
#         publications=Count('Authors')).order_by('-publications')[:10]  # Get top 10 authors
    
#     return Response(authors)

# # @api_view(['GET'])
# # def get_average_citations(request):
# #     try:
# #         papers = PaperRank.objects.all()
# #         data = [{"Title": paper.Title, "Year": paper.Year, "Citations": paper.Citations} for paper in papers]
# #         return Response(data, status=status.HTTP_200_OK)
# #     except Exception as e:
# #         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# def get_average_citations(request):
#     try:
#         papers = PaperRank.objects.all()
        
#         # Group by year and calculate average citations
#         year_data = {}
#         for paper in papers:
#             try:
#                 year = str(paper.Year).strip()
#                 citations = float(paper.Citations) if paper.Citations else 0
                
#                 if year not in year_data:
#                     year_data[year] = {'total': 0, 'count': 0}
                
#                 year_data[year]['total'] += citations
#                 year_data[year]['count'] += 1
                
#             except (ValueError, TypeError) as e:
#                 print(f"Error processing paper: {e}")
#                 continue
        
#         # Calculate averages and format response
#         averages = []
#         for year, data in year_data.items():
#             if data['count'] > 0:  # Avoid division by zero
#                 average = data['total'] / data['count']
#                 averages.append({
#                     'year': year,
#                     'average': round(average, 2),
#                     'total': data['total'],
#                     'count': data['count']
#                 })
        
#         # Sort by year
#         averages.sort(key=lambda x: x['year'])
#         print(f"Processed {len(averages)} years of citation data")
#         return Response(averages, status=status.HTTP_200_OK)
        
#     except Exception as e:
#         print(f"Error calculating averages: {str(e)}")
#         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['GET'])
# def get_top_cited_documents(request):
#     try:
#         # Get top 10 cited documents
#         top_documents = PaperRank.objects.order_by('-Citations')[:10]
        
#         # Prepare data for response
#         documents_data = []
#         for doc in top_documents:
#             documents_data.append({
#                 'Title': doc.Title,
#                 'Authors': doc.Authors,
#                 'Year': doc.Year,
#                 'Citations': doc.Citations,
#                 'Source_title': doc.Source_title,
#                 'DOI': doc.DOI
#             })
        
#         return JsonResponse({'documents': documents_data})
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)

# @api_view(['GET'])
# def get_most_cited_authors(request):
#     try:
#         # Get all papers
#         papers = PaperRank.objects.all()
        
#         # Extract and clean author names, and count citations
#         author_citations = {}
#         for paper in papers:
#             if paper.Authors and paper.Citations:
#                 # Remove square brackets, quotes, and any unnecessary characters
#                 cleaned_author_list = re.sub(r'[\[\]\'"]', '', paper.Authors)
                
#                 # Split the cleaned author list by semicolons
#                 authors = [author.strip() for author in cleaned_author_list.split(";")]
                
#                 # Add citations to each author
#                 citations = int(paper.Citations) if paper.Citations.isdigit() else 0
#                 for author in authors:
#                     if author in author_citations:
#                         author_citations[author] += citations
#                     else:
#                         author_citations[author] = citations
        
#         # Get top 10 cited authors
#         top_authors = sorted(author_citations.items(), key=lambda x: x[1], reverse=True)[:10]
        
#         # Prepare data for response
#         authors_data = [
#             {
#                 'Authors': author[0],
#                 'citations': author[1]
#             }
#             for author in top_authors
#         ]
        
#         return JsonResponse(authors_data, safe=False)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)

# @api_view(['GET'])  
# def generate_word_cloud(request):
#     try:
#         # Get all papers
#         papers = PaperRank.objects.all()
        
#         # Combine all Index_Keywords
#         all_keywords = []
#         for paper in papers:
#             if paper.Index_Keywords:
#                 # Remove square brackets, quotes, and split by semicolon
#                 keywords = re.sub(r'[\[\]\'"]', '', paper.Index_Keywords).split(';')
#                 all_keywords.extend([keyword.strip() for keyword in keywords if keyword.strip()])
        
#         # Count keyword occurrences
#         keyword_counts = Counter(all_keywords)
        
#         # Generate word cloud
#         wordcloud = WordCloud(width=1000, height=500, background_color='white').generate_from_frequencies(keyword_counts)
        
#         # Create a plot
#         plt.figure(figsize=(10, 5))
#         plt.imshow(wordcloud, interpolation='bilinear')
#         plt.axis('off')
#         plt.gca().spines['top'].set_visible(False)  # Remove the top spine
#         plt.gca().spines['right'].set_visible(False)  # Remove the right spine
#         plt.gca().spines['left'].set_visible(False)  # Remove the left spine
#         plt.gca().spines['bottom'].set_visible(False)  # Remove the bottom spine
#         plt.tight_layout(pad=1)  # Remove padding around the plot
        
#         # Save the plot to a bytes buffer
#         buffer = io.BytesIO()
#         plt.savefig(buffer, format='png')
#         buffer.seek(0)
        
#         # Encode the image to base64
#         image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
#         # Return the base64 encoded image
#         return HttpResponse(image_base64, content_type='text/plain')
#     except Exception as e:
#         return HttpResponse(str(e), status=500)

# @api_view(['GET'])    
# def get_trend_topics(request):
#     try:
#         # Get all papers
#         papers = PaperRank.objects.all().order_by('Year')
        
#         # Initialize data structure
#         trend_data = {}
        
#         for paper in papers:
#             year = paper.Year
#             if year not in trend_data:
#                 trend_data[year] = Counter()
            
#             if paper.Index_Keywords:
#                 # Remove square brackets, quotes, and split by semicolon
#                 keywords = re.sub(r'[\[\]\'"]', '', paper.Index_Keywords).split(';')
#                 trend_data[year].update([keyword.strip() for keyword in keywords if keyword.strip()])
        
#         # Get top 10 keywords for each year
#         result = {}
#         for year, counter in trend_data.items():
#             result[year] = counter.most_common(10)
        
#         return JsonResponse(result)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)

# @api_view(['GET'])
# def get_team_sizes(request):
#     try:
#         all_papers = PaperRank.objects.all()
#         team_size_counts = {}
        
#         for paper in all_papers:
#             # Check if Authors field is not empty
#             if paper.Authors:
#                 # Remove square brackets, quotes, and any unnecessary characters
#                 cleaned_author_list = re.sub(r'[\[\]\'"]', '', paper.Authors)
                
#                 # Split the cleaned author list by semicolons
#                 authors = [author.strip() for author in cleaned_author_list.split(";")]
                
#                 # Count the number of unique authors
#                 team_size = len(set(authors))
                
#                 # Update team size counts
#                 team_size_str = str(team_size)
#                 if team_size_str in team_size_counts:
#                     team_size_counts[team_size_str] += 1
#                 else:
#                     team_size_counts[team_size_str] = 1
        
#         # Return the team size distribution
#         return JsonResponse(team_size_counts)
    
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)







import json
from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
from .models import PaperRank
import re
from django.db import transaction
from wordcloud import WordCloud
from collections import Counter
import matplotlib.pyplot as plt
import base64
from django.db.models import Min, Max, Count
import io
from .serializers import PaperRankSerializer
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view
from rest_framework.response import Response
import google.generativeai as genai
from dotenv import load_dotenv
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from openai import OpenAI
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import logging

logger = logging.getLogger(__name__)


# Load environment variables
load_dotenv()

# Configure Gemini with API key from .env
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))



# class OpenAISummarizer:
#     def __init__(self):
#         self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

#     def generate_summary(self, prompt):
#         try:
#             response = self.client.chat.completions.create(
#                 model="gpt-3.5-turbo",
#                 messages=[
#                     {"role": "system", "content": "You are a data analysis expert specializing in publication trends."},
#                     {"role": "user", "content": prompt}
#                 ],
#                 max_tokens=300
#             )
#             return response.choices[0].message.content.strip()
#         except Exception as e:
#             raise ValueError(f"OpenAI API error: {str(e)}")

# Create the model with your specified configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)


selected_columns = []


@api_view(['GET'])
def read_temp_file(request):
    try:
        file_path = request.GET.get('file_path', 'temp_uploads/current_upload.csv')
        if not os.path.exists(file_path):
            return Response({
                "error": "File not found"
            }, status=404)
            
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        return HttpResponse(content, content_type='text/csv')
    
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=500)

@api_view(["POST"])
def process_data(request):
    """
    Endpoint to process raw data using provided column mappings.
    Expects a JSON with 'data' and 'mappings' keys.
    
    Example request body:
    {
        "data": [{"col1": "val1", "col2": "val2", ...}, ...],
        "mappings": {"Feature1": "col1", "Feature2": "col2", ...}
    }
    """
    try:
        payload = json.loads(request.body)
        raw_data = payload.get('data', [])
        mappings = payload.get('mappings', {})
        
        if not raw_data or not mappings:
            return JsonResponse({
                'success': False,
                'message': 'Missing required data or mappings'
            }, status=400)
        
        # Process the data with the mappings
        processed_data = []
        for row in raw_data:
            processed_row = {}
            for feature, column in mappings.items():
                processed_row[feature] = row.get(column, "")
            processed_data.append(processed_row)
        
        # Return just a preview (first 5 rows)
        preview_data = processed_data[:5] if len(processed_data) > 5 else processed_data
        
        # Optionally, save the full processed data to session or database
        request.session['processed_data'] = processed_data
        
        return JsonResponse(preview_data, safe=False)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        logger.error(f"Error processing data: {str(e)}")
        return JsonResponse({
            'success': False,
            'message': f'Server error: {str(e)}'
        }, status=500)

@api_view(["POST"])
def save_mappings(request):
    """
    Endpoint to save column mappings configuration.
    Expects a JSON with a 'mappings' key containing the mapping configuration.
    
    Example request body:
    {
        "mappings": {
            "Title": "document_title", 
            "Authors": "author_names",
            "Year": "publication_year"
        }
    }
    """
    try:
        data = json.loads(request.body)
        mappings = data.get('mappings', {})
        
        if not mappings:
            return JsonResponse({
                'success': False,
                'message': 'No mapping data provided'
            }, status=400)
        
        # Log the received mappings
        logger.info(f"Received mappings: {mappings}")
        
        # Store mappings in session
        request.session['column_mappings'] = mappings
        
        # Here you could also save to database if needed
        # MappingConfiguration.objects.create(
        #     user=request.user,
        #     configuration=mappings
        # )
        
        return JsonResponse({
            'success': True,
            'message': 'Mappings saved successfully',
            'mapping_count': len(mappings)
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        logger.error(f"Error saving mappings: {str(e)}")
        return JsonResponse({
            'success': False,
            'message': f'Server error: {str(e)}'
        }, status=500)

@api_view(['POST'])
def send_column_mappings(request):
    global column_mappings
    global selected_columns

    # Check if mappings are provided
    if 'mappings' not in request.data:
        return Response({"error": "No column mappings provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    if 'columns' not in request.data:
        return Response({"error": "No selected columns provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    columns = request.data.get('columns', [])
    selected_columns = columns


    # Update the column mappings
    column_mappings = request.data['mappings']

    return Response({"message": "Column mappings updated successfully", "selected_columns": selected_columns, "mappings": column_mappings}, status=status.HTTP_200_OK)


@api_view(['POST'])
def temp_upload(request):
    try:
        if 'file' not in request.FILES:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['file']
        
        # Ensure the temp_uploads directory exists
        if not default_storage.exists('temp_uploads'):
            os.makedirs('temp_uploads')
        
        # Save the file to temporary storage
        file_path = 'temp_uploads/current_upload.csv'
        
        # If a file already exists, delete it
        if default_storage.exists(file_path):
            default_storage.delete(file_path)
        
        # Save the new file
        default_storage.save(file_path, ContentFile(uploaded_file.read()))
        
        return Response({
            "message": "File temporarily stored successfully",
            "temp_path": file_path
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "error": f"Error storing file: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['POST'])
# def temp_upload(request):
#     try:
#         if 'files' not in request.FILES:
#             return Response({"error": "No files uploaded"}, status=status.HTTP_400_BAD_REQUEST)

#         uploaded_files = request.FILES.getlist('files')
        
#         # Ensure the temp_uploads directory exists
#         if not default_storage.exists('temp_uploads'):
#             os.makedirs('temp_uploads')
        
#         file_paths = []
        
#         # Save each file to temporary storage
#         for file in uploaded_files:
#             file_path = f'temp_uploads/{file.name}'
            
#             # If a file with the same name already exists, delete it
#             if default_storage.exists(file_path):
#                 default_storage.delete(file_path)
            
#             # Save the new file
#             default_storage.save(file_path, ContentFile(file.read()))
#             file_paths.append(file_path)
        
#         return Response({
#             "message": "Files temporarily stored successfully",
#             "temp_paths": file_paths
#         }, status=status.HTTP_200_OK)
        
#     except Exception as e:
#         return Response({
#             "error": f"Error storing files: {str(e)}"
#         }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def upload_csv(request):
    
    if 'files' not in request.FILES:
        return Response({"error": "No files uploaded"}, status=status.HTTP_400_BAD_REQUEST)

    files = request.FILES.getlist('files')
    data_frames = []

    try:
        # Process all files
        for file in files:
            df = pd.read_csv(file,encoding='utf-8-sig')
            data_frames.append(df)

        combined_df = pd.concat(data_frames, ignore_index=True)
        columns = combined_df.columns.tolist()
        
        return Response({"message": "Files uploaded and processed successfully", "columns": columns}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Previous 

# @api_view(['POST'])
# def upload_csv2(request):
#     global selected_columns, column_mappings

#     if 'files' not in request.FILES:
#         return Response({"error": "No files uploaded"}, status=status.HTTP_400_BAD_REQUEST)

#     files = request.FILES.getlist('files')
#     data_frames = []

#     try:
#         for file in files:
#             print(f"Processing file: {file.name}")
#             try:
#                 df = pd.read_csv(file, encoding='utf-8-sig')
#             except UnicodeDecodeError:
#                 df = pd.read_csv(file, encoding='latin1')  # Fallback encoding

#             # Apply column mappings if available
#             if column_mappings:
#                 df.rename(columns=column_mappings, inplace=True)

#             # Filter columns if selected
#             if selected_columns:
#                 valid_columns = [col for col in selected_columns if col in df.columns]
#                 df = df[valid_columns]

#             # Append the processed DataFrame to the list
#             data_frames.append(df)

#         # Ensure there's data to process
#         if not data_frames:
#             return Response({"error": "No valid data to process"}, status=status.HTTP_400_BAD_REQUEST)

#         # Combine all DataFrames
#         combined_df = pd.concat(data_frames, ignore_index=True)
#         print(f"Total rows: {len(combined_df)}")

#         # Process and save the combined DataFrame
#         success = process_and_save_dataframe(combined_df)

#         if success:
#             return Response({"message": "Files uploaded and processed successfully"}, status=status.HTTP_200_OK)
#         else:
#             return Response({"error": "Failed to process data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     except Exception as e:
#         return Response({"error": f"Error processing file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


# @api_view(['POST'])
# def upload_csv2(request):
#     try:
#         # Get mappings from request data
#         mappings_data = request.data.get('mappings')
#         if not mappings_data:
#             return Response({"error": "No mappings provided"}, status=status.HTTP_400_BAD_REQUEST)
        
#         # Parse mappings JSON if it's a string
#         if isinstance(mappings_data, str):
#             mappings_data = json.loads(mappings_data)
        
#         # Get stored CSV data from session or cache
#         try:
#             df = pd.read_csv('temp_uploaded_file.csv')  # Use your actual storage method
#         except Exception as e:
#             return Response({"error": f"No CSV data found: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

#         # Reverse the mappings (from feature->column to column->feature)
#         column_mappings = {v: k for k, v in mappings_data.items()}
        
#         # Rename columns according to mappings
#         df.rename(columns=column_mappings, inplace=True)
        
#         # Keep only mapped columns
#         mapped_features = list(mappings_data.keys())
#         df = df[mapped_features]
        
#         # Process and save the DataFrame
#         success = process_and_save_dataframe(df)

#         if success:
#             return Response({"message": "Data processed successfully"}, status=status.HTTP_200_OK)
#         else:
#             return Response({"error": "Failed to process data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     except Exception as e:
#         return Response({"error": f"Error processing data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def upload_csv2(request):
    try:
        # Get mappings from request data
        mappings_data = request.data.get('mappings')
        if not mappings_data:
            return Response({"error": "No mappings provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Parse mappings JSON if it's a string
        if isinstance(mappings_data, str):
            mappings_data = json.loads(mappings_data)

        # Read the temporary file
        try:
            file_path = 'temp_uploads/current_upload.csv'
            if not default_storage.exists(file_path):
                return Response({"error": "No uploaded file found"}, status=status.HTTP_400_BAD_REQUEST)
            
            with default_storage.open(file_path) as f:
                df = pd.read_csv(f)
        except Exception as e:
            return Response({"error": f"Error reading CSV: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Reverse the mappings (from feature->column to column->feature)
        column_mappings = {v: k for k, v in mappings_data.items()}
        
        # Rename columns according to mappings
        df.rename(columns=column_mappings, inplace=True)
        
        # Keep only mapped columns
        mapped_features = list(mappings_data.keys())
        df = df[mapped_features]
        
        # Process and save the DataFrame
        success = process_and_save_dataframe(df)

        # Clean up the temporary file
        if default_storage.exists(file_path):
            default_storage.delete(file_path)

        if success:
            return Response({"message": "Data processed successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to process data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        # Ensure cleanup in case of error
        if default_storage.exists('temp_uploads/current_upload.csv'):
            default_storage.delete('temp_uploads/current_upload.csv')
        return Response({"error": f"Error processing data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def process_and_save_dataframe(df):
    # Example function to process and save the dataframe to the database
    rows = []
    for _, row in df.iterrows():
        print("Starting data processing...")
    field_mapping = {
        'Authors': 'Authors',
        'Author full names': 'Authors_full_names',
        'Author(s) ID': 'Author_ID',
        'Title': 'Title',
        'Year': 'Year',
        'Source title': 'Source_title',
        'Volume': 'Volume',
        'Issue': 'Issue',
        'Art. No.': 'Art_No',
        'Page start': 'Page_start',
        'Page end': 'Page_end',
        'Page count': 'Page_count',
        'Cited by': 'Citations',
        'DOI': 'DOI',
        'Link': 'Link',
        'Affiliations': 'Affiliations',
        'Authors with affiliations': 'Authors_with_Affiliations',
        'Abstract': 'Abstract',
        'Author Keywords': 'Author_Keywords',
        'Index Keywords': 'Index_Keywords',
        'Molecular Sequence Numbers': 'Molecular_Sequence_Numbers',
        'Chemicals/CAS': 'Chemicals',
        'Tradenames': 'Tradenames',
        'Manufacturers': 'Manufacturers',
        'Funding Details': 'Funding_Details',
        'Funding Texts': 'Funding_Texts',
        'References': 'Reference',
        'Correspondence Address': 'Correspondence_Address',
        'Editors': 'Editors',
        'Publisher': 'Publisher',
        'Sponsors': 'Sponsors',
        'Conference name': 'Conference_name',
        'Conference date': 'Conference_date',
        'Conference location': 'Conference_location',
        'Conference code': 'Conference_code',
        'ISSN': 'ISSN',
        'ISBN': 'ISBN',
        'CODEN': 'CODEN',
        'PubMed ID': 'PubMed_ID',
        'Language of Original Document': 'Language',
        'Abbreviated Source Title': 'Abbreviated_Source_Title',
        'Document Type': 'Document',
        'Publication Stage': 'Publication_Stage',
        'Open Access': 'Open_Access',
        'Source': 'Source',
        'EID': 'EID'
    }
    # Save all rows to the database
    rows = []
    for index, row in df.iterrows():
        data = {}
        for csv_col, model_field in field_mapping.items():
            if csv_col in df.columns:
                value = row[csv_col]
                
                # Handle empty values
                if pd.isna(value) or value == '':
                    if model_field == 'Authors':
                        value = row.get('Authors', 'Unknown Authors')
                    elif model_field == 'Year':
                        value = row.get('Year', '0000')
                    elif model_field == 'Title':
                        value = row.get('Title', 'Unknown Title')
                    else:
                        value = ''
                
                # Handle special cases
                if model_field == 'Open_Access':
                    value = str(value).strip().lower() == 'true'
                elif model_field in ['Page_count', 'Citations']:
                    value = int(float(value)) if value and str(value).replace('.', '').isdigit() else 0
                
                data[model_field] = value

        if index == 0:
            print("Sample processed row:", data)

        try:
            paper_rank = PaperRank(**data)
            rows.append(paper_rank)
        except Exception as e:
            print(f"Error creating record at row {index}: {str(e)}")
            continue

    try:
        # Clear existing records
        PaperRank.objects.all().delete()
        
        # Bulk create new records
        with transaction.atomic():
            created = PaperRank.objects.bulk_create(rows)
            print(f"Successfully created {len(created)} records")
            return True
    except Exception as e:
        print(f"Error in bulk create: {str(e)}")
        return False

@api_view(['GET'])
def get_data(request):
    try:
        # Check if any files have been uploaded in this session
        if not selected_columns:
            return Response([], status=status.HTTP_200_OK)

        papers = PaperRank.objects.all()
        serializer = PaperRankSerializer(papers, many=True)

                # Filter the serialized data to include only selected columns
        filtered_data = [
            {col: item[col] for col in selected_columns if col in item}
            for item in serializer.data
        ]   
        

    
        return Response(filtered_data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error in get_data: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# @api_view(['GET'])
# def get_data(request):
#     # Fetch all PaperRank records from the database
#     papers = PaperRank.objects.all()
    
#     # Serialize the records to JSON format
#     serializer = PaperRankSerializer(papers, many=True)
    
#     # Return the serialized data
#     return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_all_records(request):
    try:
        # Delete all records in the PaperRank table
        PaperRank.objects.all().delete()
        return Response({"message": "All records deleted successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def generate_summary(request):
    try:
        data = request.data
        if not data or 'prompt' not in data:
            return Response({
                "error": "No prompt provided"
            }, status=400)

        try:
            # Start a chat session and send the message
            chat_session = model.start_chat(history=[])
            response = chat_session.send_message(
                data['prompt'],
                safety_settings=[
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            )
            
            if not response or not response.text:
                return Response({
                    "error": "Empty response from AI model"
                }, status=500)
            
            return Response({
                "summary": response.text.strip()
            })

        except Exception as model_error:
            print(f"Error during Gemini API call: {str(model_error)}")
            return Response({
                "error": f"AI model error: {str(model_error)}"
            }, status=500)

    except Exception as e:
        print(f"Unexpected error in generate_summary view: {str(e)}")
        return Response({
            "error": f"Server error: {str(e)}"
        }, status=500)
    
# @api_view(['POST'])
# def generate_summary(request):
#     try:
#         data = request.data
        
#         if not data or 'prompt' not in data:
#             return Response({"error": "No prompt provided"}, status=400)

#         try:
#             summarizer = OpenAISummarizer()
#             summary = summarizer.generate_summary(data['prompt'])
            
#             return Response({
#                 "summary": summary
#             })

#         except ValueError as ve:
#             return Response({"error": str(ve)}, status=500)

#     except Exception as e:
#         return Response({"error": f"Server error: {str(e)}"}, status=500)

@api_view(['GET'])
def csv_summary(request):
    try:
        total_papers = PaperRank.objects.count()
        year_min = PaperRank.objects.exclude(Year='0000').aggregate(Min('Year'))['Year__min']
        year_max = PaperRank.objects.exclude(Year='0000').aggregate(Max('Year'))['Year__max']

        # Fetch all author lists from the database
        all_authors = PaperRank.objects.values_list('Authors', flat=True)

        # Create a set to store unique authors
        unique_authors = set()

        # Iterate over all author lists
        for author_list in all_authors:
            if author_list:  # Ensure the author list is not empty or None
                # Remove square brackets, quotes, and any unnecessary characters
                cleaned_author_list = re.sub(r'[\[\]\'"]', '', author_list)
                print(cleaned_author_list)

                # Split the cleaned author list by commas (since they are comma-separated)
                authors = [author.strip() for author in cleaned_author_list.split(";")]
                unique_authors.update(author for author in authors if author.lower() != "unknown authors")

        # Get the number of unique authors
        num_unique_authors = len(unique_authors)

        all_publisher = PaperRank.objects.values_list('Publisher', flat=True)
        unique_publisher = set()

        for publisher_list in all_publisher:
            if publisher_list:
                publishers = [publisher.strip() for publisher in re.split(r';\s*', publisher_list)]
                unique_publisher.update(publisher for publisher in publishers if publisher.lower() != "unknown publisher")
        num_unique_publishers = len(unique_publisher)

        all_affiliation = PaperRank.objects.values_list('Affiliations', flat=True)
        unique_affiliation = set()
        for affiliation_list in all_affiliation:
            if affiliation_list:
                affiliations = [affiliation.strip() for affiliation in re.split(r';\s*',affiliation_list)]
                unique_affiliation.update(affiliation for affiliation in affiliations if affiliation.lower() != "unknown affiliation")

        num_unique_affiliation = len(unique_affiliation)

        document_type_counts = PaperRank.objects.values('Document').annotate(count=Count('Document'))
        language_counts = PaperRank.objects.values('Language').annotate(count=Count('Language'))

        summary = {
            "total_papers": total_papers,
            "year_range": f"{year_min} - {year_max}",
            "num_unique_authors": num_unique_authors,
            "num_unique_publishers": num_unique_publishers,
            "num_unique_affiliation": num_unique_affiliation,
            "document_type_counts": {item['Document']: item['count'] for item in document_type_counts},
            "languages": {item['Language']: item['count'] for item in language_counts}
        }
        
        return Response(summary, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)






@api_view(['GET'])
def get_chart_data(request):
    try:
        data = PaperRank.objects.all()
        serializer = PaperRankSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_papers(request):
    papers = PaperRank.objects.all()
    serializer = PaperRankSerializer(papers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def most_relevant_authors(request):
    authors = PaperRank.objects.values('Authors').annotate(
        publications=Count('Authors')).order_by('-publications')[:10]  # Get top 10 authors
    
    return Response(authors)

# @api_view(['GET'])
# def get_average_citations(request):
#     try:
#         papers = PaperRank.objects.all()
#         data = [{"Title": paper.Title, "Year": paper.Year, "Citations": paper.Citations} for paper in papers]
#         return Response(data, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_average_citations(request):
    try:
        papers = PaperRank.objects.all()
        
        # Group by year and calculate average citations
        year_data = {}
        for paper in papers:
            try:
                year = str(paper.Year).strip()
                citations = float(paper.Citations) if paper.Citations else 0
                
                if year not in year_data:
                    year_data[year] = {'total': 0, 'count': 0}
                
                year_data[year]['total'] += citations
                year_data[year]['count'] += 1
                
            except (ValueError, TypeError) as e:
                print(f"Error processing paper: {e}")
                continue
        
        # Calculate averages and format response
        averages = []
        for year, data in year_data.items():
            if data['count'] > 0:  # Avoid division by zero
                average = data['total'] / data['count']
                averages.append({
                    'year': year,
                    'average': round(average, 2),
                    'total': data['total'],
                    'count': data['count']
                })
        
        # Sort by year
        averages.sort(key=lambda x: x['year'])
        print(f"Processed {len(averages)} years of citation data")
        return Response(averages, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error calculating averages: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_top_cited_documents(request):
    try:
        # Get top 10 cited documents
        top_documents = PaperRank.objects.order_by('-Citations')[:10]
        
        # Prepare data for response
        documents_data = []
        for doc in top_documents:
            documents_data.append({
                'Title': doc.Title,
                'Authors': doc.Authors,
                'Year': doc.Year,
                'Citations': doc.Citations,
                'Source_title': doc.Source_title,
                'DOI': doc.DOI
            })
        
        return JsonResponse({'documents': documents_data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def get_most_cited_authors(request):
    try:
        # Get all papers
        papers = PaperRank.objects.all()
        
        # Extract and clean author names, and count citations
        author_citations = {}
        for paper in papers:
            if paper.Authors and paper.Citations:
                # Remove square brackets, quotes, and any unnecessary characters
                cleaned_author_list = re.sub(r'[\[\]\'"]', '', paper.Authors)
                
                # Split the cleaned author list by semicolons
                authors = [author.strip() for author in cleaned_author_list.split(";")]
                
                # Add citations to each author
                citations = int(paper.Citations) if paper.Citations.isdigit() else 0
                for author in authors:
                    if author in author_citations:
                        author_citations[author] += citations
                    else:
                        author_citations[author] = citations
        
        # Get top 10 cited authors
        top_authors = sorted(author_citations.items(), key=lambda x: x[1], reverse=True)[:10]
        
        # Prepare data for response
        authors_data = [
            {
                'Authors': author[0],
                'citations': author[1]
            }
            for author in top_authors
        ]
        
        return JsonResponse(authors_data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])  
def generate_word_cloud(request):
    try:
        # Get all papers
        papers = PaperRank.objects.all()
        
        # Combine all Index_Keywords
        all_keywords = []
        for paper in papers:
            if paper.Index_Keywords:
                # Remove square brackets, quotes, and split by semicolon
                keywords = re.sub(r'[\[\]\'"]', '', paper.Index_Keywords).split(';')
                all_keywords.extend([keyword.strip() for keyword in keywords if keyword.strip()])
        
        # Count keyword occurrences
        keyword_counts = Counter(all_keywords)
        
        # Generate word cloud
        wordcloud = WordCloud(width=1000, height=500, background_color='white').generate_from_frequencies(keyword_counts)
        
        # Create a plot
        plt.figure(figsize=(10, 5))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis('off')
        plt.gca().spines['top'].set_visible(False)  # Remove the top spine
        plt.gca().spines['right'].set_visible(False)  # Remove the right spine
        plt.gca().spines['left'].set_visible(False)  # Remove the left spine
        plt.gca().spines['bottom'].set_visible(False)  # Remove the bottom spine
        plt.tight_layout(pad=1)  # Remove padding around the plot
        
        # Save the plot to a bytes buffer
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        
        # Encode the image to base64
        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        # Return the base64 encoded image
        return HttpResponse(image_base64, content_type='text/plain')
    except Exception as e:
        return HttpResponse(str(e), status=500)

@api_view(['GET'])    
def get_trend_topics(request):
    try:
        # Get all papers
        papers = PaperRank.objects.all().order_by('Year')
        
        # Initialize data structure
        trend_data = {}
        
        for paper in papers:
            year = paper.Year
            if year not in trend_data:
                trend_data[year] = Counter()
            
            if paper.Index_Keywords:
                # Remove square brackets, quotes, and split by semicolon
                keywords = re.sub(r'[\[\]\'"]', '', paper.Index_Keywords).split(';')
                trend_data[year].update([keyword.strip() for keyword in keywords if keyword.strip()])
        
        # Get top 10 keywords for each year
        result = {}
        for year, counter in trend_data.items():
            result[year] = counter.most_common(10)
        
        return JsonResponse(result)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def get_team_sizes(request):
    try:
        all_papers = PaperRank.objects.all()
        team_size_counts = {}
        
        for paper in all_papers:
            # Check if Authors field is not empty
            if paper.Authors:
                # Remove square brackets, quotes, and any unnecessary characters
                cleaned_author_list = re.sub(r'[\[\]\'"]', '', paper.Authors)
                
                # Split the cleaned author list by semicolons
                authors = [author.strip() for author in cleaned_author_list.split(";")]
                
                # Count the number of unique authors
                team_size = len(set(authors))
                
                # Update team size counts
                team_size_str = str(team_size)
                if team_size_str in team_size_counts:
                    team_size_counts[team_size_str] += 1
                else:
                    team_size_counts[team_size_str] = 1
        
        # Return the team size distribution
        return JsonResponse(team_size_counts)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)