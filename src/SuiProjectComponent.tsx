import React, { useState, useMemo, useEffect } from 'react';
import { X, Github, Globe, ThumbsUp, Search, Loader } from 'lucide-react';
import axios from "axios";


const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const ProjectCard: React.FC<{ project }> = ({ project }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
                <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{project.name}</h3>
                    <div className="text-sm text-gray-600 mb-2 overflow-hidden max-h-16">
                        <p>{project.description}</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-blue-500 hover:text-blue-700 transition duration-300 flex items-center mb-2 text-sm"
                    >
                        Read more
                    </button>
                    <div className="mt-auto">
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
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
                <div className="mb-4 max-h-60 overflow-y-auto">
                    <p className="text-gray-600">{project.description}</p>
                </div>
                <div className="flex space-x-4 mb-4">
                    <a
                        href={project.github_url}
                        className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition duration-300 flex items-center justify-center"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Github size={18} className="mr-2" /> GitHub
                    </a>
                    <a
                        href={project.walrus_site_url}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-300 flex items-center justify-center"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Globe size={18} className="mr-2" /> Website
                    </a>
                </div>
                <div className="flex items-center justify-center bg-green-100 rounded-full py-2 px-4">
                    <ThumbsUp size={18} className="text-green-500 mr-2" />
                    <span className="text-lg font-semibold text-green-700">{project.votes} votes</span>
                </div>
            </Modal>
        </>
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

    const sortedAndFilteredProjects = useMemo(() => {
        return projects
            .filter(project =>
                project.fields.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.fields.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => parseInt(b.fields.votes) - parseInt(a.fields.votes));
    }, [projects, searchTerm]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-grow flex flex-col">
                <header className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Walrus Devnet Hackathon - Community Votes</h1>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Total Projects: {projects.length}</h1>                    <p className="text-lg text-gray-700 mb-4">Discover innovative projects powering the SUI blockchain ecosystem</p>
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
                    ) : sortedAndFilteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {sortedAndFilteredProjects.map((project, index) => (
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
            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                    <div className="mb-2 sm:mb-0">
                        Powered by <a href="https://cre8space.walrus.site" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">cre8space</a>
                    </div>
                    <div>
                        <a href="https://github.com/srksuman/Walrus-Hackathon-Vote" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-300">
                            <Github size={20} className="mr-2" />
                            GitHub Repository
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SuiProjectsComponent;