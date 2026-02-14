import React, { Suspense } from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import BackgroundAnimation from './components/BackgroundAnimation';

function App() {
  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden">
      {/* Background Animation Canvas will go here */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={null}>
          <BackgroundAnimation />
        </Suspense>
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </div>
    </div>
  );
}

export default App;
