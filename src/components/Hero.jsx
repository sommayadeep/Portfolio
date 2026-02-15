import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Download, Mail } from 'lucide-react';

const Hero = () => {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
            {/* Content Container */}
            <div className="relative z-10 max-w-4xl w-full text-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-neon-blue text-sm font-medium mb-6 backdrop-blur-md">
                        AI/ML Enthusiast & Software Developer
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                        <span className="text-white">Sommayadeep</span>{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                            Saha
                        </span>
                    </h1>

                    <h2 className="text-2xl md:text-3xl text-gray-300 font-light mb-8">
                        Building Intelligent Systems Through Code
                    </h2>

                    <p className="max-w-2xl mx-auto text-gray-400 text-lg mb-10 leading-relaxed">
                        Computer Science Engineering student specializing in Machine Learning,
                        passionate about solving real-world problems using software and intelligent systems.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.a
                            href="#projects"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-neon-blue text-black font-semibold rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-shadow"
                        >
                            View Projects <ChevronRight size={20} />
                        </motion.a>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-white/5 text-white border border-white/10 rounded-full flex items-center gap-2 hover:bg-white/10 hover:border-neon-purple/50 transition-colors backdrop-blur-md"
                            onClick={() => window.open('/cv.pdf', '_blank')}
                        >
                            <Download size={20} /> Resume
                        </motion.button>

                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-transparent text-gray-300 border border-transparent hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <Mail size={20} /> Contact Me
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
                <span className="text-sm">Scroll Down</span>
            </div>
        </section>
    );
};

export default Hero;
