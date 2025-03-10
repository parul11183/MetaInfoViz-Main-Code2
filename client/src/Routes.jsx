import React, { Profiler } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/home/Home';
import Dashboard from './pages/menu/dashboard/Dashboard';
import PublicationAnalysis from './pages/menu/biblio_analysis/publication_analysis/PublicationAnalysis';
import CitationAnalysis from './pages/menu/biblio_analysis/citation_analysis/CitationAnalysis';
import DocumentAnalysis from './pages/menu/biblio_analysis/document_analysis/DocumentAnalysis';
import Configuration from './pages/analysis_config/Configuration';
import DataPreview from './pages/data_preview/DataPreview';
import PublisherAnalysis from './pages/menu/biblio_analysis/publisher_analysis/PublisherAnalysis';
import JournalAnalysis from './pages/menu/biblio_analysis/journal_analysis/JournalAnalysis';
import AuthorCount from './pages/menu/author_analysis/author_count/AuthorCount';
import TeamSize from './pages/menu/author_analysis/team_size/TeamSize';
import Collaboration from './pages/menu/author_analysis/collaboration/Collaboration';
import CentralityMeasure from './pages/menu/author_analysis/centrality_measure/CentralityMeasure';
import TopAuthors from './pages/menu/author_analysis/Top_Authors/TopAuthors';

const AppRoutes = () => {
    return (
        <main className="main">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/configuration" element={<Configuration />} />
                <Route path="/data-preview" element={<DataPreview />} />
                <Route path="/dashboard" element={<Dashboard />} />


                {/* Biblio Analysis */}
                <Route path="/biblio-analysis/publication-analysis" element={<PublicationAnalysis />} />
                <Route path="/biblio-analysis/citations-analysis" element={<CitationAnalysis />} />
                <Route path="/biblio-analysis/document-analysis" element={<DocumentAnalysis />} />
                <Route path="/biblio-analysis/journal-analysis" element={<JournalAnalysis />} />
                <Route path="/biblio-analysis/publisher-analysis" element={<PublisherAnalysis />} />
                <Route path="/biblio-analysis/highly-cited-papers" element={<PublisherAnalysis />} />

                {/* Author Analysis */}
                <Route path="/author-analysis/author-count" element={<AuthorCount />} />
                <Route path="/author-analysis/team-size" element={<TeamSize />} />
                <Route path="/author-analysis/collaboration" element={<Collaboration />} />
                <Route path="/author-analysis/clustering-coefficient" element={<CentralityMeasure />} />
                <Route path="/author-analysis/centrality-measure" element={<CentralityMeasure />} />
                <Route path="/author-analysis/connected-components" element={<PublisherAnalysis />} />
                <Route path="/author-analysis/gender-analysis" element={<PublisherAnalysis />} />
                <Route path="/author-analysis/authorship-position" element={<PublisherAnalysis />} />
                <Route path="/author-analysis/top-Authors" element={<TopAuthors />} />
                <Route path="/author-analysis/others" element={<PublisherAnalysis />} />   
            </Routes>
        </main>


    );
};

export default AppRoutes;
