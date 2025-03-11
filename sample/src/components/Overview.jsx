import React, { useEffect, useState } from 'react';

const Overview = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the summary from the backend API when the component mounts
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch('http://13.233.2.203:80/api/get-summary/');
                if (!response.ok) {
                    throw new Error('Failed to fetch summary');
                }
                const data = await response.json();
                setSummary(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Debugging: log summary to inspect its structure
    console.log("Summary:", summary);

    return (
        <>
            {summary && (
                <div className="summary-table container mt-3">
                    {/* General summary information */}
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Summary</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.total_papers > 0 && (
                                <tr>
                                    <td>Total Papers</td>
                                    <td>{summary.total_papers}</td>
                                </tr>
                            )}
                            {summary.year_range && summary.year_range !== "None - None"  && (
                                 <tr>
                                 <td>Year Range</td>
                                 <td>{summary.year_range}</td>
                             </tr>
                            )}

                            {summary.num_unique_authors > 0 && (
                                <tr>
                                    <td>Unique Authors</td>
                                    <td>{summary.num_unique_authors}</td>
                                </tr>
                            )}
                            {summary.num_unique_publishers > 0 && (
                                <tr>
                                    <td>Unique Publishers</td>
                                    <td>{summary.num_unique_publishers}</td>
                                </tr>
                            )}
                            {summary.num_unique_affilation && (
                                <tr>
                                    <td>Unique Affiliations</td>
                                    <td>{summary.num_unique_affilation}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Document types */}
                    {summary.document_type_counts && Object.keys(summary.document_type_counts).length > 0 &&
                    summary.document_type_counts !== "null" && 
                    Object.entries(summary.document_type_counts).filter(([docType]) => docType !== "null").length > 0 && (
                        <>
                            <h3>Document Types</h3>
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Document Type</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(summary.document_type_counts)
                                        .filter(([docType]) => docType !== "null")
                                        .map(([docType, count]) => (
                                            <tr key={docType}>
                                                <td>{docType}</td>
                                                <td>{count}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </>
                    )}


                    {/* Languages */}
                    {summary.languages && Object.keys(summary.languages).length > 0 && Object.entries(summary.languages).filter(([language]) =>
                     language !== "Unknown Language").length > 0 && (
                        <>
                            <h3>Languages</h3>
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Language</th>
                                        {/* <th>Count</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(summary.languages)
                                        .filter(([language]) => language !== "Unknown Language")
                                        .map(([language, count]) => (
                                            <tr key={language}>
                                                <td>{language}</td>
                                                {/* <td>{count}</td> */}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </>
                    )}

                </div>
            )}
        </>
    );
};

export default Overview;
