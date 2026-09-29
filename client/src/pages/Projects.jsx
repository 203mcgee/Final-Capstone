import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import '../App.css';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';

export default function Projects() {
    let { id } = useParams();
    let [results, setResults] = useState([]);

    const { data: repos, isLoading, error } = useFetch('https://api.github.com/users/203mcgee/repos');

    if (isLoading) {
        return <h2 className="text-center text-xl font-bold py-12 text-black">Loading projects... ⏳</h2>;
    }

    if (error) {
        return <h2 className="text-center text-xl font-bold py-12 text-red-600">❌ Error: {error}</h2>;
    }

    function getDisplayedProjects(allRepos) {
        if (!allRepos) return [];

        // 🟢 Fixed: Use .filter() instead of .map() to return the matching repository object
        if (id) {
            return allRepos.filter((repo) => repo.id === Number(id));
        }

        return allRepos;
    }

    const projectsToRender = getDisplayedProjects(repos);

    return (
        <section className=" min-h-screen py-8 px-4 max-w-6xl mx-auto text-black">
            <h1 className="text-3xl font-extrabold text-center text-black my-4 pb-3 border-b-2 border-gray-200">
                {id ? `Project Details (#${id})` : 'My Projects'}
            </h1>

            {/* Search Components */}
            {/* <div className="mb-6">
        <SearchBar setResults={setResults} />
        {results && results.length > 0 && <SearchResults results={results} />}
      </div> */}
            <div className="mb-6 relative">
                <SearchBar setResults={setResults} repos={repos} />
                {results && results.length > 0 && <SearchResults results={results} />}
            </div>

            {/* Back Link for single project view */}
            {id && (
                <Link
                    to="/projects"
                    className="inline-block mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black font-semibold rounded-lg transition-colors"
                >
                    ← Back to All Projects
                </Link>
            )}

            {/* Responsive Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                {projectsToRender.map((repo) => (
                    <div
                        key={repo.id || repo.name}
                        className="border-2 border-gray-200 rounded-2xl p-6 bg-white text-black shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-gray-300"
                    >
                        <div>
                            <h3 className="text-xl font-bold mb-3 text-black break-words">
                                {repo.name}
                            </h3>
                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                {repo.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200 text-sm font-semibold">
                            <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                GitHub Repo ↗
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}