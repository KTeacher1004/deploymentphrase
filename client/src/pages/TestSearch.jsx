import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../components/ui/BackButton';

export default function TestSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSearch = async () => {
        try {
            const res = await axios.get(`${API_URL}/tests?searchQuery=${searchQuery}`);

            let results = res.data;

            // Apply the current category filter if it exists
            const selectedCategory = document.querySelector('select').value;
            if (selectedCategory) {
                results = results.filter(test => test.category === selectedCategory);
            }
            
            setSearchResults(res.data);
            setFilteredResults(results);
            setSearchError("");
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setSearchError(`No public tests found for "${searchQuery}".`);
                setSearchResults([]);
                setFilteredResults([]);
            } else {
                console.error("Error searching for tests:", err);
            }
        }
    };

    const handleCategoryFilter = (category) => {
        if (category === "") {
            setFilteredResults(searchResults); // Show all tests if no category is selected
        } else {
            const filteredResults = searchResults.filter(test => test.category === category);
            setFilteredResults(filteredResults);
        }
    };

    const fetchAllTests = async () => {
        try {
            const res = await axios.get(`${API_URL}/tests`);
            setSearchResults(res.data);
            setFilteredResults(res.data);
            setSearchError("");
        } catch (err) {
            console.error("Error fetching all tests:", err);
        }
    };

    useEffect(() => {
        fetchAllTests();
    }, []);

    return (
                    
        <div className='flex w-full flex-col p-10'>
            <div className="flex w-full md:w-[70%] mx-auto items-center mb-4">
                <BackButton />
            </div>
            <div className="bg-card md:w-[70%] mx-auto p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Search Public Tests</h2>
                <div className="flex items-center mt-4">
                    <input
                        type="text"
                        placeholder="Search for public tests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 flex-1"
                    />

                    <div className="flex items-center">
                        <select
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 flex-1"
                        >
                            <option value="">All Categories</option>
                            <option value="General">General</option>
                            <option value="Math">Math</option>
                            <option value="Science">Science</option>
                            <option value="History">History</option>
                            <option value="Language">Language</option>
                        </select>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="ml-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    >
                        Search
                    </button>
                </div>
                
                    {filteredResults.length > 0 ? (
                        <div className="bg-card p-4 rounded-lg shadow mt-4">
                            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                            <div className="space-y-4">
                                {filteredResults.map((test) => (
                                    <div key={test._id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <h3 className="font-semibold">{test.title}</h3>
                                            <p className="text-sm text-textSecondary">Duration: {test.duration} minutes</p>
                                        </div>
                                        <button
                                            onClick={() => window.location.href = `/student-dashboard/take-quiz/${test._id}`}
                                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                                        >
                                            Start Test
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        searchError && (
                            <p className="text-red-500 text-center mt-4">{searchError}</p>
                        )
                    )}
                
            </div>
        </div> 
    );
}