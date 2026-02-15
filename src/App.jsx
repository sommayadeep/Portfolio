import React, { Suspense, useState, useEffect } from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import BackgroundAnimation from './components/BackgroundAnimation';

function App() {
  const [gestureEnabled, setGestureEnabled] = useState(false);
  
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Check if mobile device
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden">
      {/* Background Animation - only when gesture is enabled and not mobile */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={null}>
          <BackgroundAnimation 
            enabled={gestureEnabled && !isMobile && !prefersReducedMotion} 
          />
        </Suspense>
      </div>

      <div className="relative z-10">
        <Navbar gestureEnabled={gestureEnabled} setGestureEnabled={setGestureEnabled} />
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </div>
    </div>
  );
}

export default App;

