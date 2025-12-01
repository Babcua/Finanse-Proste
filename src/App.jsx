import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, Info, Banknote, ShieldCheck, Coins, AlertTriangle, Baby, Landmark, ChevronDown, ExternalLink, Sparkles, Loader2, ArrowRight,
  Briefcase, FileSignature, PenTool, Wallet, HelpCircle, Users, PiggyBank, Home, ArrowUpRight, Lock, CheckCircle, XCircle, Shuffle, School, ChevronUp, BookOpen, Scale, Umbrella, LayoutGrid, GraduationCap, ChevronLeft, Calculator, Lightbulb, ArrowRightCircle, Target, ThumbsUp, ThumbsDown, Building2, Clock, Percent, Activity, Key, DoorOpen, BadgeCheck, Zap, Globe, Siren, CandlestickChart, ShoppingCart, FileText, Repeat
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- KONFIGURACJA API GEMINI ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

// --- DANE I KONFIGURACJA ---

const MONTHS = [
  'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze',
  'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'
];

const INFLATION_DATA = [
  { year: '2018', value: 1.6 },
  { year: '2019', value: 2.3 },
  { year: '2020', value: 3.4 },
  { year: '2021', value: 5.1 },
  { year: '2022', value: 14.4 },
  { year: '2023', value: 11.4 },
  { year: '2024', value: 5.0 }, // Prognoza/Szacunek
];

const STANDARD_BONDS = [
  { id: 'OTS', name: 'OTS (3-miesięczne)', desc: 'Krótka lokata na 3 miesiące ze stałym zyskiem. Idealna na przeczekanie.', rate: 2.50, durationMonths: 3, earlyExitFee: 0, type: 'fixed', capitalizationDesc: 'Wypłata całości na koniec', interestType: 'Stałe (wiesz ile zarobisz)', capitalization: 'end' },
  { id: 'ROR', name: 'ROR (1-roczne)', desc: 'Obligacja na rok. Oprocentowanie zmienia się co miesiąc zależnie od stóp procentowych NBP.', rate: 4.25, durationMonths: 12, earlyExitFee: 0.50, type: 'variable', capitalizationDesc: 'Wypłata odsetek co miesiąc na konto', interestType: 'Zmienne (podąża za stopami NBP)', capitalization: 'monthly_payout' },
  { id: 'DOR', name: 'DOR (2-letnie)', desc: 'Obligacja na 2 lata. Działa jak ROR, ale trwa dłużej i ma nieco wyższą marżę.', rate: 4.40, durationMonths: 24, earlyExitFee: 0.70, type: 'variable', capitalizationDesc: 'Wypłata odsetek co miesiąc na konto', interestType: 'Zmienne (podąża za stopami NBP)', capitalization: 'monthly_payout' },
  { id: 'TOS', name: 'TOS (3-letnie)', desc: 'Stały zysk przez 3 lata. Nie martwisz się zmianami stóp procentowych. Odsetki dopisują się do kapitału.', rate: 4.65, durationMonths: 36, earlyExitFee: 0.70, type: 'fixed', capitalizationDesc: 'Kapitalizacja roczna (zysk na koniec)', interestType: 'Stałe (gwarancja oprocentowania)', capitalization: 'compound_year' },
  { id: 'COI', name: 'COI (4-letnie)', desc: 'Bestseller. Chroni Twoje pieniądze przed inflacją. Odsetki wypłacane są co rok na Twoje konto.', rate: 5.00, durationMonths: 48, earlyExitFee: 0.70, type: 'indexed', capitalizationDesc: 'Wypłata odsetek raz w roku na konto', interestType: 'Indeksowane inflacją (chroni siłę nabywczą)', capitalization: 'yearly_payout' },
  { id: 'EDO', name: 'EDO (10-letnie)', desc: 'Najlepsza na długi termin (np. emeryturę). Wykorzystuje procent składany i chroni przed inflacją.', rate: 5.60, durationMonths: 120, earlyExitFee: 2.00, type: 'indexed', capitalizationDesc: 'Kapitalizacja roczna (odsetki zarabiają odsetki)', interestType: 'Indeksowane inflacją + procent składany', capitalization: 'compound_year' }
];

const FAMILY_BONDS = [
  { id: 'ROS', name: 'ROS (6-letnie)', desc: 'Rodzinna wersja obligacji inflacyjnych. Wyższy zysk niż w standardowej ofercie.', rate: 5.20, durationMonths: 72, earlyExitFee: 0.70, type: 'indexed', capitalizationDesc: 'Kapitalizacja roczna (odsetki zarabiają odsetki)', interestType: 'Indeksowane inflacją (Preferencyjna marża)', capitalization: 'compound_year' },
  { id: 'ROD', name: 'ROD (12-letnie)', desc: 'Najwyżej oprocentowana obligacja na rynku. Długoterminowe budowanie kapitału dla dzieci.', rate: 5.85, durationMonths: 144, earlyExitFee: 2.00, type: 'indexed', capitalizationDesc: 'Kapitalizacja roczna (odsetki zarabiają odsetki)', interestType: 'Indeksowane inflacją (Najwyższa ochrona)', capitalization: 'compound_year' }
];

// --- DANE DO KALKULATORA ETF ---
const ETF_DATA_MOCK = {
    'sp500': { 
        name: 'S&P 500 (USA)', 
        desc: '500 największych spółek w USA (Apple, Microsoft, Google...).',
        risk: 'Średnie/Wysokie',
        returns: { 2015: 1.38, 2016: 11.96, 2017: 21.83, 2018: -4.38, 2019: 31.49, 2020: 18.40, 2021: 28.71, 2022: -18.11, 2023: 26.29, 2024: 12.0 } 
    },
    'msci': { 
        name: 'MSCI World (Świat)', 
        desc: 'Ponad 1500 spółek z 23 krajów rozwiniętych.',
        risk: 'Średnie',
        returns: { 2015: -0.87, 2016: 7.51, 2017: 22.40, 2018: -8.71, 2019: 27.67, 2020: 15.90, 2021: 21.82, 2022: -18.14, 2023: 23.79, 2024: 10.0 }
    },
    'wig20': { 
        name: 'WIG20 (Polska)', 
        desc: '20 największych polskich spółek (Orlen, PKO, KGHM...).',
        risk: 'Wysokie',
        returns: { 2015: -19.7, 2016: 4.8, 2017: 26.4, 2018: -7.5, 2019: -5.6, 2020: -7.7, 2021: 14.3, 2022: -20.9, 2023: 30.8, 2024: 5.0 }
    },
    'nasdaq': { 
        name: 'Nasdaq 100 (Tech)', 
        desc: 'Spółki technologiczne. Duża zmienność, potencjalnie duży zysk.',
        risk: 'Bardzo Wysokie',
        returns: { 2015: 8.43, 2016: 5.89, 2017: 31.52, 2018: -1.04, 2019: 37.96, 2020: 47.58, 2021: 26.63, 2022: -33.10, 2023: 55.13, 2024: 15.0 }
    },
    'gold': { 
        name: 'ETF na Złoto', 
        desc: 'Odzwierciedla cenę złota fizycznego.',
        risk: 'Średnie (Surowce)',
        returns: { 2015: -10.4, 2016: 8.5, 2017: 13.1, 2018: -1.6, 2019: 18.3, 2020: 25.1, 2021: -3.6, 2022: -0.3, 2023: 13.1, 2024: 12.0 }
    }
};

// --- LOGIKA KALKULATORA WYNAGRODZEŃ (ROCZNA) ---

const calculateYearlySalary = (brutto, type, params) => {
  const amount = parseFloat(brutto) || 0;
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
    let zusSocial = 0, zusHealth = 0, tax = 0, ppk = 0, ppkEmployer = 0;
    
    const isZusCapped = accumulatedRetirementBase >= LIMIT_ZUS_30;
    let zusRate = 0.1371; // E+R+Ch
    
    if (type === 'uop') {
        let baseForZus = currentBrutto;
        if (isZusCapped) zusRate = 0.0245; // Tylko chorobowe
        
        zusSocial = baseForZus * zusRate;
        accumulatedRetirementBase += baseForZus;

        const baseForHealth = currentBrutto - zusSocial;
        zusHealth = baseForHealth * 0.09;

        const kup = params.workWhereLive ? KUP_STANDARD : KUP_ELEVATED;
        const taxBase = Math.max(0, currentBrutto - zusSocial - kup);
        
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
        
        if (accumulatedTaxBase < THRESHOLD_TAX) calculatedTax -= TAX_FREE_REDUCTION;
        if (params.under26 && accumulatedTaxBase < 85528) calculatedTax = 0;
        
        tax = Math.max(0, Math.round(calculatedTax));
        accumulatedTaxBase += taxBase;

        if (params.ppk) {
            ppk = currentBrutto * (params.ppkRate / 100);
            ppkEmployer = currentBrutto * 0.015;
            tax += (ppkEmployer * 0.12);
        }

        const netto = currentBrutto - zusSocial - zusHealth - tax - ppk;
        yearlyBreakdown.push({
            month: MONTHS[i], netto, gross: currentBrutto, tax, zus: zusSocial + zusHealth, ppk,
            thresholdCrossed: accumulatedTaxBase > THRESHOLD_TAX && (accumulatedTaxBase - taxBase) <= THRESHOLD_TAX
        });

    } else {
        const singleMonth = calculateSingleMonth(amount, type, params);
        yearlyBreakdown.push({ month: MONTHS[i], ...singleMonth, thresholdCrossed: false });
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
            const zusSocial = amount * 0.1126;
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

// Helper do sumowania rocznego netto dla porównań
const getYearlyNetTotal = (brutto, type, params) => {
    const breakdown = calculateYearlySalary(brutto, type, params);
    return breakdown.reduce((acc, curr) => acc + curr.netto, 0);
};

// --- LOGIKA KALKULATORA B2B ---
const calculateB2B = (inputs) => {
    const { rateType, hourlyRate, hoursCount, monthlyNet, costs, taxType, zusType, sickLeave, ipBox, ryczaltRate, isVatPayer } = inputs;
    
    let revenue = 0;
    if (rateType === 'hourly') {
        revenue = (parseFloat(hourlyRate) || 0) * (parseFloat(hoursCount) || 0);
    } else {
        revenue = parseFloat(monthlyNet) || 0;
    }

    const monthlyCosts = parseFloat(costs) || 0;
    
    // ZUS Bases (Approximate for 2025/late 2024)
    const ZUS_BASE_STANDARD = 5224.20; 
    const ZUS_BASE_PREFERENTIAL = 1399.80; 
    
    const RATE_EMERYTALNA = 0.1952;
    const RATE_RENTOWA = 0.08;
    const RATE_CHOROBOWA = 0.0245;
    const RATE_WYPADKOWA = 0.0167;
    const RATE_FP = 0.0245;

    let socialBase = 0;
    if (zusType === 'duzy') socialBase = ZUS_BASE_STANDARD;
    else if (zusType === 'maly') socialBase = ZUS_BASE_PREFERENTIAL;

    let socialZus = 0;
    if (zusType !== 'ulga') {
        socialZus = socialBase * (RATE_EMERYTALNA + RATE_RENTOWA + RATE_WYPADKOWA);
        if (sickLeave) socialZus += socialBase * RATE_CHOROBOWA;
        if (zusType === 'duzy') socialZus += socialBase * RATE_FP;
    }

    let healthBase = 0;
    let healthZus = 0;
    let taxBase = 0;
    let incomeTax = 0;

    if (taxType === 'liniowy') {
        const income = Math.max(0, revenue - monthlyCosts - socialZus);
        healthZus = Math.max(381.78, income * 0.049);
        const deductibleHealth = Math.min(healthZus, 11600/12);
        taxBase = Math.round(Math.max(0, revenue - monthlyCosts - socialZus - deductibleHealth));
        const rate = ipBox ? 0.05 : 0.19;
        incomeTax = Math.round(taxBase * rate);

    } else if (taxType === 'skala') {
        const income = Math.max(0, revenue - monthlyCosts - socialZus);
        healthZus = Math.max(381.78, income * 0.09);
        taxBase = Math.round(Math.max(0, revenue - monthlyCosts - socialZus));
        if (taxBase <= 10000) { 
            incomeTax = (taxBase * 0.12) - 300;
        } else {
            incomeTax = (10000 * 0.12 - 300) + ((taxBase - 10000) * 0.32);
        }
        incomeTax = Math.max(0, Math.round(incomeTax));
        if (ipBox) incomeTax = Math.round(taxBase * 0.05);

    } else if (taxType === 'ryczalt') {
        const yearlyRevenue = revenue * 12;
        if (yearlyRevenue < 60000) healthZus = 419.46;
        else if (yearlyRevenue < 300000) healthZus = 699.11;
        else healthZus = 1258.39;
        taxBase = Math.round(Math.max(0, revenue - socialZus - (healthZus * 0.5)));
        incomeTax = Math.round(taxBase * (ryczaltRate / 100));
    }

    const totalZus = socialZus + healthZus;
    const netIncome = revenue - monthlyCosts - incomeTax - totalZus;
    const vatAmount = isVatPayer ? revenue * 0.23 : 0;
    const grossInvoice = revenue + vatAmount;

    return {
        revenue,
        costs: monthlyCosts,
        socialZus,
        healthZus,
        totalZus,
        incomeTax,
        netIncome,
        vatAmount,
        grossInvoice,
        taxType
    };
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
    <div className="flex items-start gap-4 cursor-pointer" onClick={() => onChange(!checked)}>
        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
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

const FeatureCard = ({ title, subtitle, description, icon: Icon, color, onClick, badge }) => (
    <div 
        onClick={onClick}
        className={`
            relative p-6 rounded-3xl border border-slate-100 bg-white shadow-sm 
            hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col items-start
            overflow-hidden h-full
        `}
    >
        <div className={`
            absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl opacity-10
            ${color === 'blue' ? 'bg-blue-500' : ''}
            ${color === 'green' ? 'bg-green-500' : ''}
            ${color === 'purple' ? 'bg-purple-500' : ''}
            ${color === 'pink' ? 'bg-pink-500' : ''}
            ${color === 'orange' ? 'bg-orange-500' : ''}
            ${color === 'teal' ? 'bg-teal-500' : ''}
            ${color === 'rose' ? 'bg-rose-500' : ''}
        `}></div>

        {badge && (
            <span className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                {badge}
            </span>
        )}

        <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors shadow-sm
            ${color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : ''}
            ${color === 'green' ? 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white' : ''}
            ${color === 'purple' ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : ''}
            ${color === 'pink' ? 'bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white' : ''}
            ${color === 'orange' ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white' : ''}
            ${color === 'teal' ? 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white' : ''}
            ${color === 'rose' ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' : ''}
        `}>
            <Icon size={28} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 font-medium mb-4 uppercase tracking-wider text-[10px]">{subtitle}</p>
        
        <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
            {description}
        </p>
        
        <div className="mt-auto flex items-center gap-2 text-sm font-bold opacity-60 group-hover:opacity-100 transition-opacity">
            <span className={`
                ${color === 'blue' ? 'text-blue-600' : ''}
                ${color === 'green' ? 'text-green-600' : ''}
                ${color === 'purple' ? 'text-purple-600' : ''}
                ${color === 'pink' ? 'text-pink-600' : ''}
                ${color === 'orange' ? 'text-orange-600' : ''}
                ${color === 'teal' ? 'text-teal-600' : ''}
                ${color === 'rose' ? 'text-rose-600' : ''}
            `}>Otwórz</span>
            <ArrowRight size={16} />
        </div>
    </div>
);

// --- GŁÓWNY KOMPONENT ---

export default function App() {
  // 1. Używamy hooków z routera zamiast useState
  const navigate = useNavigate();
  const location = useLocation();

  // 2. Efekt: Przewijaj do góry przy każdej zmianie podstrony
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 3. Główny widok (Layout)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 flex flex-col">
      {/* NAGŁÓWEK */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:bg-blue-700 transition-colors"><TrendingUp size={24} /></div>
            <h1 className="text-xl font-bold tracking-tight">Finanse <span className="text-blue-600">Proste</span></h1>
          </Link>
          
          {/* Pokazuj przycisk MENU tylko jeśli NIE jesteśmy na stronie głównej */}
          {location.pathname !== '/' && (
             <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 px-3 py-2 rounded-lg">
                <ChevronLeft size={16}/> Menu
             </Link>
          )}
        </div>
      </header>

      {/* TREŚĆ - TU DZIEJE SIĘ MAGIA ROUTINGU */}
      <main className="max-w-6xl w-full mx-auto px-6 py-12 flex-grow">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/wynagrodzenia" element={<SalaryView />} />
          <Route path="/b2b" element={<B2BView />} />
          <Route path="/obligacje" element={<BondsView />} />
          <Route path="/procent-skladany" element={<CompoundView />} />
          <Route path="/ppk" element={<PpkView />} />
          <Route path="/ike-ikze" element={<IkeView />} />
          <Route path="/gielda" element={<StocksView />} />
        </Routes>
      </main>

      {/* STOPKA (Bez zmian) */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="flex justify-center"><AlertTriangle className="text-yellow-500/80" size={24} /></div>
          <div className="text-sm leading-relaxed text-slate-500 max-w-2xl mx-auto space-y-4">
            <p><strong>Zastrzeżenie prawne:</strong> Niniejszy serwis ma charakter wyłącznie edukacyjny...</p>
          </div>
          <p className="text-xs text-slate-600 pt-4 border-t border-slate-800/50">&copy; 2025 Finanse Proste.</p>
        </div>
      </footer>
    </div>
  );
}
const HomeView = () => {
  const navigate = useNavigate();
  return (
      <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 pb-12">
          <div className="text-center mb-16 max-w-2xl mt-12">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                  Finanse <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">zrozumiałe</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                  Profesjonalne narzędzia do analizy Twoich pieniędzy i prosta edukacja. Wybierz, czego potrzebujesz.
              </p>
          </div>

          <div className="w-full max-w-6xl space-y-16">
              {/* SEKCJA NARZĘDZIA */}
              <section>
                  <div className="flex items-center gap-3 mb-8 px-2">
                      <div className="bg-slate-100 p-2 rounded-lg"><Calculator size={20} className="text-slate-700"/></div>
                      <h3 className="text-xl font-bold text-slate-800">Narzędzia i Kalkulatory</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <FeatureCard 
                        title="Kalkulator Wynagrodzeń"
                        subtitle="Pensja Netto (Na rękę)"
                        description="Sprawdź ile realnie zarobisz na umowie o pracę, zleceniu i dziele. Oblicz podatki, ZUS i wpływ PPK na Twoją wypłatę."
                        icon={Wallet}
                        color="green"
                        onClick={() => navigate('/wynagrodzenia')}
                        badge="Dla każdego"
                      />
                      <FeatureCard 
                        title="Kalkulator B2B"
                        subtitle="Dla przedsiębiorców"
                        description="Symulacja faktury, podatków (liniowy, ryczałt, skala) oraz ZUS (ulga na start, mały ZUS). Pokaże czysty zysk i VAT."
                        icon={Briefcase}
                        color="teal"
                        onClick={() => navigate('/b2b')}
                        badge="Nowość"
                      />
                      <FeatureCard 
                        title="Kalkulator Obligacji Skarbowych"
                        subtitle="Symulator Zysków"
                        description="Oblicz potencjalny zysk z obligacji indeksowanych inflacją (EDO, COI) oraz standardowych. Porównaj oferty."
                        icon={ShieldCheck}
                        color="blue"
                        onClick={() => navigate('/obligacje')}
                      />
                      <FeatureCard 
                        title="Kalkulator procenta składanego"
                        subtitle="Symulator Inwestycji"
                        description="Zobacz jak czas działa na Twoją korzyść. Oblicz ile zgromadzisz odkładając małe kwoty regularnie."
                        icon={TrendingUp}
                        color="purple"
                        onClick={() => navigate('/procent-skladany')}
                      />
                  </div>
              </section>

              {/* SEKCJA EDUKACJA */}
              <section>
                  <div className="flex items-center gap-3 mb-8 px-2">
                      <div className="bg-slate-100 p-2 rounded-lg"><GraduationCap size={20} className="text-slate-700"/></div>
                      <h3 className="text-xl font-bold text-slate-800">Strefa Edukacji</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <FeatureCard 
                        title="Akcje i ETF"
                        subtitle="Inwestowanie w firmy"
                        description="Czym są akcje i ETF? Jak działa giełda i czy trzeba być milionerem, żeby zacząć? Praktyczny przewodnik."
                        icon={Activity}
                        color="rose"
                        onClick={() => navigate('/gielda')}
                        badge="Nowe"
                      />
                      <FeatureCard 
                        title="PPK w Praktyce"
                        subtitle="Pracownicze Plany Kapitałowe"
                        description="Czy to się opłaca? Kiedy można wypłacić? Dowiedz się, jak zyskać 1,5% ekstra pensji od pracodawcy."
                        icon={PiggyBank}
                        color="orange"
                        onClick={() => navigate('/ppk')}
                      />
                      <FeatureCard 
                        title="IKE oraz IKZE"
                        subtitle="Tarcza Podatkowa"
                        description="Jak legalnie nie płacić podatku od zysków? Dowiedz się jak odzyskać podatek PIT co roku dzięki IKZE."
                        icon={Umbrella}
                        color="pink"
                        onClick={() => navigate('/ike-ikze')}
                      />
                  </div>
              </section>
          </div>
      </div>
  );
};
const SalaryView = () => {
  // --- ZMIENNE ---
  const [salaryBrutto, setSalaryBrutto] = useState(8000);
  const [contractType, setContractType] = useState('uop');
  const [salaryParams, setSalaryParams] = useState({
    under26: false,
    ppk: true,
    ppkRate: 2.0, 
    workWhereLive: true,
    student: false
  });
  const [showYearlyDetails, setShowYearlyDetails] = useState(false);

  // OBLICZENIA
  const salaryYearlyData = useMemo(() => calculateYearlySalary(salaryBrutto, contractType, salaryParams), [salaryBrutto, contractType, salaryParams]);
  const currentMonthNetto = salaryYearlyData[0].netto;
  
  const yearlyTotals = useMemo(() => {
      const totals = salaryYearlyData.reduce((acc, curr) => ({
          netto: acc.netto + curr.netto,
          gross: acc.gross + curr.gross,
          tax: acc.tax + curr.tax,
          zus: acc.zus + curr.zus,
          ppk: acc.ppk + curr.ppk
      }), { netto: 0, gross: 0, tax: 0, zus: 0, ppk: 0 });
      return totals;
  }, [salaryYearlyData]);

  return (
    <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto">
        <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                <Wallet className="text-green-600" size={36}/>
                Kalkulator Wynagrodzeń
            </h2>
            <p className="text-slate-600 max-w-3xl text-lg">
                Precyzyjne narzędzie do wyliczania kwoty netto ("na rękę") z wynagrodzenia brutto. Uwzględnia progi podatkowe, ulgę dla młodych, koszty uzyskania przychodu oraz wpływ PPK.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
            {/* LEWA KOLUMNA */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
                    <button onClick={() => setContractType('uop')} className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all ${contractType === 'uop' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Umowa o pracę</button>
                    <button onClick={() => setContractType('uz')} className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all ${contractType === 'uz' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Zlecenie</button>
                    <button onClick={() => setContractType('uod')} className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all ${contractType === 'uod' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Dzieło</button>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <InputGroup label="Kwota Brutto (Miesięcznie)" value={salaryBrutto} onChange={setSalaryBrutto} suffix="PLN" step="100" />
                    
                    <div className="flex flex-col gap-4">
                        {contractType === 'uop' && (
                            <>
                                <CheckboxGroup label="Praca w miejscu zamieszkania" description="Zwykłe koszty uzyskania (250 zł)." checked={salaryParams.workWhereLive} onChange={(v) => setSalaryParams({...salaryParams, workWhereLive: v})} icon={Home} />
                                <CheckboxGroup label="PPK" description="Oszczędzanie z pracodawcą." checked={salaryParams.ppk} onChange={(v) => setSalaryParams({...salaryParams, ppk: v})} icon={PiggyBank}>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-500"><span>Twoja wpłata: {salaryParams.ppkRate}%</span></div>
                                        <input type="range" min="0.5" max="4.0" step="0.5" value={salaryParams.ppkRate} onChange={(e) => setSalaryParams({...salaryParams, ppkRate: parseFloat(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
                                    </div>
                                </CheckboxGroup>
                            </>
                        )}
                        <CheckboxGroup label="Wiek < 26 lat" description="Zerowy PIT do 85 528 zł." checked={salaryParams.under26} onChange={(v) => setSalaryParams({...salaryParams, under26: v})} icon={Baby} />
                        {contractType === 'uz' && salaryParams.under26 && (
                            <CheckboxGroup label="Status studenta" description="Brutto = Netto." checked={salaryParams.student} onChange={(v) => setSalaryParams({...salaryParams, student: v})} icon={School} />
                        )}
                    </div>
                </div>
            </div>

            {/* PRAWA KOLUMNA */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h4 className="font-bold text-slate-900 text-xl">Twoja wypłata</h4>
                            <p className="text-slate-500 text-sm mt-1">Szacunkowe netto za bieżący miesiąc.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-slate-400 uppercase">Średnie Netto</span>
                            <div className="text-3xl font-bold text-green-600">
                                {formatMoney(yearlyTotals.netto / 12)}
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100 mb-6 flex justify-between items-center">
                        <div>
                            <div className="text-sm text-green-800 font-bold mb-1">Miesięcznie na rękę (Styczeń)</div>
                            <div className="text-4xl font-black text-green-700">{formatMoney(currentMonthNetto)}</div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <button onClick={() => setShowYearlyDetails(!showYearlyDetails)} className="flex items-center justify-between w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors font-bold text-slate-700 text-sm">
                            <span className="flex items-center gap-2"><BookOpen size={18} className="text-blue-600"/> Symulacja roczna</span>
                            {showYearlyDetails ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                        </button>

                        {showYearlyDetails && (
                            <div className="overflow-x-auto mt-4 animate-in fade-in slide-in-from-top-2">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">Miesiąc</th>
                                            <th className="px-4 py-3 text-green-700 font-bold">Netto</th>
                                            <th className="px-4 py-3">Podatek</th>
                                            <th className="px-4 py-3 rounded-r-lg">ZUS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {salaryYearlyData.map((row, index) => (
                                            <tr key={index} className={`hover:bg-blue-50/50 transition-colors ${row.thresholdCrossed ? 'bg-amber-50' : ''}`}>
                                                <td className="px-4 py-2 font-medium text-slate-700 flex items-center gap-2">
                                                    {row.month}
                                                    {row.thresholdCrossed && <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-bold border border-amber-200">II PRÓG</span>}
                                                </td>
                                                <td className={`px-4 py-2 font-bold ${row.thresholdCrossed ? 'text-amber-600' : 'text-green-600'}`}>{formatMoney(row.netto)}</td>
                                                <td className="px-4 py-2 text-slate-500">{formatMoney(row.tax)}</td>
                                                <td className="px-4 py-2 text-slate-500">{formatMoney(row.zus)}</td>
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
    </div>
  );
};
const B2BView = () => {
  // --- ZMIENNE ---
  const [b2bRateType, setB2bRateType] = useState('monthly'); 
  const [b2bHourlyRate, setB2bHourlyRate] = useState(100);
  const [b2bHours, setB2bHours] = useState(160);
  const [b2bNetto, setB2bNetto] = useState(12000);
  const [b2bTaxType, setB2bTaxType] = useState('liniowy'); 
  const [b2bRyczaltRate, setB2bRyczaltRate] = useState(12);
  const [b2bZusType, setB2bZusType] = useState('duzy'); 
  const [b2bCosts, setB2bCosts] = useState(0);
  const [b2bIpBox, setB2bIpBox] = useState(false);
  const [b2bSickLeave, setB2bSickLeave] = useState(true);
  const [b2bVat, setB2bVat] = useState(true);

  // OBLICZENIA
  const b2bResult = useMemo(() => {
      return calculateB2B({
          rateType: b2bRateType,
          hourlyRate: b2bHourlyRate,
          hoursCount: b2bHours,
          monthlyNet: b2bNetto,
          costs: b2bCosts,
          taxType: b2bTaxType,
          zusType: b2bZusType,
          sickLeave: b2bSickLeave,
          ipBox: b2bIpBox,
          ryczaltRate: b2bRyczaltRate,
          isVatPayer: b2bVat
      });
  }, [b2bRateType, b2bHourlyRate, b2bHours, b2bNetto, b2bCosts, b2bTaxType, b2bZusType, b2bSickLeave, b2bIpBox, b2bRyczaltRate, b2bVat]);

  return (
    <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto">
        <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                <Briefcase className="text-teal-600" size={36}/>
                Kalkulator B2B
            </h2>
            <p className="text-slate-600 max-w-3xl text-lg">
                Kompletne narzędzie dla przedsiębiorców. Oblicz zysk netto ("na rękę") uwzględniając formę opodatkowania, rodzaj ZUS oraz koszty.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
            {/* LEFT INPUTS */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <div className="flex bg-slate-50 p-1 rounded-xl">
                        <button onClick={() => setB2bRateType('monthly')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${b2bRateType === 'monthly' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Miesięcznie</button>
                        <button onClick={() => setB2bRateType('hourly')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${b2bRateType === 'hourly' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Godzinowo</button>
                    </div>

                    {b2bRateType === 'monthly' ? (
                        <InputGroup label="Przychód netto (na fakturze)" value={b2bNetto} onChange={setB2bNetto} suffix="PLN" step="100" />
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Stawka godzinowa" value={b2bHourlyRate} onChange={setB2bHourlyRate} suffix="PLN" step="10" />
                            <InputGroup label="Ilość godzin" value={b2bHours} onChange={setB2bHours} suffix="h" step="1" />
                        </div>
                    )}

                    <InputGroup label="Koszty firmowe (netto)" value={b2bCosts} onChange={setB2bCosts} suffix="PLN" step="50" />
                    
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Forma opodatkowania</label>
                        <div className="flex flex-col gap-2">
                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${b2bTaxType === 'liniowy' ? 'bg-teal-50 border-teal-200 ring-1 ring-teal-200' : 'bg-white border-slate-200'}`}>
                                <input type="radio" name="tax" checked={b2bTaxType === 'liniowy'} onChange={() => setB2bTaxType('liniowy')} className="text-teal-600 focus:ring-teal-500"/>
                                <div>
                                    <span className="block font-bold text-slate-900">Podatek liniowy (19%)</span>
                                    <span className="text-xs text-slate-500">Stała stawka. Składka zdrowotna 4.9%. Opłacalny przy wysokich dochodach.</span>
                                </div>
                            </label>
                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${b2bTaxType === 'skala' ? 'bg-teal-50 border-teal-200 ring-1 ring-teal-200' : 'bg-white border-slate-200'}`}>
                                <input type="radio" name="tax" checked={b2bTaxType === 'skala'} onChange={() => setB2bTaxType('skala')} className="text-teal-600 focus:ring-teal-500"/>
                                <div>
                                    <span className="block font-bold text-slate-900">Skala podatkowa (12% / 32%)</span>
                                    <span className="text-xs text-slate-500">Dobra przy niższych dochodach. Kwota wolna 30 tys. zł.</span>
                                </div>
                            </label>
                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${b2bTaxType === 'ryczalt' ? 'bg-teal-50 border-teal-200 ring-1 ring-teal-200' : 'bg-white border-slate-200'}`}>
                                <input type="radio" name="tax" checked={b2bTaxType === 'ryczalt'} onChange={() => setB2bTaxType('ryczalt')} className="text-teal-600 focus:ring-teal-500"/>
                                <div className="w-full">
                                    <span className="block font-bold text-slate-900">Ryczałt</span>
                                    <span className="text-xs text-slate-500 mb-2 block">Podatek od przychodu (nie zysku). Brak kosztów. Niskie stawki.</span>
                                    {b2bTaxType === 'ryczalt' && (
                                        <select value={b2bRyczaltRate} onChange={(e) => setB2bRyczaltRate(parseFloat(e.target.value))} className="w-full text-sm p-2 border border-slate-300 rounded-lg mt-1 bg-white">
                                            <option value={12}>12% (IT, programista)</option>
                                            <option value={15}>15% (doradztwo, usługi)</option>
                                            <option value={8.5}>8.5% (usługi, najem)</option>
                                            <option value={17}>17% (wolne zawody)</option>
                                        </select>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Składki ZUS</label>
                        <select value={b2bZusType} onChange={(e) => setB2bZusType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl p-4">
                            <option value="ulga">Ulga na start (tylko zdrowotna)</option>
                            <option value="maly">Preferencyjny (mały ZUS - 2 lata)</option>
                            <option value="duzy">Duży ZUS (standard)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <CheckboxGroup label="Jestem płatnikiem VAT" description="Doliczasz 23% VAT do faktury." checked={b2bVat} onChange={setB2bVat} icon={Banknote} />
                        <CheckboxGroup label="Dobrowolne chorobowe" description="Płatne L4 (po 90 dniach). Warto przy dużym ZUS." checked={b2bSickLeave} onChange={setB2bSickLeave} icon={Target} />
                        {(b2bTaxType === 'liniowy' || b2bTaxType === 'skala') && (
                            <CheckboxGroup label="Ulga IP BOX (5%)" description="Dla programistów tworzących własność intelektualną." checked={b2bIpBox} onChange={setB2bIpBox} icon={Sparkles} />
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT RESULTS */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h4 className="font-bold text-slate-900 text-xl">Wynik miesięczny</h4>
                            <p className="text-slate-500 text-sm mt-1">Twój realny dochód na czysto.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-slate-400 uppercase">Dochód Netto</span>
                            <div className={`text-4xl font-black ${b2bResult.netIncome < 0 ? 'text-red-500' : 'text-teal-600'}`}>
                                {formatMoney(b2bResult.netIncome)}
                            </div>
                        </div>
                    </div>

                    {b2bResult.netIncome < 0 && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold text-sm flex items-center gap-2">
                            <AlertTriangle size={18}/>
                            Uwaga: Twoje koszty i obciążenia przewyższają przychód. Generujesz stratę.
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Przychód</div>
                            <div className="font-bold text-slate-900">{formatMoney(b2bResult.revenue)}</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Koszty</div>
                            <div className="font-bold text-slate-700">-{formatMoney(b2bResult.costs)}</div>
                        </div>
                        <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-center">
                            <div className="text-[10px] text-red-500 uppercase font-bold">Podatki</div>
                            <div className="font-bold text-red-700">-{formatMoney(b2bResult.incomeTax)}</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-center">
                            <div className="text-[10px] text-orange-500 uppercase font-bold">ZUS Total</div>
                            <div className="font-bold text-orange-700">-{formatMoney(b2bResult.totalZus)}</div>
                        </div>
                    </div>

                    <div className="h-64 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Przychód', value: b2bResult.revenue, fill: '#cbd5e1' },
                                { name: 'Netto', value: Math.max(0, b2bResult.netIncome), fill: '#0d9488' },
                                { name: 'Podatek', value: b2bResult.incomeTax, fill: '#f87171' },
                                { name: 'ZUS', value: b2bResult.totalZus, fill: '#fb923c' },
                            ]} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tickMargin={10}/>
                                <YAxis fontSize={12} tickMargin={10}/>
                                <RechartsTooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                    formatter={(value) => [formatMoney(value), 'Wartość']}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
const BondsView = () => {
  // --- ZMIENNE ---
  const [activeBondType, setActiveBondType] = useState('standard');
  const [selectedBondId, setSelectedBondId] = useState('EDO');
  const [bondAmount, setBondAmount] = useState(10000);
  const [earlyExit, setEarlyExit] = useState(false);
  const [exitMonth, setExitMonth] = useState(12);
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

  // OBLICZENIA
  const bondCalculation = useMemo(() => {
    const allBonds = [...STANDARD_BONDS, ...FAMILY_BONDS];
    const bond = allBonds.find(b => b.id === selectedBondId);
    if (!bond) return null;

    const units = Math.floor(bondAmount / 100);
    const realInvested = units * 100;
    let monthsDuration = bond.durationMonths;
    if (earlyExit && exitMonth < bond.durationMonths && exitMonth > 0) monthsDuration = parseInt(exitMonth);
    
    const years = monthsDuration / 12;
    let accumulatedInterest = 0;
    
    if (bond.capitalization === 'monthly_payout') accumulatedInterest = realInvested * (bond.rate/100) * years;
    else if (bond.capitalization === 'yearly_payout' || bond.capitalization === 'end') accumulatedInterest = realInvested * (bond.rate/100) * years;
    else if (bond.capitalization === 'compound_year') accumulatedInterest = (realInvested * Math.pow(1 + bond.rate/100, years)) - realInvested;

    let profitGross = accumulatedInterest;
    let fee = 0;
    if (earlyExit && monthsDuration < bond.durationMonths) {
        fee = units * bond.earlyExitFee;
        profitGross = accumulatedInterest - fee;
    }

    const taxBase = Math.max(0, profitGross);
    const tax = Number((taxBase * 0.19).toFixed(2));
    const profitNet = profitGross - tax;
    
    return { invested: realInvested, gross: profitGross, tax: tax, net: profitNet, total: realInvested + profitNet, fee: fee, bondDetails: bond, isLoss: profitNet < 0, actualMonths: monthsDuration };
  }, [bondAmount, selectedBondId, earlyExit, exitMonth]);

  const bondGrowthData = useMemo(() => {
      if (!bondCalculation) return [];
      const bond = bondCalculation.bondDetails;
      const data = [];
      const years = Math.ceil(bond.durationMonths / 12);
      
      let currentVal = bondCalculation.invested;
      const rate = bond.rate / 100;

      for(let y = 0; y <= years; y++) {
          data.push({
              year: y,
              value: Number(currentVal.toFixed(2)),
              invested: bondCalculation.invested
          });
          
          if (bond.capitalization === 'compound_year') {
              currentVal = currentVal * (1 + rate);
          } else {
              currentVal += (bondCalculation.invested * rate); 
          }
      }
      return data;
  }, [bondCalculation]);

  const handleBondAI = async () => {
    if (bondAI.loading) return;
    setBondAI({ text: "", loading: true });
    try {
      const prompt = `Jesteś ekspertem od obligacji. Wybrano obligację: ${selectedBondId}. Kwota: ${bondAmount} PLN. Zysk netto: ${bondCalculation.net.toFixed(2)} PLN. Oceń krótko ten wybór.`;
      const result = await model.generateContent(prompt);
      setBondAI({ text: result.response.text(), loading: false });
    } catch (error) { setBondAI({ text: "Błąd połączenia.", loading: false }); }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">
        <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={36}/>
              Obligacje Skarbowe
            </h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-slate-600 max-w-2xl text-lg">
                Najbezpieczniejsza forma oszczędzania w Polsce. Państwo pożycza od Ciebie pieniądze i oddaje z procentem.
                </p>
                <a href="https://www.obligacjeskarbowe.pl/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                Kup oficjalnie <ExternalLink size={14} />
                </a>
            </div>
        </div>

        <div className="flex gap-4 mb-8">
            <button onClick={() => setActiveBondType('standard')} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeBondType === 'standard' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200'}`}>Standardowe</button>
            <button onClick={() => setActiveBondType('family')} className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeBondType === 'family' ? 'bg-pink-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200'}`}><Baby size={18}/> Rodzinne 800+</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {(activeBondType === 'standard' ? STANDARD_BONDS : FAMILY_BONDS).map(bond => (
              <Card key={bond.id} isFamily={activeBondType === 'family'} selected={selectedBondId === bond.id} onClick={() => setSelectedBondId(bond.id)} className="flex flex-col h-full hover:-translate-y-1 transition-transform cursor-pointer">
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
                  <div className="text-xs text-slate-400 font-medium">{bond.durationMonths < 12 ? `${bond.durationMonths} mies.` : `${bond.durationMonths/12} lat(a)`}</div>
                </div>
              </Card>
            ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-12">
            <div className="grid lg:grid-cols-2">
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
                    <h3 className="text-xl font-bold mb-6">Parametry</h3>
                    <div className="space-y-6">
                        <InputGroup label="Kwota inwestycji" value={bondAmount} onChange={setBondAmount} suffix="PLN" step="100" min="100" />
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={earlyExit} onChange={(e) => setEarlyExit(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                <span className="font-semibold text-slate-700 text-sm">Wcześniejszy wykup?</span>
                            </label>
                            {earlyExit && bondCalculation && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Czas wykupu</span>
                                        <span className="text-sm font-bold text-blue-600">
                                            {exitMonth < 12 ? `${exitMonth} miesiąc` : `Rok ${Math.floor(exitMonth/12)}, miesiąc ${exitMonth%12 || 12}`}
                                        </span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max={bondCalculation.bondDetails.durationMonths} 
                                        step="1" 
                                        value={exitMonth} 
                                        onChange={(e) => setExitMonth(e.target.value)} 
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <p className="text-xs text-orange-600 mt-2 font-medium">
                                        Opłata: {bondCalculation.bondDetails.earlyExitFee.toFixed(2)} zł / obligację.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-8 bg-white relative flex flex-col justify-center">
                    {bondCalculation && (
                        <div className="text-center space-y-6">
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-slate-400 uppercase">Wynik finansowy (Netto)</div>
                                <div className={`text-5xl font-black ${bondCalculation.isLoss ? 'text-red-500' : 'text-green-600'}`}>
                                    {bondCalculation.isLoss ? '' : '+'}{formatMoney(bondCalculation.net)}
                                </div>
                            </div>

                            <div className="h-32 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { name: 'Wpłata', value: bondCalculation.invested, fill: '#94a3b8' },
                                        { name: 'Zysk', value: bondCalculation.net, fill: '#22c55e' },
                                        { name: 'Podatek', value: bondCalculation.tax, fill: '#f87171' },
                                    ]} layout="vertical" margin={{top: 0, right: 30, left: 40, bottom: 0}} barSize={20}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={60} style={{fontSize: '12px', fontWeight: 'bold', fill: '#64748b'}}/>
                                        <RechartsTooltip cursor={{fill: 'transparent'}} formatter={(val) => [formatMoney(val), 'Wartość']} contentStyle={{borderRadius: '12px'}}/>
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="text-xs font-bold text-slate-400 uppercase mb-2 text-left">Wzrost w czasie (Kapitalizacja)</div>
                                <div className="h-32 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={bondGrowthData}>
                                            <defs>
                                                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="year" hide />
                                            <YAxis hide domain={['dataMin', 'auto']}/>
                                            <RechartsTooltip 
                                                contentStyle={{borderRadius: '12px', border: 'none'}}
                                                formatter={(val) => [formatMoney(val), 'Wartość']}
                                                labelFormatter={(l) => `Rok ${l}`}
                                            />
                                            <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorGrowth)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="text-sm text-slate-500 flex justify-between px-2">
                                <span>Wpłata: <b>{formatMoney(bondCalculation.invested)}</b></span>
                                <span>Razem: <b>{formatMoney(bondCalculation.total)}</b></span>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <button onClick={handleBondAI} disabled={bondAI.loading} className="w-full flex justify-center items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                                    {bondAI.loading ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                                    {bondAI.loading ? "Analizuję..." : "Co na to AI?"}
                                </button>
                                <AICard text={bondAI.text} isLoading={bondAI.loading} onClose={() => setBondAI(p => ({...p, text: ""}))} title="Opinia AI" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 className="text-3xl font-bold mb-4 flex items-center gap-3"><TrendingUp className="text-red-500"/> Wróg nr 1: Inflacja</h3>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        Inflacja to proces utraty siły nabywczej pieniądza. Oznacza to, że za tę samą kwotę (np. 100 zł) możesz kupić mniej towarów i usług niż rok wcześniej. Jest mierzona wskaźnikiem CPI (Consumer Price Index) przez Główny Urząd Statystyczny.
                    </p>
                    <div className="bg-white/10 p-6 rounded-2xl border border-white/10 mb-6 space-y-4">
                        <h4 className="font-bold text-yellow-400 flex items-center gap-2"><ShieldCheck size={18}/> Jak chronią obligacje (EDO/COI/ROD)?</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Te obligacje posiadają mechanizm <strong>indeksacji inflacją</strong>. Ich oprocentowanie w kolejnych latach nie jest stałe, lecz jest sumą dwóch składników:
                        </p>
                        <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                            <li><strong>Wskaźnik inflacji:</strong> Jeśli inflacja wyniesie 5%, oprocentowanie wzrośnie o te 5%. To gwarantuje, że kapitał "goni" rosnące ceny.</li>
                            <li><strong>Stała marża:</strong> Dodatkowy zysk (np. 1.25% czy 2.00%) ponad inflację. To Twój realny zarobek.</li>
                        </ul>
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-300 text-xs font-bold border border-green-500/30">
                            Wzór: Inflacja (np. 6%) + Marża (2%) = 8% zysku w kolejnym roku.
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 h-[350px]">
                    <h4 className="text-center text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Inflacja w Polsce (r/r)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={INFLATION_DATA} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155"/>
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} tickMargin={10}/>
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} unit="%" width={40} tickMargin={10}/>
                            <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}/>
                            <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]}>
                                <div className="text-white font-bold text-xs text-center mt-2">X</div>
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
};
const CompoundView = () => {
  // --- ZMIENNE ---
  const [compoundPrincipal, setCompoundPrincipal] = useState(10000);
  const [compoundYears, setCompoundYears] = useState(10);
  const [compoundMonths, setCompoundMonths] = useState(0);
  const [compoundRate, setCompoundRate] = useState(5);
  const [compoundFreq, setCompoundFreq] = useState(12);
  const [compoundAI, setCompoundAI] = useState({ text: "", loading: false });

  // OBLICZENIA
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

  const handleCompoundAI = async () => {
    if (compoundAI.loading) return;
    setCompoundAI({ text: "", loading: true });
    try {
      const prompt = `Jesteś zabawnym i motywującym asystentem finansowym. Użytkownik oszczędzał przez ${compoundYears} lat i ${compoundMonths} miesięcy. Wpłacił: ${compoundPrincipal} PLN. Zarobił na czysto: ${totalCompoundProfit.toFixed(2)} PLN. Napisz kreatywne porównanie, co można kupić za ten zysk.`;
      const result = await model.generateContent(prompt);
      setCompoundAI({ text: result.response.text(), loading: false });
    } catch (error) { setCompoundAI({ text: "Błąd AI.", loading: false }); }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto">
        <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kalkulator Procentu Składanego</h2>
            <p className="text-slate-600 max-w-2xl text-lg">Sprawdź efekt "kuli śnieżnej". Zobacz jak rosną pieniądze, gdy odsetki zarabiają kolejne odsetki.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-4 space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
                <InputGroup label="Kwota początkowa" value={compoundPrincipal} onChange={setCompoundPrincipal} suffix="PLN" step="100" />
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Lata" value={compoundYears} onChange={setCompoundYears} suffix="lat" />
                    <InputGroup label="Miesiące" value={compoundMonths} onChange={setCompoundMonths} suffix="msc" />
                </div>
                <InputGroup label="Oprocentowanie (%)" value={compoundRate} onChange={setCompoundRate} suffix="%" step="0.1" />
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kapitalizacja</label>
                    <select value={compoundFreq} onChange={(e) => setCompoundFreq(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl p-4">
                        <option value={12}>Co miesiąc</option><option value={365}>Codziennie</option><option value={1}>Raz w roku</option>
                    </select>
                </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center min-h-[200px]">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Coins size={120} /></div>
                    <div className="relative z-10">
                        <div className="text-slate-400 font-medium mb-1">Po {compoundYears} latach będziesz mieć:</div>
                        <div className="text-5xl font-black tracking-tight mb-2">{formatMoney(finalCompoundAmount)}</div>
                        <div className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                            Zysk: +{formatMoney(totalCompoundProfit)}
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={compoundData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorZysk" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorKapital" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" stroke="#94a3b8" tickFormatter={(val) => `${val} lat`} fontSize={12} tickMargin={10} />
                            <YAxis stroke="#94a3b8" tickFormatter={(val) => `${val/1000}k`} fontSize={12} tickMargin={10} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <Legend verticalAlign="top" height={36}/>
                            <RechartsTooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none' }} 
                                formatter={(value) => [formatMoney(value), '']} 
                            />
                            <Area type="monotone" dataKey="kapital" name="Wpłacony kapitał" stackId="1" stroke="#3b82f6" fill="url(#colorKapital)" strokeWidth={2} />
                            <Area type="monotone" dataKey="zysk" name="Wypracowany zysk" stackId="1" stroke="#8b5cf6" fill="url(#colorZysk)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                <button onClick={handleCompoundAI} disabled={compoundAI.loading} className="flex items-center gap-2 text-indigo-700 font-bold text-sm hover:text-indigo-900 transition-colors">
                    <Sparkles size={16}/> {compoundAI.loading ? "Myślę..." : "Co kupię za ten zysk? (AI)"}
                </button>
                <AICard text={compoundAI.text} isLoading={compoundAI.loading} onClose={() => setCompoundAI(p => ({...p, text: ""}))} />
            </div>
        </div>
    </div>
  );
};
const StocksView = () => {
  // --- ZMIENNE ---
  const [etfAmount, setEtfAmount] = useState(10000);
  const [etfStartYear, setEtfStartYear] = useState(2015);
  const [selectedEtf, setSelectedEtf] = useState('sp500');

  // OBLICZENIA
  const etfCalculation = useMemo(() => {
      const etf = ETF_DATA_MOCK[selectedEtf];
      const data = [];
      let currentValue = parseFloat(etfAmount) || 0;
      
      const years = Object.keys(etf.returns).filter(y => y >= etfStartYear);
      
      data.push({ year: etfStartYear - 1, value: etfAmount, invested: etfAmount, change: 0 }); // Initial

      years.forEach(year => {
          const changePercent = etf.returns[year];
          const changeAmount = currentValue * (changePercent / 100);
          currentValue += changeAmount;
          data.push({
              year: year,
              value: Number(currentValue.toFixed(2)),
              invested: etfAmount,
              change: changePercent
          });
      });

      const totalProfit = currentValue - etfAmount;
      const totalPercent = ((totalProfit / etfAmount) * 100).toFixed(2);

      return { data, totalProfit, totalPercent, finalValue: currentValue, etfDetails: etf };
  }, [etfAmount, etfStartYear, selectedEtf]);

  return (
    <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-12">
        <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900">Akcje i ETF</h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                Przewodnik po świecie rynków finansowych. Od zakupu udziałów w gigantach, przez bezpieczne fundusze ETF, aż po ryzykowne kontrakty.
            </p>
        </div>

        {/* --- RACHUNEK MAKLERSKI --- */}
        <div className="mb-20 bg-blue-50 border border-blue-100 rounded-[2rem] p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-900"><FileText className="text-blue-600"/> Rachunek Maklerski - Twoja Brama</h3>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <p className="text-slate-700 mb-4 leading-relaxed">
                        Aby kupić akcje lub ETF, musisz posiadać <strong>rachunek maklerski</strong>. To specjalne konto bankowe, które pozwala na handel na giełdzie. Zwykłe konto ROR do tego nie służy.
                    </p>
                    <h4 className="font-bold text-blue-800 mb-2 mt-6">Na co zwrócić uwagę przy wyborze?</h4>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                        <li><strong>Prowizje:</strong> Szukaj kont "0% prowizji" dla akcji i ETF (do pewnego limitu obrotu).</li>
                        <li><strong>Dostęp do rynków:</strong> Czy broker oferuje giełdy zagraniczne (USA, Niemcy, Londyn)? Polskie IKE/IKZE często mają ograniczony wybór.</li>
                        <li><strong>PIT-8C:</strong> Czy broker to polska instytucja, która automatycznie wyśle Ci PIT do rozliczenia podatku? Zagraniczni brokerzy tego nie robią.</li>
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4">Dlaczego go potrzebujesz?</h4>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="bg-blue-100 p-2 rounded text-blue-700 h-fit"><ShieldCheck size={18}/></div>
                            <div className="text-sm text-slate-600">Bezpieczeństwo - aktywa są zapisane w Krajowym Depozycie Papierów Wartościowych na Twoje nazwisko.</div>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-blue-100 p-2 rounded text-blue-700 h-fit"><Globe size={18}/></div>
                            <div className="text-sm text-slate-600">Dostęp globalny - jednym kliknięciem kupujesz udziały w firmach z drugiego końca świata.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- AKCJE SZCZEGÓŁOWO --- */}
        <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-rose-100 p-2 rounded-xl text-rose-600"><PieChart size={32}/></div>
                <h3 className="text-3xl font-bold text-slate-900">Co to są Akcje?</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
                <div className="space-y-6 text-slate-600 leading-relaxed">
                    <div className="prose prose-slate">
                        <h4 className="text-lg font-bold text-slate-800">Definicja</h4>
                        <p>Akcja to papier wartościowy potwierdzający, że jesteś współwłaścicielem ułamkowej części spółki akcyjnej. Nie pożyczasz firmie pieniędzy (jak w obligacjach), ale kupujesz jej fragment.</p>
                        
                        <h4 className="text-lg font-bold text-slate-800 mt-6">Zalety i Szanse</h4>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Nieograniczony zysk:</strong> Cena akcji może wzrosnąć o 100%, 1000% lub więcej w długim terminie.</li>
                            <li><strong>Dywidendy:</strong> Regularne wypłaty gotówki z zysku firmy.</li>
                            <li><strong>Ochrona przed inflacją:</strong> Dobre firmy podnoszą ceny swoich produktów, więc ich zyski (i ceny akcji) rosną wraz z inflacją.</li>
                            <li><strong>Prawo głosu:</strong> Możesz uczestniczyć w Walnym Zgromadzeniu Akcjonariuszy.</li>
                        </ul>

                        <h4 className="text-lg font-bold text-slate-800 mt-6">Wady i Ryzyka</h4>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>Zmienność:</strong> Ceny mogą spaść o 20-50% w czasie kryzysu. To test psychiki.</li>
                            <li><strong>Bankructwo:</strong> Jeśli firma upadnie, akcjonariusze są spłacani na samym końcu (zazwyczaj tracą 100% kapitału).</li>
                            <li><strong>Brak gwarancji:</strong> Nikt nie obiecuje zysku. Wszystko zależy od kondycji firmy i gospodarki.</li>
                        </ul>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-4 flex items-center gap-2"><Globe size={20}/> Giełdy Świata (Godziny PL)</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-rose-100 shadow-sm">
                                <span className="font-bold text-slate-700">🇺🇸 NYSE / Nasdaq (USA)</span>
                                <span className="text-slate-500 font-mono">15:30 – 22:00</span>
                            </li>
                            <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-rose-100 shadow-sm">
                                <span className="font-bold text-slate-700">🇬🇧 LSE (Londyn)</span>
                                <span className="text-slate-500 font-mono">09:00 – 17:30</span>
                            </li>
                            <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-rose-100 shadow-sm">
                                <span className="font-bold text-slate-700">🇵🇱 GPW (Warszawa)</span>
                                <span className="text-slate-500 font-mono">09:00 – 17:00</span>
                            </li>
                            <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-rose-100 shadow-sm">
                                <span className="font-bold text-slate-700">🇯🇵 JPX (Tokio)</span>
                                <span className="text-slate-500 font-mono">01:00 – 07:00</span>
                            </li>
                        </ul>
                        <p className="text-[10px] text-rose-600/60 mt-4 text-center">Ciekawostka: Nowojorska giełda (NYSE) jest warta więcej niż wszystkie inne giełdy z tej listy razem wzięte.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-2">Po co inwestować w akcje?</h4>
                        <p className="text-sm text-slate-600">
                            Aby stać się beneficjentem rozwoju gospodarczego. Zamiast tylko kupować iPhone'a (wydawać pieniądze), kupujesz akcje Apple (zarabiasz na tym, że inni kupują). To przejście z bycia konsumentem na bycie kapitalistą.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- ETF SZCZEGÓŁOWO --- */}
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-16 mb-20 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-500 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30"><LayoutGrid size={40}/></div>
                    <div>
                        <h3 className="text-3xl md:text-4xl font-black">ETF (Exchange Traded Fund)</h3>
                        <p className="text-blue-300">Najlepszy przyjaciel pasywnego inwestora.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h4 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="text-yellow-400"/> Co to właściwie jest?</h4>
                        <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                            Wyobraź sobie, że chcesz kupić wszystkie 500 największych firm w USA. Musiałbyś zrobić 500 przelewów i zapłacić 500 prowizji. Zamiast tego kupujesz <strong>jeden ETF (np. na indeks S&P 500)</strong>. 
                            To "koszyk", w którym już są te wszystkie akcje. ETF jest notowany na giełdzie tak jak zwykła akcja - możesz go kupić i sprzedać w każdej sekundzie działania giełdy.
                        </p>
                        
                        <h4 className="text-xl font-bold mb-4 flex items-center gap-2"><Coins className="text-yellow-400"/> Rodzaje i Koszty</h4>
                        <ul className="space-y-3 text-sm text-slate-300 mb-6">
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-400"/> <strong>Akcyjne:</strong> Naśladują giełdy (np. USA, Niemcy, Cały Świat).</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-400"/> <strong>Obligacyjne:</strong> Bezpieczniejsze, zawierają obligacje rządowe/korporacyjne.</li>
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-400"/> <strong>Surowcowe:</strong> Dają ekspozycję na złoto, srebro, ropę (bez trzymania beczek w piwnicy).</li>
                        </ul>
                        <p className="text-slate-300 leading-relaxed text-sm">
                            <strong>TER (Total Expense Ratio):</strong> To opłata za zarządzanie, pobierana automatycznie z aktywów funduszu. W ETF jest mikroskopijna (często 0.07% - 0.20% rocznie). Zwykłe fundusze w banku pobierają 10-20 razy więcej!
                        </p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                        <h4 className="text-lg font-bold mb-4 text-center">Popularne ETF-y</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-white/5">
                                <span className="font-bold text-green-400">iShares Core S&P 500</span>
                                <span className="text-xs text-slate-400">500 największych firm USA</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-white/5">
                                <span className="font-bold text-blue-400">Vanguard FTSE All-World</span>
                                <span className="text-xs text-slate-400">3700+ firm z całego świata</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-white/5">
                                <span className="font-bold text-yellow-400">Invesco Physical Gold</span>
                                <span className="text-xs text-slate-400">Zabezpieczone fizycznym złotem</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-white/5">
                                <span className="font-bold text-red-400">Beta ETF WIG20TR</span>
                                <span className="text-xs text-slate-400">Polski rynek (z dywidendami)</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10 text-center">
                            <span className="text-xs text-slate-400">ETF to idealne rozwiązanie dla osób, które chcą inwestować, ale nie mają czasu na analizę spółek. "Kup i zapomnij".</span>
                        </div>
                    </div>
                </div>

                {/* KALKULATOR ETF */}
                <div className="bg-white text-slate-900 rounded-[2rem] p-8">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calculator className="text-blue-600"/> Symulator ETF</h3>
                    <p className="text-sm text-slate-500 mb-8 max-w-2xl">
                        Zobacz, ile zarobiłbyś (lub stracił), inwestując w przeszłości. Pamiętaj: wyniki historyczne nie gwarantują przyszłych zysków!
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <InputGroup label="Kwota inwestycji" value={etfAmount} onChange={setEtfAmount} suffix="PLN" step="1000" />
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Rok rozpoczęcia</label>
                            <select value={etfStartYear} onChange={(e) => setEtfStartYear(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl p-4">
                                {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Wybierz ETF</label>
                            <select value={selectedEtf} onChange={(e) => setSelectedEtf(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl p-4">
                                {Object.entries(ETF_DATA_MOCK).map(([key, val]) => (
                                    <option key={key} value={key}>{val.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 h-[300px] mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={etfCalculation.data}>
                                <defs>
                                    <linearGradient id="colorEtf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" fontSize={12} tickMargin={10}/>
                                <YAxis fontSize={12} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} tickMargin={10}/>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                                <RechartsTooltip 
                                    contentStyle={{borderRadius: '12px', border: 'none'}}
                                    formatter={(value, name, props) => {
                                        if (name === 'value') return [formatMoney(value), 'Wartość portfela'];
                                        if (name === 'change') return [`${value}%`, 'Zmiana r/r'];
                                        return [value, name];
                                    }}
                                    labelFormatter={(l) => `Rok ${l}`}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="value" name="Wartość" stroke="#2563eb" fill="url(#colorEtf)" strokeWidth={3}/>
                                <Line type="monotone" dataKey="invested" name="Wpłata" stroke="#94a3b8" strokeDasharray="5 5" dot={false}/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between bg-slate-100 rounded-2xl p-6">
                        <div>
                            <div className="font-bold text-slate-900 text-lg">{etfCalculation.etfDetails.name}</div>
                            <div className="text-slate-500 text-sm">{etfCalculation.etfDetails.desc}</div>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                            <div className="text-xs font-bold text-slate-400 uppercase">Wynik końcowy</div>
                            <div className={`text-3xl font-black ${etfCalculation.totalProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {etfCalculation.totalProfit > 0 ? '+' : ''}{formatMoney(etfCalculation.totalProfit)}
                            </div>
                            <div className={`text-sm font-bold ${etfCalculation.totalProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                ({etfCalculation.totalPercent}%)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* --- JAK KUPIĆ / ZARZĄDZAĆ --- */}
        <div className="mb-20">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2"><ShoppingCart size={28} className="text-slate-700"/> Poradnik Praktyczny</h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl text-slate-300">1</div>
                    <h4 className="font-bold text-slate-900 mb-2">Jak kupić?</h4>
                    <ul className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
                        <li>Załóż <strong>rachunek maklerski</strong> (np. w swoim banku, XTB, BOŚ).</li>
                        <li>Przelej środki na konto.</li>
                        <li>Znajdź akcję/ETF po nazwie lub symbolu (np. "AAPL" dla Apple, "WIG20" dla Polski).</li>
                        <li>Wpisz liczbę sztuk i kliknij "Kup". Gotowe!</li>
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl text-slate-300">2</div>
                    <h4 className="font-bold text-slate-900 mb-2">Zarządzanie</h4>
                    <p className="text-sm text-slate-600 mb-2">
                        W przypadku ETF - nie robisz nic. Czekasz latami ("buy and hold").
                    </p>
                    <p className="text-sm text-slate-600">
                        W przypadku Akcji - musisz śledzić raporty finansowe spółki. Jeśli fundamenty firmy się pogorszą, warto rozważyć sprzedaż. Unikaj częstego handlu ("daytradingu"), bo zjedzą Cię prowizje.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl text-slate-300">3</div>
                    <h4 className="font-bold text-slate-900 mb-2">Podatki (Sprzedaż)</h4>
                    <p className="text-sm text-slate-600 mb-2">
                        Dopóki trzymasz akcje - nie płacisz podatku (chyba że dywidenda).
                    </p>
                    <p className="text-sm text-slate-600">
                        Gdy sprzedasz z zyskiem, musisz zapłacić <strong>19% podatku Belki</strong>. Polski broker wyśle Ci PIT-8C, który przepisujesz do swojego rocznego zeznania podatkowego (PIT-38).
                    </p>
                </div>
            </div>
        </div>

        {/* --- DYWIDENDA --- */}
        <div className="bg-green-50 rounded-[2.5rem] p-8 md:p-12 mb-20 border border-green-100">
            <h3 className="text-3xl font-bold text-green-900 mb-6 flex items-center gap-3"><Coins className="text-green-600"/> Dywidenda - Twoja "wypłata"</h3>
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <p className="text-green-800 leading-relaxed">
                        To część zysku netto firmy, którą dzieli się ona ze swoimi współwłaścicielami (czyli Tobą!). 
                        Np. Jeśli Coca-Cola zarobi miliardy, może wypłacić 0.50$ za każdą akcję, którą posiadasz.
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                        <h4 className="font-bold text-green-900 text-sm mb-2">Ważne pojęcia:</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                            <li><strong>Dzień dywidendy (T):</strong> Musisz mieć akcje TEGO dnia po zamknięciu sesji, by dostać kasę.</li>
                            <li><strong>Dzień wypłaty:</strong> Dzień, kiedy gotówka fizycznie wpada na Twoje konto maklerskie (zwykle 2-3 tyg. później).</li>
                            <li><strong>Dividend Yield (Stopa dywidendy):</strong> Ile procent ceny akcji stanowi dywidenda (np. akcja 100 zł, dywidenda 5 zł = 5%).</li>
                        </ul>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4">Dywidendy w ETF</h4>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="bg-slate-100 p-2 rounded text-slate-700 font-bold text-xs h-fit">ACC</div>
                            <div>
                                <span className="font-bold text-slate-800 text-sm block">Accumulating (Akumulujący)</span>
                                <span className="text-xs text-slate-500">Fundusz automatycznie kupuje więcej akcji za otrzymane dywidendy. Nie płacisz podatku po drodze! Cena jednostki rośnie szybciej.</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-slate-100 p-2 rounded text-slate-700 font-bold text-xs h-fit">DIST</div>
                            <div>
                                <span className="font-bold text-slate-800 text-sm block">Distributing (Dystrybuujący)</span>
                                <span className="text-xs text-slate-500">Fundusz wypłaca gotówkę na Twoje konto. Fajne, by mieć pasywny dochód, ale musisz zapłacić 19% podatku od razu.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CFD WARNING --- */}
        <div className="bg-slate-50 border-2 border-red-100 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold text-sm mb-6">
                    <Siren size={18} className="animate-pulse"/> Strefa Wysokiego Ryzyka
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">CFD (Kontrakty Różnicowe)</h3>
                
                <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                    To nie jest inwestowanie. To zakład o cenę. Kupując CFD na złoto, nie masz złota. Kupując CFD na akcje Google, nie jesteś akcjonariuszem. Zakładasz się tylko z brokerem, czy cena wzrośnie czy spadnie.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                    <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                        <div className="text-red-600 mb-3"><Zap size={32}/></div>
                        <h4 className="font-bold text-slate-900 mb-2">Dźwignia (Levar)</h4>
                        <p className="text-sm text-slate-600">Mechanizm, który mnoży Twoje zyski, ale też i straty. Przy dźwigni 1:10, spadek ceny o 10% czyści Twoje konto do zera.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                        <div className="text-red-600 mb-3"><CandlestickChart size={32}/></div>
                        <h4 className="font-bold text-slate-900 mb-2">Statystyki</h4>
                        <p className="text-sm text-slate-600">Prawo nakazuje brokerom podawać te dane. Zwykle <strong>70% do 80%</strong> inwestorów detalicznych TRACI pieniądze na CFD.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                        <div className="text-red-600 mb-3"><XCircle size={32}/></div>
                        <h4 className="font-bold text-slate-900 mb-2">Dla kogo?</h4>
                        <p className="text-sm text-slate-600">Wyłącznie dla doświadczonych spekulantów (traderów). Jeśli dopiero zaczynasz, trzymaj się z daleka.</p>
                    </div>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-800 text-sm font-bold">
                    Odradzamy instrumenty CFD osobom początkującym. Ryzyko utraty kapitału jest niewspółmiernie wysokie do potencjalnych korzyści na starcie przygody z giełdą.
                </div>
            </div>
        </div>
    </div>
  );
};
const PpkView = () => (
    <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
               <PiggyBank size={14}/> Darmowa kasa od szefa?
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900">PPK w Praktyce</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Pracownicze Plany Kapitałowe to system, w którym na Twoją przyszłość zrzucają się trzy strony: Ty, Twój Pracodawca oraz Państwo.
            </p>
        </div>

        {/* JAK TO DZIAŁA - 3 STRONY */}
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 mb-16 relative overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                    <h3 className="text-2xl font-bold mb-6">Skąd biorą się pieniądze?</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">1</div>
                            <div>
                                <h4 className="font-bold text-blue-900 mb-1">Ty (Pracownik)</h4>
                                <p className="text-sm text-slate-600">
                                    Wpłacasz <strong>2%</strong> swojego wynagrodzenia brutto (potrącane z pensji netto).
                                    <span className="block mt-1 text-xs text-slate-400">*Jeśli zarabiasz mało (mniej niż 1.2 minimalnej), możesz obniżyć wpłatę do 0.5%.</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">2</div>
                            <div>
                                <h4 className="font-bold text-green-900 mb-1">Pracodawca (Szef)</h4>
                                <p className="text-sm text-slate-600">
                                    Dkłada <strong>1.5%</strong> Twojego wynagrodzenia brutto. To ekstra podwyżka, której nie dostałbyś do ręki!
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">3</div>
                            <div>
                                <h4 className="font-bold text-orange-900 mb-1">Państwo (Fundusz Pracy)</h4>
                                <p className="text-sm text-slate-600">
                                    Daje <strong>250 zł</strong> na powitanie (po 3 msc) oraz <strong>240 zł</strong> co roku (jeśli wpłacisz minimum).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* WYKRES SKŁADEK - NOWY COMPACT BAR */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-center h-full min-h-[300px]">
                    <h4 className="font-bold text-slate-500 mb-6 text-sm uppercase tracking-wider text-center">Twoja wpłata vs Reszta (Miesięcznie)</h4>
                    
                    <div className="space-y-6">
                        <div className="relative pt-6">
                            <div className="flex mb-2 items-center justify-between text-xs font-bold text-slate-500">
                                <span>Ty (2%)</span>
                                <span>~100 zł</span>
                            </div>
                            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-full"></div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex mb-2 items-center justify-between text-xs font-bold text-slate-500">
                                <span>Pracodawca (1.5%) + Państwo</span>
                                <span>~95 zł (Gratis!)</span>
                            </div>
                            <div className="h-4 bg-slate-200 rounded-full overflow-hidden flex">
                                <div className="h-full bg-green-500 w-[75%]"></div>
                                <div className="h-full bg-orange-500 w-[25%]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                        <div className="text-3xl font-black text-slate-900 mb-1">+95%</div>
                        <div className="text-xs text-slate-500">Natychmiastowego zysku na starcie z wpłat szefa i państwa.</div>
                    </div>
                </div>
            </div>
        </div>

        {/* ZARZĄDZANIE PPK */}
        <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2"><Briefcase className="text-slate-700"/> Zarządzanie Twoim PPK</h3>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4"><Repeat size={24}/></div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">Zmiana Funduszy</h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        Domyślnie jesteś przypisany do funduszu "zdefiniowanej daty" odpowiedniego dla Twojego wieku (im starszy jesteś, tym bezpieczniej inwestują).
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex gap-2 items-start"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0"/> <strong>Możesz to zmienić:</strong> Zaloguj się na konto w instytucji finansowej obsługującej Twoje PPK.</li>
                        <li className="flex gap-2 items-start"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0"/> <strong>Konwersja/Zamiana:</strong> Możesz przenieść zgromadzone środki lub przyszłe wpłaty do funduszu o innym profilu ryzyka (np. bardziej agresywnego, jeśli akceptujesz ryzyko).</li>
                    </ul>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4"><Shuffle size={24}/></div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">Zmiana Pracy (Transfer)</h4>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        PPK "podąża" za Tobą, ale nie automatycznie. Gdy zmieniasz pracodawcę, masz dwie opcje:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex gap-2 items-start"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0"/> <strong>Zostawić:</strong> Środki zostają na starym koncie i pracują dalej. Będziesz miał po prostu dwa (lub więcej) konta PPK.</li>
                        <li className="flex gap-2 items-start"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0"/> <strong>Wypłata Transferowa:</strong> Złóż wniosek u NOWEGO pracodawcy o transfer środków ze starego PPK. Nowa instytucja przejmie Twoje oszczędności. Wszystko masz w jednym miejscu.</li>
                    </ul>
                </div>
            </div>
        </div>

        {/* W CO INWESTUJE PPK? */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-indigo-900 text-white p-8 rounded-[2rem] relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Activity className="text-pink-400"/> Gdzie trafiają pieniądze?</h3>
                    <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                        Nie musisz się na tym znać. PPK wykorzystuje mechanizm <strong>Funduszy Zdefiniowanej Daty</strong>. System automatycznie dopasowuje ryzyko inwestycyjne do Twojego wieku.
                    </p>
                    <ul className="space-y-4 text-sm">
                        <li className="flex gap-3 items-start">
                            <Zap className="text-yellow-400 shrink-0 mt-1" size={18}/>
                            <div>
                                <strong className="block text-white">Jesteś młody?</strong>
                                <span className="text-indigo-300">Większość środków inwestowana jest w akcje (wyższe ryzyko, potencjalnie wyższy zysk). Masz czas na odrobienie strat.</span>
                            </div>
                        </li>
                        <li className="flex gap-3 items-start">
                            <ShieldCheck className="text-green-400 shrink-0 mt-1" size={18}/>
                            <div>
                                <strong className="block text-white">Zbliżasz się do 60-tki?</strong>
                                <span className="text-indigo-300">System automatycznie przenosi środki w bezpieczne obligacje, aby chronić zgromadzony kapitał przed spadkami na giełdzie.</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <Coins className="absolute -bottom-10 -right-10 text-white opacity-5 w-64 h-64"/>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2rem]">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><HelpCircle className="text-slate-600"/> Częste pytania</h3>
                <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Czy to drugie OFE?</h4>
                        <p className="text-xs text-slate-600">Nie. Środki w OFE były publiczne. Środki w PPK są <strong>prywatne</strong> (tak jak lokata w banku) i dziedziczone. Gwarantuje to ustawa.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Czy mogę wpłacać więcej?</h4>
                        <p className="text-xs text-slate-600">Tak! Zarówno Ty (do +2%), jak i pracodawca (do +2.5%) możecie zadeklarować dodatkowe wpłaty dobrowolne. To świetny sposób na szybsze budowanie kapitału.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* WYPŁATA - CO Z KASĄ */}
        <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Czy pieniądze są zablokowane? (NIE!)</h3>
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-green-200 text-green-800 rounded-full flex items-center justify-center mb-4"><BadgeCheck size={20}/></div>
                    <h4 className="font-bold text-green-900 mb-2">Po 60. roku życia</h4>
                    <p className="text-xs text-green-800">
                        Wypłacasz wszystko bez podatku Belki. 25% jednorazowo, reszta w ratach przez 10 lat. To domyślny cel PPK.
                    </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center mb-4"><Home size={20}/></div>
                    <h4 className="font-bold text-blue-900 mb-2">Na mieszkanie</h4>
                    <p className="text-xs text-blue-800">
                        Przed 45. r.ż. możesz wypłacić do 100% na wkład własny. To nieoprocentowana pożyczka - musisz ją oddać w ciągu 15 lat.
                    </p>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-red-200 text-red-800 rounded-full flex items-center justify-center mb-4"><Activity size={20}/></div>
                    <h4 className="font-bold text-red-900 mb-2">Poważna choroba</h4>
                    <p className="text-xs text-red-800">
                        Wypłata do 25% środków bezzwrotnie w razie poważnej choroby Twojej, małżonka lub dzieci.
                    </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-slate-200 text-slate-800 rounded-full flex items-center justify-center mb-4"><DoorOpen size={20}/></div>
                    <h4 className="font-bold text-slate-900 mb-2">Zwrot (Wypłata teraz)</h4>
                    <p className="text-xs text-slate-600">
                        Możesz wypłacić całość w każdej chwili! Tracisz dopłaty od państwa, płacisz podatek od zysku, a 30% wpłat szefa wraca do ZUS (jako Twoja składka emerytalna). Mimo to, zazwyczaj i tak jesteś na plusie!
                    </p>
                </div>
            </div>
        </div>

        {/* CIEKAWOSTKI */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-[2rem] p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">PPK w liczbach</h3>
            <div className="grid grid-cols-3 gap-8 divide-x divide-white/20">
                <div>
                    <div className="text-3xl font-black mb-1">~3.5 mln</div>
                    <div className="text-xs opacity-80">Osób oszczędza w PPK</div>
                </div>
                <div>
                    <div className="text-3xl font-black mb-1">~25 mld zł</div>
                    <div className="text-xs opacity-80">Aktywów łącznie</div>
                </div>
                <div>
                    <div className="text-3xl font-black mb-1">+90%</div>
                    <div className="text-xs opacity-80">Średni zysk przy natychmiastowej wypłacie</div>
                </div>
            </div>
            <p className="text-[10px] mt-4 opacity-60">*Szacunkowy zysk uwzględniający dopłaty pracodawcy (po potrąceniu zwrotu do ZUS i podatku) w porównaniu do wpłaty własnej.</p>
        </div>
    </div>
);

const IkeView = () => (
    <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">
        {/* HERO SECTION */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
               <ShieldCheck size={14}/> Twoja tarcza podatkowa
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900">IKE oraz IKZE</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                To nie są produkty inwestycyjne. To specjalne "opakowania" na Twoje inwestycje, które chronią Twoje zyski przed podatkiem Belki (19%).
            </p>
        </div>

        {/* DWA FILARY - DEFINICJE */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* IKE CARD */}
            <div className="bg-white p-8 rounded-[2rem] border-2 border-blue-100 shadow-xl shadow-blue-50 relative overflow-hidden group hover:border-blue-300 transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Lock size={120} className="text-blue-600"/></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black text-blue-700 mb-2 flex items-center gap-2">IKE <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Indywidualne Konto Emerytalne</span></h3>
                    <p className="text-slate-600 mb-6 min-h-[80px]">
                        Twoja prywatna skarbonka na emeryturę (i nie tylko). Główna zaleta: <strong>brak podatku od zysków</strong> przy wypłacie. Możesz wypłacić wcześniej, ale wtedy zapłacisz podatek.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Percent size={20}/></div>
                            <div>
                                <span className="block text-sm font-bold text-slate-700">Ulga podatkowa</span>
                                <span className="text-xs text-slate-500">Zwolnienie z podatku Belki (19%) na koniec.</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><DoorOpen size={20}/></div>
                            <div>
                                <span className="block text-sm font-bold text-slate-700">Dostępność środków</span>
                                <span className="text-xs text-slate-500">Możesz wypłacić cześć lub całość w każdej chwili (tracisz wtedy ulgę).</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><TrendingUp size={20}/></div>
                             <div>
                                <span className="block text-sm font-bold text-slate-700">Limit wpłat (2025)</span>
                                <span className="text-xs text-slate-500">ok. 24 012 zł rocznie (300% średniego wynagrodzenia).</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* IKZE CARD */}
            <div className="bg-white p-8 rounded-[2rem] border-2 border-purple-100 shadow-xl shadow-purple-50 relative overflow-hidden group hover:border-purple-300 transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Umbrella size={120} className="text-purple-600"/></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black text-purple-700 mb-2 flex items-center gap-2">IKZE <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Indywidualne Konto Zabezpieczenia Emerytalnego</span></h3>
                    <p className="text-slate-600 mb-6 min-h-[80px]">
                        Narzędzie optymalizacji podatkowej "tu i teraz". Wpłaty odliczasz od dochodu w PIT, co daje <strong>zwrot podatku</strong> co roku. W zamian "zamrażasz" środki do 65 roku życia.
                    </p>
                    
                    <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Banknote size={20}/></div>
                            <div>
                                <span className="block text-sm font-bold text-slate-700">Ulga podatkowa</span>
                                <span className="text-xs text-slate-500">Odliczasz wpłatę od PIT. Dostajesz zwrot 12%, 19% lub 32% wpłaconej kwoty.</span>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Lock size={20}/></div>
                            <div>
                                <span className="block text-sm font-bold text-slate-700">Dostępność środków</span>
                                <span className="text-xs text-slate-500">Trudniejsza wypłata przed 65 r.ż. (całość naraz + podatek PIT).</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><TrendingUp size={20}/></div>
                             <div>
                                <span className="block text-sm font-bold text-slate-700">Limit wpłat (2025)</span>
                                <span className="text-xs text-slate-500">ok. 9 605 zł (standard) / 14 407 zł (przedsiębiorcy).</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* W CO INWESTUJEMY - ANALOGIA PUDEŁKA */}
        <div className="bg-slate-900 text-white rounded-[2rem] p-8 md:p-12 mb-16 relative overflow-hidden">
             <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">IKE i IKZE to "Pudełka" 📦</h3>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                        Często ludzie myślą, że IKE to konkretna lokata w banku. Błąd! IKE/IKZE to tylko etykieta prawna (opakowanie), którą nakłada się na zwykłe konto inwestycyjne. To, co włożysz do środka, zależy od Ciebie.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                            <Landmark className="text-yellow-400" size={24}/>
                            <div>
                                <span className="font-bold block">Konto Maklerskie (Najpopularniejsze)</span>
                                <span className="text-xs text-slate-400">Kupujesz akcje (Apple, Orlen), obligacje, fundusze ETF (S&P 500).</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                            <Briefcase className="text-blue-400" size={24}/>
                            <div>
                                <span className="font-bold block">Konto w TFI</span>
                                <span className="text-xs text-slate-400">Gotowe fundusze inwestycyjne zarządzane przez ekspertów.</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                            <ShieldCheck className="text-green-400" size={24}/>
                            <div>
                                <span className="font-bold block">Obligacje Skarbowe</span>
                                <span className="text-xs text-slate-400">Specjalne konto IKE-Obligacje (tylko w PKO BP) na obligacje EDO/COI.</span>
                            </div>
                        </div>
                         <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10 opacity-60">
                            <Landmark className="text-slate-400" size={24}/>
                            <div>
                                <span className="font-bold block">Lokata Bankowa</span>
                                <span className="text-xs text-slate-400">Rzadko opłacalne. Inflacja zwykle zjada zysk, mimo braku podatku.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hidden md:block">
                      {/* Prosta wizualizacja "Pudełka" */}
                      <div className="flex flex-col items-center">
                        <div className="w-48 h-48 border-4 border-dashed border-white/30 rounded-3xl flex items-center justify-center mb-4 relative">
                            <span className="absolute -top-4 bg-slate-900 px-4 text-sm font-bold text-yellow-400 border border-yellow-400 rounded-full">Twoje IKE</span>
                            <div className="grid grid-cols-2 gap-2 p-4">
                                <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center text-[8px] font-bold">AKCJE</div>
                                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-[8px] font-bold">ETF</div>
                                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-[8px] font-bold">OBLI</div>
                                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-[8px] font-bold">FIO</div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-slate-400">
                            Wkładasz aktywa do środka.<br/>Urząd Skarbowy nie może tam zajrzeć (dopóki nie wypłacisz).
                        </p>
                      </div>
                </div>
             </div>
        </div>

        {/* DETALICZNE PORÓWNANIE - TABELA */}
        <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">IKE vs IKZE - Starcie Gigantów</h3>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <div className="p-4">Cecha</div>
                    <div className="p-4 text-blue-600 bg-blue-50/50">IKE</div>
                    <div className="p-4 text-purple-600 bg-purple-50/50">IKZE</div>
                </div>
                
                {[
                    { feature: "Główna korzyść", ike: "Cały zysk dla Ciebie (0% podatku) na koniec.", ikze: "Zwrot podatku PIT co roku (nawet kilka tysięcy zł)." },
                    { feature: "Wiek wypłaty (Emerytura)", ike: "60 lat (lub 55 jeśli nabyłeś uprawnienia).", ikze: "65 lat." },
                    { feature: "Podatek przy wypłacie", ike: "0% (brak podatku Belki).", ikze: "10% ryczałtu od całej kwoty." },
                    { feature: "Wcześniejsza wypłata", ike: "Możliwa. Oddajesz podatek Belki (19%) od zysku.", ikze: "Trudna. Całość dolicza się do dochodu (PIT 12/32%)." },
                    { feature: "Dziedziczenie", ike: "Tak, bez podatku od spadków.", ikze: "Tak, bez podatku od spadków." },
                    { feature: "Kto może założyć?", ike: "Każdy > 16 roku życia.", ikze: "Każdy > 16 roku życia." },
                ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors text-sm md:text-base">
                        <div className="p-4 font-bold text-slate-700 flex items-center">{row.feature}</div>
                        <div className="p-4 text-slate-600 bg-blue-50/10">{row.ike}</div>
                        <div className="p-4 text-slate-600 bg-purple-50/10">{row.ikze}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* SYMULACJA KORZYŚCI - WYKRESY */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><TrendingUp className="text-blue-600"/> Magia IKE (Procent Składany)</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Porównanie inwestycji 1000 zł miesięcznie przez 20 lat (7% zysku). Na zwykłym koncie podatek "zjada" część zysku przy każdej sprzedaży/dywidendzie lub na końcu.
                </p>
                <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            { year: 0, zw: 0, ike: 0 },
                            { year: 5, zw: 71000, ike: 73000 },
                            { year: 10, zw: 165000, ike: 173000 },
                            { year: 15, zw: 290000, ike: 315000 },
                            { year: 20, zw: 460000, ike: 520000 }, // ~60k różnicy
                        ]} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                            <defs>
                                <linearGradient id="colorIke" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" fontSize={10} tickFormatter={(val) => `${val} lat`}/>
                            <YAxis fontSize={10} tickFormatter={(val) => `${val/1000}k`}/>
                            <RechartsTooltip contentStyle={{borderRadius: '12px'}}/>
                            <Area type="monotone" dataKey="zw" name="Zwykłe konto" stroke="#94a3b8" fill="#f1f5f9" strokeWidth={2}/>
                            <Area type="monotone" dataKey="ike" name="Konto IKE" stroke="#2563eb" fill="url(#colorIke)" strokeWidth={3}/>
                        </AreaChart>
                      </ResponsiveContainer>
                </div>
                <div className="text-center mt-4 font-bold text-blue-700 text-sm">
                    IKE wygrywa ok. 60 000 zł więcej "na rękę"!
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                 <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><Banknote className="text-purple-600"/> Magia IKZE (Zwrot podatku)</h3>
                 <p className="text-sm text-slate-500 mb-6">
                    Ile gotówki odzyskasz z Urzędu Skarbowego w 2025 wpłacając limit (ok. 9600 zł) na IKZE? Zależy od Twoich zarobków (progu podatkowego).
                 </p>
                 <div className="space-y-4">
                     {[
                         { label: "I Próg (12%)", return: "1 152 zł", width: "30%", color: "bg-slate-300" },
                         { label: "Podatek Liniowy (19%)", return: "1 824 zł", width: "50%", color: "bg-purple-300" },
                         { label: "II Próg (32%)", return: "3 072 zł", width: "85%", color: "bg-purple-600" },
                     ].map((item, idx) => (
                         <div key={idx}>
                             <div className="flex justify-between text-sm font-bold mb-1 text-slate-700">
                                 <span>{item.label}</span>
                                 <span>{item.return}</span>
                             </div>
                             <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                                 <div className={`h-full rounded-full ${item.color}`} style={{width: item.width}}></div>
                             </div>
                         </div>
                     ))}
                 </div>
                 <div className="mt-6 p-4 bg-purple-50 rounded-xl text-xs text-purple-800 leading-relaxed border border-purple-100">
                     <strong>Super-Tip:</strong> Jeśli ten zwrot podatku (np. 3000 zł) co roku też zainwestujesz, IKZE matematycznie miażdży IKE i każde inne konto!
                 </div>
            </div>
        </div>

        {/* KROKI - JAK ZAŁOŻYĆ */}
        <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Jak zacząć? To prostsze niż myślisz</h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="relative p-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-slate-200">1</div>
                    <h4 className="font-bold mb-2">Wybierz Instytucję</h4>
                    <p className="text-sm text-slate-500">Najlepiej <strong>Dom Maklerski</strong> (np. XTB, BOŚ, mBank) - najniższe opłaty i dostęp do ETFów na cały świat.</p>
                </div>
                <div className="relative p-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-slate-200">2</div>
                    <h4 className="font-bold mb-2">Wypełnij wniosek</h4>
                    <p className="text-sm text-slate-500">Wszystko online. Potwierdzasz tożsamość przelewem weryfikacyjnym lub zdjęciem dowodu. Trwa to 10-15 minut.</p>
                </div>
                <div className="relative p-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-slate-200">3</div>
                    <h4 className="font-bold mb-2">Przelej i Kup</h4>
                    <p className="text-sm text-slate-500">Wpłacasz pieniądze na wskazane konto i kupujesz akcje/obligacje. Pamiętaj: sama wpłata to nie inwestycja! Musisz coś kupić.</p>
                </div>
            </div>
        </div>

        {/* SCENARIUSZE - CO WYBRAĆ */}
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 md:p-12 mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Co jest lepsze dla Ciebie?</h3>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-black text-purple-700 mb-4 flex items-center gap-2"><Key className="rotate-90"/> Wybierz IKZE jeśli:</h4>
                    <ul className="space-y-3">
                        {[
                            "Zarabiasz dużo (wpadasz w II próg podatkowy 32%). Ulga jest wtedy gigantyczna.",
                            "Jesteś przedsiębiorcą na podatku liniowym (19%).",
                            "Jesteś zdyscyplinowany i będziesz reinwestować zwrot podatku.",
                            "Nie planujesz ruszać tych środków przed 65 rokiem życia."
                        ].map((txt, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                <CheckCircle size={16} className="text-purple-600 mt-0.5 shrink-0"/> {txt}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-black text-blue-700 mb-4 flex items-center gap-2"><DoorOpen/> Wybierz IKE jeśli:</h4>
                     <ul className="space-y-3">
                        {[
                            "Zarabiasz mało lub nie płacisz PIT (np. studenci do 26 r.ż.). Wtedy IKZE nie daje korzyści na start.",
                            "Chcesz mieć elastyczność – możliwość wypłaty pieniędzy np. na wkład własny do mieszkania za 5 lat.",
                            "Chcesz przejść na emeryturę wcześniej (już po 60 r.ż.).",
                            "Boisz się, że w przyszłości podatki wzrosną (w IKE masz gwarancję braku podatku)."
                        ].map((txt, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0"/> {txt}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
             <div className="mt-8 text-center">
                <span className="inline-block bg-slate-200 text-slate-800 px-4 py-2 rounded-xl font-bold text-sm">
                    Najlepsza strategia? Mieć OBA konta! Wpłacaj najpierw na IKZE (limit), a nadwyżki na IKE.
                </span>
            </div>
        </div>

        {/* CIEKAWOSTKI */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Lightbulb className="text-yellow-400"/> Czy wiesz, że...</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                         <p className="text-indigo-200 text-sm mb-4 leading-relaxed">
                            Mimo ogromnych korzyści, z IKE i IKZE korzysta zaledwie garstka Polaków. Większość trzyma pieniądze na zwykłych kontach, dobrowolnie oddając 19% zysku państwu.
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <div className="text-4xl font-black text-white">~6%</div>
                            <div className="text-xs text-indigo-300">Tylko tyle dorosłych Polaków<br/>aktywnie wpłaca na IKE/IKZE.</div>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="font-bold text-white mb-2 text-sm">Limit wpłat rośnie!</h4>
                        <p className="text-xs text-slate-400 mb-2">Limit jest powiązany z przeciętnym wynagrodzeniem w gospodarce. Skoro pensje rosną, to limity też.</p>
                        <div className="h-24 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { year: '2020', val: 15 },
                                    { year: '2021', val: 15.7 },
                                    { year: '2022', val: 17 },
                                    { year: '2023', val: 20 },
                                    { year: '2024', val: 23 },
                                    { year: '2025', val: 24 },
                                ]}>
                                    <Bar dataKey="val" fill="#fbbf24" radius={[4,4,0,0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center text-[10px] text-slate-500 mt-1">Wzrost limitu IKE (tys. zł)</div>
                    </div>
                </div>
            </div>
            <Sparkles className="absolute -bottom-10 -right-10 text-white opacity-5 w-64 h-64"/>
        </div>

        {/* PRZEKIEROWANIE */}
        <div className="flex justify-center mt-12 gap-4">
             <button onClick={() => navigate('/obligacje')} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                <ShieldCheck size={20}/> Zobacz Obligacje
             </button>
             <button onClick={() => navigate('/gielda')} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                <Activity size={20}/> Zobacz Akcje
             </button>
        </div>
    </div>
);