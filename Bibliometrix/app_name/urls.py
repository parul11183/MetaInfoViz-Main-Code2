from django.urls import path

from .views import send_column_mappings, read_temp_file, save_mappings, process_data ,temp_upload,upload_csv,upload_csv2,get_data,delete_all_records, generate_summary, csv_summary,get_chart_data,get_papers,most_relevant_authors,get_most_cited_authors,get_average_citations,get_top_cited_documents,generate_word_cloud,get_trend_topics,get_team_sizes

urlpatterns = [
    path('api/send-column-mappings/', send_column_mappings, name='send-column-mappings'),
    path('api/temp_upload/', temp_upload, name='temp_upload'),
    # path('api/save-mappings/', save_mappings, name='save_mappings'),
    # path('api/process-data/', process_data, name='process_data'),
    path('api/read-temp-file/', read_temp_file, name='read-temp-file'),
    path('api/upload-csv/', upload_csv, name='upload-csv'),
    path('api/upload-csv2/', upload_csv2, name='upload-csv2'),
    path('api/get-data/', get_data, name='get-data'),  
    path('api/delete-all/', delete_all_records, name='delete_all_records'),
    path('api/get-summary/',csv_summary , name='get-summary'),
    path('api/get-chart-data/', get_chart_data,name='get_chart_data'),
    path('api/get-papers/', get_papers,name='get_papers'),
    path('api/most-relevant-authors/', most_relevant_authors, name='most-relevant-authors'),
    path('api/get-average-citations/',get_average_citations, name='get_average_citations'),
    path('api/get-top-cited-documents/', get_top_cited_documents, name='get-top_cited_documents'),
    path('api/get-most-cited-authors/', get_most_cited_authors, name='get_most_cited_authors'),
    path('api/generate-word-cloud/', generate_word_cloud, name='generate-word-cloud'),
    path('api/get-trend-topics/', get_trend_topics, name='get-trend-topics'),
    path('api/generate-summary/', generate_summary, name='generate-summary'),
    path('api/get-team-size/', get_team_sizes, name='get-team-sizes'),
]