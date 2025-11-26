import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Info, Banknote, ShieldCheck, Coins, AlertTriangle, Baby, Landmark, ChevronDown, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- KONFIGURACJA API GEMINI ---
// W środowisku produkcyjnym klucz jest wstrzykiwany automatycznie.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

// --- BAZA DANYCH OBLIGACJI ---

const STANDARD_BONDS = [
  {
    id: 'OTS',
    name: 'OTS (3-miesięczne)',
    desc: 'Krótka lokata na 3 miesiące ze stałym zyskiem. Idealna na przeczekanie.',
    rate: 3.00,
    durationMonths: 3,
    earlyExitFee: 0,
    type: 'fixed',
    capitalizationDesc: 'Wypłata całości na koniec',
    interestType: 'Stałe (wiesz ile zarobisz)',
    capitalization: 'end', 
  },
  {
    id: 'ROR',
    name: 'ROR (1-roczne)',
    desc: 'Obligacja na rok. Oprocentowanie zmienia się co miesiąc zależnie od stóp procentowych NBP.',
    rate: 5.75, 
    durationMonths: 12,
    earlyExitFee: 0.50, 
    type: 'variable',
    capitalizationDesc: 'Wypłata odsetek co miesiąc na konto',
    interestType: 'Zmienne (podąża za stopami NBP)',
    capitalization: 'monthly_payout', 
  },
  {
    id: 'DOR',
    name: 'DOR (2-letnie)',
    desc: 'Obligacja na 2 lata. Działa jak ROR, ale trwa dłużej i ma nieco wyższą marżę.',
    rate: 5.90,
    durationMonths: 24,
    earlyExitFee: 0.70,
    type: 'variable',
    capitalizationDesc: 'Wypłata odsetek co miesiąc na konto',
    interestType: 'Zmienne (podąża za stopami NBP)',
    capitalization: 'monthly_payout',
  },
  {
    id: 'TOS',
    name: 'TOS (3-letnie)',
    desc: 'Stały zysk przez 3 lata. Nie martwisz się zmianami stóp procentowych. Odsetki dopisują się do kapitału.',
    rate: 5.95,
    durationMonths: 36,
    earlyExitFee: 0.70,
    type: 'fixed',
    capitalizationDesc: 'Kapitalizacja roczna (zysk na koniec)',
    interestType: 'Stałe (gwarancja oprocentowania)',
    capitalization: 'compound_year',
  },
  {
    id: 'COI',
    name: 'COI (4-letnie)',
    desc: 'Bestseller. Chroni Twoje pieniądze przed inflacją. Odsetki wypłacane są co rok na Twoje konto.',
    rate: 6.30, 
    durationMonths: 48,
    earlyExitFee: 0.70,
    type: 'indexed',
    capitalizationDesc: 'Wypłata odsetek raz w roku na konto',
    interestType: 'Indeksowane inflacją (chroni siłę nabywczą)',
    capitalization: 'yearly_payout',
  },
  {
    id: 'EDO',
    name: 'EDO (10-letnie)',
    desc: 'Najlepsza na długi termin (np. emeryturę). Wykorzystuje procent składany i chroni przed inflacją.',
    rate: 6.55, 
    durationMonths: 120,
    earlyExitFee: 2.00,
    type: 'indexed',
    capitalizationDesc: 'Kapitalizacja roczna (odsetki zarabiają odsetki)',
    interestType: 'Indeksowane inflacją + procent składany',
    capitalization: 'compound_year',
  }
];

const FAMILY_BONDS = [
  {
    id: 'ROS',
    name: 'ROS (6-letnie)',
    desc: 'Rodzinna wersja obligacji inflacyjnych. Wyższy zysk niż w standardowej ofercie.',
    rate: 6.50, 
    durationMonths: 72,
    earlyExitFee: 0.70,
    type: 'indexed',
    capitalizationDesc: 'Kapitalizacja roczna (odsetki zarabiają odsetki)',
    interestType: 'Indeksowane inflacją (Preferencyjna marża)',
    capitalization: 'compound_year',
  },
  {
    id: 'ROD',
    name: 'ROD (12-letnie)',
    desc: 'Najwyżej oprocentowana obligacja na rynku. Długoterminowe budowanie kapitału dla dzieci.',
    rate: 6.80, 
    durationMonths: 144,
    earlyExitFee: 2.00,
    type: 'indexed',
    capitalizationDesc: 'Kapitalizacja roczna (odsetki zarabiają odsetki)',
    interestType: 'Indeksowane inflacją (Najwyższa ochrona)',
    capitalization: 'compound_year',
  }
];

// --- KOMPONENTY POMOCNICZE ---

const Card = ({ children, className = "", selected = false, onClick, isFamily = false }) => (
  <div 
    onClick={onClick}
    className={`
      bg-white rounded-2xl p-5 transition-all duration-300 border relative overflow-hidden group
      ${selected 
        ? (isFamily ? 'border-pink-500 ring-1 ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.15)]' : 'border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-1 ring-blue-600')
        : 'border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300 cursor-pointer'}
      ${className}
    `}
  >
    {isFamily && (
      <div className="absolute top-0 right-0 bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
        800+
      </div>
    )}
    {children}
  </div>
);

const InputGroup = ({ label, value, onChange, type = "number", suffix, min = 0, step = "1" }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        step={step}
        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-semibold rounded-xl p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium select-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const formatMoney = (amount) => {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(amount);
};

const AICard = ({ text, isLoading, onClose, title = "Analiza AI" }) => {
  if (!text && !isLoading) return null;

  return (
    <div className="mt-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onClose} className="absolute top-2 right-2 text-indigo-300 hover:text-indigo-500 p-1">
        <span className="sr-only">Zamknij</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div className="flex gap-3 items-start">
        <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600 shrink-0">
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 text-sm mb-1">{title}</h4>
          <p className="text-indigo-800 text-sm leading-relaxed">
            {isLoading ? "Generuję analizę Twoich finansów..." : text}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- GŁÓWNY KOMPONENT ---

export default function App() {
  // --- STATE ---
  const [compoundPrincipal, setCompoundPrincipal] = useState(10000);
  const [compoundYears, setCompoundYears] = useState(10);
  const [compoundMonths, setCompoundMonths] = useState(0);
  const [compoundRate, setCompoundRate] = useState(5);
  const [compoundFreq, setCompoundFreq] = useState(12);

  const [activeBondType, setActiveBondType] = useState('standard'); 
  const [selectedBondId, setSelectedBondId] = useState('EDO');
  const [bondAmount, setBondAmount] = useState(10000);
  const [earlyExit, setEarlyExit] = useState(false);

  // AI State
  const [compoundAI, setCompoundAI] = useState({ text: "", loading: false });
  const [bondAI, setBondAI] = useState({ text: "", loading: false });

  // --- LOGIKA: Procent Składany ---
  const compoundData = useMemo(() => {
    const data = [];
    const totalMonths = (parseInt(compoundYears) || 0) * 12 + (parseInt(compoundMonths) || 0);
    const r = (parseFloat(compoundRate) || 0) / 100;
    const n = parseInt(compoundFreq); 
    const step = totalMonths > 60 ? 12 : (totalMonths > 24 ? 3 : 1); 

    for (let m = 0; m <= totalMonths; m += step) {
      const t = m / 12; 
      const amount = compoundPrincipal * Math.pow(1 + r/n, n * t);
      data.push({
        name: `Msc ${m}`,
        year: (m/12).toFixed(1),
        kapital: compoundPrincipal,
        zysk: amount - compoundPrincipal,
        razem: amount
      });
    }
    return data;
  }, [compoundPrincipal, compoundYears, compoundMonths, compoundRate, compoundFreq]);

  const finalCompoundAmount = compoundData[compoundData.length - 1]?.razem || compoundPrincipal;
  const totalCompoundProfit = finalCompoundAmount - compoundPrincipal;

  // --- LOGIKA: Obligacje ---
  const bondCalculation = useMemo(() => {
    const allBonds = [...STANDARD_BONDS, ...FAMILY_BONDS];
    const bond = allBonds.find(b => b.id === selectedBondId);
    if (!bond) return null;

    const units = Math.floor(bondAmount / 100); 
    const realInvested = units * 100;
    const years = bond.durationMonths / 12;
    let finalGross = 0;

    if (bond.capitalization === 'end') {
        const periodYears = bond.durationMonths / 12;
        finalGross = realInvested * (1 + (bond.rate/100) * periodYears);
    } else if (bond.capitalization === 'monthly_payout') {
        const totalPayouts = realInvested * (bond.rate/100) * years;
        finalGross = realInvested + totalPayouts;
    } else if (bond.capitalization === 'yearly_payout') {
        const totalPayouts = realInvested * (bond.rate/100) * years;
        finalGross = realInvested + totalPayouts;
    } else if (bond.capitalization === 'compound_year') {
        finalGross = realInvested * Math.pow(1 + bond.rate/100, years);
    }

    let profitGross = finalGross - realInvested;
    
    let fee = 0;
    if (earlyExit) {
        fee = units * bond.earlyExitFee;
        profitGross = Math.max(0, profitGross - fee);
    }

    const tax = Math.max(0, profitGross * 0.19);
    const profitNet = profitGross - tax;
    const finalNet = realInvested + profitNet;

    return {
        invested: realInvested,
        gross: profitGross,
        tax: tax,
        net: profitNet,
        total: finalNet,
        fee: fee,
        bondDetails: bond
    };
  }, [bondAmount, selectedBondId, earlyExit]);

  // --- AI HANDLERS ---

  const handleCompoundAI = async () => {
    if (compoundAI.loading) return;
    setCompoundAI({ text: "", loading: true });

    try {
      const prompt = `
        Jesteś zabawnym i motywującym asystentem finansowym.
        Użytkownik oszczędzał przez ${compoundYears} lat i ${compoundMonths} miesięcy.
        Wpłacił: ${compoundPrincipal} PLN.
        Zarobił na czysto (same odsetki): ${totalCompoundProfit.toFixed(2)} PLN.
        
        Napisz krótkie (max 2 zdania), kreatywne porównanie, co można kupić za ten zysk (${totalCompoundProfit.toFixed(2)} PLN) lub użyj metafory jak bardzo urosły te pieniądze dzięki "magii procentu składanego".
        Bądź konkretny, użyj polskich realiów cenowych (np. cena kawy, weekendu w górach, używanego auta). Pisz do użytkownika "Ty".
      `;
      
      const result = await model.generateContent(prompt);
      setCompoundAI({ text: result.response.text(), loading: false });
    } catch (error) {
      setCompoundAI({ text: "Ups, mój kalkulator wyobraźni się przegrzał. Spróbuj później!", loading: false });
    }
  };

  const handleBondAI = async () => {
    if (bondAI.loading) return;
    setBondAI({ text: "", loading: true });

    try {
      const prompt = `
        Jesteś ekspertem od polskich obligacji skarbowych, który tłumaczy finanse prostym językiem.
        Użytkownik wybrał obligację: ${selectedBondId} (${bondCalculation.bondDetails.name}).
        Kwota inwestycji: ${bondAmount} PLN.
        Szacowany zysk netto (na rękę): ${bondCalculation.net.toFixed(2)} PLN.
        Okres: ${bondCalculation.bondDetails.durationMonths / 12} lat.

        Oceń krótko (max 3 zdania) ten wybór. 
        1. Czy to bezpieczne? (Tak, gwarancja skarbu państwa).
        2. Czy to lepsze niż trzymanie pieniędzy w skarpecie?
        3. Wspomnij o ochronie przed inflacją jeśli to obligacja indeksowana (COI, EDO, ROS, ROD).
      `;

      const result = await model.generateContent(prompt);
      setBondAI({ text: result.response.text(), loading: false });
    } catch (error) {
       setBondAI({ text: "Nie udało mi się połączyć z bazą wiedzy finansowej. Spróbuj ponownie.", loading: false });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <TrendingUp size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Finanse <span className="text-blue-600">Proste</span></h1>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
            <a href="#procent" className="hover:text-blue-600 transition-colors">Procent Składany</a>
            <a href="#edukacja" className="hover:text-blue-600 transition-colors">Edukacja</a>
            <a href="#obligacje" className="hover:text-blue-600 transition-colors">Obligacje</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-24">

        {/* SEKCJA 1: KALKULATOR PROCENTU SKŁADANEGO */}
        <section id="procent" className="scroll-mt-24">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Magia Procentu Składanego</h2>
            <p className="text-slate-600 max-w-2xl text-lg">
              Sprawdź, jak Twoje oszczędności mogą rosnąć same z siebie. Wpisz kwotę, wybierz czas i zobacz efekt "kuli śnieżnej".
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Inputy */}
            <div className="lg:col-span-4 space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
              <InputGroup 
                label="Kwota początkowa" 
                value={compoundPrincipal} 
                onChange={setCompoundPrincipal} 
                suffix="PLN" 
                step="100"
              />
              <div className="grid grid-cols-2 gap-4">
                <InputGroup 
                  label="Lata" 
                  value={compoundYears} 
                  onChange={setCompoundYears} 
                  suffix="lat" 
                />
                <InputGroup 
                  label="Miesiące" 
                  value={compoundMonths} 
                  onChange={setCompoundMonths} 
                  suffix="msc" 
                />
              </div>
              <InputGroup 
                label="Oprocentowanie roczne" 
                value={compoundRate} 
                onChange={setCompoundRate} 
                suffix="%" 
                step="0.1"
              />
              
              {/* NOWOCZESNY SELECT */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kapitalizacja odsetek</label>
                <div className="relative">
                  <select 
                    value={compoundFreq}
                    onChange={(e) => setCompoundFreq(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-semibold rounded-xl p-4 pr-12 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer hover:bg-slate-100"
                  >
                    <option value={365}>Codziennie</option>
                    <option value={12}>Co miesiąc</option>
                    <option value={4}>Co kwartał</option>
                    <option value={1}>Raz w roku</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

            </div>

            {/* Wyniki */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Coins size={100} />
                  </div>
                  <span className="text-slate-400 font-medium mb-1">Wynik końcowy</span>
                  <span className="text-4xl font-bold tracking-tight">{formatMoney(finalCompoundAmount)}</span>
                  <div className="mt-4 text-sm text-slate-400 bg-slate-800/50 w-fit px-3 py-1 rounded-full">
                    Wzrost o {((finalCompoundAmount/compoundPrincipal - 1)*100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-900 p-6 rounded-2xl flex flex-col justify-between border border-blue-100 relative">
                  <div>
                    <span className="text-blue-600 font-medium mb-1">Czysty zysk (Odsetki)</span>
                    <span className="text-4xl font-bold tracking-tight text-blue-600 block">+{formatMoney(totalCompoundProfit)}</span>
                    <div className="mt-4 text-sm text-blue-700">
                      To pieniądze wygenerowane przez czas i procent.
                    </div>
                  </div>
                  
                  {/* AI BUTTON */}
                  <div className="absolute bottom-6 right-6">
                    <button 
                        onClick={handleCompoundAI}
                        disabled={compoundAI.loading}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {compoundAI.loading ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                        {compoundAI.loading ? "Myślę..." : "Co to oznacza w praktyce? ✨"}
                    </button>
                  </div>
                </div>
              </div>

              {/* AI RESULT CARD */}
              <AICard 
                text={compoundAI.text} 
                isLoading={compoundAI.loading} 
                onClose={() => setCompoundAI(p => ({...p, text: ""}))}
                title="Wizualizacja zysku ✨"
              />

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1 min-h-[400px]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600"/>
                  Symulacja wzrostu
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={compoundData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorZysk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorWklad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="year" 
                      stroke="#94a3b8" 
                      tickFormatter={(val) => `${val} lat`} 
                      tickMargin={10}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tickFormatter={(val) => `${val/1000}k`} 
                      fontSize={12}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => formatMoney(value)}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                    <Area type="monotone" dataKey="razem" name="Kapitał z odsetkami" stroke="#2563eb" fillOpacity={1} fill="url(#colorZysk)" strokeWidth={3}/>
                    <Area type="monotone" dataKey="kapital" name="Wpłacony kapitał" stroke="#94a3b8" fillOpacity={1} fill="url(#colorWklad)" strokeWidth={2} strokeDasharray="5 5"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* SEKCJA 2: EDUKACJA - BEZPIECZEŃSTWO */}
        <section id="edukacja" className="grid lg:grid-cols-2 gap-8">
           {/* Karta o Kapitalizacji */}
           <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20"></div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Banknote className="text-blue-400"/>
                Kapitalizacja
              </h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Większość obligacji (jak EDO, ROS) nie wypłaca zysku na konto. Zamiast tego, odsetki są dopisywane do Twojej puli. Dzięki temu w kolejnym roku pracują już większe pieniądze. To właśnie procent składany w praktyce.
              </p>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <div className="flex justify-between text-sm mb-2 text-slate-400">
                  <span>Rok 1</span>
                  <span>Rok 2</span>
                  <span>Rok 3</span>
                </div>
                <div className="h-24 flex items-end gap-2">
                   <div className="flex-1 bg-blue-600/50 rounded-t h-[60%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 bg-slate-800 px-2 py-1 rounded transition-opacity">100zł</span></div>
                   <div className="flex-1 bg-blue-600/70 rounded-t h-[75%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 bg-slate-800 px-2 py-1 rounded transition-opacity">107zł</span></div>
                   <div className="flex-1 bg-blue-600 rounded-t h-[95%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 bg-slate-800 px-2 py-1 rounded transition-opacity">115zł</span></div>
                </div>
                <div className="text-center text-xs text-blue-300 mt-2">Kula śnieżna rośnie</div>
              </div>
           </div>

           {/* Karta o Bezpieczeństwie */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900">
                <ShieldCheck className="text-green-600"/>
                Dlaczego to bezpieczne?
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Obligacje Skarbowe to dług, który Państwo Polskie zaciąga u Ciebie. Są uznawane za najbezpieczniejszą formę oszczędzania w kraju.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <div className="bg-green-100 p-2 rounded-lg text-green-700 mt-1 shrink-0"><Landmark size={18}/></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Gwarancja Państwa</h4>
                    <p className="text-sm text-slate-500">Państwo odpowiada za dług całym swoim majątkiem. Bank może upaść (BFG chroni tylko do 100 tys. EUR), państwo - w teorii - jest wieczne.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="bg-green-100 p-2 rounded-lg text-green-700 mt-1 shrink-0"><AlertTriangle size={18}/></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Ochrona przed inflacją</h4>
                    <p className="text-sm text-slate-500">Obligacje 4, 10-letnie oraz rodzinne (6, 12) są indeksowane inflacją. Jeśli inflacja rośnie, Twoje oprocentowanie też rośnie w kolejnych latach.</p>
                  </div>
                </li>
              </ul>
           </div>
        </section>

        {/* SEKCJA 3: OBLIGACJE SKARBOWE */}
        <section id="obligacje" className="scroll-mt-24">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={40}/>
              Kalkulator Obligacji
            </h2>
            <p className="text-slate-600 max-w-2xl text-lg">
              Wybierz rodzaj obligacji, aby zobaczyć szczegóły. Dla beneficjentów 800+ dostępne są specjalne obligacje rodzinne z wyższym zyskiem.
            </p>
          </div>

          {/* Wybór kategorii obligacji */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setActiveBondType('standard')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${activeBondType === 'standard' ? 'bg-slate-900 text-white shadow-lg scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
            >
              Oferta Standardowa
            </button>
            <button 
              onClick={() => setActiveBondType('family')}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeBondType === 'family' ? 'bg-pink-600 text-white shadow-lg shadow-pink-200 scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
            >
              <Baby size={20}/>
              Obligacje Rodzinne (800+)
            </button>
          </div>

          {/* Opis dla rodzinnych */}
          {activeBondType === 'family' && (
             <div className="mb-8 bg-pink-50 border border-pink-100 p-6 rounded-2xl flex gap-4 items-start">
                <div className="bg-pink-200 p-2 rounded-full text-pink-700 shrink-0"><Info size={20}/></div>
                <div>
                  <h4 className="font-bold text-pink-900 mb-1">Tylko dla beneficjentów 800+</h4>
                  <p className="text-sm text-pink-800">
                    Te obligacje (ROS, ROD) mają wyższe oprocentowanie niż standardowe, ale możesz je kupić tylko do wysokości przyznanego świadczenia wychowawczego.
                  </p>
                </div>
             </div>
          )}

          {/* Karty */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {(activeBondType === 'standard' ? STANDARD_BONDS : FAMILY_BONDS).map(bond => (
              <Card 
                key={bond.id} 
                isFamily={activeBondType === 'family'}
                selected={selectedBondId === bond.id}
                onClick={() => setSelectedBondId(bond.id)}
                className="flex flex-col h-full hover:-translate-y-1 transition-transform"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-black text-2xl text-slate-900">{bond.id}</span>
                  {selectedBondId === bond.id && <div className={`w-3 h-3 rounded-full animate-pulse ${activeBondType === 'family' ? 'bg-pink-500' : 'bg-blue-600'}`}></div>}
                </div>
                <div className="flex-grow">
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{bond.desc}</p>
                  
                  <div className="space-y-2 mb-4">
                     <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Jak działa zysk?</div>
                     <div className="text-xs bg-slate-50 p-2 rounded border border-slate-100 text-slate-700 font-medium">
                        {bond.interestType}
                     </div>
                     <div className="text-xs bg-slate-50 p-2 rounded border border-slate-100 text-slate-700 font-medium">
                        {bond.capitalizationDesc}
                     </div>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{bond.rate.toFixed(2)}%</div>
                  <div className="text-xs text-slate-400 font-medium">
                    {bond.durationMonths < 12 ? `${bond.durationMonths} mies.` : `${bond.durationMonths/12} lat(a)`}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Kalkulator */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              
              {/* Panel sterowania */}
              <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold mb-8">Parametry Twojej Inwestycji</h3>
                <div className="space-y-8">
                  <InputGroup 
                    label="Kwota inwestycji" 
                    value={bondAmount} 
                    onChange={setBondAmount} 
                    suffix="PLN" 
                    step="100" 
                    min="100"
                  />
                  <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative flex items-center pt-1">
                        <input 
                          type="checkbox" 
                          checked={earlyExit}
                          onChange={(e) => setEarlyExit(e.target.checked)}
                          className="w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="block font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">Wcześniejszy wykup?</span>
                        <span className="text-sm text-slate-500 mt-1 block">
                          Zaznacz, jeśli planujesz wypłacić pieniądze przed końcem {bondCalculation?.bondDetails.durationMonths / 12} lat. 
                          Opłata (sankcja) wyniesie {bondCalculation?.bondDetails.earlyExitFee.toFixed(2)} zł od sztuki.
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-800 flex gap-3 items-start">
                    <Info className="shrink-0 mt-0.5" size={18}/>
                    <p>
                        Pamiętaj: dla obligacji indeksowanych inflacją (COI, EDO, ROS, ROD) oprocentowanie w kolejnych latach będzie inne (zależne od inflacji). Ten kalkulator zakłada stały poziom dla uproszczenia.
                    </p>
                  </div>
                </div>
              </div>

              {/* Wyniki */}
              <div className="p-8 md:p-12 flex flex-col justify-center bg-white relative">
                {bondCalculation && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Podsumowanie dla {bondCalculation.bondDetails.id}</h4>
                        
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-slate-600">Typ kapitalizacji</span>
                            <span className="font-medium text-right text-sm">{bondCalculation.bondDetails.capitalizationDesc}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-slate-600">Zysk Brutto</span>
                            <span className="font-medium text-slate-900">{formatMoney(bondCalculation.gross)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50 text-red-500">
                            <span className="">Podatek Belki (19%)</span>
                            <span className="font-medium">-{formatMoney(bondCalculation.tax)}</span>
                        </div>
                        {bondCalculation.fee > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-slate-50 text-orange-500">
                                <span className="">Opłata za wcześniejszy wykup</span>
                                <span className="font-medium">-{formatMoney(bondCalculation.fee)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-4">
                            <span className="text-xl font-bold text-slate-900">Zysk Netto ("na rękę")</span>
                            <span className="text-3xl font-black text-green-600">+{formatMoney(bondCalculation.net)}</span>
                        </div>

                         {/* AI BUTTON & RESULT */}
                         <div className="mt-4">
                            <button 
                                onClick={handleBondAI}
                                disabled={bondAI.loading}
                                className="w-full flex justify-center items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all disabled:opacity-50"
                            >
                                {bondAI.loading ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                                {bondAI.loading ? "Analizuję..." : "Opinia eksperta AI o tej obligacji ✨"}
                            </button>
                            <AICard 
                                text={bondAI.text} 
                                isLoading={bondAI.loading} 
                                onClose={() => setBondAI(p => ({...p, text: ""}))}
                                title="Opinia Eksperta AI ✨"
                            />
                        </div>

                    </div>

                    <div className="h-48 mt-4">
                       <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Wpłata', value: bondCalculation.invested, fill: '#cbd5e1' },
                          { name: 'Netto', value: bondCalculation.net, fill: '#16a34a' },
                          { name: 'Podatek', value: bondCalculation.tax, fill: '#f87171' },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tickMargin={5}/>
                          <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(value) => formatMoney(value)}/>
                          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          
          <div className="flex justify-center">
            <a 
              href="https://www.obligacjeskarbowe.pl/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50"
            >
              Oficjalna strona Obligacji Skarbowych <ExternalLink size={16} />
            </a>
          </div>

          <div className="h-px bg-slate-800 w-full max-w-xs mx-auto"></div>

          <div className="space-y-4">
            <div className="flex justify-center">
               <AlertTriangle className="text-yellow-500/80" size={24} />
            </div>
            <p className="text-lg text-white font-medium">To nie jest porada inwestycyjna</p>
            <p className="text-sm leading-relaxed text-slate-500 max-w-2xl mx-auto">
              Przedstawione kalkulacje mają charakter wyłącznie edukacyjny i poglądowy. Wartości historyczne nie gwarantują zysków w przyszłości. 
              Rzeczywisty zysk z obligacji indeksowanych inflacją (COI, EDO, ROS, ROD) będzie zależał od przyszłych odczytów inflacji GUS.
              Przed podjęciem decyzji finansowej zapoznaj się z listem emisyjnym na stronie emitenta.
            </p>
          </div>
          
          <p className="text-xs pt-8 text-slate-600">&copy; 2024 Finanse Proste. Stworzono dla celów edukacyjnych.</p>
        </div>
      </footer>

    </div>
  );
}
