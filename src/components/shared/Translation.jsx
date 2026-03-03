"use client";

import { useState, useEffect } from "react";
import { HiSearch, HiChevronDown } from "react-icons/hi";

const countryOptions = [
  { code: "bn", name: "Bangladesh", flagCode: "bd" },
  { code: "en", name: "United States", flagCode: "us" },
  { code: "ur", name: "Pakistan", flagCode: "pk" },
  { code: "hi", name: "India", flagCode: "in" },
  { code: "ar", name: "Saudi Arabia", flagCode: "sa" },
  { code: "en-AU", name: "Australia", flagCode: "au" }, 
  { code: "en-CA", name: "Canada", flagCode: "ca" }, 
  { code: "ja", name: "Japan", flagCode: "jp" }, 
  { code: "ar-QA", name: "Qatar", flagCode: "qa" }, 
  { code: "af", name: "South Africa", flagCode: "za" },
  { code: "sq", name: "Albania", flagCode: "al" },
  { code: "am", name: "Ethiopia", flagCode: "et" },
  { code: "hy", name: "Armenia", flagCode: "am" },
  { code: "az", name: "Azerbaijan", flagCode: "az" },
  { code: "eu", name: "Basque Country", flagCode: "es" }, 
  { code: "be", name: "Belarus", flagCode: "by" },
  { code: "bs", name: "Bosnia & Herzegovina", flagCode: "ba" },
  { code: "bg", name: "Bulgaria", flagCode: "bg" },
  { code: "ca", name: "Catalonia", flagCode: "es" }, 
  { code: "ceb", name: "Philippines", flagCode: "ph" },
  { code: "ny", name: "Malawi", flagCode: "mw" },
  { code: "zh-CN", name: "China (Simplified)", flagCode: "cn" },
  { code: "zh-TW", name: "Taiwan", flagCode: "tw" },
  { code: "co", name: "Corsica", flagCode: "fr" },
  { code: "hr", name: "Croatia", flagCode: "hr" },
  { code: "cs", name: "Czech Republic", flagCode: "cz" },
  { code: "da", name: "Denmark", flagCode: "dk" },
  { code: "nl", name: "Netherlands", flagCode: "nl" },
  { code: "eo", name: "Esperanto", flagCode: "eu" }, 
  { code: "et", name: "Estonia", flagCode: "ee" },
  { code: "fi", name: "Finland", flagCode: "fi" },
  { code: "fr", name: "France", flagCode: "fr" },
  { code: "fy", name: "Friesland", flagCode: "nl" },
  { code: "gl", name: "Galicia", flagCode: "es" },
  { code: "ka", name: "Georgia", flagCode: "ge" },
  { code: "de", name: "Germany", flagCode: "de" },
  { code: "el", name: "Greece", flagCode: "gr" },
  { code: "gu", name: "India (Gujarati)", flagCode: "in" },
  { code: "ht", name: "Haiti", flagCode: "ht" },
  { code: "ha", name: "Nigeria (Hausa)", flagCode: "ng" },
  { code: "haw", name: "Hawaii", flagCode: "us" }, 
  { code: "he", name: "Israel", flagCode: "il" },
  { code: "hmn", name: "Hmong", flagCode: "cn" },
  { code: "hu", name: "Hungary", flagCode: "hu" },
  { code: "is", name: "Iceland", flagCode: "is" },
  { code: "ig", name: "Nigeria (Igbo)", flagCode: "ng" },
  { code: "id", name: "Indonesia", flagCode: "id" },
  { code: "ga", name: "Ireland", flagCode: "ie" },
  { code: "it", name: "Italy", flagCode: "it" },
  { code: "jw", name: "Indonesia (Javanese)", flagCode: "id" },
  { code: "kn", name: "India (Kannada)", flagCode: "in" },
  { code: "kk", name: "Kazakhstan", flagCode: "kz" },
  { code: "km", name: "Cambodia", flagCode: "kh" },
  { code: "rw", name: "Rwanda", flagCode: "rw" },
  { code: "ko", name: "South Korea", flagCode: "kr" },
  { code: "ku", name: "Kurdistan", flagCode: "iq" }, 
  { code: "ky", name: "Kyrgyzstan", flagCode: "kg" },
  { code: "lo", name: "Laos", flagCode: "la" },
  { code: "la", name: "Latin", flagCode: "va" }, 
  { code: "lv", name: "Latvia", flagCode: "lv" },
  { code: "lt", name: "Lithuania", flagCode: "lt" },
  { code: "lb", name: "Luxembourg", flagCode: "lu" },
  { code: "mk", name: "North Macedonia", flagCode: "mk" },
  { code: "mg", name: "Madagascar", flagCode: "mg" },
  { code: "ms", name: "Malaysia", flagCode: "my" },
  { code: "ml", name: "India (Malayalam)", flagCode: "in" },
  { code: "mt", name: "Malta", flagCode: "mt" },
  { code: "mi", name: "New Zealand", flagCode: "nz" },
  { code: "mr", name: "India (Marathi)", flagCode: "in" },
  { code: "mn", name: "Mongolia", flagCode: "mn" },
  { code: "my", name: "Myanmar", flagCode: "mm" },
  { code: "ne", name: "Nepali", flagCode: "np" },
  { code: "no", name: "Norway", flagCode: "no" },
  { code: "or", name: "India (Odia)", flagCode: "in" },
  { code: "ps", name: "Afghanistan", flagCode: "af" },
  { code: "fa", name: "Iran", flagCode: "ir" },
  { code: "pl", name: "Poland", flagCode: "pl" },
  { code: "pt", name: "Portugal", flagCode: "pt" },
  { code: "pa", name: "India (Punjabi)", flagCode: "in" },
  { code: "ro", name: "Romania", flagCode: "ro" },
  { code: "ru", name: "Russia", flagCode: "ru" },
  { code: "sm", name: "Samoa", flagCode: "ws" },
  { code: "gd", name: "Scotland", flagCode: "gb-sct" },
  { code: "sr", name: "Serbia", flagCode: "rs" },
  { code: "st", name: "Lesotho", flagCode: "ls" },
  { code: "sn", name: "Zimbabwe", flagCode: "zw" },
  { code: "sd", name: "Pakistan (Sindhi)", flagCode: "pk" },
  { code: "si", name: "Sri Lanka", flagCode: "lk" },
  { code: "sk", name: "Slovakia", flagCode: "sk" },
  { code: "sl", name: "Slovenia", flagCode: "si" },
  { code: "so", name: "Somalia", flagCode: "so" },
  { code: "es", name: "Spain", flagCode: "es" },
  { code: "su", name: "Indonesia (Sundanese)", flagCode: "id" },
  { code: "sw", name: "Kenya", flagCode: "ke" },
  { code: "sv", name: "Sweden", flagCode: "se" },
  { code: "tg", name: "Tajিকistan", flagCode: "tj" },
  { code: "ta", name: "India (Tamil)", flagCode: "in" },
  { code: "tt", name: "Russia (Tatar)", flagCode: "ru" },
  { code: "te", name: "India (Telugu)", flagCode: "in" },
  { code: "th", name: "Thailand", flagCode: "th" },
  { code: "tr", name: "Turkey", flagCode: "tr" },
  { code: "tk", name: "Turkmenistan", flagCode: "tm" },
  { code: "uk", name: "Ukraine", flagCode: "ua" },
  { code: "ug", name: "China (Uyghur)", flagCode: "cn" },
  { code: "uz", name: "Uzbekistan", flagCode: "uz" },
  { code: "vi", name: "Vietnam", flagCode: "vn" },
  { code: "pt-BR", name: "Brazil", flagCode: "br" }, 
  { code: "es-AR", name: "Argentina", flagCode: "ar" }, 
  { code: "cy", name: "Wales", flagCode: "gb-wls" },
  { code: "xh", name: "South Africa (Xhosa)", flagCode: "za" },
  { code: "yi", name: "Israel (Yiddish)", flagCode: "il" },
  { code: "yo", name: "Nigeria (Yoruba)", flagCode: "ng" },
  { code: "zu", name: "South Africa (Zulu)", flagCode: "za" }
];

export const TranslationInit = () => {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { 
          pageLanguage: 'en', 
          autoDisplay: false, 
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE 
        },
        'google_translate_hidden'
      );
    };

    if (!document.getElementById("google-translate-script")) {
      const addScript = document.createElement('script');
      addScript.id = "google-translate-script";
      addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      addScript.async = true;
      document.body.appendChild(addScript);
    }

    const observer = new MutationObserver(() => {
      if (document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      if (document.documentElement.style.top !== '0px') {
        document.documentElement.style.top = '0px';
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        html, body { top: 0px !important; position: static !important; }
        .goog-te-banner-frame { display: none !important; opacity: 0 !important; visibility: hidden !important; }
        iframe.goog-te-banner-frame { display: none !important; }
        .VIpgJd-ZVi9od-aZ2wEe-wOHMyf,
        .VIpgJd-ZVi9od-aZ2wEe-wOHMyf-ti6hGc,
        .skiptranslate > iframe { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
        body > .skiptranslate { display: none !important; }
        #goog-gt-tt, .goog-tooltip { display: none !important; visibility: hidden !important; }
        .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; border: none !important; }
      `}} />

      <div style={{ position: 'fixed', top: '-10000px', left: '-10000px', zIndex: -99999, opacity: 0 }}>
        <div id="google_translate_hidden"></div>
      </div>
    </>
  );
};


export default function Translation({ isMobile = false, closeMenu }) {
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");

  const filteredCountries = countryOptions
    .filter((country) => country.name.toLowerCase().includes(langSearch.toLowerCase()))
    .slice(0, 7);

  useEffect(() => {
    setMounted(true);
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    const googtrans = getCookie('googtrans');
    if (googtrans) {
      const lang = googtrans.split('/')[2];
      if (lang) setCurrentLang(lang);
    }
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    setLangDropdownOpen(false); 
    setLangSearch(""); 

    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/;`;

    if(closeMenu) closeMenu();
    window.location.reload();
  };

  const activeCountry = countryOptions.find(c => c.code === currentLang) || countryOptions.find(c => c.code === 'en');

  // Mobile Version UI
  if (isMobile) {
    return (
      <div className="w-full relative z-[120]">
        <button 
          onClick={() => setLangDropdownOpen(!langDropdownOpen)}
          className="bg-[#cddfa0]/10 border border-[#cddfa0]/30 backdrop-blur-md text-white rounded-xl px-5 py-3.5 flex items-center gap-4 outline-none cursor-pointer hover:bg-[#cddfa0]/20 transition duration-300 mb-2 w-max shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
        >
          {mounted ? (
            <img 
              src={`https://flagcdn.com/w80/${activeCountry.flagCode}.png`} 
              alt="flag" 
              className="w-12 h-auto rounded-md object-cover shadow-sm" 
            />
          ) : (
            <div className="w-12 h-8 bg-white/20 animate-pulse rounded"></div>
          )}
          <HiChevronDown className={`text-lg transition-transform ${langDropdownOpen ? "rotate-180" : "rotate-0"}`} />
        </button>

        {langDropdownOpen && (
          <div className="bg-[#0f2e28]/30 backdrop-blur-xl border border-[#cddfa0]/20 rounded-2xl p-4 mb-4 w-full shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="relative mb-4 flex items-center">
              <input 
                type="text" 
                placeholder="Search Country..." 
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                className="w-full bg-[#cddfa0]/10 text-white border border-[#cddfa0]/20 rounded-xl px-4 py-3 text-[16px] outline-none focus:bg-[#cddfa0]/20 focus:border-[#cddfa0]/70 placeholder-white/50 transition backdrop-blur-sm"
              />
            </div>
            
            <ul className="flex flex-col gap-1 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <li 
                    key={`mobile-${country.code}`}
                    onClick={() => handleLanguageChange(country.code)}
                    className={`cursor-pointer px-4 py-3 rounded-xl text-[16px] flex items-center gap-4 transition-colors duration-200 whitespace-nowrap
                      ${currentLang === country.code ? "bg-[#cddfa0]/30 text-[#cddfa0] font-bold" : "text-white/80 hover:bg-[#cddfa0]/10 hover:text-white"}`}
                  >
                    <img 
                      src={`https://flagcdn.com/w80/${country.flagCode}.png`} 
                      alt={country.name} 
                      className="w-10 h-auto rounded-md shadow-sm"
                    />
                    {country.name}
                  </li>
                ))
              ) : (
                <li className="text-white/40 text-[16px] text-center py-3">No country found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Desktop Version UI
  return (
    <div className="relative">
      <button 
        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
        className="bg-[#cddfa0]/10 border border-[#cddfa0]/30 backdrop-blur-md text-white rounded-lg px-4 py-2 flex items-center gap-3 outline-none cursor-pointer hover:bg-[#cddfa0]/20 transition duration-300 shadow-sm"
      >
        {mounted ? (
          <img 
            src={`https://flagcdn.com/w80/${activeCountry.flagCode}.png`} 
            alt="flag" 
            className="w-10 h-auto rounded-md object-cover shadow-sm" 
          />
        ) : (
          <div className="w-10 h-6 bg-white/20 animate-pulse rounded"></div>
        )}
        <HiChevronDown className={`text-sm transition-transform ${langDropdownOpen ? "rotate-180" : "rotate-0"}`} />
      </button>

      {langDropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)}></div>
          <div className="absolute top-full mt-3 right-0 bg-[#0f2e28]/30 backdrop-blur-xl border border-[#cddfa0]/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-[320px] z-50 p-3">
            <div className="relative mb-3 flex items-center">
              <HiSearch className="absolute left-3 text-white/50 text-[18px]" />
              <input 
                type="text" 
                placeholder="Search Country..." 
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                className="w-full bg-[#cddfa0]/10 text-white border border-[#cddfa0]/20 rounded-xl pl-10 pr-3 py-2.5 text-[15px] outline-none focus:bg-[#cddfa0]/20 focus:border-[#cddfa0]/70 placeholder-white/50 transition backdrop-blur-sm"
              />
            </div>
            
            <ul className="flex flex-col gap-1 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <li 
                    key={country.code}
                    onClick={() => handleLanguageChange(country.code)}
                    className={`cursor-pointer px-3 py-2.5 rounded-xl text-[15px] flex items-center gap-3 transition-colors duration-200 whitespace-nowrap
                      ${currentLang === country.code ? "bg-[#cddfa0]/30 text-[#cddfa0] font-bold" : "text-white/80 hover:bg-[#cddfa0]/10 hover:text-white"}`}
                  >
                    <img 
                      src={`https://flagcdn.com/w80/${country.flagCode}.png`} 
                      alt={country.name} 
                      className="w-8 h-auto rounded-md shadow-sm"
                    />
                    {country.name}
                  </li>
                ))
              ) : (
                <li className="text-white/40 text-[15px] text-center py-3">No country found</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}