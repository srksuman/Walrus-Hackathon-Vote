import React, { useState, useMemo, useEffect } from 'react';
import { ChevronUp, ChevronDown, Github, Globe, ThumbsUp, Search, Loader } from 'lucide-react';
import axios from "axios";

// Sample data with 20 projects for demonstration
const sampleData = {
    "jsonrpc": "2.0",
    "result": {
        "data": {
            "content": {
                "fields": {
                    "project_list": Array(20).fill().map((_, i) => ({
                        "fields": {
                            "name": `Project ${i + 1}`,
                            "github_url": `https://github.com/project${i + 1}`,
                            "walrus_site_url": `https://project${i + 1}.walrus.site/`,
                            "votes": Math.floor(Math.random() * 100).toString(),
                            "description": `This is a sample description for Project ${i + 1}. It demonstrates the functionality of our updated component with various features and improvements.`
                        }
                    }))
                }
            }
        }
    }
};

const ProjectCard: React.FC<{ project: any }> = ({ project }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{project.name}</h3>
                <div className={`text-sm text-gray-600 mb-2 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-full' : 'max-h-16'}`}>
                    <p>{project.description}</p>
                </div>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-500 hover:text-blue-700 transition duration-300 flex items-center mb-2 text-sm"
                >
                    {expanded ? (
                        <>
                            <ChevronUp size={16} className="mr-1" /> Show less
                        </>
                    ) : (
                        <>
                            <ChevronDown size={16} className="mr-1" /> Read more
                        </>
                    )}
                </button>
                <div className="flex space-x-2 mb-2">
                    <a
                        href={project.github_url}
                        className="flex-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs transition duration-300 flex items-center justify-center"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Github size={14} className="mr-1" /> GitHub
                    </a>
                    <a
                        href={project.walrus_site_url}
                        className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition duration-300 flex items-center justify-center"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Globe size={14} className="mr-1" /> Website
                    </a>
                </div>
                <div className="flex items-center justify-center bg-green-100 rounded-full py-1 px-2">
                    <ThumbsUp size={14} className="text-green-500 mr-1" />
                    <span className="text-sm font-semibold text-green-700">{project.votes} votes</span>
                </div>
            </div>
        </div>
    );
};

const SuiProjectsComponent: React.FC = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const getProjectInfoRes = await axios.post("https://fullnode.mainnet.sui.io", {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "sui_getObject",
                "params": [
                    "0x097affa9fd35bc136c9f54b6617fbb24655325694fd23271f7a7ed3b6bd98c6c",
                    {
                        "showContent": true
                    }
                ]
            });
            const projectInfo = getProjectInfoRes.data;
            setProjects(projectInfo.result.data.content.fields.project_list);
            setLoading(false);
        };

        fetchData();
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter(project =>
            project.fields.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.fields.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [projects, searchTerm]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-grow flex flex-col">
                <header className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Walrus Devnet Hackathon - Community Vote ({projects.length})</h1>
                    <p className="text-lg text-gray-700 mb-4">Discover innovative projects powering the SUI blockchain ecosystem</p>
                    <div className="max-w-md mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </header>
                <div className="flex-grow overflow-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader size={40} className="animate-spin text-blue-500" />
                            <span className="ml-2 text-lg text-gray-700">Loading projects...</span>
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProjects.map((project, index) => (
                                <ProjectCard key={index} project={project.fields} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-xl text-gray-700 mb-2">No projects found</p>
                            <p className="text-gray-500">Try adjusting your search terms or check back later for new projects.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuiProjectsComponent;