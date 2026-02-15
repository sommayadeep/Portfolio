import React, { useState, useEffect } from 'react';
import { Menu, X, Hand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ gestureEnabled, setGestureEnabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            
            // Determine active section
            const sections = ['hero', 'projects', 'skills', 'contact'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#hero' },
        { name: 'Projects', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Contact', href: '#contact' },
    ];

    const toggleGesture = () => {
        setGestureEnabled(!gestureEnabled);
    };

    return (
        <>
            <nav 
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <a href="#" className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent" aria-label="Go to Home">
                        Sommayadeep
                    </a>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                className={`transition-colors hover:text-white ${activeSection === link.href.slice(1) ? 'text-neon-blue' : 'text-gray-300'}`}
                                aria-current={activeSection === link.href.slice(1) ? 'page' : undefined}
                            >
                                {link.name}
                            </a>
                        ))}
                        
                        {/* Gesture Toggle Button */}
                        <button
                            onClick={toggleGesture}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                                gestureEnabled 
                                    ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50' 
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/30'
                            }`}
                            aria-label={gestureEnabled ? 'Disable hand gesture control' : 'Enable hand gesture control'}
                            aria-pressed={gestureEnabled}
                        >
                            <Hand size={16} />
                            <span>{gestureEnabled ? 'ON' : 'OFF'}</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-white" 
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10"
                        >
                            <div className="flex flex-col p-6 space-y-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-gray-300 hover:text-neon-blue transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                {/* Gesture Toggle in Mobile */}
                                <button
                                    onClick={() => { toggleGesture(); setIsOpen(false); }}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium w-full ${
                                        gestureEnabled 
                                            ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50' 
                                            : 'bg-white/5 text-gray-400 border border-white/10'
                                    }`}
                                >
                                    <Hand size={16} />
                                    <span>Gesture Mode {gestureEnabled ? 'ON' : 'OFF'}</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Side Navigation Indicator */}
            <div 
                className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3"
                role="navigation"
                aria-label="Section indicators"
            >
                {navLinks.map((link) => {
                    const isActive = activeSection === link.href.slice(1);
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                isActive 
                                    ? 'bg-neon-blue scale-125 shadow-[0_0_10px_rgba(14,165,233,0.5)]' 
                                    : 'bg-white/20 hover:bg-white/40'
                            }`}
                            aria-label={`Go to ${link.name}`}
                            aria-current={isActive ? 'true' : undefined}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default Navbar;

