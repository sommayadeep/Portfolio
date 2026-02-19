import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
    {
        title: 'CertiTrust',
        description: 'Blockchain-based certificate verification system ensuring authenticity and security.',
        tech: ['React', 'Solidity', 'Ethereum', 'Tailwind'],
        live: 'https://certi-trust-gamma.vercel.app',
        github: '#', // Placeholder if not provided
    },
    {
        title: 'SugarShield',
        description: 'Comprehensive health tracking application tailored for youth diabetes management.',
        tech: ['React', 'Node.js', 'Express', 'MongoDB'],
        live: 'https://sugar-shield.vercel.app',
        github: '#',
    },
    {
        title: 'AlgoViz',
        description: 'Interactive simulator for visualizing Data Structures and Algorithms in real-time.',
        tech: ['HTML', 'CSS', 'JavaScript', 'D3.js'],
        live: 'https://sommayadeep.github.io/AlgoViz-DSA-Simulator/',
        github: '#',
    },
    {
        title: 'Student Management System',
        description: 'Full-stack platform to manage student records, attendance, and grades efficiently.',
        tech: ['React', 'Node.js', 'PostgreSQL', 'Express'],
        live: 'https://student-management-system-0tmt.onrender.com',
        github: '#',
    },
    {
        title: 'Trilingo',
        description: 'Real-time language converter and learning tool breaking communication barriers.',
        tech: ['React', 'API Integration', 'Tailwind'],
        live: 'https://trilingo.netlify.app/',
        github: '#',
    },
    {
        title: 'Mahendra Chandra & Sons',
        description: 'Business website showcasing services, offerings, and contact details for Mahendra Chandra & Sons.',
        tech: ['Business Website', 'Frontend', 'Responsive Design'],
        live: 'http://mahendra-chandra-sons.vercel.app',
        github: 'https://github.com/sommayadeep/MahendraChandra-sons',
    },
];

const ProjectCard = ({ project, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="glass-card p-6 rounded-2xl relative group overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <h3 className="text-2xl font-bold mb-2 group-hover:text-neon-blue transition-colors relative z-10">{project.title}</h3>
            <p className="text-gray-400 mb-4 h-12 relative z-10">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                {project.tech.map((t, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                        {t}
                    </span>
                ))}
            </div>

            <div className="flex gap-4 relative z-10">
                <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-white hover:text-neon-blue transition-colors"
                >
                    <ExternalLink size={16} /> Live Demo
                </a>
                <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                    <Github size={16} /> GitHub
                </a>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    return (
        <section id="projects" className="py-20 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Projects</span>
                </h2>
                <p className="text-gray-400">Showcasing my journey in AI, Blockchain, and Web Development</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} index={index} />
                ))}
            </div>
        </section>
    );
};

export default Projects;
