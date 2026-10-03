import React, { Fragment } from 'react';
import 'tailwindcss'
import Timeline from '../components/Timeline';
import { useEffect, useState } from 'react';
import { getSkills, createSkill, deleteSkill, updateSkill } from '../api.js';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';




export default function ExperienceSkills() {

    // Experience & Skills (/experience): An interactive, highly structured timeline and grid setup demonstrating technical checkpoints, frameworks, and growth tracking.
    // https://www.youtube.com/watch?v=UqGIqNkhTXY

    // The three pieces of state every screen that loads data needs.
    const [skills, setSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);
    let [results, setResults] = useState([]);
    let [like,setLike] = useState([]);
    

    // const searchData = fetch('http://localhost:5000/api/skills');


    const knownSkills = [
        {
            skill: 'C++',
            learned: 2021,
            direction: 'right'

        },
        {
            skill: 'C',
            learned: 2022,
            direction: 'left'

        },
        {
            skill: 'Javascript',
            learned: 2025,
            direction: 'right'

        },
        {
            skill: 'MySQL',
            learned: 2025,
            direction: 'left'
        },
        {
            skill: 'HTML',
            learned: 2026,
            direction: 'right'

        },
        {
            skill: 'CSS',
            learned: 2026,
            direction: 'left'

        },
    ];

    const knownFrameworks = [
        {
            framework: 'Node.Js',
            learned: 2025,
            direction: 'right'
        },
        {
            framework: 'React.Js',
            learned: 2026,
            direction: 'left'
        }
    ];

    const technicalCheckpoint = [
        {
            techCheck: 'MCA Backend Programming Certification',
            completion: 'January 15, 2026',
            direction: 'right'
        },
        {
            techCheck: 'NextStack HTML & CSS Certification',
            completion: 'May 12, 2026',
            direction: 'left'
        },
        {
            techCheck: 'NextStack Javascript Certification',
            completion: 'January 15, 2026',
            direction: 'right'
        },
    ];

    // This is from the Connection-Sprint-starter-pack



    async function loadSkills(searchTerm = search) {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getSkills(searchTerm);
            console.log("Fetched data:", data);

            let skillsArray = [];
            if (Array.isArray(data)) {
                skillsArray = data;
            } else if (data && Array.isArray(data.skills)) {
                skillsArray = data.skills;
            } else if (data && Array.isArray(data.data)) {
                skillsArray = data.data; // Handles standard Express API wrappers like { success: true, data: [...] }
            }

            setSkills(skillsArray);
        } catch (err) {
            setError(err.message || 'Failed to fetch skills');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        // useEffect itself can't be async, so we define a function inside.
        loadSkills(search);

    }, [search]);

    async function handleCreate(newSkill) {
        try {
            setFormError(null);
            await createSkill(newSkill);
            await loadSkills();
            return true;
        } catch (err) {
            setFormError(err.message);
            return false;
        }
    }

    // -------------------------------------------------------------
    // UPDATE
    // -------------------------------------------------------------
    async function handleUpdate(id, changes) {
        try {
            // TODO (LAB 4a): send only the changed fields, then reload
            // and close the editor.
            //
            await updateSkill(id, changes);
            await loadSkills();
            setEditingId(null);

            return true;
        } catch (err) {
            setError(err.message);
            // Note: we do NOT close the editor here. A failed save should
            // never throw away what the user typed.
            return false;
        }
    }

    // -------------------------------------------------------------
    // DELETE
    // -------------------------------------------------------------
    async function handleDelete(id) {
        if (!window.confirm('Delete this skill?')) return;

        try {
            await deleteSkill(id);
            await loadSkills();
        } catch (err) {
            setError(err.message);
            loadSkills();
        }
    }

    const isSearching = search.trim() !== '';


    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">My Experience & Skills</h1>
                {/* text-black text-center bg-white text-2xl m-3.5 p-2.5 rounded-lg min-h-fit min-w-fit max-h-3.5 max-w-3.5  */}
                {/* <div className='grid grid-cols-3 gap-1.5 pb-1.5  '>
                    {gridSkills.map((skill) =>(
                        <div key={skill} className='grid-skills bg-white rounded-full mx-auto w-full text-center pb-3 dark:text-black  object-contain'>{skill}</div>
                        
                    ))}
                </div> */}
                <div className="mb-6 relative">
                    <SearchBar setResults={setResults} repos={skills} />
                    {results && results.length > 0 && <SearchResults results={results} />}
                </div>
                {isLoading && <p className="status">Loading skills…</p>}

                {error && (
                    <p className="status error">Could not load skills: {error}</p>
                )}

                {!isLoading && !error && skills.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold border-b-2 text-center mb-4">
                            API Skills & Endorsements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {skills.map((skill) => (
                                <div key={skill.id || skill._id} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                                    <h3 className="font-bold text-lg">{skill.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Category: {skill.category}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Level: {skill.level}</p>
                                    <p className="mt-2 text-xs font-semibold text-blue-600">
                                        Endorsements: {skill.endorsements || 0}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}


                {/* Skills Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold border-b-2 text-center mb-4">Core Languages</h2>
                    <Timeline info={knownSkills} />
                </section>

                {/* Frameworks Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold border-b-2 text-center mb-4">Frameworks & Libraries</h2>
                    <Timeline info={knownFrameworks} />
                </section>

                {/* Certifications Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold border-b-2 text-center mb-6">Technical Checkpoints</h2>
                    <Timeline info={technicalCheckpoint} />
                </section>
            </div>
        </>
    );


}

