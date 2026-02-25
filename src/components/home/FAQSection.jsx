import React, { useState } from 'react';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "How do I get started with the platform?",
      answer: "Getting started is easy! Simply create an account, verify your email, and you'll get instant access to our dashboard where you can set up your first project."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Absolutely. We believe in no long-term lock-ins. You can cancel your subscription from your account settings with just two clicks, no questions asked."
    },
    {
      question: "Do you offer API access for developers?",
      answer: "Yes, our Professional and Enterprise plans come with full API access. We provide comprehensive documentation to help you integrate our tools seamlessly into your MERN stack applications."
    },
    {
      question: "Is my data secure and private?",
      answer: "Security is our top priority. All data is end-to-end encrypted, and we regularly undergo third-party security audits to ensure your information stays safe in our database."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    
    <section className="relative py-24 px-4 bg-gradient-to-b from-[#0a2e26] to-[#061510] overflow-hidden">
      

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(205,223,160,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-[#cddfa0] font-mono tracking-[0.3em] text-[10px] md:text-xs uppercase mb-4 block font-bold opacity-90">
            Common Inquiries
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Frequently Asked <span className="text-[#cddfa0] italic font-light font-serif">Questions</span>
          </h2>
          <div className="w-20 h-1 bg-[#cddfa0]/30 mx-auto rounded-full"></div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 border ${
                  isOpen 
                    ? 'bg-white/[0.03] border-[#cddfa0]/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
                    : 'bg-transparent border-white/10 hover:border-[#cddfa0]/20 hover:bg-white/[0.02]'
                }`}
              >
                {/* Active Indicator Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[#cddfa0] transition-all duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>

                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-7 md:px-10 text-left focus:outline-none"
                >
                  <span className={`text-lg md:text-xl font-bold tracking-tight transition-colors duration-300 pr-4 ${isOpen ? 'text-[#cddfa0]' : 'text-white/80 group-hover:text-white'}`}>
                    {faq.question}
                  </span>
                  
                  {/* Icon Design */}
                  <div className={`relative flex-shrink-0 w-6 h-6 transition-all duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                    <span className={`absolute top-1/2 left-0 w-full h-0.5 rounded-full transition-all duration-500 ${isOpen ? 'bg-[#cddfa0] rotate-0' : 'bg-white/30'}`}></span>
                    <span className={`absolute top-0 left-1/2 h-full w-0.5 rounded-full transition-all duration-500 ${isOpen ? 'opacity-0' : 'bg-white/30'}`}></span>
                  </div>
                </button>

                <div 
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-7 md:px-10 pt-0 text-white/50 text-base md:text-lg leading-relaxed font-light">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;