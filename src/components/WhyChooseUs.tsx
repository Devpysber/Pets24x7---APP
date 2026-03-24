import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface WhyChooseUsProps {
  serviceName: string;
  category: string;
  description: string;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ serviceName, category, description }) => {
  const [usps, setUsps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const generateUSPs = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate 3 short, compelling unique selling propositions (USPs) for a pet service named "${serviceName}" in the category "${category}". 
          Description: ${description}
          Return only a JSON array of 3 strings.`,
          config: {
            responseMimeType: "application/json",
          }
        });

        const result = JSON.parse(response.text || '[]');
        if (Array.isArray(result) && result.length > 0) {
          setUsps(result.slice(0, 3));
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error generating USPs:', err);
        // Fallback USPs based on category
        const fallbacks: Record<string, string[]> = {
          'Grooming': [
            'Professional grooming with a gentle touch',
            'Premium pet-safe products for a shiny coat',
            'Stress-free environment for your furry friends'
          ],
          'Vet Clinics': [
            'Expert medical care from experienced veterinarians',
            'State-of-the-art diagnostic and treatment facilities',
            'Compassionate care for all your pet\'s health needs'
          ],
          'Pet Shops': [
            'Wide range of premium pet food and accessories',
            'Expert advice on pet nutrition and care',
            'Quality products from trusted global brands'
          ],
          'Trainers': [
            'Positive reinforcement based training methods',
            'Customized training plans for every pet',
            'Expert trainers with years of experience'
          ],
          'Pet Hotels': [
            'Safe and comfortable stay for your pets',
            'Regular exercise and playtime sessions',
            '24/7 supervision and care by pet lovers'
          ]
        };
        setUsps(fallbacks[category] || [
          'Dedicated professional care for your pets',
          'Safe and comfortable environment',
          'Trusted by pet parents in your community'
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    generateUSPs();
  }, [serviceName, category, description]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-6 rounded-2xl bg-indigo-50/30 border border-indigo-100/50 animate-pulse">
        <div className="h-4 w-32 bg-indigo-100 rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-indigo-50 rounded" />
          <div className="h-3 w-5/6 bg-indigo-50 rounded" />
          <div className="h-3 w-4/6 bg-indigo-50 rounded" />
        </div>
      </div>
    );
  }

  if (error || usps.length === 0) {
    return null; // Don't show anything if generation fails
  }

  return (
    <section className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-200">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="h-24 w-24" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-amber-300" />
          <h2 className="text-lg font-bold">Why Choose Us?</h2>
        </div>
        
        <ul className="space-y-3">
          {usps.map((usp, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-300 flex-shrink-0" />
              <p className="text-sm font-medium leading-relaxed text-indigo-50">
                {usp}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};
