import React from 'react';
import { Team } from '../components/About/Team';
import { AppointmentCTA } from '../components/Shared/AppointmentCTA';

const TeamPage: React.FC = () => {
  return (
    <main id="main-content" tabIndex={-1} className="flex-grow bg-white">
      <div className="pt-24 md:pt-32 pb-12 text-center bg-gray-50 border-b border-gray-100">
         {/* We can rely on the Team component's internal header or add a page header here. 
             Since Team component has "Our Team" title, we might just want to render it directly 
             or wrap it similarly to other pages. 
             The Team component has `py-24` and a title. Let's just use it directly but maybe reduce top padding if we add a header?
             For now, let's just render it. 
         */}
      </div>
       {/* Actually, Team component has its own 'Our Team' heading. 
           If I want a consistent "Page Header" look (like "About Us -> Who We Are"), 
           I might want to adjust, but simply rendering <Team /> is the safest MVP. 
           However, I will wrap it to ensure background consistency.
       */}
      <Team />
      <AppointmentCTA />
    </main>
  );
};

export default TeamPage;
