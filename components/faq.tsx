// components/FAQ.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, Phone, Mail } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 'project-duration',
    question: 'How long does a typical electrical project take?',
    answer: 'It depends on the scope of work. Simple jobs like light fixture installations can take 1–2 hours, while larger projects like panel upgrades or full rewiring may take 1–3 days.'
  },
  {
    id: 'free-estimates',
    question: 'Do you offer free estimates?',
    answer: 'Yes! We provide free, no-obligation estimates for residential and commercial electrical work across Nassau and Suffolk County. Reach out anytime to book a consultation.'
  },
  {
    id: 'services-offered',
    question: 'What types of electrical services do you offer?',
    answer: 'CRC Electric handles everything from lighting and outlet installations to panel upgrades, landscape lighting, smart home setups, and commercial wiring.'
  },
  {
    id: 'preparation',
    question: 'Do I need to prep anything before the technician arrives?',
    answer: 'We recommend clearing access to the work area. Our electricians will handle the rest with care and professionalism.'
  },
  {
    id: 'licensed-insured',
    question: 'Is CRC Electric licensed and insured?',
    answer: 'Yes, CRC Electric is fully licensed and insured to perform electrical work throughout Long Island—ensuring peace of mind and safety with every job.'
  }
];

interface FAQItemProps {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItemComponent: React.FC<FAQItemProps> = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900 shadow-lg">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:bg-gray-800"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg md:text-xl font-semibold text-white pr-4">
          {faq.question}
        </h3>
        <div className="flex-shrink-0">
          <ChevronDown 
            className={`w-6 h-6 text-red-500 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-5 pt-2 border-t border-gray-700">
          <p className="text-gray-300 leading-relaxed text-base md:text-lg">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  

  return (
    <section className="bg-black py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="text-red-500">FAQs</span> for CRC Electric
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Have questions about our electrical services? Here are some of the most common ones we hear. 
            Need more info? Don't hesitate to contact us!
          </p>
          
         
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {faqData.map((faq) => (
            <FAQItemComponent
              key={faq.id}
              faq={faq}
              isOpen={openItems.has(faq.id)}
              onToggle={() => toggleItem(faq.id)}
            />
          ))}
        </div>

        

        {/* Additional Help Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-base">
            Looking for specific service information? Check out our{' '}
            <a href="/services" className="text-red-400 hover:text-red-300 underline transition-colors duration-200">
              services page
            </a>{' '}
            or{' '}
            <a href="/contact" className="text-red-400 hover:text-red-300 underline transition-colors duration-200">
              request a free quote
            </a>{' '}
            to get started on your project today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
