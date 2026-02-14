import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setStatus('sending');
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        }, 2000);
    };

    return (
        <section id="contact" className="py-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Connect</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-md">
                        Interested in collaborating on AI projects or just want to say hi?
                        My inbox is always open.
                    </p>

                    <div className="space-y-6">
                        <a href="mailto:your.email@example.com" className="flex items-center gap-4 text-xl text-gray-300 hover:text-white transition-colors group">
                            <div className="p-4 rounded-full bg-white/5 group-hover:bg-neon-blue/20 transition-colors">
                                <Mail className="group-hover:text-neon-blue" />
                            </div>
                            <span>sommayadeep.saha@example.com</span>
                        </a>

                        <a href="https://linkedin.com/in/sommayadeep" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-xl text-gray-300 hover:text-white transition-colors group">
                            <div className="p-4 rounded-full bg-white/5 group-hover:bg-neon-blue/20 transition-colors">
                                <Linkedin className="group-hover:text-neon-blue" />
                            </div>
                            <span>LinkedIn Profile</span>
                        </a>

                        <a href="https://github.com/sommayadeep" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-xl text-gray-300 hover:text-white transition-colors group">
                            <div className="p-4 rounded-full bg-white/5 group-hover:bg-neon-blue/20 transition-colors">
                                <Github className="group-hover:text-neon-blue" />
                            </div>
                            <span>GitHub Profile</span>
                        </a>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.form
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    onSubmit={handleSubmit}
                    className="glass-card p-8 rounded-3xl"
                >
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 text-sm">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 text-sm">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 text-sm">Message</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue transition-colors resize-none"
                            placeholder="Your message..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-bold text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        {status === 'sending' ? 'Sending...' : (
                            <>
                                Send Message <Send size={18} />
                            </>
                        )}
                    </button>

                    {status === 'success' && (
                        <p className="mt-4 text-green-400 text-center text-sm">Message sent successfully!</p>
                    )}
                </motion.form>
            </div>

            <footer className="mt-20 text-center text-gray-500 text-sm border-t border-white/5 pt-8">
                <p>&copy; {new Date().getFullYear()} Sommayadeep Saha. All rights reserved.</p>
                <p className="mt-2">Built with React, Tailwind & Three.js</p>
            </footer>
        </section>
    );
};

export default Contact;
