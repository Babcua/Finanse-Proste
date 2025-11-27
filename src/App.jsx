import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Info, Banknote, ShieldCheck, Coins, AlertTriangle, Baby, Landmark, ChevronDown, ExternalLink, Sparkles, Loader2, ArrowRight,
  Briefcase, FileSignature, PenTool, Wallet, HelpCircle, Users, PiggyBank, Home, ArrowUpRight, Lock, CheckCircle, XCircle, Shuffle, School, ChevronUp, BookOpen, Scale, Umbrella
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- KONFIGURACJA API GEMINI ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

// --- DANE I KONFIGURACJA ---

const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

const INFLATION_DATA = [
  { year: '2018', value: 1.6 },
  { year: '2019', value: 2.3 },
  { year: '2020', value: 3.4 },
  { year: '2021', value: 5.1 },
  { year: '2022', value: 14.4 },
  { year: '2023', value: 11.4 },
  { year: '2024', value: 5.0 }, 
];

const STANDARD_BONDS = [
  {
    id: 'OTS',
    name: 'OTS (3-miesięczne)',
    desc: 'Krótka lokata na 3 miesiące ze stałym zyskiem. Idealna na przeczekanie.',
    rate: 2.75,
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
    rate: 4.50, 
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
    rate: 4.65,
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
    rate: 4.90,
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
    rate: 5.25, 
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
    rate: 5.75, 
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
    rate: 5.45, 
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
    rate: 6.00, 
    durationMonths: 144,
    earlyExitFee: 2.00,
    type: 'indexed',
    capitalizationDesc: 'Kapitalizacja roczna (odsetki zarabiają odsetki)',
    interestType: 'Indeksowane inflacją (Najwyższa ochrona)',
    capitalization: 'compound_year',
  }
];

// --- LOGIKA KALKULATORA WYNAGRODZEŃ (ROCZNA) ---

const calculateYearlySalary = (brutto, type, params) => {
  const amount = parseFloat(brutto) || 0;
  
  // Parametry podatkowe 2024/2025
  const THRESHOLD_TAX = 120000;
  const LIMIT_ZUS_30 = 234720; 
  const KUP_STANDARD = 250;
  const KUP_ELEVATED = 300;
  const TAX_FREE_REDUCTION = 300; 

  let accumulatedTaxBase = 0;
  let accumulatedRetirementBase = 0;
  
  const yearlyBreakdown = [];

  for (let i = 0; i < 12; i++) {
    let currentBrutto = amount;
    let zusSocial = 0;
    let zusHealth = 0;
    let tax = 0;
    let ppk = 0;
    let ppkEmployer = 0;
    
    const isZusCapped = accumulatedRetirementBase >= LIMIT_ZUS_30;
    
    let zusRate = 0.1371; // E+R+Ch
    
    if (type === 'uop') {
        let baseForZus = currentBrutto;
        
        if (isZusCapped) {
            zusRate = 0.0245; // Tylko chorobowe
        }
        
        zusSocial = baseForZus * zusRate;
        accumulatedRetirementBase += baseForZus; 

        const baseForHealth = currentBrutto - zusSocial;
        zusHealth = baseForHealth * 0.09;

        // Koszty uzyskania
        const kup = params.workWhereLive ? KUP_STANDARD : KUP_ELEVATED;
        const taxBase = Math.max(0, currentBrutto - zusSocial - kup);
        
        // Podatek z progresją
        let calculatedTax = 0;
        
        if (accumulatedTaxBase > THRESHOLD_TAX) {
            calculatedTax = taxBase * 0.32;
        } else if (accumulatedTaxBase + taxBase > THRESHOLD_TAX) {
            const inFirstBracket = THRESHOLD_TAX - accumulatedTaxBase;
            const inSecondBracket = taxBase - inFirstBracket;
            calculatedTax = (inFirstBracket * 0.12) + (inSecondBracket * 0.32);
        } else {
            calculatedTax = taxBase * 0.12;
        }
        
        if (accumulatedTaxBase < THRESHOLD_TAX) { 
            calculatedTax -= TAX_FREE_REDUCTION;
        }

        if (params.under26 && accumulatedTaxBase < 85528) {
            calculatedTax = 0;
        }
        
        tax = Math.max(0, Math.round(calculatedTax));
        accumulatedTaxBase += taxBase;

        // PPK (Dynamiczna stawka)
        if (params.ppk) {
            ppk = currentBrutto * (params.ppkRate / 100); // Pracownik
            ppkEmployer = currentBrutto * 0.015; // Pracodawca (stałe 1.5% w standardzie)
            tax += (ppkEmployer * 0.12); 
        }

        const netto = currentBrutto - zusSocial - zusHealth - tax - ppk;
        
        yearlyBreakdown.push({
            month: MONTHS[i],
            netto: netto,
            gross: currentBrutto,
            tax: tax,
            zus: zusSocial + zusHealth,
            ppk: ppk,
            thresholdCrossed: accumulatedTaxBase > THRESHOLD_TAX && (accumulatedTaxBase - taxBase) <= THRESHOLD_TAX
        });

    } else {
        const singleMonth = calculateSingleMonth(amount, type, params);
        yearlyBreakdown.push({
             month: MONTHS[i],
             ...singleMonth,
             thresholdCrossed: false
        });
    }
  }
  
  return yearlyBreakdown;
};

// Helper dla UZ/UoD
const calculateSingleMonth = (amount, type, params) => {
    let netto = 0, tax = 0, zus = 0, ppk = 0;
    const HEALTH_RATE = 0.09;
    
    if (type === 'uz') {
        if (params.under26 && params.student) {
            netto = amount;
        } else {
            const zusSocial = amount * 0.1126; // E+R
            const baseHealth = amount - zusSocial;
            const zusHealth = baseHealth * HEALTH_RATE;
            zus = zusSocial + zusHealth;
            
            const kup = (amount - zusSocial) * 0.20;
            const taxBase = Math.round(amount - zusSocial - kup);
            let cTax = (taxBase * 0.12) - 300;
            if (params.under26) cTax = 0;
            tax = Math.max(0, cTax);
            netto = amount - zus - tax;
        }
    } else if (type === 'uod') {
        const kup = amount * 0.20;
        const taxBase = Math.round(amount - kup);
        tax = Math.max(0, taxBase * 0.12);
        netto = amount - tax;
    }
    return { netto, tax, zus, ppk };
};


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

const InputGroup = ({ label, value, onChange, type = "number", suffix, min = 0, max, step = "1", disabled=false }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-semibold rounded-xl p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium select-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const CheckboxGroup = ({ label, checked, onChange, icon: Icon, description, children }) => (
  <div 
    className={`
      flex flex-col gap-2 p-4 rounded-xl border transition-all
      ${checked ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:border-slate-200'}
    `}
  >
    <div 
        className="flex items-start gap-4 cursor-pointer"
        onClick={() => onChange(!checked)}
    >
        <div className={`
        w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors
        ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}
        `}>
        {checked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon size={16} className={checked ? 'text-blue-600' : 'text-slate-400'} />}
                <span className={`font-semibold text-sm ${checked ? 'text-blue-900' : 'text-slate-700'}`}>{label}</span>
            </div>
            {description && <p className="text-xs text-slate-500 leading-relaxed">{description}</p>}
        </div>
    </div>
    {/* Renderowanie dzieci (np. suwaków) tylko gdy checkbox jest zaznaczony */}
    {checked && children && (
        <div className="pl-12 pt-2 animate-in fade-in slide-in-from-top-1">
            {children}
        </div>
    )}
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
            {isLoading ? "Generuję analizę..." : text}
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
  const [exitMonth, setExitMonth] = useState(12);

  // SALARY STATE
  const [salaryBrutto, setSalaryBrutto] = useState(8000);
  const [contractType, setContractType] = useState('uop'); 
  const [salaryParams, setSalaryParams] = useState({
    under26: false,
    ppk: true,
    ppkRate: 2.0, // Domyślna stawka PPK
    workWhereLive: true,
    student: false
  });
  const [showYearlyDetails, setShowYearlyDetails] = useState(false);

  // AI State
  const [compoundAI, setCompoundAI] = useState({ text: "", loading: false });
  const [bondAI, setBondAI] = useState({ text: "", loading: false });

  // Reset exit month when bond changes
  useEffect(() => {
    const allBonds = [...STANDARD_BONDS, ...FAMILY_BONDS];
    const bond = allBonds.find(b => b.id === selectedBondId);
    if (bond) {
      if (exitMonth > bond.durationMonths) {
          setExitMonth(Math.floor(bond.durationMonths / 2));
      }
    }
  }, [selectedBondId]);

  // --- LOGIKA: Wynagrodzenia (ROCZNA) ---
  const salaryYearlyData = useMemo(() => {
    return calculateYearlySalary(salaryBrutto, contractType, salaryParams);
  }, [salaryBrutto, contractType, salaryParams]);

  const currentMonthNetto = salaryYearlyData[0].netto; 

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
    
    let monthsDuration = bond.durationMonths;
    if (earlyExit && exitMonth < bond.durationMonths && exitMonth > 0) {
        monthsDuration = parseInt(exitMonth);
    }
    
    const years = monthsDuration / 12;
    let accumulatedInterest = 0;
    
    if (bond.capitalization === 'monthly_payout') {
        accumulatedInterest = realInvested * (bond.rate/100) * years;
    } else if (bond.capitalization === 'yearly_payout' || bond.capitalization === 'end') {
        accumulatedInterest = realInvested * (bond.rate/100) * years;
    } else if (bond.capitalization === 'compound_year') {
        accumulatedInterest = (realInvested * Math.pow(1 + bond.rate/100, years)) - realInvested;
    }

    let profitGross = accumulatedInterest;
    let fee = 0;

    if (earlyExit && monthsDuration < bond.durationMonths) {
        fee = units * bond.earlyExitFee;
        profitGross = accumulatedInterest - fee;
    }

    const taxBase = Math.max(0, profitGross); 
    const tax = Number((taxBase * 0.19).toFixed(2));
    const profitNet = profitGross - tax; 
    const finalReturn = realInvested + profitNet;

    return {
      invested: realInvested,
      gross: profitGross,
      interestOnly: accumulatedInterest,
      tax: tax,
      net: profitNet,
      total: finalReturn,
      fee: fee,
      bondDetails: bond,
      isLoss: profitNet < 0,
      actualMonths: monthsDuration
    };
  }, [bondAmount, selectedBondId, earlyExit, exitMonth]);

  // --- AI HANDLERS ---
  const handleCompoundAI = async () => {
    if (compoundAI.loading) return;
    setCompoundAI({ text: "", loading: true });
    try {
      const prompt = `Jesteś zabawnym i motywującym asystentem finansowym. Użytkownik oszczędzał przez ${compoundYears} lat i ${compoundMonths} miesięcy. Wpłacił: ${compoundPrincipal} PLN. Zarobił na czysto: ${totalCompoundProfit.toFixed(2)} PLN. Napisz kreatywne porównanie, co można kupić za ten zysk.`;
      const result = await model.generateContent(prompt);
      setCompoundAI({ text: result.response.text(), loading: false });
    } catch (error) {
      setCompoundAI({ text: "Ups, mój kalkulator wyobraźni się przegrzał.", loading: false });
    }
  };

  const handleBondAI = async () => {
    if (bondAI.loading) return;
    setBondAI({ text: "", loading: true });
    try {
      const prompt = `Jesteś ekspertem od obligacji. Wybrano obligację: ${selectedBondId}. Kwota: ${bondAmount} PLN. Zysk netto: ${bondCalculation.net.toFixed(2)} PLN. Oceń krótko ten wybór.`;
      const result = await model.generateContent(prompt);
      setBondAI({ text: result.response.text(), loading: false });
    } catch (error) {
       setBondAI({ text: "Błąd połączenia.", loading: false });
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
            <a href="#wynagrodzenia" className="hover:text-blue-600 transition-colors">Kalkulator Wynagrodzeń</a>
            <a href="#ppk" className="hover:text-blue-600 transition-colors">PPK</a>
            <a href="#ike-ikze" className="hover:text-blue-600 transition-colors">IKE / IKZE</a>
            <a href="#procent" className="hover:text-blue-600 transition-colors">Kalkulator Procenta</a>
            <a href="#obligacje" className="hover:text-blue-600 transition-colors">Obligacje</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-24">

        {/* NOWA SEKCJA: KALKULATOR WYNAGRODZEŃ */}
        <section id="wynagrodzenia" className="scroll-mt-24">
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                    <Wallet className="text-green-600" size={36}/>
                    Kalkulator Wynagrodzeń
                </h2>
                <p className="text-slate-600 max-w-2xl text-lg">
                    Sprawdź ile dostaniesz "na rękę" (netto) ze swojej pensji brutto. Zrozum, co zjadają podatki i dlaczego rodzaj umowy ma znaczenie.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* LEWA KOLUMNA - INPUTY */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Wybór Umowy */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2 p-1">
                        <button 
                            onClick={() => setContractType('uop')}
                            className={`flex-1 flex items-center justify-start gap-3 py-3 px-4 rounded-xl font-bold text-sm transition-all ${contractType === 'uop' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Briefcase size={18}/> Umowa o Pracę
                        </button>
                        <button 
                            onClick={() => setContractType('uz')}
                            className={`flex-1 flex items-center justify-start gap-3 py-3 px-4 rounded-xl font-bold text-sm transition-all ${contractType === 'uz' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <FileSignature size={18}/> Umowa Zlecenie
                        </button>
                        <button 
                            onClick={() => setContractType('uod')}
                            className={`flex-1 flex items-center justify-start gap-3 py-3 px-4 rounded-xl font-bold text-sm transition-all ${contractType === 'uod' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <PenTool size={18}/> Umowa o Dzieło
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                        <InputGroup 
                            label="Twoje wynagrodzenie Brutto (na umowie)"
                            value={salaryBrutto}
                            onChange={setSalaryBrutto}
                            suffix="PLN"
                            step="100"
                        />
                        
                        <div className="flex flex-col gap-4">
                            {/* Checkboxy zależne od umowy */}
                            {contractType === 'uop' && (
                                <>
                                    <CheckboxGroup 
                                        label="Praca w miejscu zamieszkania"
                                        description="Jeśli pracujesz w miejscowości, w której mieszkasz, KUP wynosi 250 zł. Jeśli dojeżdżasz, KUP wynosi 300 zł. Wyższe koszty (300 zł) oznaczają niższą podstawę opodatkowania i nieco wyższą pensję netto."
                                        checked={salaryParams.workWhereLive}
                                        onChange={(v) => setSalaryParams({...salaryParams, workWhereLive: v})}
                                        icon={Home}
                                    />
                                    <CheckboxGroup 
                                        label="Uczestnictwo w PPK"
                                        description="Pracownicze Plany Kapitałowe. Oszczędzasz wspólnie z pracodawcą i państwem."
                                        checked={salaryParams.ppk}
                                        onChange={(v) => setSalaryParams({...salaryParams, ppk: v})}
                                        icon={PiggyBank}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                                <span>Twoja wpłata: {salaryParams.ppkRate}%</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0.5" 
                                                max="4.0" 
                                                step="0.5" 
                                                value={salaryParams.ppkRate}
                                                onChange={(e) => setSalaryParams({...salaryParams, ppkRate: parseFloat(e.target.value)})}
                                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-400">
                                                <span>0.5%</span>
                                                <span>Standard: 2%</span>
                                                <span>4.0%</span>
                                            </div>
                                        </div>
                                    </CheckboxGroup>
                                </>
                            )}
                            
                            <CheckboxGroup 
                                label="Wiek poniżej 26 lat"
                                description="Zerowy PIT do 85 528 zł rocznie."
                                checked={salaryParams.under26}
                                onChange={(v) => setSalaryParams({...salaryParams, under26: v})}
                                icon={Baby}
                            />

                             {contractType === 'uz' && salaryParams.under26 && (
                                <CheckboxGroup 
                                    label="Status studenta/ucznia"
                                    description="Brutto = Netto (brak ZUS i PIT)."
                                    checked={salaryParams.student}
                                    onChange={(v) => setSalaryParams({...salaryParams, student: v})}
                                    icon={School}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* PRAWA KOLUMNA - WYNIKI ROCZNE (TABELA) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col">
                         <div className="mb-6 flex justify-between items-end">
                            <div>
                                <h4 className="font-bold text-slate-900 text-xl">Twoja wypłata</h4>
                                <p className="text-slate-500 text-sm mt-1">Tak wygląda Twoje miesięczne wynagrodzenie netto.</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-slate-400 uppercase">Średnie Netto</span>
                                <div className="text-3xl font-bold text-green-600">
                                    {formatMoney(salaryYearlyData.reduce((acc, curr) => acc + curr.netto, 0) / 12)}
                                </div>
                            </div>
                         </div>

                         {/* ZWIEZLY WIDOK */}
                         <div className="bg-green-50 p-6 rounded-2xl border border-green-100 mb-6 flex justify-between items-center">
                            <div>
                                <div className="text-sm text-green-800 font-bold mb-1">Miesięcznie na rękę</div>
                                <div className="text-4xl font-black text-green-700">{formatMoney(currentMonthNetto)}</div>
                            </div>
                            <div className="hidden sm:block text-right text-xs text-green-800/70">
                                Kwota dla Stycznia.<br/>Zobacz symulację roczną poniżej.
                            </div>
                         </div>

                         {/* ROZWIJANA TABELA */}
                         <div className="border-t border-slate-100 pt-4 mt-auto">
                            <button 
                                onClick={() => setShowYearlyDetails(!showYearlyDetails)}
                                className="flex items-center justify-between w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors font-bold text-slate-700 text-sm"
                            >
                                <span className="flex items-center gap-2">
                                    <BookOpen size={18} className="text-blue-600"/>
                                    Symulacja roczna (Styczeń - Grudzień)
                                </span>
                                {showYearlyDetails ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                            </button>

                            {showYearlyDetails && (
                                <div className="overflow-x-auto mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-3 rounded-l-lg">Miesiąc</th>
                                                <th className="px-4 py-3 text-green-700 font-bold">Netto</th>
                                                <th className="px-4 py-3">Podatek</th>
                                                <th className="px-4 py-3">ZUS</th>
                                                {salaryParams.ppk && contractType === 'uop' && <th className="px-4 py-3 rounded-r-lg">PPK (Ty)</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {salaryYearlyData.map((row, index) => (
                                                <tr key={index} className={`hover:bg-blue-50/50 transition-colors ${row.thresholdCrossed ? 'bg-amber-50' : ''}`}>
                                                    <td className="px-4 py-3 font-medium text-slate-700 flex items-center gap-2">
                                                        {row.month}
                                                        {row.thresholdCrossed && (
                                                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold border border-amber-200" title="Przekroczono próg podatkowy">
                                                                II PRÓG
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className={`px-4 py-3 font-bold ${row.thresholdCrossed ? 'text-amber-600' : 'text-green-600'}`}>
                                                        {formatMoney(row.netto)}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500">{formatMoney(row.tax)}</td>
                                                    <td className="px-4 py-3 text-slate-500">{formatMoney(row.zus)}</td>
                                                    {salaryParams.ppk && contractType === 'uop' && <td className="px-4 py-3 text-blue-600 font-medium">-{formatMoney(row.ppk)}</td>}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            </div>

            {/* SEKCJA EDUKACYJNA: PROGI I MINIMALNA */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 mt-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white p-2 rounded-lg text-indigo-600 shadow-sm"><Info size={24}/></div>
                    <h3 className="text-xl font-bold text-indigo-900">Warto wiedzieć: Twoje pieniądze a prawo</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Minimalna */}
                    <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <ArrowRight size={18} className="text-indigo-500"/> Płaca Minimalna
                        </h4>
                        <div className="text-3xl font-black text-indigo-600 mb-2">4 300 zł</div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Tyle wynosi minimalne wynagrodzenie brutto od 1 lipca 2024 roku. Jeśli pracujesz na pełen etat na Umowę o Pracę, pracodawca nie może zapłacić Ci mniej. To Twoja gwarancja socjalna.
                        </p>
                    </div>

                    {/* Progi */}
                    <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <ArrowRight size={18} className="text-red-500"/> Drugi Próg Podatkowy
                        </h4>
                        <div className="text-3xl font-black text-red-500 mb-2">120 000 zł</div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            To limit dochodów rocznych. Dopóki Twoje zarobki (liczone narastająco od stycznia) nie przekroczą tej kwoty, płacisz 12% podatku. 
                            <br/><br/>
                            <strong>Co się dzieje po przekroczeniu?</strong> <br/>
                            Od nadwyżki powyżej 120 tys. zł zapłacisz aż <strong>32% podatku</strong>. Dlatego osoby dobrze zarabiające pod koniec roku często dostają niższe przelewy "na rękę". Nasz kalkulator uwzględnia ten moment w symulacji rocznej.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* NOWA SEKCJA EDUKACYJNA O PPK (Zmieniony styl) */}
        <section id="ppk" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 relative overflow-hidden scroll-mt-24">
            
            <div className="relative z-10">
                <div className="max-w-3xl mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                            <PiggyBank size={24}/>
                        </div>
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Edukacja Finansowa</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-slate-900">
                        Jak działa PPK?
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Pracownicze Plany Kapitałowe to prosty system oszczędzania. Ty odkładasz małą część pensji, a pracodawca i państwo dokładają resztę. Pieniądze są Twoją prywatną własnością.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {/* Karta 1 */}
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-4 border border-slate-100">
                            <Users size={24}/>
                        </div>
                        <h3 className="font-bold text-xl mb-4 text-slate-900">Kto wpłaca?</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-600">Twoja wpłata</span>
                                <span className="font-bold text-slate-900">2.0%</span>
                            </li>
                            <li className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-600">Szef dorzuca</span>
                                <span className="font-bold text-green-600">+1.5%</span>
                            </li>
                            <li className="text-xs text-slate-500 pt-1">
                                To darmowa podwyżka. Pieniądze od pracodawcy trafiają prosto na Twoje konto PPK.
                            </li>
                        </ul>
                    </div>

                    {/* Karta 2 */}
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-4 border border-slate-100">
                            <Landmark size={24}/>
                        </div>
                        <h3 className="font-bold text-xl mb-4 text-slate-900">Bonusy od Państwa</h3>
                        <ul className="space-y-3 text-sm">
                             <li className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-600">Na start</span>
                                <span className="font-bold text-blue-600">250 zł</span>
                            </li>
                             <li className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-600">Co roku</span>
                                <span className="font-bold text-blue-600">240 zł</span>
                            </li>
                            <li className="text-xs text-slate-500 pt-1">
                                Państwo nagradza Cię za regularne oszczędzanie. Te kwoty są wolne od podatku.
                            </li>
                        </ul>
                    </div>

                    {/* Karta 3 */}
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-4 border border-slate-100">
                            <Lock size={24}/>
                        </div>
                        <h3 className="font-bold text-xl mb-4 text-slate-900">Twoje Zasady</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            Środki są w 100% prywatne i dziedziczone - tak jak pieniądze w banku.
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Możesz wypłacić pieniądze w każdej chwili (tzw. zwrot), choć najbardziej opłaca się poczekać do 60. roku życia, by zachować wszystkie bonusy.
                        </p>
                    </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4 items-start">
                    <Info className="text-blue-600 shrink-0 mt-1" />
                    <p className="text-sm text-blue-800 leading-relaxed">
                        Pamiętaj: System jest domyślny (autozapis), ale dobrowolny. W każdej chwili możesz zrezygnować lub wrócić do oszczędzania, składając prosty wniosek u swojego pracodawcy.
                    </p>
                </div>
            </div>
        </section>

        {/* NOWA SEKCJA: IKE / IKZE */}
        <section id="ike-ikze" className="scroll-mt-24">
            <div className="mb-12 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm mb-4 border border-indigo-100">
                    <Umbrella size={16}/> Emerytalna Tarcza Podatkowa
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">IKE oraz IKZE</h2>
                <p className="text-slate-600 text-lg">
                    To nie są produkty inwestycyjne. To "walizki podatkowe".<br/> 
                    Ty wybierasz, co włożysz do środka (akcje, obligacje, lokaty), a państwo daje Ci zwolnienia z podatków.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
                
                {/* IKE */}
                <div className="bg-white border-2 border-indigo-50 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group hover:border-indigo-100 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>
                    
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <ShieldCheck size={32}/>
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl text-slate-900">IKE</h3>
                            <p className="text-sm text-indigo-600 font-medium">Indywidualne Konto Emerytalne</p>
                        </div>
                    </div>

                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Idealne, jeśli chcesz uniknąć podatku od zysków (podatek Belki 19%) przy wypłacie w przyszłości. Wpłacasz pieniądze już opodatkowane (z pensji), ale cały zysk jest dla Ciebie.
                    </p>

                    <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-start gap-3">
                            <div className="mt-1"><CheckCircle className="text-green-500" size={18}/></div>
                            <div>
                                <span className="block font-bold text-slate-900 text-sm">Brak Podatku Belki</span>
                                <span className="text-xs text-slate-500">Przy wypłacie po 60 r.ż. nie oddajesz państwu ani grosza z zysków.</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1"><CheckCircle className="text-green-500" size={18}/></div>
                            <div>
                                <span className="block font-bold text-slate-900 text-sm">Elastyczna wypłata</span>
                                <span className="text-xs text-slate-500">Możesz wypłacić część lub całość wcześniej (tracisz wtedy ulgę i płacisz zwykły podatek).</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-6">
                        <span className="text-slate-500">Limit wpłat (2024):</span>
                        <span className="font-bold text-indigo-900 text-lg">23 472 zł</span>
                    </div>
                </div>

                {/* IKZE */}
                <div className="bg-white border-2 border-blue-50 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group hover:border-blue-100 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>
                    
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                            <Scale size={32}/>
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl text-slate-900">IKZE</h3>
                            <p className="text-sm text-blue-600 font-medium">Indywidualne Konto Zabezpieczenia Emerytalnego</p>
                        </div>
                    </div>

                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Działa jak "tarcza" na Twoje obecne podatki. To co wpłacisz na IKZE, odliczasz od swojego dochodu w PIT. Dostajesz realny zwrot gotówki od Urzędu Skarbowego co roku.
                    </p>

                    <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-start gap-3">
                            <div className="mt-1"><CheckCircle className="text-green-500" size={18}/></div>
                            <div>
                                <span className="block font-bold text-slate-900 text-sm">Zwrot podatku TERAZ</span>
                                <span className="text-xs text-slate-500">Wpłacasz 9000 zł? Jeśli jesteś w II progu (32%), Urząd odda Ci prawie 3000 zł!</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1"><AlertTriangle className="text-amber-500" size={18}/></div>
                            <div>
                                <span className="block font-bold text-slate-900 text-sm">Podatek na koniec</span>
                                <span className="text-xs text-slate-500">Przy wypłacie po 65 r.ż. płacisz zryczałtowany podatek 10% od całości.</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-6">
                        <span className="text-slate-500">Limit wpłat (2024):</span>
                        <span className="font-bold text-blue-900 text-lg">9 388 zł <span className="text-xs font-normal text-slate-400">(więcej dla firm)</span></span>
                    </div>
                </div>
            </div>

            {/* Sekcja edukacyjna: Co w środku? */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <h3 className="text-3xl font-bold mb-4">Co można włożyć do "walizki"?</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            IKE i IKZE zakładasz w konkretnej instytucji. Od tego zależy, co będzie w środku. Nie musisz być ekspertem giełdowym – są też opcje bezpieczne.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="bg-green-500/10 p-2 rounded-lg text-green-400"><Banknote size={20}/></div>
                                <div>
                                    <div className="font-bold">Konto Oszczędnościowe / Lokata</div>
                                    <div className="text-xs text-slate-500">Najbezpieczniej. Zakładasz w Banku.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400"><ShieldCheck size={20}/></div>
                                <div>
                                    <div className="font-bold">Obligacje Skarbowe (IKE)</div>
                                    <div className="text-xs text-slate-500">Tylko w PKO BP (Biuro Maklerskie). Super bezpieczne.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400"><TrendingUp size={20}/></div>
                                <div>
                                    <div className="font-bold">Fundusze / Akcje (ETF)</div>
                                    <div className="text-xs text-slate-500">Większy potencjał zysku, ale też ryzyko. Zakładasz w biurze maklerskim.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl text-center">
                        <div className="inline-block bg-white/20 p-4 rounded-full mb-6 backdrop-blur-sm">
                            <Sparkles size={32} className="text-white"/>
                        </div>
                        <h4 className="text-2xl font-bold mb-2">Ciekawostka</h4>
                        <p className="text-indigo-100 mb-6 text-sm">
                            Możesz mieć JEDNO IKE i JEDNO IKZE jednocześnie! To nie jest wybór "albo-albo". Wielu ekspertów poleca zacząć od IKZE (żeby odzyskać podatek), a nadwyżki wpłacać na IKE.
                        </p>
                        <div className="bg-black/20 rounded-xl p-4 text-xs text-indigo-200">
                            Wcześniejsza wypłata z IKZE jest bolesna – cała kwota dolicza się do Twojego dochodu w PIT. Traktuj IKZE jak pieniądze "zamurowane" do 65 roku życia.
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* SEKCJA 2: KALKULATOR PROCENTU SKŁADANEGO (POŁĄCZONY) */}
        <section id="procent" className="scroll-mt-24 pt-12 border-t border-slate-200">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kalkulator Procenta Składanego</h2>
            <p className="text-slate-600 max-w-2xl text-lg">
              Sprawdź, jak Twoje oszczędności mogą rosnąć same z siebie. Wpisz kwotę, wybierz czas i zobacz efekt "kuli śnieżnej".
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 mb-16">
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
                <div className="bg-blue-50 text-blue-900 p-6 rounded-2xl flex flex-col border border-blue-100 relative">
                  <div>
                    <span className="text-blue-600 font-medium mb-1">Czysty zysk (Odsetki)</span>
                    <span className="text-4xl font-bold tracking-tight text-blue-600 block">+{formatMoney(totalCompoundProfit)}</span>
                    <div className="mt-4 text-sm text-blue-700 mb-4">
                      To pieniądze wygenerowane przez czas i procent.
                    </div>
                  </div>
                
                  {/* AI INTEGRATION - INSIDE CARD */}
                  <div className="mt-auto pt-4 border-t border-blue-200/50">
                    <button 
                        onClick={handleCompoundAI}
                        disabled={compoundAI.loading}
                        className="flex items-center gap-2 text-indigo-700 font-bold text-sm hover:text-indigo-900 transition-colors disabled:opacity-50"
                    >
                        {compoundAI.loading ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                        {compoundAI.loading ? "Myślę..." : "Co to oznacza w praktyce? Spytaj AI"}
                    </button>
                    <AICard 
                        text={compoundAI.text} 
                        isLoading={compoundAI.loading} 
                        onClose={() => setCompoundAI(p => ({...p, text: ""}))}
                        title="Wizualizacja zysku"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1 min-h-[400px]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600"/>
                  Symulacja wzrostu
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={compoundData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
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
                      tickMargin={15}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tickFormatter={(val) => `${val/1000}k`} 
                      tickMargin={10}
                      fontSize={12}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => formatMoney(value)}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px' }}/>
                    <Area type="monotone" dataKey="razem" name="Kapitał z odsetkami" stroke="#2563eb" fillOpacity={1} fill="url(#colorZysk)" strokeWidth={3}/>
                    <Area type="monotone" dataKey="kapital" name="Wpłacony kapitał" stroke="#94a3b8" fillOpacity={1} fill="url(#colorWklad)" strokeWidth={2} strokeDasharray="5 5"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* EDUKACJA - BEZPIECZEŃSTWO (Podpięte pod sekcję Procentu) */}
            <div className="grid lg:grid-cols-2 gap-8">
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
            </div>
        </section>

        {/* SEKCJA 3: KALKULATOR OBLIGACJI (POŁĄCZONY) */}
        <section id="obligacje" className="scroll-mt-24 pt-12 border-t border-slate-200">
          <div className="mb-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={40}/>
              Symulator Zysków z Obligacji
            </h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-slate-600 max-w-2xl text-lg">
                Oblicz potencjalny zysk. Wybierz rodzaj obligacji, aby zobaczyć szczegóły. Dane poglądowe.
                </p>
                <a 
                href="https://www.obligacjeskarbowe.pl/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-lg text-sm"
                >
                Kup oficjalnie na obligacjeskarbowe.pl <ExternalLink size={14} />
                </a>
            </div>
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
                          Zaznacz, jeśli planujesz wypłacić pieniądze przed końcem.
                        </span>
                      </div>
                    </label>
                   
                    {/* Input do miesiąca wykupu pojawia się tylko gdy checkbox jest zaznaczony */}
                    {earlyExit && bondCalculation && (
                        <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                            <InputGroup 
                                label="Wypłata po miesiącu"
                                value={exitMonth}
                                onChange={setExitMonth}
                                type="range"
                                min="1"
                                max={bondCalculation.bondDetails.durationMonths}
                                step="1"
                            />
                            <div className="flex justify-between text-xs font-bold text-slate-500 mt-2">
                                <span>1 mies.</span>
                                <span className="text-blue-600">{exitMonth} mies. ({Math.floor(exitMonth/12)} lat)</span>
                                <span>{bondCalculation.bondDetails.durationMonths} mies.</span>
                            </div>
                            <p className="text-xs text-orange-600 mt-2 font-medium">
                                Opłata za przedwczesny wykup: {bondCalculation.bondDetails.earlyExitFee.toFixed(2)} zł od każdej obligacji (100zł).
                            </p>
                        </div>
                    )}
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-800 flex gap-3 items-start">
                    <Info className="shrink-0 mt-0.5" size={18}/>
                    <p>
                        Dla obligacji indeksowanych inflacją (COI, EDO, ROS, ROD) oprocentowanie w kolejnych latach będzie zależało od inflacji. Ten kalkulator zakłada stały poziom dla uproszczenia.
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
                            <span className="text-slate-600">Zysk Brutto (po ew. opłacie)</span>
                            <span className={`font-medium ${bondCalculation.gross < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                                {formatMoney(bondCalculation.gross)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50 text-slate-500">
                            <span className="">Podatek Belki (19%)</span>
                            <span className="font-medium">-{formatMoney(bondCalculation.tax)}</span>
                        </div>
                        {bondCalculation.fee > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-slate-50 text-orange-500">
                                <span className="">Opłata sankcyjna</span>
                                <span className="font-medium">-{formatMoney(bondCalculation.fee)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-4">
                            <span className="text-xl font-bold text-slate-900">Zysk Netto ("na rękę")</span>
                            <span className={`text-3xl font-black ${bondCalculation.isLoss ? 'text-red-600' : 'text-green-600'}`}>
                                {bondCalculation.isLoss ? '' : '+'}{formatMoney(bondCalculation.net)}
                            </span>
                        </div>
                        {bondCalculation.isLoss && (
                            <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-lg text-center font-bold">
                                Uwaga: Strata kapitału z powodu opłaty przy szybkim wykupie!
                            </div>
                        )}

                         {/* AI BUTTON & RESULT INSIDE PANEL */}
                         <div className="mt-6 border-t border-slate-100 pt-4">
                            <button 
                                onClick={handleBondAI}
                                disabled={bondAI.loading}
                                className="w-full flex justify-center items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                            >
                                {bondAI.loading ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                                {bondAI.loading ? "Analizuję..." : "Opinia eksperta AI o tej obligacji"}
                            </button>
                            <AICard 
                                text={bondAI.text} 
                                isLoading={bondAI.loading} 
                                onClose={() => setBondAI(p => ({...p, text: ""}))}
                                title="Opinia Eksperta AI"
                            />
                        </div>

                    </div>

                    <div className="h-64 mt-4">
                       <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Zysk brutto', value: parseFloat(bondCalculation.gross.toFixed(2)), fill: '#cbd5e1' },
                          { name: 'Zysk netto', value: parseFloat(bondCalculation.net.toFixed(2)), fill: bondCalculation.isLoss ? '#ef4444' : '#16a34a' },
                          { name: 'Podatek', value: parseFloat(bondCalculation.tax.toFixed(2)), fill: '#f87171' },
                        ]} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tickMargin={10}/>
                          <YAxis fontSize={12} tickMargin={10}/>
                          <RechartsTooltip 
                            cursor={{fill: 'transparent'}} 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                            labelStyle={{color: '#64748b'}}
                            formatter={(value) => [formatMoney(value), 'Wartość']}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
           {/* INFLACJA - Podpięta pod obligacje */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 mt-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <TrendingUp className="text-red-500" size={32}/>
                            Co to jest inflacja i marża?
                        </h2>
                        <div className="space-y-6 text-slate-600 leading-relaxed">
                            <p>
                                <strong className="text-slate-900">Inflacja</strong> to wrogiem Twoich oszczędności. Oznacza, że za te same pieniądze możesz kupić coraz mniej. Jeśli trzymasz pieniądze w "skarpecie" przy inflacji 10%, realnie tracisz jedną dziesiątą ich wartości rocznie.
                            </p>
                            <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-blue-500">
                                <h3 className="font-bold text-slate-900 mb-2">Jak działają obligacje indeksowane (COI, EDO)?</h3>
                                <p className="text-sm">
                                    W pierwszym roku mają stałe oprocentowanie. Od drugiego roku ich zysk to: <br/>
                                    <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200 mt-2 inline-block font-bold text-blue-700">INFLACJA + MARŻA</span>
                                </p>
                            </div>
                            <p>
                                <strong className="text-slate-900">Marża</strong> to Twój gwarantowany zysk <strong>powyżej</strong> inflacji. Jeśli inflacja wyniesie 5%, a Twoja marża to 1.50% (jak w obligacji EDO), to zarobisz 6.50%. Dzięki temu Twoje pieniądze nie tylko nie tracą na wartości, ale realnie zarabiają.
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="text-lg font-bold mb-6 text-center text-slate-700">Inflacja w Polsce (2018-2024)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={INFLATION_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tickMargin={15} stroke="#64748b" fontSize={12}/>
                                    <YAxis axisLine={false} tickLine={false} tickMargin={10} stroke="#64748b" fontSize={12} unit="%"/>
                                    <RechartsTooltip 
                                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                                        formatter={(value) => [`${value}%`, 'Inflacja']}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-center text-xs text-slate-400 mt-4">Źródło: GUS (dane roczne / szacunkowe)</p>
                    </div>
                </div>
            </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          
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