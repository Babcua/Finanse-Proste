import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react'; // ZMIANA 1: Używamy Info zamiast Cookie

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('fp_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('fp_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 md:p-6 z-[100] animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-xl text-blue-600 hidden md:block">
            {/* ZMIANA 2: Bezpieczna ikona */}
            <Info size={24} /> 
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Dbamy o Twoją prywatność</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Używamy plików cookies i podobnych technologii, aby strona działała poprawnie oraz w celach statystycznych. Korzystając z serwisu, zgadzasz się na ich użycie.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            Akceptuję
          </button>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;