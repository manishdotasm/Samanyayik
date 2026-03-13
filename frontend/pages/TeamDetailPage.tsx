import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { TeamMember } from '../types';
import { TRANSLATIONS, TEAM_MEMBERS, TEAM_MEMBERS_NP } from '../constants';
import { Button } from '../components/UI/Button';

const TeamDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { language } = useAccessibility();
    const t = TRANSLATIONS[language];
    
    // In a real app, we'd fetch by ID. Here we use index or find by logic if we had IDs.
    // Assuming simple index based routing for now as per constants array.
    const memberIndex = parseInt(id || '0', 10);
    const members = language === 'np' ? TEAM_MEMBERS_NP : TEAM_MEMBERS;
    const member = members[memberIndex];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!member) {
        return (
            <div className="py-32 text-center">
                 <h2 className="text-2xl font-bold mb-4">Member Not Found</h2>
                 <Link to="/team">
                    <Button variant="primary">Back to Team</Button>
                 </Link>
            </div>
        );
    }

  return (
    <main id="main-content" tabIndex={-1} className="flex-grow bg-white min-h-screen pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-8">
            <Link to="/team" className="inline-flex items-center text-secondary hover:text-green-700 font-bold transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'np' ? 'टोलीमा फर्कनुहोस्' : 'Back to Team'}
            </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Image Column */}
            <div className="w-full md:w-1/3">
                 <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-50 aspect-[3/4]">
                    <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                    />
                 </div>
            </div>

            {/* Info Column */}
            <div className="w-full md:w-2/3 space-y-8">
                <div>
                     <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-2">{member.name}</h1>
                     <p className="text-xl md:text-2xl text-secondary font-bold uppercase tracking-wide">{member.position}</p>
                </div>

                <div className="prose prose-lg text-black font-sans font-normal leading-relaxed text-justify max-w-none">
                     <p>{member.description}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 space-y-4">
                     <h3 className="text-xl font-bold text-black border-b border-gray-200 pb-2 mb-4">
                        {language === 'np' ? 'सम्पर्क विवरण' : 'Contact Information'}
                     </h3>
                     
                     <div className="flex items-start gap-4">
                         <span className="font-bold text-gray-500 w-32 shrink-0">{t.phoneLabel}:</span>
                         <a href={`tel:${member.phoneNumber}`} className="text-black hover:text-secondary font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4" /> {member.phoneNumber}
                         </a>
                     </div>

                     <div className="flex items-start gap-4">
                         <span className="font-bold text-gray-500 w-32 shrink-0">{t.emailLabel}:</span>
                         <a href={`mailto:${member.email}`} className="text-black hover:text-secondary font-medium flex items-center gap-2">
                             <Mail className="w-4 h-4" /> {member.email}
                         </a>
                     </div>

                      <div className="flex items-start gap-4">
                         <span className="font-bold text-gray-500 w-32 shrink-0">Working Areas:</span>
                         <span className="text-black font-medium">{member.workingArea}</span>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};

export default TeamDetailPage;
