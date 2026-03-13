import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { extractTextFromBlocks, fetchAPI, renderStrapiBlocks } from '../utils/api';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { TRANSLATIONS } from '../constants';
import { NewsItem } from '../types';
import { Calendar, User, Loader2 } from 'lucide-react';

const NewsDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { language } = useAccessibility();
    
    // We don't necessarily need 't' if we just copy the exact modal content structure,
    // but we might need it for fallback text.
    
    const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNewsItem = async () => {
            if (!id) return;
            try {
                setLoading(true);
                let data = null;
                let attributes = null;

                try {
                    // Try direct fetch first
                    const response = await fetchAPI<any>(`/api/news/${id}?populate=*`);
                    if (response?.data) {
                         data = response.data;
                         attributes = data.attributes || data; 
                    }
                } catch (directError) {
                    console.warn("Direct fetch failed, trying list fallback...", directError);
                }

                // Fallback: Fetch list and find
                if (!attributes) {
                    const listResponse = await fetchAPI<any>('/api/news?populate=*');
                    const listData = listResponse?.data || [];
                    const found = listData.find((item: any) => String(item.id) === id);
                    if (found) {
                        data = found;
                        attributes = found.attributes || found;
                    }
                }

                if (!attributes) {
                    throw new Error(`News item with ID ${id} not found.`);
                }

                const isNepali = language === 'np';
                
                const item: NewsItem = {
                    id: data.id,
                    category: attributes.category,
                    title: isNepali ? (attributes.title_np || attributes.title_en) : attributes.title_en,
                    description: isNepali ? (attributes.description_np || attributes.description_en) : attributes.description_en,
                    fullContent: renderStrapiBlocks(isNepali ? attributes.content_np : attributes.content_en),
                    author: isNepali ? (attributes.author_np || attributes.author_en) : attributes.author_en,
                    date: attributes.date,
                    image: attributes.image?.data?.attributes?.url 
                        ? `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}${attributes.image.data.attributes.url}`
                        : "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2000",
                    externalUrl: null
                };

                setNewsItem(item);
            } catch (err: any) {
                console.error("Failed to fetch news item:", err);
                setError(err.message || "Failed to load news content.");
            } finally {
                setLoading(false);
            }
        };

        loadNewsItem();
    }, [id, language]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
        );
    }

    if (error || !newsItem) {
        return (
             <div className="min-h-screen flex justify-center items-center">
                <p className="text-xl font-bold text-gray-800">{error || "News not found"}</p>
            </div>
        );
    }

    // Matching the Modal Content Structure from NewsGrid.tsx
    return (
        <main id="main-content" tabIndex={-1} className="flex-grow bg-white min-h-screen py-12 px-4 md:px-8">
             <div className="max-w-4xl mx-auto">
                <article className="prose max-w-none">
                    <img 
                      src={newsItem.image} 
                      alt={newsItem.title} 
                      className="w-full h-96 object-cover rounded-lg mb-8 shadow-sm"
                    />
                    
                    <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                       <div className="flex items-center text-sm font-sans font-bold text-black">
                          <User className="w-5 h-5 mr-2 text-secondary" />
                          <span className="text-gray-500 mr-1">Written by</span> {newsItem.author}
                       </div>
                       <div className="flex items-center text-sm font-sans font-bold text-black">
                          <Calendar className="w-5 h-5 mr-2 text-secondary" />
                          {newsItem.date}
                       </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-8 leading-tight">
                      {newsItem.title}
                    </h2>
                    
                    <div 
                        className="text-black font-sans font-normal leading-relaxed space-y-6 text-lg" 
                        dangerouslySetInnerHTML={{ __html: newsItem.fullContent || newsItem.description }} 
                    />
                </article>
             </div>
        </main>
    );
};

export default NewsDetailPage;
