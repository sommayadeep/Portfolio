import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Globe, Cpu } from 'lucide-react';

const SkillCategory = ({ title, skills, icon: Icon, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-colors"
        >
            <div className="flex items-center gap-3 mb-4 text-neon-blue">
                <Icon size={24} />
                <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <span
                        key={skill}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white hover:border-neon-blue/50 transition-colors cursor-default"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};

const Skills = () => {
    const categories = [
        {
            title: "Programming",
            icon: Code,
            skills: ["C", "C++", "Python", "Java"],
        },
        {
            title: "Web Development",
            icon: Globe,
            skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "Tailwind CSS"],
        },
        {
            title: "Concepts",
            icon: Database,
            skills: ["DBMS", "OOPS", "Data Structures", "Algorithms", "Operating Systems"],
        }
    ];

    return (
        <section id="skills" className="py-20 px-6 max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Arsenal</span>
                </h2>
                <p className="text-gray-400">Tools and technologies I use to bring ideas to life</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {categories.map((cat, index) => (
                    <SkillCategory key={index} {...cat} delay={index * 0.1} />
                ))}
            </div>

            {/* Special Machine Learning Badge */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-2xl text-center border-neon-purple/30 bg-gradient-to-br from-neon-purple/5 to-transparent relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-neon-purple/10 blur-3xl rounded-full scale-150 animate-pulse-slow"></div>
                <div className="relative z-10">
                    <Cpu className="mx-auto w-12 h-12 text-neon-purple mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Machine Learning Specialist</h3>
                    <p className="text-gray-400 mb-4">Focusing on neural networks, deep learning, and intelligent systems.</p>
                    <div className="flex justify-center gap-2">
                        <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded-full text-sm font-medium">TensorFlow</span>
                        <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded-full text-sm font-medium">PyTorch</span>
                        <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded-full text-sm font-medium">Scikit-learn</span>
                    </div>
                </div>
            </motion.div>

            {/* Currently Learning Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-20 text-center"
            >
                <p className="text-xl text-gray-300 flex items-center justify-center gap-2">
                    Currently Learning & Building More Projects
                    <span className="animate-pulse w-2 h-2 bg-neon-blue rounded-full"></span>
                </p>
                <div className="h-1 w-24 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto mt-4 rounded-full"></div>
            </motion.div>
        </section>
    );
};

export default Skills;
