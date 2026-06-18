
import React from 'react';
import { Hero } from '../components/Home/Hero';
import { Intro } from '../components/Home/Intro';
import { WhyUs } from '../components/Home/WhyUs';
import { Achievements } from '../components/Home/Achievements';
import { PastProjects } from '../components/Home/PastProjects';
import { PracticeAreas } from '../components/Home/PracticeAreas';
import { Testimonials } from '../components/Home/Testimonials';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAccessibility } from '../contexts/AccessibilityContext';

const Home: React.FC = () => {
  usePageTitle('Home');
  const { language } = useAccessibility();
  return (
    <main id="main-content" lang={language === 'np' ? 'ne' : 'en'} tabIndex={0} className="flex-grow">
      <Hero />
      <Intro />
      <WhyUs />
      <Achievements />
      <PastProjects />
      <PracticeAreas />
      <Testimonials />
    </main>
  );
};

export default Home;
