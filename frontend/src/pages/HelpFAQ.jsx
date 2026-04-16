import React, { useState } from "react";
import { Link } from "react-router-dom"; // Standard routing for the contact button

const HelpFAQ = () => {
  // State to track which FAQ is currently open
  const [openIndex, setOpenIndex] = useState(null);

  // The real answers!
  const faqs = [
    {
      category: "Booking & Appointments",
      questions: [
        { q: "How do I book an appointment?", a: "Simply navigate to our Home or Services page, select your desired service, choose an available stylist, and pick a time slot that works for you. Click 'Book Now' to confirm!" },
        { q: "Can I cancel or reschedule my appointment?", a: "Yes. You can manage your appointments by logging into your account and visiting the 'My Appointments' tab. Please note we require 24 hours notice for cancellations." },
        { q: "Do I need to pay a deposit?", a: "For select premium services (like full hair coloring or extensions), a 20% deposit may be required to secure your slot." }
      ]
    },
    {
      category: "Services & Staff",
      questions: [
        { q: "Can I request a specific stylist?", a: "Absolutely! During the booking process, you will see a dropdown list of available staff. You can select your favorite stylist there." },
        { q: "How do I know which facial is right for my skin?", a: "We offer complimentary 10-minute consultations before any skincare treatment. You can also message us via the Contact page with your skin concerns." }
      ]
    },
    {
      category: "Account & General",
      questions: [
        { q: "How do I leave a review?", a: "After your appointment, log in and visit the 'Testimonials' tab. You can leave a star rating and a written review for your stylist there!" },
        { q: "Is my payment information secure?", a: "Yes, we use industry-standard encryption to ensure your personal and payment information is completely safe and secure." }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const uniqueKey = `${categoryIndex}-${questionIndex}`;
    // If clicking the one that's already open, close it. Otherwise, open the new one.
    setOpenIndex(openIndex === uniqueKey ? null : uniqueKey);
  };

  return (
    <div className="bg-[#fdfafb] min-h-screen p-8 lg:p-12 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            How Can We <span className="text-pink-500 italic">Help?</span>
          </h2>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Frequently Asked Questions & App Guide
          </p>
        </div>

        {/* FAQ Categories & Interactive Accordion */}
        <div className="space-y-10">
          {faqs.map((cat, cIndex) => (
            <div key={cIndex} className="bg-white p-8 rounded-[2rem] shadow-sm border border-pink-50/50">
              <h3 className="text-xl font-black text-pink-500 uppercase tracking-wide mb-6 border-b border-pink-50 pb-4">
                {cat.category}
              </h3>
              
              <div className="space-y-4">
                {cat.questions.map((item, qIndex) => {
                  const uniqueKey = `${cIndex}-${qIndex}`;
                  const isOpen = openIndex === uniqueKey;

                  return (
                    <div 
                      key={qIndex} 
                      className={`border rounded-2xl transition-all duration-300 ${
                        isOpen ? "border-pink-200 bg-pink-50/30 shadow-sm" : "border-gray-100 hover:border-pink-200"
                      }`}
                    >
                      {/* The clickable question button */}
                      <button
                        onClick={() => toggleFAQ(cIndex, qIndex)}
                        className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none cursor-pointer"
                      >
                        <span className={`font-bold ${isOpen ? "text-pink-600" : "text-gray-700"}`}>
                          {item.q}
                        </span>
                        <span className={`text-xl transition-transform duration-300 ${isOpen ? "rotate-45 text-pink-500" : "text-gray-400"}`}>
                          +
                        </span>
                      </button>
                      
                      {/* The Answer Dropdown: 
                        Using CSS Grid here ensures a perfect, smooth sliding animation 
                        no matter how long the text is. 
                      */}
                      <div 
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Still have questions?</p>
          {/* Linked exactly to your /contact route */}
          <Link 
            to="/contact" 
            className="inline-block bg-pink-400 hover:bg-pink-500 text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all shadow-md hover:shadow-lg"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HelpFAQ;