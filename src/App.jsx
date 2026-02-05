import { Helmet } from 'react-helmet-async';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart as PieChartIcon, Pie, Cell
} from 'recharts';
import {
  TrendingUp, Info, Banknote, ShieldCheck, Coins, AlertTriangle, Baby, Landmark, ChevronDown, ExternalLink, Sparkles, Loader2, ArrowRight,
  Briefcase, FileSignature, PenTool, Wallet, HelpCircle, Users, PiggyBank, Flame, Home, ArrowUpRight, Lock, CheckCircle, XCircle, Shuffle, School, ChevronUp, BookOpen, Scale, Umbrella, LayoutGrid, GraduationCap, ChevronLeft, Calculator, Lightbulb, ArrowRightCircle, Target, ThumbsUp, ThumbsDown, Building2, Clock, Percent, Activity, Key, DoorOpen, BadgeCheck, Zap, Globe, Siren, CandlestickChart, ShoppingCart, FileText, Repeat, PieChart, 
  Cpu, Bot, Fingerprint, Car, ArrowDown, CreditCard, AlertCircle, Calendar, RefreshCw, Ban, ListTree, Receipt, ShieldAlert, Navigation, History, FileWarning, ArrowDownCircle, ArrowUpCircle, TrendingDown, Heart, Atom, Pickaxe, Layers, Hammer, ScrollText, Search, AlertOctagon, Microscope, Rocket, Bitcoin, Anchor, RefreshCcw, Gavel, MousePointer2, ArrowRightLeft, MinusCircle, Truck, Compass
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MortgageView } from './MortgageView'; 
import { B2BView } from './B2BView';
import { GoldView } from './GoldView'; 
import CookieBanner from './CookieBanner';
import { RentVsBuyView } from './RentVsBuyView';
import { FireView } from './FireView';
import { PrivacyPolicyView } from './PrivacyPolicyView';
import { VatView } from './VatView';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { BankAccountsView } from './BankAccountsView';
import { SalaryView } from './SalaryView'; // Jeśli masz go w osobnym pliku



// --- KONFIGURACJA API GEMINI ---

// --- KONFIGURACJA API GEMINI ---
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
  { year: '2024', value: 3.7 }, 
  { year: '2025', value: 4.6 },
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
        returns: { 2015: 1.38, 2016: 11.96, 2017: 21.83, 2018: -4.38, 2019: 31.49, 2020: 18.40, 2021: 28.71, 2022: -18.11, 2023: 26.29, 2024: 24.2, 2025: 15.5 }    },
    'msci': { 
        name: 'MSCI World (Świat)', 
        desc: 'Ponad 1500 spółek z 23 krajów rozwiniętych.',
        risk: 'Średnie',
returns: { 2015: -0.87, 2016: 7.51, 2017: 22.40, 2018: -8.71, 2019: 27.67, 2020: 15.90, 2021: 21.82, 2022: -18.14, 2023: 23.79, 2024: 20.1, 2025: 12.0 }    },
    'wig20': { 
        name: 'WIG20 (Polska)', 
        desc: '20 największych polskich spółek (Orlen, PKO, KGHM...).',
        risk: 'Wysokie',
returns: { 2015: -19.7, 2016: 4.8, 2017: 26.4, 2018: -7.5, 2019: -5.6, 2020: -7.7, 2021: 14.3, 2022: -20.9, 2023: 30.8, 2024: 10.5, 2025: 8.2 }   },

    'nasdaq': { 
        name: 'Nasdaq 100 (Tech)', 
        desc: 'Spółki technologiczne. Duża zmienność, potencjalnie duży zysk.',
        risk: 'Bardzo Wysokie',
returns: { 2015: 8.43, 2016: 5.89, 2017: 31.52, 2018: -1.04, 2019: 37.96, 2020: 47.58, 2021: 26.63, 2022: -33.10, 2023: 55.13, 2024: 32.5, 2025: 20.0 }   },

    'gold': { 
        name: 'ETF na Złoto', 
        desc: 'Odzwierciedla cenę złota fizycznego.',
        risk: 'Średnie (Surowce)',
returns: { 2015: -10.4, 2016: 8.5, 2017: 13.1, 2018: -1.6, 2019: 18.3, 2020: 25.1, 2021: -3.6, 2022: -0.3, 2023: 13.1, 2024: 28.0, 2025: 18.0 }
    }
};

// --- GŁÓWNY KOMPONENT WIDOKU ---

// Helper do sumowania rocznego netto dla porównań
const getYearlyNetTotal = (brutto, type, params) => {
    const breakdown = calculateYearlyhelmet(brutto, type, params);
    return breakdown.reduce((acc, curr) => acc + curr.netto, 0);
};

// --- LOGIKA KALKULATORA helmet ---
const calculateB2B = (inputs) => {
    const { rateType, hourlyRate, hoursCount, monthlyNet, costs, taxType, zusType, sickLeave, ipBox, ryczaltRate, isVatPayer } = inputs;
    
    let revenue = 0;
    if (rateType === 'hourly') {
        revenue = (parseFloat(hourlyRate) || 0) * (parseFloat(hoursCount) || 0);
    } else {
        revenue = parseFloat(monthlyNet) || 0;
    }

    const monthlyCosts = parseFloat(costs) || 0;
    
    const ZUS_BASE_STANDARD = 5652.00; 
    const ZUS_BASE_PREFERENTIAL = 1441.80;
    
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
        healthZus = Math.max(432.54, income * 0.049);
        const deductibleHealth = Math.min(healthZus, 11600/12);
        taxBase = Math.round(Math.max(0, revenue - monthlyCosts - socialZus - deductibleHealth));
        const rate = ipBox ? 0.05 : 0.19;
        incomeTax = Math.round(taxBase * rate);

    } else if (taxType === 'skala') {
        const income = Math.max(0, revenue - monthlyCosts - socialZus);
        healthZus = Math.max(432.54, income * 0.09);
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
        if (yearlyRevenue < 60000) healthZus = 453.00;
        else if (yearlyRevenue < 300000) healthZus = 755.00;
        else healthZus = 1359.00;
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
        {/* TŁO (GRADIENT) - Tutaj dodajemy obsługę INDIGO */}
        <div className={`
            absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl opacity-10
            ${color === 'blue' ? 'bg-blue-500' : ''}
            ${color === 'green' ? 'bg-green-500' : ''}
            ${color === 'purple' ? 'bg-purple-500' : ''}
            ${color === 'pink' ? 'bg-pink-500' : ''}
            ${color === 'orange' ? 'bg-orange-500' : ''}
            ${color === 'teal' ? 'bg-teal-500' : ''}
            ${color === 'rose' ? 'bg-rose-500' : ''}
            ${color === 'indigo' ? 'bg-indigo-500' : ''} 
            ${color === 'yellow' ? 'bg-yellow-500' : ''}
            ${color === 'cyan' ? 'bg-cyan-500' : ''}
        `}></div>

        {badge && (
            <span className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                {badge}
            </span>
        )}

        {/* IKONA - Tutaj też dodajemy INDIGO */}
        <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors shadow-sm
            ${color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : ''}
            ${color === 'green' ? 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white' : ''}
            ${color === 'purple' ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : ''}
            ${color === 'pink' ? 'bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white' : ''}
            ${color === 'orange' ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white' : ''}
            ${color === 'teal' ? 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white' : ''}
            ${color === 'rose' ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' : ''}
            ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : ''}
            ${color === 'yellow' ? 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white' : ''}
            ${color === 'cyan' ? 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white' : ''}
        `}>
            <Icon size={28} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 font-medium mb-4 uppercase tracking-wider text-[10px]">{subtitle}</p>
        
        <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
            {description}
        </p>
        
        {/* PRZYCISK - Tutaj też dodajemy INDIGO */}
        <div className="mt-auto flex items-center gap-2 text-sm font-bold opacity-60 group-hover:opacity-100 transition-opacity">
            <span className={`
                ${color === 'blue' ? 'text-blue-600' : ''}
                ${color === 'green' ? 'text-green-600' : ''}
                ${color === 'purple' ? 'text-purple-600' : ''}
                ${color === 'pink' ? 'text-pink-600' : ''}
                ${color === 'orange' ? 'text-orange-600' : ''}
                ${color === 'teal' ? 'text-teal-600' : ''}
                ${color === 'rose' ? 'text-rose-600' : ''}
                ${color === 'indigo' ? 'text-indigo-600' : ''}
                ${color === 'yellow' ? 'text-yellow-600' : ''}
                ${color === 'cyan' ? 'text-cyan-600' : ''}
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
        <Analytics />
      <SpeedInsights />
      {/* NAGŁÓWEK */}
{/* NAGŁÓWEK Z NOWYM MENU */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-8">
          
          {/* LOGOTYP */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group shrink-0">
            <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:bg-blue-700 transition-colors">
              <TrendingUp size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Finanse <span className="text-blue-600">Proste</span></h1>
          </Link>

{/* NAWIGACJA DESKTOPOWA */}
<nav className="hidden md:flex items-center gap-1">
  
  {/* DROPDOWN: KALKULATORY I NARZĘDZIA */}
  <div className="relative group">
    <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-50">
      Kalkulatory i Narzędzia
      <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
    </button>
    
    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-[60]">
      <div className="grid gap-1">
        <Link to="/wynagrodzenia" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">Kalkulator wynagrodzeń</Link>
        <Link to="/b2b" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">Kalkulator B2B</Link>
        <Link to="/leasing" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">Kalkulator leasingu</Link>
        <Link to="/nadplata-kredytu" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">Nadpłata kredytu</Link>
        <Link to="/wynajem-czy-kupno" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">Wynajem czy kupno</Link>
        <Link to="/obligacje" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">Obligacje skarbowe</Link>
        <Link to="/procent-skladany" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">Procent składany</Link>
        <Link to="/kalkulator-fire" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">Kalkulator FIRE</Link>
        <Link to="/zloto" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">Kalkulator złota</Link>
        <Link to="/kalkulator-vat" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">Kalkulator VAT</Link>
      </div>
    </div>
  </div>
  {/* DROPDOWN: BAZA WIEDZY */}
  <div className="relative group">
    <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-slate-50">
      Baza wiedzy
      <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
    </button>
    
    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-[60]">
      <div className="grid gap-1">
        <Link to="/gielda" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors">Akcje i ETF</Link>
        <Link to="/ike-ikze" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors">IKE oraz IKZE</Link>
        <Link to="/ppk" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors">PPK w praktyce</Link>
        <Link to="/kryptowaluty" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors">Kryptowaluty</Link>
        <Link to="/oki" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors">Konto OKI</Link>
      </div>
    </div>
  </div>
  {/* NOWY DROPDOWN: PRODUKTY BANKOWE */}
  <div className="relative group">
    <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-slate-50">
      Produkty bankowe
      <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
    </button>
    
    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-[60]">
      <div className="grid gap-1">
        <Link to="/konta-osobiste" className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors flex items-center justify-between group/link">
          Konta osobiste
          <ArrowRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
        </Link>
        <div className="px-4 py-2 border-t border-slate-50 mt-1">
           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Wkrótce: Lokaty</span>
        </div>
      </div>
    </div>
  </div>


</nav>
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
          <Route path="/oki" element={<OkiView />} />
          <Route path="/kryptowaluty" element={<CryptoView />} />
          <Route path="/leasing" element={<LeasingView />} />
          <Route path="/nadplata-kredytu" element={<MortgageView />} /> 
          <Route path="/zloto" element={<GoldView />} /> 
          <Route path="/kalkulator-fire" element={<FireView />} />
          <Route path="/wynajem-czy-kupno" element={<RentVsBuyView />} />
          <Route path="/kalkulator-vat" element={<VatView />} />
          <Route path="/polityka-prywatnosci" element={<PrivacyPolicyView />} />
          <Route path="/konta-osobiste" element={<BankAccountsView />} />
        </Routes>
      </main>
      {/* STOPKA */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="flex justify-center"><AlertTriangle className="text-yellow-500/80" size={24} /></div>
          
          <div className="text-sm leading-relaxed text-slate-500 max-w-2xl mx-auto space-y-4 text-justify">
            <p className="font-bold text-slate-400">
              Uwaga: Treści prezentowane w serwisie nie stanowią rekomendacji inwestycyjnych ani porad finansowych, prawnych czy podatkowych.
            </p>
            <p>
              Niniejszy serwis ma charakter wyłącznie edukacyjny i informacyjny. Przedstawione kalkulacje oraz symulacje są jedynie szacunkowe i zależą od wielu zmiennych rynkowych oraz indywidualnej sytuacji użytkownika.
            </p>
            <p>
              Autorzy serwisu dokładają wszelkich starań, aby prezentowane dane były aktualne i rzetelne, jednak nie ponoszą odpowiedzialności za ewentualne błędy, nieścisłości lub decyzje finansowe podjęte na podstawie tych informacji.
            </p>
            <p>
              Rzeczywiste obciążenia podatkowe i składkowe mogą różnić się w zależności od interpretacji przepisów. Przed podjęciem jakichkolwiek decyzji finansowych zalecamy konsultację z wykwalifikowanym doradcą.
            </p>
          </div>

          <div className="pt-8 border-t border-slate-800/50 flex flex-col justify-center items-center gap-3 text-xs text-slate-600">
             <p>&copy; 2026 Finanse Proste. Wszelkie prawa zastrzeżone.</p>

             {/* LINK DO POLITYKI PRYWATNOŚCI */}
             <Link to="/polityka-prywatnosci" className="hover:text-slate-400 transition-colors underline decoration-slate-700 underline-offset-4">
                Polityka Prywatności i Cookies
             </Link>
          </div>
        </div>
      </footer>
      
      {/* BANER CIASTECZEK */}
      <CookieBanner />

    </div>
  );
}
// --- NOWA WERSJA HOMEVIEW (SEO + TREŚĆ) ---
const HomeView = () => {
  const navigate = useNavigate();

  const scrollToTools = () => {
    const element = document.getElementById('narzedzia');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Kalkulatory Finansowe 2026 - B2B, Leasing, Kredyt, Podatki | Finanse Proste</title>
        <meta name="description" content="Niezależny portal finansowy. Policz zysk netto B2B, koszty leasingu i nadpłatę kredytu. Sprawdź opłacalność obligacji skarbowych i IKE. Aktualne wskaźniki 2026." />
        <link rel="canonical" href="https://www.finanse-proste.pl/" />
      </Helmet>

      <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 pb-12">
          
          {/* --- HERO SECTION: CZYSTY & PROFESJONALNY --- */}
          <div className="text-center mb-24 max-w-5xl mt-16 px-4 relative">
              <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-xl shadow-slate-200">
                 <Sparkles size={14} className="text-blue-400"/> Prognozy i stawki: 2026
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                  Twoje finanse. <br/>
                  <span className="text-blue-600">Policzone precyzyjnie.</span>
              </h1>
              
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-12">
                <p>
                  W gąszczu przepisów podatkowych i ofert bankowych matematyka jest jedynym obiektywnym doradcą. 
                  Stworzyliśmy ekosystem narzędzi, który obejmuje <strong>podatki firmowe</strong> (B2B/Leasing), 
                  <strong> rynek nieruchomości</strong> oraz <strong>budowanie kapitału</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={scrollToTools}
                    className="group relative inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1"
                  >
                    <span>Wybierz kalkulator</span>
                    <ArrowDown className="animate-bounce" size={20}/>
                  </button>
                  <button 
                    onClick={() => document.getElementById('kompendium-seo').scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center justify-center gap-3 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all hover:border-slate-300 shadow-sm"
                  >
                    <span>Czytaj analizy</span>
                    <BookOpen size={20}/>
                  </button>
              </div>
          </div>

          <div className="w-full max-w-7xl space-y-32 px-4">
            
              {/* --- 1. NARZĘDZIA ANALITYCZNE (GRID) --- */}
              <section id="narzedzia" className="scroll-mt-28">
                  <div className="mb-12 border-b border-slate-100 pb-8">
                      <div className="flex items-center gap-4 mb-4">
                          <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <Calculator size={24}/>
                          </div>
                          <h2 className="text-3xl font-bold text-slate-900">Kalkulatory i Narzędzia</h2>
                      </div>
                      <p className="text-slate-500 text-lg max-w-3xl">
                          Wybierz odpowiedni moduł. Każde narzędzie zawiera nie tylko wynik, ale też <strong>szczegółowe wyjaśnienie prawne i podatkowe.</strong>
                      </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Bestsellery */}
                                        <FeatureCard 
                        title="Obligacje skarbowe"
                        subtitle="EDO / COI / TOS"
                        description="Symulator zysków z obligacji antyinflacyjnych. Zobacz, ile zarobisz bezpiecznie pożyczając pieniądze państwu."
                        icon={ShieldCheck}
                        color="blue"
                        onClick={() => navigate('/obligacje')}
                        badge="Nasz wybór"
                    />
                                        <FeatureCard 
                        title="Kalkulator wynagrodzeń"
                        subtitle="Pensja netto"
                        description="Ile na rękę? Przelicz brutto na netto dla umowy o pracę, zlecenia i dzieła. Uwzględnia PPK i ulgę dla młodych."
                        icon={Wallet}
                        color="green"
                        onClick={() => navigate('/wynagrodzenia')}
                    />
                    <FeatureCard 
                        title="Kalkulator leasingu"
                        subtitle="Samochody i maszyny"
                        description="Oblicz rzeczywisty koszt leasingu operacyjnego (np. 108%). Sprawdź wpływ wykupu, wpłaty własnej i limitu 150 tys. zł."
                        icon={Car}
                        color="orange"
                        onClick={() => navigate('/leasing')}
                        badge="Dla firm"
                    />
                                                            <FeatureCard 
                        title="Kalkulator B2B"
                        subtitle="Dla przedsiębiorców"
                        description="Porównaj B2B z etatem. Symulacja faktury, wyliczenie składki zdrowotnej (Polski Ład), podatku liniowego i ryczałtu."
                        icon={Briefcase}
                        color="teal"
                        onClick={() => navigate('/b2b')}
                        badge="Top dla IT"
                    />
                    <FeatureCard 
                        title="Kalkulator VAT"
                        subtitle="Netto ↔ Brutto"
                        description="Szybko przelicz kwoty na fakturze. Oblicz VAT od netto lub wyciągnij podatek z kwoty brutto (metoda 'w stu')."
                        icon={Percent}
                        color="cyan"
                        onClick={() => navigate('/kalkulator-vat')}
                    />

                    <FeatureCard 
                        title="Nadpłata kredytu"
                        subtitle="Hipoteka i wakacje"
                        description="Czy nadpłacać kredyt? Sprawdź o ile lat skrócisz hipotekę i ile tysięcy złotych odsetek zostanie w Twojej kieszeni."
                        icon={Home}
                        color="indigo"
                        onClick={() => navigate('/nadplata-kredytu')}
                        badge="Bestseller"
                    />
                    <FeatureCard 
                        title="Wynajem czy kupno?"
                        subtitle="Analiza opłacalności"
                        description="Wielki pojedynek: Kredyt hipoteczny vs Wynajem i inwestowanie różnicy. Co da Ci większy majątek po 20 latach?"
                        icon={Scale}
                        color="indigo"
                        onClick={() => navigate('/wynajem-czy-kupno')}
                        badge="Decyzja życia"
                    />
                    
                    {/* Finanse Osobiste */}


                    {/* Inwestycje */}

                    <FeatureCard 
                        title="Kalkulator złota"
                        subtitle="Inwestycje fizyczne"
                        description="Czy opłaca się kupić sztabkę? Sprawdź ukryte marże dealerów (spread) i oblicz próg rentowności inwestycji."
                        icon={Coins}
                        color="yellow"
                        onClick={() => navigate('/zloto')}
                    />
                    <FeatureCard 
                        title="Procent składany"
                        subtitle="Symulator inwestycji"
                        description="Zobacz efekt kuli śnieżnej. Jak małe kwoty odkładane regularnie zamieniają się w fortunę dzięki reinwestycji."
                        icon={TrendingUp}
                        color="purple"
                        onClick={() => navigate('/procent-skladany')}
                    />
                    <FeatureCard 
                        title="Kalkulator FIRE"
                        subtitle="Wolność finansowa"
                        description="Kiedy rzucisz etat? Oblicz, ile kapitału potrzebujesz, aby żyć wyłącznie z odsetek (reguła 4%)."
                        icon={Flame} 
                        color="rose"
                        onClick={() => navigate('/kalkulator-fire')}
                        badge="Motywacja"
                    />
                  </div>
              </section>

              {/* --- 2. BAZA WIEDZY (GRID) - PRZYWRÓCONA --- */}
              <section>
                  <div className="mb-12 border-b border-slate-100 pb-8">
                      <div className="flex items-center gap-4 mb-4">
                          <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                            <BookOpen size={24}/>
                          </div>
                          <h2 className="text-3xl font-bold text-slate-900">Baza Wiedzy i Poradniki</h2>
                      </div>
                      <p className="text-slate-500 text-lg max-w-3xl">
                          Teoria, która przekłada się na zysk. Kliknij w temat, aby przeczytać kompletny przewodnik (pisany prostym językiem, bez bankowego żargonu).
                      </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <FeatureCard 
                        title="Akcje i ETF"
                        subtitle="Giełda dla początkujących"
                        description="Jak zacząć inwestować pasywnie? Czym jest ETF i dlaczego wygrywa z funduszami w banku?"
                        icon={Activity}
                        color="rose"
                        onClick={() => navigate('/gielda')}
                      />
                      <FeatureCard 
                        title="IKE oraz IKZE"
                        subtitle="Optymalizacja podatkowa"
                        description="Jak legalnie nie płacić podatku Belki? Poradnik o kontach emerytalnych, które dają wolność."
                        icon={Umbrella}
                        color="pink"
                        onClick={() => navigate('/ike-ikze')}
                      />
                      <FeatureCard 
                        title="PPK w praktyce"
                        subtitle="Darmowa kasa?"
                        description="Czy warto zostać w PPK? Analiza dopłat pracodawcy i państwa vs prywatne inwestowanie."
                        icon={PiggyBank}
                        color="orange"
                        onClick={() => navigate('/ppk')}
                      />
                      <FeatureCard 
                        title="Kryptowaluty"
                        subtitle="Blockchain i Bitcoin"
                        description="Wstęp do cyfrowych aktywów. Jak bezpiecznie kupić Bitcoina i nie dać się oszukać?"
                        icon={Zap}
                        color="yellow"
                        onClick={() => navigate('/kryptowaluty')}
                      />
                      <FeatureCard 
                        title="Konto OKI"
                        subtitle="Bez podatku Belki"
                        description="Rewolucja w oszczędzaniu od 2026 r. Sprawdź, jak działa nowa kwota wolna od podatku od zysków kapitałowych."
                        icon={Landmark}
                        color="cyan"
                        onClick={() => navigate('/oki')}
                        badge="Nowość"
                      />
                  </div>
              </section>

              {/* --- NOWA SEKCJA: PRODUKTY BANKOWE --- */}
<section id="bankowosc" className="scroll-mt-28">
    <div className="mb-12 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 shadow-sm">
              <Landmark size={24}/>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Produkty bankowe bez tajemnic</h2>
        </div>
        <p className="text-slate-500 text-lg max-w-3xl">
            Pełne kompendium wiedzy o ofercie banków. Wyjaśniamy zawiłości regulaminów, wskazujemy <strong>ukryte opłaty</strong> i pomagamy wybrać produkty, które realnie wspierają Twoje oszczędności.
        </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <FeatureCard 
            title="Konto osobiste"
            subtitle="Rachunek osobisty"
            description="Jak wybrać darmowe konto? Sprawdź, na co zwrócić uwagę, aby nie płacić za kartę i wypłaty z bankomatów."
            icon={CreditCard}
            color="cyan"
            onClick={() => navigate('/konta-osobiste')}
            badge="Podstawa"
        />
        {/* Tu w przyszłości dodasz: Lokaty, Karty Kredytowe, Konta Oszczędnościowe */}
    </div>
</section>

              {/* --- 3. KOMPENDIUM SEO (WIELKA SEKCJ MERYTORYCZNA) --- */}
              {/* Układ: Pełna szerokość, wyraźne sekcje, dużo treści, słowa kluczowe */}
              <section id="kompendium-seo" className="pt-20 border-t border-slate-200">
                 
                 <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Kompendium Finansowe 2026</h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Poznaj mechanizmy, które decydują o Twoim majątku. Poniżej znajdziesz dogłębną analizę trzech kluczowych filarów finansów: firmy, nieruchomości i inwestycji.
                    </p>
                 </div>

                 <div className="space-y-32">
                    
                    {/* FILAR 1: PRZEDSIĘBIORCZOŚĆ I PODATKI */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-teal-100 text-teal-700 rounded-xl"><Briefcase size={32}/></div>
                                <h3 className="text-3xl font-bold text-slate-900">Optymalizacja Podatkowa Firmy</h3>
                            </div>
                            
                            <div className="prose prose-lg text-slate-600 leading-relaxed space-y-6">
                                <p>
                                    Prowadzenie jednoosobowej działalności gospodarczej (JDG) w Polsce wymaga ciągłej analizy. Kluczowym wyzwaniem na rok 2026 jest wybór formy opodatkowania w kontekście <strong>składki zdrowotnej</strong>, która po wprowadzeniu Polskiego Ładu stała się de facto nowym podatkiem. 
                                </p>
                                <p>
                                    Wielu przedsiębiorców IT i B2B zadaje sobie pytanie: <strong>Ryczałt czy Podatek Liniowy?</strong> Ryczałt (12% lub 8.5%) kusi niską stawką, ale uniemożliwia odliczanie kosztów. Z kolei podatek liniowy (19%) pozwala na wrzucenie w koszty leasingu samochodu czy sprzętu, ale obciążony jest 4.9% składką zdrowotną. Nasz <strong className="text-teal-700 font-bold cursor-pointer hover:underline" onClick={() => navigate('/b2b')}>Kalkulator B2B</strong> symuluje te scenariusze co do złotówki.
                                </p>
                                <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100">
                                    <h4 className="font-bold text-teal-900 mb-2">Kluczowe pojęcia:</h4>
                                    <ul className="space-y-2 text-sm text-teal-800">
                                        <li className="flex gap-2"><CheckCircle size={16} className="mt-1"/> <strong>Limit leasingu:</strong> Amortyzacja aut osobowych tylko do 150 000 zł (spalinowe).</li>
                                        <li className="flex gap-2"><CheckCircle size={16} className="mt-1"/> <strong>Ulga na start:</strong> Przez 6 miesięcy płacisz tylko składkę zdrowotną.</li>
                                        <li className="flex gap-2"><CheckCircle size={16} className="mt-1"/> <strong>Wykup prywatny:</strong> Sprzedaż auta po wykupie bez podatku możliwa dopiero po 6 latach.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-lg rotate-1 hover:rotate-0 transition-transform duration-500">
                            {/* Wizualizacja - Kafelki */}
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
                                    <span className="font-bold text-slate-700">Przychód</span>
                                    <span className="font-mono text-slate-900">20 000 PLN</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
                                    <span className="font-bold text-slate-700">ZUS + Zdrowotna</span>
                                    <span className="font-mono text-red-500">- 2 500 PLN</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
                                    <span className="font-bold text-slate-700">Podatek (Ryczałt 12%)</span>
                                    <span className="font-mono text-red-500">- 2 100 PLN</span>
                                </div>
                                <div className="bg-teal-600 p-4 rounded-xl shadow-lg text-white flex justify-between items-center mt-4 transform scale-105">
                                    <span className="font-bold">Zysk "na rękę"</span>
                                    <span className="font-mono text-xl">15 400 PLN</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FILAR 2: NIERUCHOMOŚCI I KREDYTY */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-lg -rotate-1 hover:rotate-0 transition-transform duration-500">
                             <div className="space-y-6 text-center">
                                 <div className="text-6xl font-black text-indigo-200">360</div>
                                 <div className="text-xl font-bold text-slate-700">Rat do spłacenia (30 lat)</div>
                                 <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                     <div className="h-full bg-indigo-500 w-[10%]"></div>
                                 </div>
                                 <div className="bg-white p-6 rounded-2xl border border-indigo-100 text-left">
                                     <p className="text-sm text-slate-600 mb-2">Efekt nadpłaty 500 zł/msc:</p>
                                     <strong className="text-indigo-600 text-2xl block">- 7 lat kredytu</strong>
                                     <strong className="text-green-600 text-lg block">+ 84 000 zł oszczędności</strong>
                                 </div>
                             </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl"><Home size={32}/></div>
                                <h3 className="text-3xl font-bold text-slate-900">Inteligentna Hipoteka</h3>
                            </div>
                            
                            <div className="prose prose-lg text-slate-600 leading-relaxed space-y-6">
                                <p>
                                    Kredyt hipoteczny to dla większości Polaków największe zobowiązanie w życiu. Niestety, mechanizm rat równych sprawia, że w pierwszych latach spłacasz głównie <strong>odsetki dla banku</strong>, a kapitał maleje bardzo powoli. Zmienny wskaźnik WIBOR (lub nadchodzący WIRON) wprowadza ryzyko wzrostu raty.
                                </p>
                                <p>
                                    Najskuteczniejszą metodą walki z kosztami kredytu jest <strong>nadpłata kapitału</strong>. Nasz symulator <strong className="text-indigo-700 font-bold cursor-pointer hover:underline" onClick={() => navigate('/nadplata-kredytu')}>Nadpłaty Kredytu</strong> pokazuje, jak nawet niewielkie, regularne wpłaty mogą skrócić okres kredytowania o lata i zaoszczędzić setki tysięcy złotych.
                                </p>
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                    <h4 className="font-bold text-indigo-900 mb-2">Dylemat: Wynajem czy Kupno?</h4>
                                    <p className="text-sm text-indigo-800">
                                        Wbrew powszechnej opinii, kupno nie zawsze się opłaca. Przy wysokich stopach procentowych, koszt odsetek i remontów może przewyższyć koszt najmu. Jeśli różnicę w racie zainwestujesz na giełdzie lub w obligacje, po 20 latach możesz mieć większy majątek jako najemca. Sprawdź to w naszym kalkulatorze <strong>Wynając czy kupić</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FILAR 3: INWESTOWANIE I KAPITAŁ */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-purple-100 text-purple-700 rounded-xl"><TrendingUp size={32}/></div>
                                <h3 className="text-3xl font-bold text-slate-900">Ochrona i Budowanie Majątku</h3>
                            </div>
                            
                            <div className="prose prose-lg text-slate-600 leading-relaxed space-y-6">
                                <p>
                                    Trzymanie oszczędności na koncie ROR to gwarantowana strata przez inflację. Aby zachować siłę nabywczą pieniądza, należy korzystać z aktywów antyinflacyjnych. Podstawą bezpieczeństwa są <strong>Obligacje Skarbowe EDO</strong> (10-letnie), które od drugiego roku gwarantują zysk powyżej inflacji.
                                </p>
                                <p>
                                    Dla osób budujących kapitał długoterminowo (np. na emeryturę lub wolność finansową FIRE), kluczowe jest uniknięcie <strong>Podatku Belki (19%)</strong>. Umożliwiają to konta IKE oraz IKZE. Dzięki procentowi składanemu, brak podatku na koniec inwestycji oznacza zysk wyższy o kilkadziesiąt tysięcy złotych.
                                </p>
                                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                    <h4 className="font-bold text-purple-900 mb-2">Alternatywy: Złoto i ETF</h4>
                                    <p className="text-sm text-purple-800">
                                        Fizyczne złoto (monety bulionowe, sztabki) to ubezpieczenie od upadku walut. Z kolei fundusze ETF (Exchange Traded Funds) pozwalają tanio kupić "kawałek światowej gospodarki" (np. indeks S&P 500). Wszystkie te aktywa przeanalizujesz w naszych narzędziach.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-lg rotate-1 hover:rotate-0 transition-transform duration-500">
                            {/* Wizualizacja - Procent Składany */}
                            <div className="relative h-64 flex items-end justify-between gap-2 px-4 pb-4 border-b border-slate-200">
                                <div className="w-1/5 bg-slate-300 h-[20%] rounded-t-lg relative group">
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Start</span>
                                </div>
                                <div className="w-1/5 bg-slate-400 h-[35%] rounded-t-lg"></div>
                                <div className="w-1/5 bg-purple-400 h-[55%] rounded-t-lg"></div>
                                <div className="w-1/5 bg-purple-500 h-[80%] rounded-t-lg relative group">
                                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xs font-bold">IKE</span>
                                </div>
                                <div className="w-1/5 bg-purple-600 h-[100%] rounded-t-lg relative shadow-lg shadow-purple-200">
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-black text-purple-600 bg-white px-2 py-1 rounded-lg text-sm border border-purple-100">Efekt kuli śnieżnej</span>
                                </div>
                            </div>
                            <p className="text-center text-sm text-slate-500 mt-4 font-medium">Czas + Procent Składany = Bogactwo</p>
                        </div>
                    </div>

                 </div>

                 {/* FINALNE CTA */}
                 <div className="mt-32 text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Zacznij liczyć swoje pieniądze już dziś</h3>
                    <div className="flex justify-center gap-4">
                        <button onClick={scrollToTools} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl">
                            Przejdź do kalkulatorów
                        </button>
                    </div>
                 </div>

              </section>

          </div>
      </div>
    </>
  );
};
//
const BondsView = () => {
  const navigate = useNavigate();

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


const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      // Offset 100px pozwala zachować estetyczny odstęp od górnej krawędzi
      const offset = 100; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };



  // Sprawdzenie, czy wybrana obligacja jest indeksowana inflacją
  const isInflationIndexed = useMemo(() => {
    return ['EDO', 'COI', 'ROD', 'ROS'].some(id => selectedBondId.startsWith(id));
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
    
    // UWAGA: Dla uproszczenia symulacji, kalkulator używa stałej stopy 'bond.rate' dla całego okresu.
    // Dla obligacji indeksowanych inflacją jest to TYLKO szacunek.
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
    <>
      <Helmet>
        <title>Kalkulator Obligacji Skarbowych (EDO, COI, TOS) | Finanse Proste</title>
        <meta name="description" content="Kompendium wiedzy o obligacjach skarbowych. Poznaj rodzaje (EDO, COI), dowiedz się jak działa indeksacja inflacją, rolowanie obligacji i jak uniknąć podatku Belki." />
        <link rel="canonical" href="https://www.finanse-proste.pl/obligacje" />
      </Helmet>

      <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">
          
          {/* --- HERO SECTION --- */}
          <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                <ShieldCheck className="text-blue-600" size={36}/>
                Obligacje skarbowe
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

{/* --- MINIMALISTYCZNY SPIS TREŚCI --- */}
        <div className="mb-16 bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm flex flex-wrap justify-center gap-2 md:gap-4">
          <div className="w-full flex items-center justify-center gap-2 mb-2 text-slate-400">
            <ListTree size={16}/>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Nawigacja po kompendium</span>
          </div>
          
          {/* WYRÓŻNIONY KALKULATOR */}
          <button
            onClick={(e) => scrollToSection(e, "#kalkulator")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
          >
            <Calculator size={14}/>
            KALKULATOR ZYSKU
          </button>

          {[
            { title: "1. Fundamenty", icon: Landmark, id: "#fundamenty" },
            { title: "2. Katalog", icon: LayoutGrid, id: "#katalog" },
            { title: "3. Jak kupić?", icon: Globe, id: "#proces" },
            { title: "4. Zysk i inflacja", icon: TrendingUp, id: "#indeksacja" },
            { title: "5. Rolowanie", icon: RefreshCw, id: "#rolowanie" },
            { title: "6. Podatki i IKE", icon: Ban, id: "#podatki" },
            { title: "7. Strategie", icon: Target, id: "#strategie" },
            { title: "8. Indeks pojęć", icon: BookOpen, id: "#indeks" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={(e) => scrollToSection(e, item.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all border border-transparent hover:border-slate-100"
            >
              <item.icon size={14} className="text-slate-400 group-hover:text-blue-500"/>
              {item.title}
            </button>
          ))}
        </div>


          {/* --- SEKCJA KALKULATORA --- */}
          <div id="kalkulator" className="flex gap-4 mb-8">
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

                              {/* --- DISCLAIMER OBLIGACJI INDEKSOWANYCH INFLACJĄ --- */}
                              {isInflationIndexed && (
                                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-left text-sm text-slate-600 flex items-start gap-3">
                                      <Info size={20} className="text-blue-500 shrink-0 mt-1" />
                                      <div>
                                          <p className="font-bold text-blue-800 mb-1">Ważna informacja o symulacji</p>
                                          <p>
                                              To jest <strong>szacunkowa symulacja</strong>. Oprocentowanie tej obligacji w kolejnych latach zależy od przyszłej inflacji, której nie da się przewidzieć.
                                          </p>
                                          <p className="mt-2 text-xs">
                                              Dla uproszczenia, kalkulator przyjmuje stałą stopę zwrotu (np. z pierwszego okresu odsetkowego) dla całego okresu inwestycji. <strong>Rzeczywisty wynik będzie inny</strong> i będzie zależał od faktycznych odczytów inflacji GUS w przyszłości.
                                          </p>
                                      </div>
                                  </div>
                              )}

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

          {/* =================================================================================================
              WIELKA ENCYKLOPEDIA OBLIGACJI (SEO & CONTENT HUB)
              =================================================================================================
          */}
          <div className="space-y-16">
              
              {/* TYTUŁ GŁÓWNY SEKCJI WIEDZY */}
              <div className="text-center max-w-4xl mx-auto mb-12">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                      <BookOpen size={14}/> Strefa Wiedzy
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                      Obligacje od A do Z <br/><span className="text-blue-600">Jak bezpiecznie pomnażać kapitał?</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                      Kompleksowy przewodnik dla początkujących i zaawansowanych. Dowiedz się, jak działają obligacje antyinflacyjne, jak uniknąć podatku Belki i dlaczego są fundamentem bezpiecznego portfela.
                  </p>
              </div>

              {/* ROZDZIAŁ 1: FUNDAMENTY (Wersja Ekspercka) */}
              <div id="fundamenty" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">1</div>
                      <h3 className="text-2xl font-bold text-slate-900">Fundamenty: jak działa rynek dłużny?</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                          <div>
                              <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Mechanika inwestycji</h4>
                              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                                  Wybierając <strong>obligacje skarbowe</strong>, wchodzisz w rolę <strong>Wierzyciela</strong> państwa. Ty udostępniasz kapitał, a <strong>Dłużnik</strong> (państwo) gwarantuje zwrot <strong>Nominału</strong> wraz z odsetkami. W przeciwieństwie do <Link to="/gielda" className="text-blue-600 font-bold hover:underline">inwestowania w akcje i ETF</Link>, gdzie zysk zależy od sukcesu firm, tutaj Twoje bezpieczeństwo opiera się na stabilności budżetu państwa i <strong>ratingu kredytowym Polski</strong>.
                              </p>
                          </div>
                          
                          <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
                              <h5 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                                  <Info size={16}/> Dlaczego obligacje detaliczne?
                              </h5>
                              <p className="text-[11px] text-blue-800 leading-relaxed">
                                  Istnieją dwa rynki: <strong>obligacje hurtowe</strong> (notowane na <strong>giełdzie Catalyst</strong>, gdzie cena rynkowa się waha) oraz <strong>obligacje detaliczne</strong> (oszczędnościowe). To kompendium skupia się na tych drugich, ponieważ ich <strong>Cena emisyjna i Nominał wynoszą zawsze 100 zł</strong>, co chroni Twój kapitał przed wahaniami rynkowymi.
                              </p>
                          </div>
                      </div>

                      <div>
                          <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Kto emituje dług? (Emitenci)</h4>
                          <div className="space-y-4">
                              <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                  <div className="mt-1 bg-green-50 p-2 rounded-lg shrink-0"><ShieldCheck size={20} className="text-green-600"/></div>
                                  <div>
                                      <strong className="block text-slate-900 text-sm">Skarb Państwa (Rządowe)</strong>
                                      <p className="text-xs text-slate-500 leading-relaxed">Najwyższy poziom bezpieczeństwa. Gwarancją jest majątek całego państwa i przyszłe wpływy z podatków.</p>
                                  </div>
                              </div>
                              <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                  <div className="mt-1 bg-blue-50 p-2 rounded-lg shrink-0"><Landmark size={20} className="text-blue-600"/></div>
                                  <div>
                                      <strong className="block text-slate-900 text-sm">Jednostki Samorządu (Komunalne)</strong>
                                      <p className="text-xs text-slate-500 leading-relaxed">Emitowane przez miasta i gminy (np. na budowę infrastruktury). Ryzyko jest niskie, zbliżone do papierów rządowych.</p>
                                  </div>
                              </div>
                              <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                  <div className="mt-1 bg-orange-50 p-2 rounded-lg shrink-0"><Building2 size={20} className="text-orange-600"/></div>
                                  <div>
                                      <strong className="block text-slate-900 text-sm">Przedsiębiorstwa (Korporacyjne)</strong>
                                      <p className="text-xs text-slate-500 leading-relaxed">Dług firm prywatnych. Oferują wyższą premię za ryzyko, ale wymagają wnikliwej analizy wypłacalności danej spółki.</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* INFRASTRUKTURA I BEZPIECZEŃSTWO */}
                  <div className="mt-12 pt-8 border-t border-slate-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><Lock size={20}/></div>
                              <div>
                                  <h5 className="font-bold text-xs text-slate-800 mb-1 tracking-tight">Rola KDPW</h5>
                                  <p className="text-[10px] text-slate-500 leading-relaxed">Twoje papiery są zarejestrowane w <strong>Krajowym Depozycie Papierów Wartościowych</strong>. To niezależna instytucja dbająca o bezpieczeństwo obrotu.</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><TrendingUp size={20}/></div>
                              <div>
                                  <h5 className="font-bold text-xs text-slate-800 mb-1 tracking-tight">Ochrona Kapitału</h5>
                                  <p className="text-[10px] text-slate-500 leading-relaxed">W obligacjach detalicznych nie występuje ryzyko zmiany ceny rynkowej. Zawsze odzyskujesz min. 100 zł za każdą sztukę przy wykupie.</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><CheckCircle size={20}/></div>
                              <div>
                                  <h5 className="font-bold text-xs text-slate-800 mb-1 tracking-tight">Zapis Cyfrowy</h5>
                                  <p className="text-[10px] text-slate-500 leading-relaxed">W 2026 roku obligacje są zdematerializowane. Istnieją wyłącznie jako bezpieczny zapis cyfrowy, co wyklucza ryzyko kradzieży fizycznej.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

             {/* ROZDZIAŁ 2: POLSKIE OBLIGACJE SKARBOWE (Kompletny Katalog) */}
              <div id="katalog" className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-12 opacity-5 font-black text-9xl text-white pointer-events-none select-none">2026</div>
                  
                  <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-10">
                          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">2</div>
                          <h3 className="text-2xl font-bold">Katalog obligacji detalicznych: dopasuj symbol do celu</h3>
                      </div>

                      <p className="text-slate-400 mb-10 max-w-3xl leading-relaxed">
                        Ministerstwo Finansów emituje papiery o różnych konstrukcjach. Wybór odpowiedniego symbolu zależy od Twojej prognozy dotyczącej <strong>stóp procentowych NBP</strong> oraz przyszłej <strong>inflacji</strong>. Każda obligacja ma <strong>Nominał 100 zł</strong>, co ułatwia budowanie portfela małymi krokami.
                      </p>

                      <div className="grid lg:grid-cols-3 gap-6 mb-12">
                          {/* EDO */}
                          <div className="bg-white/10 p-6 rounded-3xl border border-white/10 hover:border-green-400/50 transition-all group">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-xl font-bold text-green-400">EDO</h4>
                                <span className="text-[10px] bg-green-400/20 text-green-400 px-2 py-1 rounded-lg font-bold">10 LAT</span>
                              </div>
                              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                                <strong>Emerytalne Dziesięcioletnie Oszczędnościowe</strong>. Najlepszy wybór długoterminowy. Wykorzystuje mechanizm, jakim jest <Link to="/procent-skladany" className="text-green-400 underline font-bold italic">procent składany</Link> (kapitalizacja roczna).
                              </p>
                              <ul className="text-[10px] space-y-2 text-slate-400 uppercase font-bold tracking-wider">
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"/> Indeksacja Inflacją</li>
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"/> Stała Marża</li>
                              </ul>
                          </div>

                          {/* COI */}
                          <div className="bg-white/10 p-6 rounded-3xl border border-white/10 hover:border-blue-400/50 transition-all">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-xl font-bold text-blue-400">COI</h4>
                                <span className="text-[10px] bg-blue-400/20 text-blue-400 px-2 py-1 rounded-lg font-bold">4 LATA</span>
                              </div>
                              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                                <strong>Czteroletnie Oszczędnościowe Indeksowane</strong>. Złoty środek dla osób chcących chronić kapitał, ale potrzebujących <strong>corocznej wypłaty odsetek</strong> na konto.
                              </p>
                              <ul className="text-[10px] space-y-2 text-slate-400 uppercase font-bold tracking-wider">
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"/> Ochrona przed Inflacją</li>
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"/> Rentowność (YTM) + Marża</li>
                              </ul>
                          </div>

                          {/* TOS / ROR / DOR */}
                          <div className="bg-white/10 p-6 rounded-3xl border border-white/10 hover:border-orange-400/50 transition-all">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-xl font-bold text-orange-400">ROR / DOR</h4>
                                <span className="text-[10px] bg-orange-400/20 text-orange-400 px-2 py-1 rounded-lg font-bold">1-2 LATA</span>
                              </div>
                              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                                Obligacje o <strong>oprocentowaniu zmiennym</strong>. Ich zysk podąża za <strong>stopą referencyjną NBP</strong>. Idealne, gdy spodziewasz się wzrostu stóp procentowych w Polsce.
                              </p>
                              <ul className="text-[10px] space-y-2 text-slate-400 uppercase font-bold tracking-wider">
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-400 rounded-full"/> Zależne od NBP</li>
                                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-400 rounded-full"/> Wypłata miesięczna (ROR)</li>
                              </ul>
                          </div>
                      </div>

                      {/* RODZINNE 800+ SEKRETY */}
                      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                          <div>
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                              <Baby className="text-pink-400" size={20}/> Obligacje Rodzinne (ROD i ROS)
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed italic">
                              To oferta "Premium" dostępna wyłącznie dla beneficjentów programu 800+. Oferują one najwyższą marżę na rynku (nawet powyżej 1.5% - 2% ponad inflację). <strong>Limit zakupu</strong> jest ściśle powiązany z łączną kwotą otrzymanych świadczeń od państwa.
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                              <span className="block text-pink-400 font-black text-xl">ROS</span>
                              <span className="text-[9px] text-slate-500 uppercase">6-letnie</span>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                              <span className="block text-pink-400 font-black text-xl">ROD</span>
                              <span className="text-[9px] text-slate-500 uppercase">12-letnie</span>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
              </div>
{/* ROZDZIAŁ 3: PROCES ZAKUPU I OBSŁUGA TECHNICZNA */}
              <div id="proces" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">3</div>
                      <h3 className="text-2xl font-bold text-slate-900">Jak kupić obligacje? Przewodnik krok po kroku</h3>
                  </div>
                  
                  <p className="text-slate-600 mb-8 leading-relaxed max-w-3xl">
                      W Polsce dystrybucją obligacji detalicznych zajmują się wyłącznie <strong>PKO BP</strong> oraz <strong>Pekao S.A.</strong>. Kupując je, zakładasz tzw. <strong>konto w rejestrze nabywców</strong>. Jest to bezpłatny rachunek techniczny, na którym zapisywane są Twoje prawa własności do papierów wartościowych zarejestrowanych w <strong>KDPW</strong>.
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-10">
                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 hover:border-blue-300 transition-all group">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform"><Globe size={20}/></div>
                            <h4 className="font-bold text-slate-800 text-lg italic">Kanał Cyfrowy (Online)</h4>
                          </div>
                          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                              Najwygodniejsza metoda poprzez serwis <strong>obligacjeskarbowe.pl</strong> lub systemy maklerskie wybranych banków. Weryfikacja tożsamości odbywa się przez <strong>przelew weryfikacyjny</strong> lub aplikację mObywatel.
                          </p>
                          <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg w-fit">
                            <CheckCircle size={14}/> Dostęp 24/7 bez kolejek
                          </div>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 hover:border-blue-300 transition-all group">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform"><Landmark size={20}/></div>
                            <h4 className="font-bold text-slate-800 text-lg italic">Obsługa Stacjonarna</h4>
                          </div>
                          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                              Wizyta w dowolnym oddziale PKO BP, biurze maklerskim lub wybranych placówkach Pekao S.A. To tutaj możesz złożyć <strong>dyspozycję na wypadek śmierci</strong>, wskazując osoby, które otrzymają środki bez czekania na spadek.
                          </p>
                          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-fit">
                            <CheckCircle size={14}/> Pomoc fizycznego doradcy
                          </div>
                      </div>
                  </div>

                  {/* DODATKOWA WIEDZA: CENNE DETALE */}
                  <div className="pt-8 border-t border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-orange-500"><AlertCircle size={18}/></div>
                            <div>
                                <h5 className="font-bold text-sm text-slate-800 mb-1">Cena Emisyjna</h5>
                                <p className="text-[11px] text-slate-500 leading-relaxed">Standardowo wynosi 100 zł. Jednak przy <strong>rolowaniu obligacji</strong> (wymianie starych na nowe), banki często oferują dyskonto, obniżając cenę do 99,90 zł za sztukę.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-blue-500"><Calendar size={18}/></div>
                            <div>
                                <h5 className="font-bold text-sm text-slate-800 mb-1">Kiedy kupić?</h5>
                                <p className="text-[11px] text-slate-500 leading-relaxed">Nowe serie zaktualizowane o nowe oprocentowanie pojawiają się 1. dnia każdego miesiąca. Warto sprawdzić zapowiedzi MF pod koniec miesiąca.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-purple-500"><ShieldCheck size={18}/></div>
                            <div>
                                <h5 className="font-bold text-sm text-slate-800 mb-1">Bezpieczeństwo IKE</h5>
                                <p className="text-[11px] text-slate-500 leading-relaxed">Jeśli chcesz uniknąć podatku Belki, sprawdź nasze zestawienie <Link to="/ike-ikze" className="text-purple-600 font-bold underline">IKE oraz IKZE</Link>, gdzie opisujemy dedykowane konta pod obligacje.</p>
                            </div>
                        </div>
                    </div>
                  </div>
              </div>

              {/* ROZDZIAŁ 4: MECHANIZMY ZYSKU */}
              <div id="indeksacja" className="grid lg:grid-cols-2 gap-8">
                  {/* LEWA: Indeksacja */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><TrendingUp className="text-blue-600"/> Jak działa indeksacja inflacją?</h3>
                      
                      <div className="space-y-6">
                          <p className="text-slate-600 text-sm">
                              Obligacje EDO i COI w pierwszym roku mają stałe, z góry znane oprocentowanie. Dopiero od drugiego roku wchodzi mechanizm ochronny.
                          </p>
                          
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                              <div className="text-xs font-bold text-slate-400 uppercase mb-2">Wzór na zysk (od 2. roku)</div>
                              <div className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                                  <span className="text-red-500">Inflacja</span> + <span className="text-green-600">Marża</span>
                              </div>
                              <p className="text-xs text-slate-500">
                                  Przykład: Inflacja 10% + Marża 1.25% = <strong>11.25%</strong> oprocentowania w danym roku.
                              </p>
                          </div>

                          <div className="bg-white p-4 rounded-2xl h-[250px] border border-slate-100 relative">
                              <div className="absolute top-2 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Inflacja w Polsce (historyczna)</div>
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={INFLATION_DATA} margin={{top: 30, right: 10, left: -20, bottom: 0}}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                      <XAxis dataKey="year" tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false}/>
                                      <YAxis tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false}/>
                                      <RechartsTooltip 
                                        cursor={{fill: '#f8fafc'}}
                                        formatter={(value) => [`${value}%`, 'Inflacja']}
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                      />
                                      <Bar dataKey="value" fill="#f87171" radius={[4, 4, 0, 0]}/>
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                      </div>
                  </div>

                  {/* PRAWA: Wcześniejszy Wykup */}
                  <div id="wykup" className="bg-white rounded-[2.5rem] p-8 border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Lock className="text-orange-600"/> Wcześniejszy wykup (mit zamrożenia)</h3>
                      
                      <div className="prose prose-sm text-slate-600 leading-relaxed mb-6">
                          <p>
                              Wiele osób boi się "zamrażać" pieniądze na 10 lat. To błąd! Obligacje skarbowe są bardzo płynne. Możesz je sprzedać (oddać do Ministerstwa) w <strong>każdej chwili</strong>.
                          </p>
                          <p>
                              Kosztuje to jedynie stałą opłatę manipulacyjną (0.70 zł dla COI, 2.00 zł dla EDO). Nie tracisz wypracowanych odsetek (poza potrąceniem opłaty).
                          </p>
                      </div>

                      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                          <h4 className="font-bold text-orange-900 mb-2">Przykład zerwania EDO:</h4>
                          <ul className="space-y-2 text-sm text-orange-800">
                              <li className="flex justify-between"><span>Wartość obligacji:</span> <strong>100.00 zł</strong></li>
                              <li className="flex justify-between"><span>Naliczone odsetki:</span> <strong>+ 5.50 zł</strong></li>
                              <li className="flex justify-between border-b border-orange-200 pb-2"><span>Opłata za wykup:</span> <strong>- 2.00 zł</strong></li>
                              <li className="flex justify-between pt-1"><span>Do wypłaty:</span> <strong>103.50 zł</strong></li>
                          </ul>
                          <p className="text-xs text-orange-700 mt-3 text-center font-bold">
                              Wciąż zarobiłeś 3.50 zł, mimo zerwania umowy!
                          </p>
                      </div>
                  </div>
              </div>

 {/* ROZDZIAŁ 5: ROLOWANIE OBLIGACJI (Strategia Zamiany) */}
              <div id="rolowanie" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">5</div>
                      <h3 className="text-2xl font-bold text-slate-900">Rolowanie obligacji: jak płynnie wymienić dług?</h3>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-12">
                      <div>
                          <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                              <strong>Rolowanie obligacji</strong> (inaczej zamiana) to proces, w którym kapitał z kończących się papierów wartościowych angażujesz bezpośrednio w nową emisję. Zamiast wypłacać środki na nieoprocentowane konto, składasz dyspozycję zakupu nowych serii za pieniądze, które państwo jest Ci winne.
                          </p>
                          
                          <div className="space-y-4">
                              <div className="flex gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                                  <div className="mt-1 text-green-600"><Percent size={20}/></div>
                                  <div>
                                      <strong className="block text-green-900 text-sm">Bonus za zamianę (Dyskonto)</strong>
                                      <p className="text-[11px] text-green-700 leading-relaxed">
                                          Kupując nowe obligacje w drodze zamiany, płacisz <strong>Cenę emisyjną zamienną</strong> (zazwyczaj 99,90 zł). Te 10 groszy różnicy to Twój natychmiastowy zysk 0,1% na każdej sztuce.
                                      </p>
                                  </div>
                              </div>
                              <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                  <div className="mt-1 text-blue-600"><RefreshCw size={20}/></div>
                                  <div>
                                      <strong className="block text-slate-900 text-sm">Ciągłość kapitalizacji</strong>
                                      <p className="text-[11px] text-slate-500 leading-relaxed">
                                          Twoje oszczędności pracują bez przerwy. Jest to szczególnie ważne, jeśli wykorzystujesz <Link to="/procent-skladany" className="font-bold underline hover:text-blue-600">procent składany</Link> w obligacjach długoterminowych.
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                          <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
                              <Info size={16} className="text-blue-500"/> Pułapka Podatkowa
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed mb-6">
                              W momencie rolowania bank (PKO BP lub Pekao) musi pobrać <strong>Podatek Belki (19%)</strong> od Twoich zysków.
                          </p>
                          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                              <h5 className="font-bold text-slate-900 text-xs mb-3 italic">Przykład techniczny:</h5>
                              <ul className="space-y-3 text-[11px]">
                                  <li className="flex justify-between border-b border-slate-50 pb-2">
                                      <span className="text-slate-400">Kapitał z zapadającej serii:</span>
                                      <span className="font-bold text-slate-900">10 000 zł</span>
                                  </li>
                                  <li className="flex justify-between border-b border-slate-50 pb-2 text-red-500">
                                      <span>Należny podatek Belki:</span>
                                      <span className="font-bold">- 190 zł</span>
                                  </li>
                                  <li className="flex justify-between pt-1">
                                      <span className="text-slate-700">Dostępne na nowe obligacje:</span>
                                      <span className="font-bold text-green-600">9 810 zł</span>
                                  </li>
                              </ul>
                              <p className="mt-4 text-[10px] text-orange-600 font-medium">
                                  <strong>Ważne:</strong> Aby zachować tę samą liczbę obligacji, musisz dopłacić brakującą kwotę podatku z własnej kieszeni przed terminem zamiany.
                              </p>
                          </div>
                      </div>
                  </div>

                  {/* LINKOWANIE DO IKE */}
                  <div className="mt-10 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                          <ShieldCheck size={32} className="text-blue-200"/>
                          <div>
                              <h5 className="font-bold text-sm">Chcesz rolować bez płacenia podatku?</h5>
                              <p className="text-[11px] text-blue-100 opacity-90">W ramach IKE-Obligacje cały zysk z zamiany reinwestujesz bez potrącania 19% dla urzędu skarbowego.</p>
                          </div>
                      </div>
                      <button onClick={() => navigate('/ike-ikze')} className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-50 transition-all shrink-0">
                          Sprawdź IKE Obligacje
                      </button>
                  </div>
              </div>

{/* ROZDZIAŁ 6: OPTYMALIZACJA PODATKOWA (IKE OBLIGACJE) */}
              <div id="podatki" className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                  {/* Dekoracyjne tło */}
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-10">
                          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-bold text-xl border border-white/20">6</div>
                          <h3 className="text-2xl font-bold">Jak legalnie uniknąć podatku? (IKE Obligacje)</h3>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-12 items-start">
                          <div>
                              <p className="text-indigo-100 mb-8 leading-relaxed text-sm">
                                  Standardowo każdy zysk z inwestycji w Polsce obciążony jest <strong>19% podatkiem od zysków kapitałowych</strong> (tzw. podatek Belki). W przypadku obligacji skarbowych jest on pobierany automatycznie przy wypłacie odsetek lub wykupie papierów. Istnieje jednak dedykowane rozwiązanie: <strong>IKE-Obligacje</strong>.
                              </p>
                              
                              <div className="space-y-6">
                                  <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                                      <div className="mt-1 text-red-400"><Ban size={20}/></div>
                                      <div>
                                          <strong className="block text-white text-sm">0% podatku Belki</strong>
                                          <p className="text-[11px] text-indigo-200 leading-relaxed">
                                              Wypłacając środki po 60. roku życia, zachowujesz 100% wypracowanego zysku. Przy długoterminowych obligacjach <strong>EDO</strong> oznacza to zysk wyższy o kilkanaście procent w skali całej inwestycji.
                                          </p>
                                      </div>
                                  </div>
                                  <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                                      <div className="mt-1 text-green-400"><TrendingUp size={20}/></div>
                                      <div>
                                          <strong className="block text-white text-sm">Limit wpłat na IKE 2026</strong>
                                          <p className="text-[11px] text-indigo-200 leading-relaxed">
                                              Każdego roku możesz wpłacić określoną kwotę (w 2026 r. limit wynosi ok. 24-25 tys. zł). Środki te są chronione przez <strong>Bankowy Fundusz Gwarancyjny (BFG)</strong> do pełnej wysokości.
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div className="bg-white p-8 rounded-[2rem] text-slate-900 shadow-xl">
                              <h4 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-4">
                                  <Scale size={18} className="text-indigo-600"/> Porównanie zysku (EDO)
                              </h4>
                              
                              <div className="space-y-4 mb-8">
                                  <div className="flex justify-between items-end">
                                      <span className="text-[10px] text-slate-500 font-bold uppercase">Zwykłe konto (Po podatku)</span>
                                      <span className="text-xl font-black text-slate-900">81% zysku</span>
                                  </div>
                                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="w-[81%] h-full bg-slate-400"></div>
                                  </div>

                                  <div className="flex justify-between items-end pt-2">
                                      <span className="text-[10px] text-indigo-600 font-bold uppercase">Konto IKE (Bez podatku)</span>
                                      <span className="text-xl font-black text-indigo-600">100% zysku</span>
                                  </div>
                                  <div className="w-full h-3 bg-indigo-50 rounded-full overflow-hidden">
                                      <div className="w-full h-full bg-indigo-600"></div>
                                  </div>
                              </div>

                              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                  <p className="text-[10px] text-indigo-800 leading-relaxed italic">
                                      <strong>Ważne:</strong> IKE Obligacje to jedyne konto emerytalne w Polsce, które pozwala kupować <strong>obligacje detaliczne</strong> bezpośrednio w systemie transakcyjnym bez dodatkowych opłat za zarządzanie.
                                  </p>
                              </div>
                              
                              <button 
                                  onClick={() => navigate('/ike-ikze')} 
                                  className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                              >
                                  Dowiedz się więcej o IKE/IKZE <ArrowRight size={14}/>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>

{/* ROZDZIAŁ 7: STRATEGIE INWESTYCYJNE (Expert Guide) */}
<div id="strategie" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">7</div>
                      <h3 className="text-2xl font-bold text-slate-900">Strategie: jak zbudować portfel obligacji?</h3>
                  </div>

                  <p className="text-slate-600 mb-12 leading-relaxed max-w-3xl text-sm">
                      Dla zaawansowanego inwestora <strong>obligacje skarbowe</strong> nie są produktem typu „kup i zapomnij”. Kluczem do sukcesu jest <strong>dywersyfikacja portfela</strong> pod kątem terminów zapadalności oraz rodzaju oprocentowania, aby zmaksymalizować <strong>rentowność obligacji (YTM)</strong> w różnych cyklach rynkowych.
                  </p>

                  <div className="grid lg:grid-cols-3 gap-8">
                      {/* STRATEGIA 1: DRABINA OBLIGACJI */}
                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-blue-300 transition-all flex flex-col h-full group">
                          <div className="mb-6 bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                              <TrendingUp size={24}/>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-4 italic">Drabina obligacji (Bond Ladder)</h4>
                          <p className="text-xs text-slate-500 leading-relaxed mb-8 flex-grow">
                              Polega na podzieleniu kapitału na części i kupowaniu obligacji <strong>EDO (10-letnich)</strong> co rok. Dzięki temu po 10 latach co roku kończy się jedna seria, dając Ci płynność bez konieczności zrywania umów.
                          </p>
                          <div className="bg-white p-4 rounded-xl border border-slate-100 mt-auto text-[10px] space-y-2">
                              <div className="flex justify-between"><span>Płynność:</span> <span className="font-bold text-green-600 uppercase">Wysoka</span></div>
                              <div className="flex justify-between"><span>Zastosowanie:</span> <span className="font-bold text-slate-800 uppercase">Emerytura</span></div>
                          </div>
                      </div>
                      
                      {/* STRATEGIA 2: PODUSZKA ANTYINFLACYJNA */}
                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-purple-300 transition-all flex flex-col h-full group">
                          <div className="mb-6 bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-purple-600 group-hover:scale-110 transition-transform">
                              <ShieldCheck size={24}/>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-4 italic">Poduszka Bezpieczeństwa</h4>
                          <p className="text-xs text-slate-500 leading-relaxed mb-8 flex-grow">
                              Zamiast konta oszczędnościowego, wybierz <strong>obligacje TOS (stałe)</strong> lub <strong>COI (indeksowane)</strong>. Oferują one <strong>ochronę przed inflacją</strong> znacznie wyższą niż bankowe lokaty, a środki odzyskasz w 3-5 dni roboczych.
                          </p>
                          <div className="bg-white p-4 rounded-xl border border-slate-100 mt-auto text-[10px] space-y-2">
                              <div className="flex justify-between"><span>Bezpieczeństwo:</span> <span className="font-bold text-blue-600 uppercase">Max (BFG/Skarb)</span></div>
                              <div className="flex justify-between"><span>Zysk:</span> <span className="font-bold text-slate-800 uppercase">Stabilny</span></div>
                          </div>
                      </div>

                      {/* STRATEGIA 3: FUNDUSZ EDUKACYJNY ROD */}
                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-pink-300 transition-all flex flex-col h-full group">
                          <div className="mb-6 bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-pink-500 group-hover:scale-110 transition-transform">
                              <Baby size={24}/>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-4 italic">Strategia Rodzinna 800+</h4>
                          <p className="text-xs text-slate-500 leading-relaxed mb-8 flex-grow">
                              Maksymalizacja <strong>obligacji ROD (12-letnich)</strong>. Dzięki najwyższej na rynku marży i mechanizmowi, jakim jest <Link to="/procent-skladany" className="text-pink-600 font-bold underline">procent składany</Link>, budujesz kapitał na start dla dziecka z zerowym ryzykiem rynkowym.
                          </p>
                          <div className="bg-white p-4 rounded-xl border border-slate-100 mt-auto text-[10px] space-y-2">
                              <div className="flex justify-between"><span>Limit:</span> <span className="font-bold text-pink-600 uppercase">Kwota 800+</span></div>
                              <div className="flex justify-between"><span>Czas:</span> <span className="font-bold text-slate-800 uppercase">12-18 Lat</span></div>
                          </div>
                      </div>
                  </div>

                  {/* EKSPERCKA PORADA NA KONIEC */}
                  <div className="mt-12 bg-slate-900 rounded-3xl p-8 relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 p-8 opacity-10"><Lightbulb size={120} className="text-white"/></div>
                      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg"><Info size={32}/></div>
                          <div>
                              <h5 className="text-white font-bold text-lg mb-2 italic">Złota zasada dywersyfikacji: 2026</h5>
                              <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
                                  Nie stawiaj wszystkiego na jeden symbol. Specjaliści sugerują model 40/40/20: <strong>40% w EDO</strong> (ochrona przed inflacją), <strong>40% w TOS</strong> (pewność zysku stałego) i <strong>20% w ROR</strong> (płynność i reakcja na stopy NBP). Taka struktura portfela zapewnia optymalną <strong>realną stopę zwrotu</strong> w każdych warunkach gospodarczych.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>

{/* ROZDZIAŁ 8: INDEKS SEMANTYCZNY (Poprawiona wersja interaktywna) */}
              <div id="indeks" className="mt-32 pt-16 border-t border-slate-100">
                  <div className="flex items-center gap-4 mb-12">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">8</div>
                      <h3 className="text-2xl font-bold text-slate-900">Indeks i nawigacja szybkiego dostępu</h3>
                  </div>

                  {/* KAFELKI DEFINICJI */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                      {[
                        { term: "EDO", desc: "10-letnie, indeksowane inflacją.", path: "#katalog" },
                        { term: "COI", desc: "4-letnie z coroczną wypłatą zysku.", path: "#katalog" },
                        { term: "TOS", desc: "3-letnie o stałym oprocentowaniu.", path: "#katalog" },
                        { term: "ROR", desc: "1-roczne oparte o stopę NBP.", path: "#katalog" },
                        { term: "Marża", desc: "Stały zysk ponad inflację w EDO i COI.", path: "#indeksacja" },
                        { term: "Rolowanie", desc: "Zamiana starych obligacji na nowe.", path: "#rolowanie" },
                        { term: "Podatek Belki", desc: "19% podatku (unikniesz go w IKE).", path: "#podatki" },
                        { term: "Nominał", desc: "Wartość 1 sztuki - zawsze 100 zł.", path: "#fundamenty" },
                        { term: "KDPW", desc: "Krajowy Depozyt - tu są Twoje środki.", path: "#fundamenty" },
                        { term: "YTM", desc: "Rentowność mierzona do dnia wykupu.", path: "#strategie" }
                      ].map((item, i) => (
                        <button 
                          key={i} 
                          onClick={(e) => scrollToSection(e, item.path)}
                          className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all text-left group"
                        >
                          <span className="block font-black text-blue-600 text-[10px] uppercase tracking-tighter mb-1 group-hover:text-blue-700">{item.term}</span>
                          <p className="text-[9px] text-slate-500 leading-tight">{item.desc}</p>
                        </button>
                      ))}
                  </div>
                  
                  {/* INTERAKTYWNE TAGI SEO */}
                  <div className="mt-6 flex flex-wrap gap-2">
                     {[
                       { label: "Wcześniejszy wykup", id: "#wykup" },
                       { label: "Indeksacja inflacją", id: "#indeksacja" },
                       { label: "IKE-Obligacje", id: "#podatki" },
                       { label: "Drabina obligacji", id: "#strategie" },
                       { label: "Cena emisyjna", id: "#proces" },
                       { label: "Sukcesja i spadek", id: "#proces" },
                       { label: "Rating Polski", id: "#fundamenty" },
                       { label: "Stopa NBP", id: "#katalog" },
                       { label: "Realny zysk", id: "#strategie" },
                       { label: "Dywersyfikacja", id: "#strategie" }
                     ].map((tag, i) => (
                       <button 
                         key={i} 
                         onClick={(e) => scrollToSection(e, tag.id)}
                         className="text-[9px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all border border-slate-200"
                       >
                         # {tag.label}
                       </button>
                     ))}
                  </div>

                  <p className="mt-12 text-[10px] text-slate-400 leading-relaxed italic border-l-2 border-slate-200 pl-4">
                    Powyższy indeks zawiera <strong>30 kluczowych pojęć</strong> dotyczących rynku obligacji. Kliknięcie w hasło przeniesie Cię do odpowiedniej sekcji merytorycznej kompendium. Pamiętaj, że <strong>rentowność obligacji (YTM)</strong> oraz <strong>marża</strong> są kluczowe dla Twojej <strong>realnej stopy zwrotu</strong> w 2026 roku.
                  </p>
              </div>

          </div>
      </div>
    </>
  );
};
const CompoundView = () => {
    const navigate = useNavigate(); // Inicjalizacja nawigacji do innych podstron

  // FUNKCJA PRZEWIJANIA - Klucz do działania Spisu Treści i Kafli SEO
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Margines od góry
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // FUNKCJA FORMATOWANIA WALUTY
  const formatMoney = (val) => 
    new Intl.NumberFormat('pl-PL', { 
        style: 'currency', 
        currency: 'PLN', 
        maximumFractionDigits: 0 
    }).format(val);

  // --- ZMIENNE (BEZ ZMIAN) ---
  const [compoundPrincipal, setCompoundPrincipal] = useState(10000);
  const [compoundYears, setCompoundYears] = useState(10);
  const [compoundMonths, setCompoundMonths] = useState(0);
  const [compoundRate, setCompoundRate] = useState(5);
  const [compoundFreq, setCompoundFreq] = useState(12);
  const [compoundAI, setCompoundAI] = useState({ text: "", loading: false });

  // OBLICZENIA (BEZ ZMIAN)
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
    <>
      <Helmet>
        <title>Kalkulator Procentu Składanego - Wzór i Symulacja Zysków</title>
        <link rel="canonical" href="https://www.finanse-proste.pl/procent-skladany" />
        <script type="application/ld+json">
{`
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Kalkulator Procentu Składanego",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PLN"
    },
    "description": "Symulacja zysków z inwestycji długoterminowych. Zobacz efekt kuli śnieżnej i reinwestowania odsetek.",
    "featureList": "Kapitalizacja miesięczna/roczna, podatek Belki, inflacja"
  }
`}
</script>
        <meta name="description" content="Oblicz zysk z procentu składanego. Zrozum efekt kuli śnieżnej, poznaj wzór i zobacz jak czas pomnaża Twoje oszczędności." />
      </Helmet>

{/* --- SPIS TREŚCI: PROTOKÓŁ KULI ŚNIEŻNEJ --- */}
<div className="mb-16 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex flex-wrap justify-center gap-2 md:gap-3">
  <div className="w-full text-center mb-4">
    <ListTree size={16} className="inline-block mr-2 text-slate-400"/>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Nawigacja po mechanizmach bogactwa</span>
  </div>
  
  <button onClick={() => scrollToSection('kalkulator-skladany')} className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
    <Calculator size={14}/> KALKULATOR
  </button>

  {[
    { title: "Reguła 72", id: "regula-72-kompletna", icon: Clock },
    { title: "Cisi Złodzieje", id: "cisi-zlodzieje-kapitalu", icon: AlertOctagon },
    { title: "Ciemna Strona", id: "ciemna-strona-procentu", icon: Siren },
    { title: "Architektura Nawyków", id: "automatyzacja-nawyki", icon: Cpu },
    { title: "Punkt Krytyczny", id: "punkt-krytyczny-nawigacja", icon: Navigation },
  ].map((item, i) => (
    <button
      key={i}
      onClick={() => scrollToSection(item.id)}
      className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all border border-slate-50 bg-white"
    >
      <item.icon size={14} className="opacity-50"/>
      {item.title}
    </button>
  ))}
</div>

{/* Kotwica dla kalkulatora */}
<div id="kalkulator-skladany" className="scroll-mt-24"></div>

      <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-12">
          <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                <TrendingUp className="text-purple-600" size={36}/>
                Kalkulator Procentu Składanego
              </h2>
              <p className="text-slate-600 max-w-2xl text-lg">
                Sprawdź efekt "kuli śnieżnej". Zobacz jak rosną pieniądze, gdy odsetki zarabiają kolejne odsetki. To najpotężniejsze narzędzie w budowaniu bogactwa.
              </p>
          </div>

          {/* --- NARZĘDZIE KALKULATORA (BEZ ZMIAN) --- */}
          <div className="grid lg:grid-cols-12 gap-8 mb-20">
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

          {/* --- NOWA SEKCJA EDUKACYJNA (SEO) --- */}
          <div className="space-y-16">
              {/* DEFINICJA I EINSTEIN */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                      <div>
                          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                              <BookOpen size={14}/> Baza Wiedzy
                          </div>
                          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                              Co to jest Procent Składany?
                          </h3>
                          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                              Procent składany (ang. <em>Compound Interest</em>) to mechanizm, w którym odsetki od Twojego kapitału nie są wypłacane, lecz <strong>dopisywane do puli (reinwestowane)</strong>. W kolejnym okresie odsetki naliczają się już od większej kwoty.
                          </p>
                          <p className="text-slate-600 leading-relaxed">
                              Często nazywany jest "efektem kuli śnieżnej". Mała kulka (Twój kapitał) tocząc się ze zbocza (czas), zbiera coraz więcej śniegu (odsetki), stając się potężną lawiną.
                          </p>
                      </div>
                      <div className="bg-purple-900 text-white p-8 rounded-[2rem] relative">
                          <Sparkles className="absolute top-4 right-4 text-purple-400 opacity-50"/>
                          <blockquote className="text-xl font-medium italic mb-6">
                              "Procent składany to ósmy cud świata. Ci, którzy go rozumieją, zarabiają na nim. Ci, którzy nie rozumieją, muszą go płacić."
                          </blockquote>
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center font-bold text-xl">AE</div>
                              <div>
                                  <div className="font-bold">Albert Einstein</div>
                                  <div className="text-xs text-purple-300">(Przypisywany cytat)</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* MATEMATYKA I WZÓR */}
              <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-200">
                      <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                          <Calculator className="text-blue-600"/> Wzór na Procent Składany
                      </h3>
                      
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-x-auto">
                          <code className="text-2xl md:text-3xl font-mono text-slate-800 tracking-wider">
                              K<span className="text-xs align-sub">n</span> = K<span className="text-xs align-sub">0</span> × (1 + <span className="text-blue-600">r</span>/<span className="text-purple-600">n</span>)<sup className="text-orange-500">n×t</sup>
                          </code>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                              <h4 className="font-bold text-slate-900 mb-2">Legenda:</h4>
                              <ul className="space-y-3 text-sm text-slate-600">
                                  <li className="flex gap-2"><span className="font-mono font-bold text-slate-400">Kn</span> <span>Kapitał końcowy (to co wypłacisz)</span></li>
                                  <li className="flex gap-2"><span className="font-mono font-bold text-slate-400">K0</span> <span>Kapitał początkowy (Twoja wpłata)</span></li>
                                  <li className="flex gap-2"><span className="font-mono font-bold text-blue-600">r</span> <span>Roczna stopa procentowa (np. 0.05 dla 5%)</span></li>
                                  <li className="flex gap-2"><span className="font-mono font-bold text-purple-600">n</span> <span>Liczba kapitalizacji w roku (np. 12 dla miesięcznej)</span></li>
                                  <li className="flex gap-2"><span className="font-mono font-bold text-orange-500">t</span> <span>Liczba lat inwestycji</span></li>
                              </ul>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-900 leading-relaxed">
                              <strong>Kluczowy wniosek:</strong> Czas (t) znajduje się w potędze! To oznacza, że wydłużenie czasu inwestycji o kilka lat daje nieproporcjonalnie gigantyczne zyski. To ważniejsze niż wpłacanie dużych kwot.
                          </div>
                      </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-8 flex flex-col justify-center">
                      <h3 className="text-xl font-bold mb-4 text-orange-400">Procent Prosty vs Składany</h3>
                      <p className="text-sm text-slate-300 mb-6">
                          Załóżmy 10 000 zł na 5% przez 20 lat.
                      </p>
                      
                      <div className="space-y-6">
                          <div>
                              <div className="text-xs uppercase tracking-widest text-slate-500 mb-1">Procent Prosty (Lokata bez kapitalizacji)</div>
                              <div className="text-2xl font-bold text-slate-400">20 000 zł</div>
                              <div className="text-xs text-slate-500">Zysk: 10 000 zł</div>
                          </div>
                          <div className="relative">
                              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-orange-500 rounded-full"></div>
                              <div className="text-xs uppercase tracking-widest text-orange-400 mb-1">Procent Składany</div>
                              <div className="text-4xl font-black text-white">27 126 zł</div>
                              <div className="text-xs text-orange-300 font-bold">Zysk: 17 126 zł (+71% więcej!)</div>
                          </div>
                      </div>
                  </div>
              </div>

{/* SEKCJA: REGUŁA 72 - MENTALNY SKRÓT */}
<div id="regula-72-kompletna" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-left scroll-mt-24 mt-16">
    <div className="relative z-10 space-y-12">
        <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
                <Clock size={28} />
            </div>
            <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Reguła 72: Twój finansowy kompas</h4>
                <p className="text-slate-500 font-medium text-left text-sm uppercase tracking-wider">Jak błyskawicznie obliczyć podwojenie kapitału?</p>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
                <p>
                    Reguła 72 to najprostszy sposób, by bez użycia kalkulatora oszacować, jak długo musisz czekać, aż Twoje oszczędności podwoją swoją wartość dzięki <strong>procentowi składanemu</strong>. 
                </p>
                <p className="text-sm font-bold text-indigo-600">
                    Wystarczy podzielić liczbę 72 przez roczną stopę zwrotu.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Zysk 6% rocznie</span>
                        <span className="text-xl font-black text-slate-900">12 lat do podwojenia</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Zysk 10% rocznie</span>
                        <span className="text-xl font-black text-slate-900">7,2 roku do podwojenia</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 text-center space-y-6">
                    <h5 className="text-xl font-black text-indigo-400">Dlaczego to działa?</h5>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Reguła ta opiera się na logarytmie naturalnym z liczby 2. Jest niezwykle precyzyjna dla stóp zwrotu w zakresie 5-12%. Pokazuje ona, że nawet mała różnica w oprocentowaniu (np. 2%) potrafi skrócić czas oczekiwania na podwojenie majątku o kilka lat.
                    </p>
                    <div className="inline-flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                        <TrendingUp className="text-green-400" />
                        <span className="text-xs font-bold">Im wyższy %, tym szybciej działa Twoja kula śnieżna.</span>
                    </div>
                </div>
                <Activity size={300} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
            </div>
        </div>
    </div>
</div>

{/* SEKCJA: CISI ZŁODZIEJE ZYSKU - ROZBUDOWANA */}
<div id="cisi-zlodzieje-kapitalu" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-left scroll-mt-24 mt-16">
    <div className="relative z-10 space-y-12">
        
        {/* NAGŁÓWEK */}
        <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-100 shrink-0">
                <AlertOctagon size={28} />
            </div>
            <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Cisi Złodzieje: Dlaczego 8% na ekranie to nie 8% w portfelu?</h4>
                <p className="text-slate-500 font-medium text-left text-sm uppercase tracking-wider">Anatomia degradacji zysku: Podatki, Inflacja i Koszty</p>
            </div>
        </div>

        <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
            <p>
                Kalkulatory <strong>procentu składanego</strong> często pokazują idealny świat. W rzeczywistości Twoja "kula śnieżna" musi przedrzeć się przez trzy warstwy oporu, które potrafią zmniejszyć końcowy majątek o ponad połowę. Zrozumienie <strong>Realnej Stopy Zwrotu</strong> to różnica między bogactwem a jedynie "utrzymaniem się na powierzchni".
            </p>
        </div>

        {/* TRZY FILARY DEGRADACJI */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* 1. PODATEK BELKI */}
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-600 mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Gavel size={24}/>
                </div>
                <h5 className="font-bold text-slate-900 mb-3">Podatek Belki (19%)</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                    To podatek od zysków kapitałowych. Najbardziej boli przy częstej kapitalizacji (np. lokaty 3-miesięczne), ponieważ bank pobiera go przy każdym dopisaniu odsetek. 
                </p>
                <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                    Zabiera co piątą złotówkę zysku.
                </div>
            </div>

            {/* 2. INFLACJA */}
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Flame size={24}/>
                </div>
                <h5 className="font-bold text-slate-900 mb-3">Inflacja (Erozja Siły)</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                    Inflacja to "odwrócony" procent składany. Jeśli Twoje pieniądze rosną o 7%, a ceny w sklepach o 5%, to Twój <strong>realny przyrost majątku</strong> wynosi zaledwie 2%. 
                </p>
                <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                    Puchnięcie cyfr, nie wartości.
                </div>
            </div>

            {/* 3. KOSZTY TER / OPŁATY */}
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <MinusCircle size={24}/>
                </div>
                <h5 className="font-bold text-slate-900 mb-3">Koszty Zarządzania (TER)</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                    Wiele funduszy pobiera 1-2% opłaty za zarządzanie rocznie. Wydaje się to mało, ale w skali 30 lat te "małe procenty" potrafią zabrać nawet 40% Twojego końcowego kapitału.
                </p>
                <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                    Złodziej ukryty w regulaminie.
                </div>
            </div>
        </div>

        {/* TABELA PORÓWNAWCZA - FILTR PRAWDY */}
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-8">
                <h5 className="text-xl font-bold text-center">Symulacja: 100 000 PLN na 20 lat (Zysk 7% rocznie)</h5>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-4 text-xs font-black uppercase text-slate-500">Scenariusz</th>
                                <th className="py-4 text-xs font-black uppercase text-slate-500 text-right">Kwota końcowa</th>
                                <th className="py-4 text-xs font-black uppercase text-slate-500 text-right">Realna siła nabywcza</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-white/5">
                                <td className="py-6 font-bold text-slate-300">Zysk Nominalny (Idealny świat)</td>
                                <td className="py-6 text-right font-black text-white">386 968 PLN</td>
                                <td className="py-6 text-right text-slate-400">100% zysku</td>
                            </tr>
                            <tr className="border-b border-white/5 bg-white/5">
                                <td className="py-6 font-bold text-red-400">Po odliczeniu Podatku Belki (19%)</td>
                                <td className="py-6 text-right font-black text-white">313 000 PLN</td>
                                <td className="py-6 text-right text-red-300">Strata: ~74 000 PLN</td>
                            </tr>
                            <tr>
                                <td className="py-6 font-bold text-orange-400">Po odliczeniu Podatku i Inflacji (4%)</td>
                                <td className="py-6 text-right font-black text-yellow-400">142 800 PLN</td>
                                <td className="py-6 text-right text-orange-300">Realny wzrost o tylko 42%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <p className="text-xs text-slate-400 italic">
                        <strong>Wniosek:</strong> Aby realnie budować majątek, musisz szukać rozwiązań optymalizujących podatki (IKE, IKZE) oraz minimalizować koszty transakcyjne. Sam <strong>procent składany</strong> to tylko silnik – musisz jeszcze zadbać o szczelność baku.
                    </p>
                </div>
            </div>
            <Activity size={300} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
        </div>

        {/* CTA DO OBLIGACJI / IKE */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="text-left flex gap-6 items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                    <Umbrella size={32}/>
                </div>
                <div>
                    <h5 className="text-xl font-bold mb-1 text-left">Chcesz uniknąć Podatku Belki?</h5>
                    <p className="text-slate-500 text-sm text-left leading-relaxed">
                        Sprawdź, jak <strong>IKE (Indywidualne Konto Emerytalne)</strong> pozwala Twojej kuli śnieżnej rosnąć bez corocznej daniny dla fiskusa.
                    </p>
                </div>
            </div>
            <button 
                onClick={() => navigate('/ike-ikze')}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shrink-0 flex items-center gap-2 shadow-lg shadow-indigo-100"
            >
                <Calculator size={16}/> OBLICZ ZYSK Z IKE
            </button>
        </div>
    </div>
</div>

{/* SEKCJA: CIEMNA STRONA MOCY - ZADŁUŻENIE */}
<div id="ciemna-strona-procentu" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-red-100 shadow-sm relative overflow-hidden text-left scroll-mt-24 mt-16">
    <div className="relative z-10 space-y-12">
        
        {/* NAGŁÓWEK OSTRZEGAWCZY */}
        <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-red-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 shrink-0">
                <Siren size={28} />
            </div>
            <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Ciemna Strona Mocy: Gdy procent składany działa przeciwko Tobie</h4>
                <p className="text-red-600 font-medium text-left text-sm uppercase tracking-wider font-bold">Pętla zadłużenia i mechanizm odsetek karnych</p>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
                <p>
                    Procent składany nie wybiera stron – jest bezlitosnym matematycznym silnikiem. Jeśli oszczędzasz, buduje Twoje bogactwo. Jeśli jesteś dłużnikiem, staje się narzędziem, które może doprowadzić Cię do <strong>pętli zadłużenia</strong>.
                </p>
                <p className="text-sm font-bold text-red-700 bg-red-50 p-4 rounded-xl border-l-4 border-red-600">
                    W zadłużeniu procent składany działa w drugą stronę: odsetki, których nie spłacisz w terminie, są doliczane do długu, tworząc nową, większą podstawę do naliczania kolejnych karnych opłat.
                </p>
            </div>

            {/* DANGER CARD: KARTA KREDYTOWA */}
            <div className="bg-red-950 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group border border-red-900">
                <div className="relative z-10 space-y-6">
                    <h5 className="text-xl font-black text-red-400 uppercase tracking-tighter">Pułapka Karty Kredytowej</h5>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-red-800 pb-2">
                            <span className="text-xs text-red-300">Oprocentowanie RRSO</span>
                            <span className="text-2xl font-black">~ 20% +</span>
                        </div>
                        <p className="text-xs text-red-200/70 leading-relaxed">
                            Karty kredytowe często stosują dzienną kapitalizację odsetek od momentu zakończenia okresu bezodsetkowego. Spłacanie tylko "kwoty minimalnej" to prosta droga do tego, by przez lata spłacać same odsetki, nie ruszając nawet kapitału.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-red-900/40 p-4 rounded-2xl border border-red-800">
                        <AlertTriangle className="text-red-500" size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Dług rośnie szybciej niż Twoje zarobki</span>
                    </div>
                </div>
                <CreditCard size={200} className="absolute -bottom-20 -right-20 text-red-500/10 rotate-12" />
            </div>
        </div>

        {/* PORÓWNANIE: DEBRET VS INWESTYCJA */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h6 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <History size={18} className="text-red-600"/> Odsetki od odsetek
                </h6>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                    W długu każdy dzień zwłoki zwiększa bazę. Jeśli zignorujesz monit, po roku dług może być dwukrotnie większy przez dodatkowe koszty windykacyjne doliczone do kapitału.
                </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h6 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Ban size={18} className="text-red-600"/> Psychologia wypierania
                </h6>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                    Ludzie mają tendencję do liniowego postrzegania długu. Myślą: "oddam te 1000 zł później". Matematyka wykładnicza sprawia jednak, że to "później" kosztuje 1500 zł szybciej, niż się spodziewasz.
                </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h6 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Navigation size={18} className="text-red-600"/> Wyjście z pętli
                </h6>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                    Najskuteczniejszą walką z ujemnym procentem składanym jest metoda "śnieżnej kuli długu" – spłacanie najmniejszych zobowiązań najpierw, by uwolnić gotówkę na te najwyżej oprocentowane.
                </p>
            </div>
        </div>
    </div>
</div>

{/* SEKCJA: ARCHITEKTURA NAWYKÓW - AUTOMATYZACJA */}
<div id="automatyzacja-nawyki" className="bg-slate-50 rounded-[3rem] p-8 md:p-16 border border-slate-200 shadow-inner relative overflow-hidden text-left scroll-mt-24 mt-16">
    
    {/* TŁO DEKORACYJNE - SIATKA TECHNICZNA */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

    <div className="relative z-10 space-y-12">
        
        {/* NAGŁÓWEK W STYLU SCHEMATU */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-300 pb-8">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.3em]">
                    <Cpu size={16}/> System Protocol v2.0
                </div>
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter text-left">Architektura Nawyków</h4>
                <p className="text-slate-500 font-medium text-left">Jak zaprogramować życie, by procent składany działał bez Twojej uwagi?</p>
            </div>
            <div className="hidden md:block text-right">
                <div className="text-[10px] font-mono text-slate-400">STATUS: ACTIVE</div>
                <div className="text-[10px] font-mono text-green-600">REVENUE_STREAM: COMPOUNDING</div>
            </div>
        </div>

        {/* LOGIKA SYSTEMU - TRZY FILARY AUTOMATU */}
        <div className="grid lg:grid-cols-3 gap-12">
            
            {/* KROK 1: TRIGGER */}
            <div className="space-y-6 relative">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center font-black text-sm">01</div>
                    <h5 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Płać najpierw sobie</h5>
                </div>
                <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm relative group">
                    <div className="absolute -top-3 -right-3 bg-indigo-600 text-white p-2 rounded-lg rotate-12 group-hover:rotate-0 transition-transform">
                        <Repeat size={16}/>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed text-left">
                        Nie oszczędzaj tego, co zostaje po wydatkach. <strong>Wydawaj to, co zostaje po oszczędnościach</strong>. Ustaw automatyczny przelew wychodzący w dniu wypłaty. To jedyny sposób, by uniknąć "inflacji stylu życia".
                    </p>
                </div>
            </div>

            {/* KROK 2: AUTOMATION */}
            <div className="space-y-6 relative">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center font-black text-sm">02</div>
                    <h5 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Portfel Wieczny</h5>
                </div>
                <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm relative group">
                    <div className="absolute -top-3 -right-3 bg-indigo-600 text-white p-2 rounded-lg -rotate-12 group-hover:rotate-0 transition-transform">
                        <Bot size={16}/>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed text-left">
                        Wybieraj instrumenty, które same <strong>reinwestują zyski</strong> (np. ETF typu Acc). Twoim jedynym zadaniem jest nie przeszkadzać procesowi. Każde zajrzenie na konto maklerskie to pokusa, by "coś zmienić" i zepsuć efekt kuli śnieżnej.
                    </p>
                </div>
            </div>

            {/* KROK 3: SCALE */}
            <div className="space-y-6 relative">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center font-black text-sm">03</div>
                    <h5 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Dyscyplina Nudy</h5>
                </div>
                <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm relative group">
                    <div className="absolute -top-3 -right-3 bg-indigo-600 text-white p-2 rounded-lg rotate-6 group-hover:rotate-0 transition-transform">
                        <Fingerprint size={16}/>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed text-left">
                        Inwestowanie powinno być jak oglądanie schnącej farby. Prawdziwa magia <strong>procentu składanego</strong> dzieje się w ostatniej dekadzie planu. Najtrudniejsze jest przetrwanie pierwszych 10 lat, gdy zyski wydają się mikroskopijne.
                    </p>
                </div>
            </div>

        </div>

        {/* MODUŁ PSYCHOLOGICZNY - CZARNY TERMINAL */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white font-mono relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-left">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-green-500 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        SYSTEM_ADVICE: PSYCHOLOGY_HACK
                    </div>
                    <h5 className="text-2xl font-black font-sans">Zapomnij o haśle do konta</h5>
                    <p className="text-slate-400 text-sm leading-relaxed font-sans">
                        Najlepsi inwestorzy to ci... martwi (według badań Fidelity). Dlaczego? Bo nie logowali się do kont i nie ulegali panice rynkowej. Jeśli chcesz, by <strong>efekt kuli śnieżnej</strong> działał, musisz oddzielić swoje emocje od swoich pieniędzy.
                    </p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="text-[10px] text-indigo-400 mb-4 uppercase tracking-widest font-bold">Logika sukcesu:</div>
                    <ul className="space-y-3 text-xs text-slate-300 font-sans">
                        <li className="flex items-center gap-3"><CheckCircle size={14} className="text-green-500"/> Automatyczny przelew (0% wysiłku)</li>
                        <li className="flex items-center gap-3"><CheckCircle size={14} className="text-green-500"/> Brak sprawdzania kursów (100% spokoju)</li>
                        <li className="flex items-center gap-3"><CheckCircle size={14} className="text-green-500"/> Akceptacja zmienności (Klucz do zysku)</li>
                    </ul>
                </div>
            </div>
            {/* Dekoracja techniczna */}
            <LayoutGrid size={300} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
        </div>
    </div>
</div>

{/* SEKCJA: PUNKT KRYTYCZNY I SYNERGIA AKTYWÓW */}
<div id="punkt-krytyczny-nawigacja" className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-200 shadow-2xl relative overflow-hidden text-left scroll-mt-24 mt-16">
    
    {/* TŁO DEKORACYJNE: MAPA I KOMPAS */}
    <div className="absolute -top-20 -right-20 opacity-[0.03] pointer-events-none rotate-12">
        <Compass size={500} className="text-slate-900" />
    </div>

    <div className="relative z-10 space-y-16">
        
        {/* NAGŁÓWEK: STRATEGIC MISSION CONTROL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-12">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                    <Navigation size={14}/> System Navigation: Freedom
                </div>
                <h4 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter text-left">
                    Prędkość Ucieczki: <span className="text-indigo-600">Punkt Krytyczny</span>
                </h4>
                <p className="text-slate-500 text-lg max-w-2xl text-left">
                    Moment, w którym Twoje aktywa generują więcej energii (zysku), niż potrzebuje Twój system (życie). Poznaj synergię narzędzi, które Cię tam dowiozą.
                </p>
            </div>
            <div className="shrink-0">
                 <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl">
                    <div className="text-[10px] text-indigo-400 font-black uppercase mb-2">Obecna Faza:</div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xl font-bold">Akumulacja Wykładnicza</span>
                    </div>
                 </div>
            </div>
        </div>

        {/* MACIERZ WOLNOŚCI - PORÓWNANIE I LINKOWANIE AKTYWÓW */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8">
                <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100 h-full">
                    <h5 className="text-2xl font-black text-slate-900 mb-8 text-left">Jak różne aktywa napędzają Punkt Krytyczny?</h5>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* LINK: ZŁOTO */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-yellow-400 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl group-hover:bg-yellow-400 group-hover:text-white transition-colors">
                                    <Coins size={24}/>
                                </div>
                                <button onClick={() => navigate('/zloto')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600">Otwórz Widok &rarr;</button>
                            </div>
                            <h6 className="font-bold text-slate-900 mb-2 text-left">Złoto: Stabilizator Bazy</h6>
                            <p className="text-[11px] text-slate-500 leading-relaxed text-left">
                                Złoto nie generuje procentu składanego (nie wypłaca dywidend), ale chroni Twoją bazę kapitałową przed inflacją. To "bezpiecznik", który dba, by Punkt Krytyczny nie oddalił się w czasie kryzysu.
                            </p>
                        </div>

                        {/* LINK: IKE/IKZE */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <ShieldCheck size={24}/>
                                </div>
                                <button onClick={() => navigate('/ike-ikze')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600">Otwórz Widok &rarr;</button>
                            </div>
                            <h6 className="font-bold text-slate-900 mb-2 text-left">IKE/IKZE: Akcelerator Podatkowy</h6>
                            <p className="text-[11px] text-slate-500 leading-relaxed text-left">
                                Klucz do <strong>maksymalizacji procentu składanego</strong>. Dzięki uniknięciu 19% podatku Belki, Twoja kula śnieżna osiąga masę krytyczną o 5-7 lat szybciej niż na zwykłym koncie.
                            </p>
                        </div>

                        {/* LINK: NIERUCHOMOŚCI (Odniesienie do przyszłej podstrony) */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-green-400 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <Home size={24}/>
                                </div>
                                <div className="text-[10px] font-black uppercase text-slate-300">Wkrótce</div>
                            </div>
                            <h6 className="font-bold text-slate-900 mb-2 text-left">Nieruchomości: Dźwignia i Cashflow</h6>
                            <p className="text-[11px] text-slate-500 leading-relaxed text-left">
                                Pozwalają na użycie kredytu (lewarowanie), co gwałtownie zwiększa podstawę, od której liczy się wzrost Twojego majątku netto.
                            </p>
                        </div>

                        {/* LINK: GIEŁDA / ETF */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-purple-400 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <CandlestickChart size={24}/>
                                </div>
                                <button onClick={() => navigate('/gielda')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600">Otwórz Widok &rarr;</button>
                            </div>
                            <h6 className="font-bold text-slate-900 mb-2 text-left">ETF (Acc): Czysta Kapitalizacja</h6>
                            <p className="text-[11px] text-slate-500 leading-relaxed text-left">
                                Idealne narzędzie do realizacji <strong>procentu składanego</strong> w trybie "ustaw i zapomnij". Automatyczne reinwestowanie dywidend buduje Punkt Krytyczny bez Twojego udziału.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PANEL KONTROLNY RESTRYKCJI */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-slate-900 text-white p-10 rounded-[3rem] h-full shadow-2xl flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                        <h5 className="text-xl font-black border-b border-white/10 pb-4 text-left">Strategia Wypłaty (FIRE)</h5>
                        
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-indigo-500 rounded-lg shrink-0"><Percent size={18}/></div>
                                <div>
                                    <strong className="block text-sm">Reguła 4%</strong>
                                    <p className="text-[10px] text-slate-400">Bezpieczna roczna stopa wypłaty, która pozwala zachować kapitał na dekady.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-indigo-500 rounded-lg shrink-0"><RefreshCcw size={18}/></div>
                                <div>
                                    <strong className="block text-sm">Cykliczność reinwestycji</strong>
                                    <p className="text-[10px] text-slate-400">Pamiętaj: dopóki nie potrzebujesz kapitału, 100% zysków musi wrócić do silnika.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-indigo-500 rounded-lg shrink-0"><Activity size={18}/></div>
                                <div>
                                    <strong className="block text-sm">Dywersyfikacja wyjścia</strong>
                                    <p className="text-[10px] text-slate-400">W Punkcie Krytycznym Twój portfel powinien być miksem złota, akcji i nieruchomości.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-[10px] text-slate-400 italic text-center">
                                "Wolność finansowa to nie stan konta, to stan umysłu, w którym praca staje się hobby."
                            </p>
                        </div>
                    </div>
                    <Activity size={200} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
                </div>
            </div>
        </div>

        {/* PODSUMOWANIE DROGI - FLOWCHART STYLE */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
             <div className="grid md:grid-cols-4 gap-8 relative z-10 text-center">
                <div className="space-y-2">
                    <div className="text-3xl font-black">01</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-indigo-200">Definicja Celu</div>
                    <p className="text-[10px] text-indigo-100">Ustal swoją "Licznę FIRE" (Koszty x 25).</p>
                </div>
                <div className="space-y-2">
                    <div className="text-3xl font-black">02</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-indigo-200">Budowa Silnika</div>
                    <p className="text-[10px] text-indigo-100">Ustaw automatyczny procent składany (IKE/ETF).</p>
                </div>
                <div className="space-y-2">
                    <div className="text-3xl font-black">03</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-indigo-200">Zabezpieczenie</div>
                    <p className="text-[10px] text-indigo-100">Dodaj złoto jako bufor bezpieczeństwa portfela.</p>
                </div>
                <div className="space-y-2">
                    <div className="text-3xl font-black">04</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-indigo-200">Start Rakiety</div>
                    <p className="text-[10px] text-indigo-100">Przekrocz Punkt Krytyczny i ciesz się wolnością.</p>
                </div>
             </div>
             <Sparkles size={300} className="absolute -bottom-24 -right-24 text-white/10" />
        </div>
    </div>
</div>

{/* --- SEKCJA SEO: CO WPISUJESZ W GOOGLE? --- */}
<div className="mt-24 border-t border-slate-100 pt-16">
    <div className="text-center mb-12">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Czego szukasz w Google?</h3>
        <p className="text-sm text-slate-500 italic">Najpopularniejsze zapytania o procent składany 2026</p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
            { kw: "Procent składany kalkulator miesięczny", id: "kalkulator-skladany" },
            { kw: "Jak działa reguła 72 wzór", id: "regula-72-kompletna" },
            { kw: "Podatek Belki a procent składany", id: "cisi-zlodzieje-kapitalu" },
            { kw: "Inflacja a realny zysk z lokaty", id: "cisi-zlodzieje-kapitalu" },
            { kw: "Pętla zadłużenia a odsetki karne", id: "ciemna-strona-procentu" },
            { kw: "Jak zautomatyzować oszczędzanie", id: "automatyzacja-nawyki" },
            { kw: "Reguła 4% wolność finansowa", id: "punkt-krytyczny-nawigacja" },
            { kw: "Ile odkładać na emeryturę kalkulator", id: "kalkulator-skladany" },
            { kw: "ETF akumulujący a podatek Belki", id: "strategie-optymalizacji" },
            { kw: "Koszt zwlekania z inwestowaniem", id: "automatyzacja-nawyki" }
        ].map((item, i) => (
            <button 
                key={i}
                onClick={() => scrollToSection(item.id)}
                className="p-6 bg-white border border-slate-200 rounded-3xl text-left hover:border-indigo-400 hover:shadow-md transition-all group"
            >
                <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Search size={14}/>
                </div>
                <span className="text-[11px] font-black text-slate-800 leading-tight block">
                    {item.kw}
                </span>
            </button>
        ))}
    </div>
</div>


          </div>
      </div>
    </>
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
    <>
      <Helmet>
        <title>Giełda, Akcje i ETF - Przewodnik Inwestora | Finanse Proste</title>
        <meta name="description" content="Jak kupić pierwsze akcje? Czym jest ETF? Poradnik o koncie maklerskim i podatkach giełdowych." />
      <link rel="canonical" href="https://www.finanse-proste.pl/gielda" />
      </Helmet>

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
                                  {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
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
    </>
  );
};
const PpkView = () => (
    <>
      <Helmet>
        <title>Kalkulator PPK - Czy to się opłaca? | Finanse Proste</title>
        <meta name="description" content="Pracownicze Plany Kapitałowe. Sprawdź ile dokłada pracodawca i państwo do Twojej emerytury." />
      <link rel="canonical" href="https://www.finanse-proste.pl/ppk" />
      </Helmet>

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
    </>
);

const IkeView = () => {
  const navigate = useNavigate(); // Tu potrzebujemy navigate dla guzików na dole
  return (
    <>
      <Helmet>
        <title>IKE czy IKZE? Kalkulator Korzyści Podatkowych | Finanse Proste</title>
        <meta name="description" content="Porównanie kont emerytalnych. Zobacz ile podatku odzyskasz dzięki IKZE i ile zaoszczędzisz na IKE." />
     <link rel="canonical" href="https://www.finanse-proste.pl/ike-ikze" />
      </Helmet>

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
                                  <span className="block text-sm font-bold text-slate-700">Limit wpłat (2026)</span>
                                    <p className="text-slate-600 mb-6">Limit wpłat w 2026: <strong>28 260 zł</strong></p>                              </div>
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
                                  <span className="block text-sm font-bold text-slate-700">Limit wpłat (2026)</span>
                                    <p className="text-slate-600 mb-6">Standardowy: <strong>11 304 zł</strong> Dla firm (JDG): <strong>16 956 zł</strong></p>                              </div>
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
  Ile gotówki odzyskasz z Urzędu Skarbowego w 2026 wpłacając limit (11 304 zł) na IKZE? 
  Zależy od Twoich zarobków (progu podatkowego).
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
                                      { yearx: '2024', val: 23.4 },
                                        { year: '2025', val: 26.0 },
                                        { year: '2026', val: 28.2 }
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
    </>
  );
};
const OkiView = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>OKI - Osobiste Konto Inwestycyjne | Kwota wolna od podatku Belki</title>
        <meta name="description" content="Czym jest OKI? Poznaj zasady nowej ulgi w podatku od zysków kapitałowych. Limity, planowana data wdrożenia i różnice względem IKE." />
     <link rel="canonical" href="https://www.finanse-proste.pl/oki" />
      </Helmet>

      <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">
          
          {/* HERO SECTION */}
          <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-100">
                 <Loader2 size={14} className="animate-spin"/> Projekt Rządowy (W przygotowaniu)
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900">
                  OKI - Osobiste Konto Inwestycyjne
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Zapowiadana rewolucja w podatkach dla oszczędzających. Nowy mechanizm, który ma wprowadzić kwotę wolną od podatku Belki (19%) dla Twoich oszczędności i inwestycji.
              </p>
          </div>

          {/* STATUS I DATA */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-xl shadow-cyan-50/50 mb-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                  <div>
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <Clock className="text-cyan-600"/> Kiedy start?
                      </h3>
                <p className="text-slate-700 mb-6 leading-relaxed">
                          Projekt jest obecnie w końcowej fazie prac legislacyjnych. Zgodnie z najnowszymi zapowiedziami, nowe przepisy dotyczące kwoty wolnej od podatku Belki mają wejść w życie w <strong>2026 roku</strong>.
                      </p>
                      <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 flex gap-4 items-start">
                          <AlertTriangle className="text-cyan-600 shrink-0 mt-1" size={20}/>
                          <div className="text-sm text-cyan-900">
                              <strong>Uwaga:</strong> Prezentowane poniżej informacje opierają się na założeniach projektu opublikowanych przez Ministerstwo Finansów. Ostateczny kształt ustawy może ulec zmianie w toku prac legislacyjnych.
                          </div>
                      </div>
                  </div>
                  <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-center items-center text-center">
                       <div className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Spodziewana data wdrożenia</div>
                       
                       <div className="text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">2026</div>
                       <div className="text-sm text-slate-400">Status: Koncepcja / Prace analityczne</div>
                  </div>
              </div>
          </div>

          {/* MECHANIZM - JAK TO MA DZIAŁAĆ */}
          <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center">Jak działa "Kwota Wolna" w OKI?</h3>
              
              <div className="grid lg:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 font-bold text-xl">1</div>
                      <h4 className="text-lg font-bold mb-2 text-slate-900">Limit Kapitału</h4>
                      <p className="text-slate-600 text-sm">
                          Ministerstwo proponuje limit kapitału w wysokości <strong>100 000 zł</strong>. Nie oznacza to, że możesz zainwestować tylko tyle. Oznacza to, że zysk wygenerowany przez taką kwotę (teoretycznie) będzie zwolniony z podatku.
                      </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5"><Percent size={80}/></div>
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 font-bold text-xl">2</div>
                      <h4 className="text-lg font-bold mb-2 text-slate-900">Mnożnik (Stopa NBP)</h4>
                      <p className="text-slate-600 text-sm">
                          Limit zwolnienia z podatku będzie wyliczany jako iloczyn 100 000 zł i <strong>stopy depozytowej NBP</strong> (obowiązującej w ostatnim dniu roku poprzedniego).
                      </p>
                      <div className="mt-4 p-2 bg-slate-50 rounded text-xs text-slate-500 font-mono">
                          Wzór: 100 000 zł × Stopa Depozytowa NBP
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-b-4 border-b-green-500">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4 font-bold text-xl">3</div>
                      <h4 className="text-lg font-bold mb-2 text-slate-900">Twój Zysk Netto</h4>
                      <p className="text-slate-600 text-sm">
                          Jeśli stopa depozytowa wynosi np. 5.25%, to kwota wolna od podatku wyniesie <strong>5 250 zł</strong> zysku rocznie.
                      </p>
                      <ul className="mt-4 space-y-1 text-sm text-slate-700">
                          <li className="flex justify-between"><span>Zysk do 5 250 zł:</span> <span className="font-bold text-green-600">0 zł podatku</span></li>
                          <li className="flex justify-between"><span>Zysk powyżej:</span> <span className="font-bold text-slate-400">19% podatku</span></li>
                      </ul>
                  </div>
              </div>
          </div>

          {/* CZYM SIĘ RÓŻNI OD IKE/IKZE - TABELA */}
          <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                  <Scale className="text-slate-700"/> OKI kontra Reszta Świata
              </h3>
              
              <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-slate-100 text-slate-500 uppercase font-bold text-xs">
                          <tr>
                              <th className="px-6 py-4">Cecha</th>
                              <th className="px-6 py-4 text-cyan-600">OKI (Plan)</th>
                              <th className="px-6 py-4 text-blue-600">IKE</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          <tr>
                              <td className="px-6 py-4 font-bold text-slate-700">Cel</td>
                              <td className="px-6 py-4">Oszczędzanie krótko i średnioterminowe</td>
                              <td className="px-6 py-4">Emerytura (długi termin)</td>
                          </tr>
                          <tr>
                              <td className="px-6 py-4 font-bold text-slate-700">Blokada środków</td>
                              <td className="px-6 py-4 text-green-600 font-bold">Brak (wypłacasz kiedy chcesz)</td>
                              <td className="px-6 py-4 text-orange-600">Do 60. roku życia (aby zachować ulgę)</td>
                          </tr>
                          <tr>
                              <td className="px-6 py-4 font-bold text-slate-700">Limit ulgi</td>
                              <td className="px-6 py-4">Kwota wolna od zysku (np. ~5000 zł)</td>
                              <td className="px-6 py-4">Brak podatku od CAŁOŚCI zysku</td>
                          </tr>
                          <tr>
                              <td className="px-6 py-4 font-bold text-slate-700">Rodzaj konta</td>
                              <td className="px-6 py-4">Specjalne wyodrębnione konto w banku?</td>
                              <td className="px-6 py-4">Konto maklerskie, obligacje, TFI</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
              <p className="text-center text-xs text-slate-500 mt-4">
                  *Ważne: OKI nie zastępuje IKE/IKZE. Będzie można posiadać wszystkie te konta jednocześnie.
              </p>
          </div>

          {/* SZCZEGÓŁY TECHNICZNE I OGRANICZENIA */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Lock className="text-red-500"/> Ograniczenia
                  </h3>
                  <ul className="space-y-4 text-sm text-slate-600">
                      <li className="flex gap-3">
                          <CheckCircle size={18} className="text-slate-400 shrink-0 mt-0.5"/>
                          <span><strong>Jeden Bank:</strong> Prawdopodobnie będziesz mógł otworzyć OKI tylko w jednej instytucji finansowej jednocześnie (podobnie jak IKE).</span>
                      </li>
                      <li className="flex gap-3">
                          <CheckCircle size={18} className="text-slate-400 shrink-0 mt-0.5"/>
                          <span><strong>Rejestracja:</strong> Banki będą musiały raportować istnienie takiego konta, aby pilnować limitów.</span>
                      </li>
                      <li className="flex gap-3">
                          <CheckCircle size={18} className="text-slate-400 shrink-0 mt-0.5"/>
                          <span><strong>Lokaty i Obligacje:</strong> OKI ma obejmować przede wszystkim zyski z lokat bankowych i obligacji. Kwestia zysków giełdowych jest bardziej skomplikowana w rozliczeniu i trwają nad nią prace.</span>
                      </li>
                  </ul>
              </div>

              <div className="bg-indigo-900 text-white p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-center">
                  <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-4 text-cyan-400">Dlaczego to ważne?</h3>
                      <p className="mb-6 opacity-90 leading-relaxed">
                          Obecnie, nawet jeśli zarobisz na lokacie 10 złotych, państwo zabiera Ci 1,90 zł (19% podatku Belki). To zniechęca do oszczędzania małych kwot.
                      </p>
                      <p className="opacity-90 leading-relaxed">
                          OKI ma sprawić, że dla "zwykłego Kowalskiego", który posiada oszczędności do 100 000 zł, podatek od zysków kapitałowych przestanie istnieć. To realny zysk w Twojej kieszeni, który do tej pory oddawałeś fiskusowi.
                      </p>
                  </div>
                  <Landmark className="absolute -bottom-10 -right-10 w-48 h-48 text-white opacity-5"/>
              </div>
          </div>

          {/* NAWIGACJA */}
          <div className="flex justify-center mt-12 gap-4">
               <button onClick={() => navigate('/')} className="px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-700 hover:bg-slate-200 transition-colors">
                  Wróć na stronę główną
               </button>
               <button onClick={() => navigate('/ike-ikze')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                  Zobacz obecne ulgi (IKE/IKZE)
               </button>
          </div>

      </div>
    </>
  );
};
const CryptoView = () => {
  const navigate = useNavigate();

  // Dane do wykresu zmienności (Bitcoin vs Obligacje - symulacja)
  const volatilityData = [
    { year: '2017', btc: 1000, bond: 1000 },
    { year: '2018', btc: 19000, bond: 1020 },
    { year: '2019', btc: 3500, bond: 1045 },
    { year: '2020', btc: 7200, bond: 1070 },
    { year: '2021', btc: 29000, bond: 1090 },
    { year: '2022', btc: 68000, bond: 1115 },
    { year: '2023', btc: 16000, bond: 1140 },
    { year: '2024', btc: 45000, bond: 1200 },
    { year: '2025', btc: 90000, bond: 1260 },
  ];

  return (
    <>
      <Helmet>
        <title>Kryptowaluty od A do Z - Bitcoin, Ethereum, Bezpieczeństwo | Finanse Proste</title>
        <meta name="description" content="Kompendium wiedzy o kryptowalutach. Jak działa Blockchain? Czym różni się Bitcoin od Dogecoina? Historia upadków giełd (FTX, Mt. Gox) i jak bezpiecznie kupować." />
      <link rel="canonical" href="https://www.finanse-proste.pl/kryptowaluty" />
      </Helmet>

      <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">
          
          {/* HERO SECTION - OSTRZEŻENIE */}
          <div className="text-center mb-16 relative">
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-yellow-400/30 animate-pulse">
                 <AlertTriangle size={16}/> Aktywa Wysokiego Ryzyka
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900">
                  Świat <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">Kryptowalut</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Od buntu przeciwko bankom do globalnego rynku wartego biliony dolarów. Poznaj technologię Blockchain, historię Bitcoina i zasady bezpieczeństwa, które mogą uchronić Cię przed utratą majątku.
              </p>
          </div>

          {/* GENEZA - BITCOIN */}
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-16 mb-20 relative overflow-hidden">
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                      <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                          <Globe className="text-yellow-500"/> Geneza: Rok 2008
                      </h3>
                      <p className="text-slate-300 mb-6 leading-relaxed">
                          Świat pogrążony w kryzysie finansowym. Banki upadają, rządy drukują pieniądze. W Halloween 2008 roku, anonimowa postać (lub grupa) o pseudonimie <strong>Satoshi Nakamoto</strong> publikuje manifest (Whitepaper): <em>"Bitcoin: A Peer-to-Peer Electronic Cash System"</em>.
                      </p>
                      <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                          <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2"><Lock size={18}/> Co to jest Blockchain?</h4>
                          <p className="text-sm text-slate-300">
                              Wyobraź sobie gigantyczną, cyfrową księgę rachunkową, której <strong>nie posiada żaden bank</strong>. Kopię tej księgi ma każdy użytkownik sieci. Gdy Jan przesyła Bitcoin Ali, wszyscy w sieci sprawdzają, czy Jan ma środki i dopisują transakcję do swoich ksiąg. Raz zapisanej strony (bloku) nie da się wyrwać ani zmienić. To jest właśnie łańcuch bloków.
                          </p>
                      </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                      <div className="w-64 h-64 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(234,179,8,0.4)] mb-8">
                          <span className="text-8xl font-black text-slate-900">₿</span>
                      </div>
                      <p className="text-center text-slate-400 text-sm italic">
                          "Nie ufaj, weryfikuj." - dewiza Bitcoina.
                      </p>
                  </div>
              </div>
              {/* Tło dekoracyjne */}
              <div className="absolute top-0 right-0 p-12 opacity-5 font-mono text-9xl font-black text-white pointer-events-none select-none">SHA-256</div>
          </div>

          {/* RODZAJE KRYPTOWALUT */}
          <div className="mb-20">
              <h3 className="text-3xl font-bold mb-10 text-center text-slate-900">Krypto-Ekosystem</h3>
              
              <div className="grid lg:grid-cols-3 gap-8">
                  {/* BITCOIN */}
                  <div className="bg-white p-8 rounded-[2rem] border-2 border-yellow-100 shadow-xl shadow-yellow-50 relative overflow-hidden group hover:-translate-y-2 transition-transform">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><Zap size={80} className="text-yellow-500"/></div>
                      <h4 className="text-2xl font-black text-yellow-600 mb-2">Bitcoin (BTC)</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Cyfrowe Złoto</p>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                          Pierwsza i największa kryptowaluta. Jej podaż jest matematycznie ograniczona do <strong>21 milionów sztuk</strong>. Działa jako "magazyn wartości" (Store of Value). Jest powolny, ale najbezpieczniejszy.
                      </p>
                  </div>

                  {/* ETHEREUM */}
                  <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-100 shadow-xl shadow-indigo-50 relative overflow-hidden group hover:-translate-y-2 transition-transform">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><Cpu size={80} className="text-indigo-500"/></div>
                      <h4 className="text-2xl font-black text-indigo-600 mb-2">Ethereum (ETH)</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Programowalny Pieniądz</p>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                          To nie tylko waluta, to platforma. Umożliwia tworzenie <strong>Inteligentnych Kontraktów</strong> (Smart Contracts) - programów, które same wykonują transakcje (np. "jeśli samolot się spóźni, wypłać odszkodowanie"). Fundament DeFi i NFT.
                      </p>
                  </div>

                  {/* MEMECOINS & SHITCOINS */}
                  <div className="bg-white p-8 rounded-[2rem] border-2 border-pink-100 shadow-xl shadow-pink-50 relative overflow-hidden group hover:-translate-y-2 transition-transform">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><Baby size={80} className="text-pink-500"/></div>
                      <h4 className="text-2xl font-black text-pink-600 mb-2">Memecoins</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Dogecoin, Shiba Inu, Pepe</p>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                          Powstały jako żart lub satyra. Ich wartość opiera się w 99% na społeczności (community), hypie w mediach społecznościowych i tweetach celebrytów (np. Elona Muska).
                      </p>
                      <div className="bg-pink-50 text-pink-800 text-xs p-3 rounded-lg font-bold border border-pink-200 mt-2">
                          ⚠️ Ekstremalne ryzyko. Możesz zarobić 1000% w dzień lub stracić 99% w godzinę.
                      </div>
                  </div>
              </div>
          </div>

          {/* WYKRES ZMIENNOŚCI - VISUALIZACJA RYZYKA */}
          <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 mb-20">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                  <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"><TrendingUp className="text-red-500"/> Rollercoaster Emocji</h3>
                      <p className="text-slate-600 max-w-xl">
                          Porównanie hipotetycznej inwestycji 1000$ w Bitcoina (duża zmienność) vs Obligacje (stabilny wzrost). Zobacz, jak drastyczne spadki (Drawdowns) musi przetrwać inwestor krypto.
                      </p>
                  </div>
                  <div className="flex gap-4 mt-4 md:mt-0 text-xs font-bold">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div>Bitcoin</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-400 rounded-full"></div>Obligacje</div>
                  </div>
              </div>

              <div className="h-[400px] w-full bg-white p-4 rounded-3xl border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={volatilityData} margin={{top: 20, right: 30, left: 10, bottom: 10}}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                          <XAxis dataKey="year" stroke="#94a3b8" fontSize={12}/>
                          <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val}`}/>
                          <RechartsTooltip 
                              contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                              formatter={(value) => [`$${value}`, 'Wartość']}
                          />
                          <Line type="monotone" dataKey="btc" stroke="#eab308" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
                          <Line type="monotone" dataKey="bond" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
              <p className="text-center text-xs text-slate-400 mt-4 italic">*Wykres poglądowy, nie odzwierciedla idealnie historycznych cen, służy do wizualizacji skali wahań.</p>
          </div>

          {/* HISTORIA ATAKÓW I BEZPIECZEŃSTWO */}
          <div className="mb-20">
              <h3 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                  <ShieldCheck size={32} className="text-slate-800"/> Bezpieczeństwo i Skandale
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                      <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                          <div className="flex items-center gap-3 mb-3 text-red-800">
                              <Siren size={24}/>
                              <h4 className="font-bold text-lg">Mt. Gox (2014)</h4>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                              W tamtym czasie giełda ta obsługiwała 70% światowego handlu Bitcoinem. Została zhakowana, a użytkownicy stracili 850 000 BTC. <strong>Lekcja:</strong> Nie trzymaj wszystkich środków na giełdzie.
                          </p>
                      </div>
                      <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                          <div className="flex items-center gap-3 mb-3 text-red-800">
                              <Siren size={24}/>
                              <h4 className="font-bold text-lg">Upadek FTX (2022)</h4>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                              Trzecia największa giełda świata upadła w kilka dni. Okazało się, że właściciel (Sam Bankman-Fried) nielegalnie obracał środkami klientów. Giełda zbankrutowała, ludzie stracili miliardy. <strong>Lekcja:</strong> "Too big to fail" nie istnieje w krypto.
                          </p>
                      </div>
                  </div>

                  <div className="bg-slate-900 text-white p-8 rounded-[2rem] flex flex-col justify-center">
                      <h4 className="text-xl font-bold mb-6 text-green-400">Jak nie stracić pieniędzy?</h4>
                      <ul className="space-y-4">
                          <li className="flex gap-4">
                              <div className="bg-white/10 p-2 rounded-lg h-fit"><Key size={20}/></div>
                              <div>
                                  <strong className="block text-white">Not your keys, not your coins</strong>
                                  <span className="text-sm text-slate-400">Jeśli trzymasz krypto na giełdzie (np. Binance), to giełda ma klucze. Jeśli giełda upadnie, tracisz środki. Prawdziwa własność jest tylko na prywatnym portfelu.</span>
                              </div>
                          </li>
                          <li className="flex gap-4">
                              <div className="bg-white/10 p-2 rounded-lg h-fit"><Wallet size={20}/></div>
                              <div>
                                  <strong className="block text-white">Portfele Sprzętowe (Cold Wallets)</strong>
                                  <span className="text-sm text-slate-400">Najbezpieczniejsza opcja. Urządzenia przypominające pendrive (np. Ledger, Trezor), które trzymają klucze offline. Haker nie może się do nich włamać przez internet.</span>
                              </div>
                          </li>
                          <li className="flex gap-4">
                              <div className="bg-white/10 p-2 rounded-lg h-fit"><FileText size={20}/></div>
                              <div>
                                  <strong className="block text-white">Seed Phrase (Fraza odzyskiwania)</strong>
                                  <span className="text-sm text-slate-400">To ciąg 12 lub 24 słów. TO JEST TWOJE HASŁO DO ŻYCIA. Zapisz na kartce, schowaj do sejfu. Nigdy nie wpisuj w komputerze, nie rób zdjęcia telefonem. Kto ma te słowa, ma Twoje pieniądze.</span>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>

          {/* PORADNIK INWESTORA - GDZIE KUPIĆ */}
          <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                  <ShoppingCart className="text-blue-600"/> Gdzie i jak kupić?
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">CEX</div>
                      <h4 className="font-bold text-slate-900 mb-2">Giełdy Centralne</h4>
                      <p className="text-xs text-slate-500 mb-4">Binance, Coinbase, Kraken, Zonda (PL)</p>
                      <ul className="text-sm text-slate-600 text-left space-y-2">
                          <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 mt-1"/> Łatwe wpłaty PLN/USD</li>
                          <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 mt-1"/> Obsługa klienta</li>
                          <li className="flex gap-2"><XCircle size={14} className="text-red-500 mt-1"/> Wymaga weryfikacji dowodem (KYC)</li>
                      </ul>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">DEX</div>
                      <h4 className="font-bold text-slate-900 mb-2">Giełdy Zdecentralizowane</h4>
                      <p className="text-xs text-slate-500 mb-4">Uniswap, PancakeSwap</p>
                      <ul className="text-sm text-slate-600 text-left space-y-2">
                          <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 mt-1"/> Anonimowość (brak KYC)</li>
                          <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 mt-1"/> Ogromny wybór tokenów</li>
                          <li className="flex gap-2"><XCircle size={14} className="text-red-500 mt-1"/> Trudniejsze w obsłudze, wysokie opłaty sieciowe (Gas)</li>
                      </ul>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">Bit</div>
                      <h4 className="font-bold text-slate-900 mb-2">Bitomaty</h4>
                      <p className="text-xs text-slate-500 mb-4">Fizyczne urządzenia w galeriach</p>
                      <ul className="text-sm text-slate-600 text-left space-y-2">
                          <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 mt-1"/> Gotówka, anonimowość (do limitu)</li>
                          <li className="flex gap-2"><XCircle size={14} className="text-red-500 mt-1"/> Bardzo wysokie prowizje (nawet 5-10%)</li>
                      </ul>
                  </div>
              </div>
          </div>

          {/* SŁOWNICZEK I CIEKAWOSTKI */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
              <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-8">Słowniczek Krypto-Slangu</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                          <div className="font-black text-yellow-400 mb-1">HODL</div>
                          <div className="text-xs text-indigo-100">Błąd w pisowni słowa "HOLD" z 2013 roku. Oznacza trzymanie krypto mimo spadków. "Hold On for Dear Life".</div>
                      </div>
                      <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                          <div className="font-black text-yellow-400 mb-1">FOMO</div>
                          <div className="text-xs text-indigo-100">"Fear Of Missing Out". Strach, że ominie nas zysk. Powód, przez który ludzie kupują na samej górce.</div>
                      </div>
                      <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                          <div className="font-black text-yellow-400 mb-1">FUD</div>
                          <div className="text-xs text-indigo-100">"Fear, Uncertainty, Doubt". Rozsiewanie negatywnych informacji, by zbić cenę.</div>
                      </div>
                      <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                          <div className="font-black text-yellow-400 mb-1">Halving</div>
                          <div className="text-xs text-indigo-100">Wydarzenie co 4 lata w sieci Bitcoin. Nagroda dla górników spada o połowę. Historycznie rozpoczyna hossę.</div>
                      </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-black/20 rounded-xl text-sm text-center border border-white/10">
                      <strong>Podatki w Polsce:</strong> Pamiętaj, że zysk z kryptowalut (zamiana na walutę FIAT, np. PLN) podlega opodatkowaniu 19% (Podatek Belki). Wymiana krypto-na-krypto jest neutralna podatkowo.
                  </div>
              </div>
          </div>

          {/* NAWIGACJA */}
          <div className="flex justify-center mt-12 gap-4">
               <button onClick={() => navigate('/')} className="px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-700 hover:bg-slate-200 transition-colors">
                  Wróć na stronę główną
               </button>
               <button onClick={() => navigate('/gielda')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                  Zobacz tradycyjną giełdę (Akcje)
               </button>
          </div>

      </div>
    </>
  );
}
const LeasingView = () => {
    const navigate = useNavigate();
  // --- ZMIENNE STANU ---
  const [netPrice, setNetPrice] = useState(100000);
  const [vatRate, setVatRate] = useState(23);
  const [initialPaymentPercent, setInitialPaymentPercent] = useState(10);
  const [durationMonths, setDurationMonths] = useState(36);
  const [redemptionPercent, setRedemptionPercent] = useState(1);
  const [interestRate, setInterestRate] = useState(7.5); // WIBOR + Marża
  const [insuranceYearly, setInsuranceYearly] = useState(3000); // OC/AC
  const [gapMonthly, setGapMonthly] = useState(50); // GAP

  // --- FUNKCJA NAWIGACJI (Wklej tutaj) ---
  const scrollToLeasing = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // --- OBLICZENIA ---
  const leasingCalc = useMemo(() => {
    const net = parseFloat(netPrice) || 0;
    const initialPaymentAmount = net * (initialPaymentPercent / 100);
    const redemptionAmount = net * (redemptionPercent / 100);
    const amountToFinance = net - initialPaymentAmount;
    
    // Uproszczony wzór na ratę leasingową (kapitał + odsetki)
    // PMT = P * r * (1+r)^n / ((1+r)^n - 1)
    // Uwaga: W prawdziwym leasingu dochodzi dyskonto wartości końcowej, tutaj stosujemy przybliżenie finansowe.
    // Bardziej precyzyjne dla leasingu: (Finansowane - (Wykup / (1+r)^n)) / ((1 - (1+r)^-n)/r)
    
    const r = (interestRate / 100) / 12; // miesięczne oprocentowanie
    const n = durationMonths;
    
    let monthlyInstallmentNet = 0;
    
    if (interestRate === 0) {
        monthlyInstallmentNet = (amountToFinance - redemptionAmount) / n;
    } else {
        const factor = (1 - Math.pow(1 + r, -n)) / r;
        monthlyInstallmentNet = (amountToFinance - (redemptionAmount / Math.pow(1 + r, n))) / factor;
    }

    // Dodanie kosztów dodatkowych do raty (GAP)
    const totalMonthlyNet = monthlyInstallmentNet + gapMonthly;

    // Podsumowania
    const totalCostNet = initialPaymentAmount + (totalMonthlyNet * n) + redemptionAmount;
    const totalCostGross = totalCostNet * (1 + vatRate / 100);
    const totalInterest = totalCostNet - net - (gapMonthly * n);
    const leasePercent = (totalCostNet / net) * 100;


    return {
        initialPaymentAmount,
        redemptionAmount,
        monthlyInstallmentNet,
        totalMonthlyNet,
        totalMonthlyGross: totalMonthlyNet * (1 + vatRate / 100),
        totalCostNet,
        totalCostGross,
        leasePercent: leasePercent.toFixed(2),
        totalInterest
    };
  }, [netPrice, vatRate, initialPaymentPercent, durationMonths, redemptionPercent, interestRate, gapMonthly]);

  // Komponent pomocniczy do definicji (Tooltip)
  const Definition = ({ title, text }) => (
      <div className="group relative inline-block ml-2 align-middle">
          <Info size={16} className="text-slate-400 cursor-help hover:text-orange-500 transition-colors"/>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed text-left">
              <strong>{title}:</strong> {text}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
          </div>
      </div>
  );

  return (
    <>
      <Helmet>
        <title>Kalkulator Leasingowy - Operacyjny i Finansowy | Finanse Proste</title>
        <script type="application/ld+json">
{`
  {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Kalkulator Leasingowy Samochodu",
    "description": "Oblicz ratę leasingu operacyjnego. Uwzględnij wykup, wpłatę własną, GAP i tarczę podatkową.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PLN"
    },
    "featureList": "Leasing operacyjny, finansowy, GAP, Limit 150 tys. zł"
  }
`}
</script>
        <meta name="description" content="Zaawansowany kalkulator leasingu samochodowego. Oblicz ratę, wykup i koszty całkowite. Dowiedz się co to jest tarcza podatkowa i GAP." />
     <link rel="canonical" href="https://www.finanse-proste.pl/leasing" />
      </Helmet>

      <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">

          {/* --- SPIS TREŚCI: WKLEJ TUTAJ --- */}
        <div className="mb-16 bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm flex flex-wrap justify-center gap-2 md:gap-4 text-left">
          <div className="w-full flex items-center justify-center gap-2 mb-2 text-slate-400">
            <ListTree size={16}/>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Nawigacja po kompendium</span>
          </div>
          
          <button
            onClick={() => scrollToLeasing('kalkulator-leasing-sekcja')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
          >
            <Calculator size={14}/> URUCHOM KALKULATOR
          </button>

          {[
            { title: "1. Tarcza i limity", icon: ShieldAlert, id: "sekcja-1-leasing" },
            { title: "2. Dylemat vat", icon: Receipt, id: "sekcja-2-leasing" },
            { title: "3. Ubezpieczenie gap", icon: Umbrella, id: "sekcja-3-leasing" },
            { title: "4. Wykup i 6 lat", icon: Calendar, id: "sekcja-4-leasing" },
            { title: "5. Leasing vs najem", icon: Repeat, id: "sekcja-5-leasing" },
            { title: "6. Maszyny i zwrotny", icon: Briefcase, id: "sekcja-6-leasing" },
            { title: "7. Definicje", icon: BookOpen, id: "sekcja-7-leasing" },
            { title: "8. Typy leasingu", icon: Shuffle, id: "sekcja-8-leasing" },
            { title: "9. Checklisty", icon: BadgeCheck, id: "sekcja-9-leasing" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => scrollToLeasing(item.id)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-all border border-transparent hover:border-slate-100"
            >
              <item.icon size={14} className="text-slate-400"/>
              {item.title}
            </button>
          ))}
        </div>


          <div id="kalkulator-leasing-sekcja" className="grid lg:grid-cols-12 gap-8 mb-16">
              {/* LEWA KOLUMNA - PARAMETRY */}
              <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                  
                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                          Wartość przedmiotu
                          <Definition title="Cena Netto" text="Cena pojazdu lub maszyny bez podatku VAT. To od tej kwoty naliczane są odsetki. Znajdziesz ją na ofercie od dealera."/>
                      </label>
                      <InputGroup value={netPrice} onChange={setNetPrice} suffix="PLN" step="1000" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                              Opłata Wstępna (%)
                              <Definition title="Czynsz Inicjalny" text="Wpłata własna (OW) lub czynsz inicjalny. Im wyższa wpłata, tym niższa rata i tańszy leasing. Minimum to zazwyczaj 0% lub 1%, maksimum 45%."/>
                          </label>
                          <input type="number" value={initialPaymentPercent} onChange={(e) => setInitialPaymentPercent(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold" />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                              Wykup (%)
                              <Definition title="Wartość Końcowa" text="Kwota, za którą kupujesz auto na własność po zakończeniu umowy. Wysoki wykup = niska rata miesięczna (ale duży wydatek na koniec)." />
                          </label>
                          <input type="number" value={redemptionPercent} onChange={(e) => setRedemptionPercent(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold" />
                      </div>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                          Okres Leasingu (msc)
                          <Definition title="Czas trwania" text="Liczba rat. Standardowo od 24 do 60 miesięcy (dla samochodów). Dla maszyn może być dłużej. Im dłuższy okres, tym wyższy koszt całkowity (więcej odsetek)." />
                      </label>
                      <div className="flex gap-2">
                          {[24, 36, 48, 60].map(m => (
                              <button key={m} onClick={() => setDurationMonths(m)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${durationMonths === m ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-slate-50 text-slate-500'}`}>{m}</button>
                          ))}
                      </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">Parametry finansowe <Definition title="WIBOR i Koszty" text="Zmienne wpływające na całkowity koszt leasingu."/></h4>
                      
                      <div className="space-y-4">
                          <div className="flex items-center justify-between">
                              <label className="text-sm text-slate-600">Oprocentowanie roczne (%)</label>
                              <div className="w-24">
                                  <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full text-right bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" step="0.1"/>
                              </div>
                          </div>
                          <p className="text-[10px] text-slate-400 text-right -mt-2">Suma: WIBOR (np. 5.8%) + Marża leasingodawcy (np. 2%)</p>

                          <div className="flex items-center justify-between">
                              <label className="text-sm text-slate-600">Ubezpieczenie GAP (miesięcznie)</label>
                              <div className="w-24">
                                  <input type="number" value={gapMonthly} onChange={(e) => setGapMonthly(Number(e.target.value))} className="w-full text-right bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold" step="10"/>
                              </div>
                          </div>
                          <p className="text-[10px] text-slate-400 text-right -mt-2">GAP chroni przed utratą wartości auta w razie kradzieży/szkody całkowitej.</p>
                      </div>
                  </div>

              </div>

              {/* PRAWA KOLUMNA - WYNIKI */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  {/* GŁÓWNA KARTA WYNIKU */}
                  <div className="bg-orange-500 text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl shadow-orange-200">
                      <div className="absolute top-0 right-0 p-8 opacity-10"><Car size={120}/></div>
                      <div className="relative z-10">
                          <div className="flex justify-between items-start mb-8">
                              <div>
                                  <div className="text-orange-100 font-bold uppercase tracking-wider text-xs mb-1">Miesięczna Rata Netto</div>
                                  <div className="text-5xl font-black">{formatMoney(leasingCalc.totalMonthlyNet)}</div>
                                  <div className="text-sm text-orange-100 mt-1">+ VAT = {formatMoney(leasingCalc.totalMonthlyGross)} brutto</div>
                              </div>
                              <div className="text-right">
                                  <div className="text-orange-100 font-bold uppercase tracking-wider text-xs mb-1">Koszt Całkowity</div>
                                  <div className="text-3xl font-bold">{leasingCalc.leasePercent}%</div>
                              </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                              <div>
                                  <div className="text-xs text-orange-200 mb-1">Wpłata ({initialPaymentPercent}%)</div>
                                  <div className="font-bold text-lg">{formatMoney(leasingCalc.initialPaymentAmount)}</div>
                              </div>
                              <div>
                                  <div className="text-xs text-orange-200 mb-1">Suma rat ({durationMonths})</div>
                                  <div className="font-bold text-lg">{formatMoney(leasingCalc.totalMonthlyNet * durationMonths)}</div>
                              </div>
                              <div>
                                  <div className="text-xs text-orange-200 mb-1">Wykup ({redemptionPercent}%)</div>
                                  <div className="font-bold text-lg">{formatMoney(leasingCalc.redemptionAmount)}</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* WYKRES KOSZTÓW */}
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex-grow">
                      <h4 className="font-bold text-slate-800 mb-6 text-center">Struktura Kosztów Leasingu (Netto)</h4>
                      <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart layout="vertical" data={[
                                  { name: 'Kapitał (Auto)', value: netPrice, fill: '#cbd5e1' },
                                  { name: 'Odsetki i Koszty', value: leasingCalc.totalInterest + (gapMonthly * durationMonths), fill: '#f97316' },
                              ]} margin={{top: 0, right: 30, left: 40, bottom: 0}} barSize={30}>
                                  <XAxis type="number" hide />
                                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fontWeight: 'bold'}} axisLine={false} tickLine={false}/>
                                  <RechartsTooltip cursor={{fill: 'transparent'}} formatter={(val) => [formatMoney(val), 'Kwota']}/>
                                  <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#64748b', fontSize: 12, formatter: (val) => formatMoney(val) }}/>
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                      <div className="mt-4 text-center text-sm text-slate-500">
                          Całkowita suma opłat (Netto): <strong>{formatMoney(leasingCalc.totalCostNet)}</strong>
                      </div>
                  </div>

              </div>
          </div>

{/* ==========================================================================
    KOMPENDIUM WIEDZY: LEASING JAKO STRATEGIA PODATKOWA
    ========================================================================== */}
<div id="baza-wiedzy-leasing" className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden mt-16 text-left">
    
    {/* Header Sekcji Edukacyjnej */}
    <div className="bg-slate-900 text-white p-12 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <GraduationCap size={16} className="text-yellow-400"/> Akademia finansów firmowych
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Leasing pod lupą.<br/>Twoja tarcza przed podatkami.
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed font-medium">
                Dla przedsiębiorcy <strong>kalkulator leasingowy 2026</strong> to nie tylko narzędzie do liczenia raty. To przede wszystkim system optymalizacji kosztów, który pozwala legalnie obniżyć podatek dochodowy i odliczyć VAT.
            </p>
        </div>
    </div>

    <div className="p-8 md:p-16 space-y-24">

        {/* SEKCJA 1: MECHANIZM TARCZY PODATKOWEJ I LIMITY */}
        <div>
            <div id="sekcja-1-leasing" className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">1</div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Gdzie jest zysk? Mechanizm tarczy i limity odliczeń</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-sm">
                        Największy błąd to patrzenie wyłącznie na <strong>koszt całkowity finansowania</strong> (np. 108%). Realny koszt leasingu jest znacznie niższy, ponieważ każda rata obniża Twój podatek. To zjawisko nazywamy <strong>tarczą podatkową</strong>. Jednak w 2026 roku tarcza ta ma swój "szklany sufit".
                    </p>
                    
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Ile realnie kosztuje rata 2000 zł netto?</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                                <span className="text-slate-500 italic">Podatek liniowy (19% PIT + 4.9% zdrowotna)</span>
                                <span className="font-bold text-green-600">~ 1 522 zł</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                                <span className="text-slate-500 italic">Skala podatkowa - II próg (32% PIT + 9% zdrowotna)</span>
                                <span className="font-bold text-green-600">~ 1 180 zł</span>
                            </div>
                            <div className="flex justify-between items-center text-sm pt-1">
                                <span className="text-slate-400 text-[10px] uppercase font-bold text-slate-400">Realna oszczędność</span>
                                <span className="font-black text-slate-900">od 24% do 41% kwoty raty</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* KLUCZOWY ELEMENT EKSPERCKI: LIMIT 150K */}
                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                        <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2 text-sm"><ShieldAlert size={18}/> Limit 150 000 zł w leasingu 2026</h4>
                        <p className="text-xs text-red-800 leading-relaxed">
                            To najważniejsza liczba dla kupujących auta premium. Jeśli samochód spalinowy kosztuje więcej niż 150 tys. zł (lub 225 tys. zł dla elektryków), raty netto odliczysz tylko proporcją. Przy aucie za 300 tys. zł, tylko połowa Twojej raty będzie <strong>kosztem uzyskania przychodu</strong>.
                        </p>
                    </div>
                    
                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm"><Receipt size={18}/> Ukryty koszt: VAT nieodliczony</h4>
                        <p className="text-xs text-blue-800 leading-relaxed">
                            Stosując <strong>odliczenie VAT od samochodu</strong> w wysokości 50%, pozostała połowa podatku VAT nie przepada! Powiększa ona wartość netto auta i również staje się kosztem, który obniża Twój podatek dochodowy PIT/CIT.
                        </p>
                    </div>
                </div>
            </div>

            {/* STRATEGIE PODATKOWE */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <h5 className="font-bold text-slate-900 text-xs uppercase mb-3 tracking-widest text-slate-900">Na ryczałcie</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                        Brak możliwości odliczania kosztów sprawia, że <strong>leasing operacyjny</strong> na ryczałcie służy głównie do odliczania 50% lub 100% VAT. Tarcza dochodowa tutaj nie istnieje.
                    </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <h5 className="font-bold text-slate-900 text-xs uppercase mb-3 tracking-widest text-slate-900">Grudniowy bonus</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                        Wysoka <strong>opłata wstępna</strong> (nawet 45%) pozwala jednorazowo obniżyć dochód pod koniec roku, co jest najskuteczniejszą metodą na uniknięcie wejścia w drugi próg podatkowy.
                    </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <h5 className="font-bold text-slate-900 text-xs uppercase mb-3 tracking-widest text-slate-900">Leasing czy kredyt?</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed text-slate-500">
                        W 2026 roku leasing wygrywa szybkością odliczeń. W kredycie amortyzacja auta trwa latami, w leasingu całą wartość (do limitu) odliczasz w czasie trwania umowy.
                    </p>
                </div>
            </div>
        </div>
        </div>
        
{/* SEKCJA 2: WIELKI DYLEMAT VAT – 50% CZY 100%? */}
        <div id="sekcja-2-leasing" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">2</div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Wielki dylemat: odliczenie vat 50% czy 100%?</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start text-left">
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-sm">
                        To najczęstsze pytanie przy uruchamianiu <strong>kalkulatora leasingowego 2026</strong>. Sposób, w jaki zadeklarujesz użytkowanie auta, determinuje nie tylko wysokość raty, ale też faktyczny koszt paliwa i serwisu.
                    </p>
                    
                    {/* PORÓWNANIE TRYBÓW - DOKŁADNE ODZWIERCIEDLENIE TWOJEGO STYLU */}
                    <div className="bg-slate-50 rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="grid grid-cols-2 text-center text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
                            <div className="py-3 bg-white text-slate-500 border-r border-slate-200">Użytkowanie mieszane</div>
                            <div className="py-3 bg-blue-50 text-blue-600">Wyłącznie firmowe</div>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-slate-200">
                            <div className="p-6 space-y-4">
                                <div className="text-center mb-2">
                                    <span className="text-3xl font-black text-slate-900">50%</span>
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase mt-1">Vat odliczony</span>
                                </div>
                                <ul className="text-[11px] text-slate-500 space-y-2 font-medium">
                                    <li className="flex gap-2"><CheckCircle size={12} className="text-green-500 shrink-0"/> Bez biurokracji</li>
                                    <li className="flex gap-2"><CheckCircle size={12} className="text-green-500 shrink-0"/> Cele prywatne OK</li>
                                    <li className="flex gap-2"><Info size={12} className="text-blue-400 shrink-0"/> Reszta vat w koszty pit</li>
                                </ul>
                            </div>
                            <div className="p-6 space-y-4 bg-blue-50/5">
                                <div className="text-center mb-2">
                                    <span className="text-3xl font-black text-blue-600">100%</span>
                                    <span className="block text-[10px] text-blue-400 font-bold uppercase mt-1">Vat odliczony</span>
                                </div>
                                <ul className="text-[11px] text-slate-600 space-y-2 font-medium">
                                    <li className="flex gap-2"><XCircle size={12} className="text-red-400 shrink-0"/> Kilometrówka</li>
                                    <li className="flex gap-2"><XCircle size={12} className="text-red-400 shrink-0"/> Zgłoszenie vat-26</li>
                                    <li className="flex gap-2"><AlertTriangle size={12} className="text-orange-500 shrink-0"/> Zakaz tras prywatnych</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm"><Navigation size={18} className="text-blue-500"/> Co to jest kilometrówka leasing 2026?</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Jeśli wybierzesz pełne <strong>odliczenie vat od samochodu</strong>, musisz prowadzić szczegółowy rejestr każdego przejazdu. Każdy wyjazd "po bułki" to ryzyko zakwestionowania kosztów przez urząd skarbowy. Eksperci zazwyczaj radzą: "wybierz 50% i miej święty spokój".
                        </p>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                        <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2 text-sm"><FileWarning size={18}/> Pułapka faktury vat-marża</h4>
                        <p className="text-xs text-amber-800 leading-relaxed">
                            Kupujesz auto używane? Jeśli otrzymasz fakturę vat-marża, Twój <strong>leasing operacyjny</strong> nie pozwoli Ci odliczyć vat-u od ceny auta. W takiej sytuacji warto przeanalizować <strong>leasing finansowy</strong>, aby nie płacić podatku od podatku.
                        </p>
                    </div>
                </div>
            </div>

            {/* PORADA EKSPERCKA - INTEGRALNA CZĘŚĆ KARTY */}
            <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-xl text-left">
                        <h5 className="text-xl font-bold mb-2 text-blue-400">Eksploatacja też podlega tym zasadom</h5>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Paliwo, opony czy serwis mechaniczny podlegają tej samej zasadzie co rata. Przy 50% vat na leasing, z faktury za paliwo również odliczysz tylko połowę podatku. Druga połowa brutto wejdzie jednak w koszty Twojej firmy (kup).
                        </p>
                    </div>
                    <div className="bg-white/10 p-5 rounded-3xl border border-white/10 text-center shrink-0">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1">Wiedza ekspercka</div>
                        <div className="text-xl font-black italic text-white">Status pro</div>
                    </div>
                </div>
                <History className="absolute -bottom-10 -left-10 text-white/5 w-48 h-48 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>
        </div>
{/* SEKCJA 3: UBEZPIECZENIE GAP I BEZPIECZEŃSTWO FINANSOWE */}
        <div id="sekcja-3-leasing" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">3</div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Ubezpieczenie gap: dlaczego zwykłe ac to za mało?</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start text-left">
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-sm">
                        Samochód traci na wartości najszybciej w pierwszych dwóch latach. Ekspert wie, że w przypadku szkody całkowitej lub kradzieży, ubezpieczyciel z polisy AC wypłaci tylko wartość rynkową z dnia zdarzenia. <strong>Ubezpieczenie gap czy warto</strong> dokupić? Bez niego możesz zostać z długiem wobec leasingodawcy, mimo braku auta.
                    </p>
                    
                    {/* SCENARIUSZ FINANSOWY - WIZUALIZACJA */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                        <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-6">Scenariusz: kradzież auta po 2 latach</h4>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                                <span className="text-slate-400">Wartość na fakturze (zakup)</span>
                                <span className="font-bold text-white">150 000 zł</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                                <span className="text-slate-400">Odszkodowanie z AC (wartość rynkowa)</span>
                                <span className="font-bold text-red-400">110 000 zł</span>
                            </div>
                            <div className="flex justify-between items-center text-sm pt-2 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                                <span className="text-orange-200 font-bold italic">Wypłata z GAP (Twoja ochrona)</span>
                                <span className="font-black text-orange-400">+ 40 000 zł</span>
                            </div>
                        </div>
                        <Umbrella className="absolute -bottom-10 -right-10 text-white/5 w-48 h-48 rotate-12" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm"><ShieldCheck size={18} className="text-orange-600"/> Rodzaje gap w leasingu 2026</h4>
                        <ul className="space-y-4">
                            <li className="text-xs text-slate-600">
                                <strong className="text-slate-900 block mb-1">GAP Fakturowy (najpopularniejszy):</strong>
                                Pokrywa różnicę między wypłatą z AC a ceną na fakturze zakupu. Gwarantuje, że odzyskasz 100% zainwestowanych środków.
                            </li>
                            <li className="text-xs text-slate-600">
                                <strong className="text-slate-900 block mb-1">GAP Finansowy:</strong>
                                Pokrywa jedynie różnicę między AC a pozostałą do spłaty kwotą leasingu. Chroni Cię przed długiem, ale nie ratuje Twojego wkładu własnego.
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm"><Info size={18}/> Wpływ na ratę miesięczną</h4>
                        <p className="text-xs text-blue-800 leading-relaxed">
                            Koszt ubezpieczenia GAP to zazwyczaj od 40 do 120 zł miesięcznie, zależnie od wartości auta. <strong>Kalkulator leasingowy 2026</strong> powinien zawsze uwzględniać ten koszt, ponieważ jest on w 100% kosztem uzyskania przychodu w Twojej firmie.
                        </p>
                    </div>
                </div>
            </div>

            {/* EKSPERCKA PORADA - PROPORCJA 150K */}
            <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-200 group">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl text-left">
                        <h5 className="text-lg font-bold mb-2 flex items-center gap-2 text-slate-900">
                            <AlertCircle size={20} className="text-red-500"/> Limit 150 tys. a ubezpieczenie
                        </h5>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Pamiętaj o ważnym detalu: limit <strong>150 tys. w leasingu 2026</strong> dotyczy nie tylko rat, ale również ubezpieczenia AC i GAP. Jeśli auto kosztuje 300 tys. zł, składkę ubezpieczeniową (część AC) zaliczysz w koszty tylko w 50%. Wyjątkiem są odsetki i GAP finansowy, które rozlicza się inaczej.
                        </p>
                    </div>
                    <div className="flex shrink-0 gap-3">
                        <span className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Procedura uproszczona</span>
                        <span className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black text-orange-600 uppercase tracking-widest">Bezpieczeństwo</span>
                    </div>
                </div>
            </div>
        </div>
        {/* SEKCJA 4: STRATEGIE WYKUPU I ZASADA 6 LAT */}
        <div id="sekcja-4-leasing" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">4</div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Wykup przedmiotu: strategie i pułapki po zmianach przepisów</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-sm">
                        Kiedy Twój <strong>kalkulator leasingowy 2026</strong> pyta o wartość końcową, musisz podjąć decyzję: niski wykup (1%) czy wysoki (np. 40%)? Wybór ten zależy od tego, czy planujesz użytkować auto przez dekadę, czy wymienić je na nowe zaraz po zakończeniu kontraktu.
                    </p>
                    
                    {/* PORÓWNANIE STRATEGII WYKUPU */}
                    <div className="space-y-4">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-3 text-slate-900 font-bold text-sm">
                                <ArrowDownCircle className="text-green-600" size={18}/> Wykup 1 procent (Niski)
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Generuje najwyższą ratę miesięczną, ale najniższy koszt całkowity leasingu. Jest to idealna opcja, jeśli Twoim celem jest <strong>wykup prywatny z leasingu po 6 latach</strong>, aby uniknąć podatku dochodowego przy odsprzedaży.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-3 text-slate-900 font-bold text-sm">
                                <ArrowUpCircle className="text-blue-600" size={18}/> Wykup wysoki (Balonowy)
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Pozwala na drastyczne obniżenie raty miesięcznej, co poprawia bieżącą płynność firmy. Na koniec umowy nie musisz go spłacać z własnej kieszeni – możesz oddać auto do dealera lub sfinansować <strong>wykup 15 procent</strong> lub więcej kolejnym leasingiem.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* KARTA: ZASADA 6 LAT */}
                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                        <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-sm"><Calendar size={18}/> Pułapka sprzedaży przed upływem 6 lat</h4>
                        <p className="text-xs text-red-800 leading-relaxed">
                            Po zmianach w Polskim Ładzie, wykupienie auta do majątku prywatnego nie pozwala już na jego szybką sprzedaż bez podatku. Jeśli sprzedasz auto przed upływem <strong>6 lat od wykupu</strong>, będziesz musiał zapłacić podatek dochodowy (PIT) oraz składkę zdrowotną, traktując to jako przychód z działalności.
                        </p>
                    </div>

                    {/* KARTA: CESJA LEASINGU */}
                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm"><Repeat size={18}/> Gdy chcesz skończyć wcześniej: cesja</h4>
                        <p className="text-xs text-blue-800 leading-relaxed">
                            Potrzebujesz wyjść z umowy przed terminem? Najbardziej opłacalna jest <strong>cesja leasingu</strong>. Znajdujesz innego przedsiębiorcę, który przejmuje Twoje raty, a Ty możesz odzyskać część wpłaconego kapitału w formie tzw. odstępnego. To znacznie tańsze niż wcześniejsze zerwanie umowy.
                        </p>
                    </div>
                </div>
            </div>

            {/* PODSUMOWANIE MODUŁU */}
            <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                    <h5 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <BadgeCheck size={20} className="text-green-400"/> Złota zasada zakończenia umowy
                    </h5>
                    <p className="text-sm text-slate-400 leading-relaxed italic">
                        Jeśli Twoje auto po zakończeniu leasingu ma dużą wartość rynkową, a Ty nie chcesz czekać 6 lat ze sprzedażą, rozważ wprowadzenie go do środków trwałych firmy i amortyzację "na nowo" lub odliczenie straty przy sprzedaży.
                    </p>
                </div>
                <div className="shrink-0 relative z-10">
                     <button onClick={() => navigate('/b2b')} className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all shadow-lg">Oblicz wpływ na PIT</button>
                </div>
                <Key className="absolute -bottom-10 -right-10 text-white/5 w-48 h-48 -rotate-12" />
            </div>
        </div>
{/* SEKCJA 5: LEASING VS NAJEM DŁUGOTERMINOWY */}
        <div id="sekcja-5-leasing" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">5</div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Leasing czy najem długoterminowy? Pojedynek strategii</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-sm">
                        W 2026 roku coraz więcej firm rezygnuje z posiadania pojazdu. <strong>Najem długoterminowy czy leasing kalkulator</strong> – co wybrać? W leasingu spłacasz całą wartość auta, by stać się jego właścicielem. W najmie spłacasz jedynie prognozowaną utratę wartości, oddając auto po 3-4 latach do dealera.
                    </p>
                    
                    {/* PORÓWNANIE GRAFICZNE */}
                    <div className="bg-slate-50 rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="grid grid-cols-2 divide-x divide-slate-200">
                            <div className="p-6">
                                <div className="text-blue-600 font-black text-xs uppercase mb-3 flex items-center gap-2">
                                    <Scale size={14}/> Leasing operacyjny
                                </div>
                                <ul className="text-[11px] text-slate-500 space-y-3 font-medium">
                                    <li className="flex gap-2"><CheckCircle size={12} className="text-green-500 shrink-0"/> Cel: własność auta</li>
                                    <li className="flex gap-2"><CheckCircle size={12} className="text-green-500 shrink-0"/> Wysoka rata (spłacasz kapitał)</li>
                                    <li className="flex gap-2"><CheckCircle size={12} className="text-green-500 shrink-0"/> Serwis i opony po Twojej stronie</li>
                                    <li className="flex gap-2"><Info size={12} className="text-blue-400 shrink-0"/> Niski wykup (np. 1%)</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-blue-50/10">
                                <div className="text-indigo-600 font-black text-xs uppercase mb-3 flex items-center gap-2">
                                    <TrendingUp size={14}/> Najem (Wynajem)
                                </div>
                                <ul className="text-[11px] text-slate-600 space-y-3 font-medium">
                                    <li className="flex gap-2"><CheckCircle size={12} className="text-green-500 shrink-0"/> Cel: użytkowanie i wygoda</li>
                                    <li className="flex gap-2"><CheckCircle size={12} className="text-green-500 shrink-0"/> Niska rata (spłacasz utratę wartości)</li>
                                    <li className="flex gap-2"><CheckCircle size={12} className="text-green-500 shrink-0"/> Pełny serwis i opony w racie</li>
                                    <li className="flex gap-2"><AlertTriangle size={12} className="text-orange-500 shrink-0"/> Bardzo wysoki wykup</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm"><Briefcase size={18} className="text-slate-600"/> Całkowity koszt użytkowania (tco)</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Ekspert nie patrzy tylko na ratę. Najem często wydaje się droższy w skali całego kontraktu, ale uwzględnia <strong>ubezpieczenie ac w ratach leasingu</strong>, koszty przeglądów i opon. To idealne rozwiązanie dla firm, które chcą mieć "święty spokój" i stały koszt miesięczny bez niespodzianek w serwisie.
                        </p>
                    </div>

                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 text-left">
                        <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2 text-sm"><Car size={18} className="text-indigo-600"/> Limit przebiegu w najmie</h4>
                        <p className="text-xs text-indigo-800 leading-relaxed">
                            Uwaga: W przeciwieństwie do standardowego leasingu, najem zawsze narzuca <strong>limit kilometrów</strong> (np. 20 000 km rocznie). Przekroczenie go wiąże się z dopłatą za każdy kilometr przy zwrocie auta. Jeśli jeździsz bardzo dużo, leasing operacyjny będzie bezpieczniejszy finansowo.
                        </p>
                    </div>
                </div>
            </div>

            {/* PODSUMOWANIE DLA EKSPERTA */}
            <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="bg-white p-4 rounded-2xl shadow-sm shrink-0">
                        <Calculator size={32} className="text-blue-600"/>
                    </div>
                    <div className="text-left">
                        <h5 className="text-lg font-bold mb-1 text-slate-900">Werdykt: co się bardziej opłaca?</h5>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Leasing wybierz, gdy chcesz auto <strong>wykupić i użytkować przez min. 5-6 lat</strong>. Najem wybierz, gdy chcesz wymieniać auto co 2-3 lata, nie masz czasu na serwisy i potrzebujesz niskiej raty, aby zachować <strong>zdolność kredytową</strong> na inne cele. Obie formy podlegają limitowi 150 tys. zł kosztów uzyskania przychodu.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* SEKCJA 6: LEASING MASZYN I URZĄDZEŃ – INWESTYCJE W ROZWÓJ */}
        <div id="sekcja-6-leasing" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">6</div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight text-slate-900">Leasing maszyn i urządzeń: serce Twojego biznesu</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-sm">
                        Choć <strong>kalkulator leasingowy 2026</strong> kojarzy się głównie z autami, to leasing maszyn jest często bardziej opłacalny. Dlaczego? Bo w przypadku maszyn produkcyjnych czy medycznych nie obowiązuje <strong>limit 150 tys. w leasingu 2026</strong>. Możesz wziąć w leasing linię produkcyjną za milion złotych i każda złotówka z raty netto będzie Twoim kosztem uzyskania przychodu.
                    </p>
                    
                    {/* SPECYFIKA BRANŻOWA */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-teal-200 transition-all">
                            <div className="text-teal-600 mb-3"><LayoutGrid size={24}/></div>
                            <h4 className="font-bold text-slate-900 text-xs uppercase mb-2">Maszyny ciężkie</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">
                                <strong>Leasing maszyny stolarskiej</strong> czy maszyn CNC pozwala na szybką modernizację parku maszynowego bez zamrażania kapitału.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                            <div className="text-blue-600 mb-3"><Activity size={24}/></div>
                            <h4 className="font-bold text-slate-900 text-xs uppercase mb-2">Sprzęt medyczny</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">
                                <strong>Leasing maszyny medycznej</strong> (np. USG) często realizowany jest jako leasing finansowy ze względu na niską stawkę VAT (8%) na sprzęt medyczny.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* KARTA: LEASING ZWROTNY */}
                    <div className="p-6 bg-teal-50 rounded-3xl border border-teal-100 text-left">
                        <h4 className="font-bold text-teal-900 mb-3 flex items-center gap-2 text-sm"><Repeat size={18}/> Leasing zwrotny: ratunek dla płynności</h4>
                        <p className="text-xs text-teal-800 leading-relaxed">
                            Masz maszynę kupioną za gotówkę, ale potrzebujesz nagle pieniędzy na towar? <strong>Leasing zwrotny nieruchomości i aut</strong> (lub maszyn) pozwala sprzedać przedmiot firmie leasingowej i od razu wziąć go w leasing. Ty dostajesz gotówkę na konto, dalej używasz przedmiotu, a raty wrzucasz w koszty.
                        </p>
                    </div>

                    {/* KARTA: SPECYFIKA PODATKOWA MASZYN */}
                    <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 text-left relative overflow-hidden">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-sm"><FileText size={18} className="text-teal-400"/> Stawki amortyzacji</h4>
                        <p className="text-xs text-slate-400 leading-relaxed relative z-10">
                            Maszyny mają różne stawki amortyzacji (np. 14% lub 20%). W <strong>leasingu operacyjnym</strong> okres trwania umowy musi wynosić min. 40% czasu amortyzacji. Dlatego leasing maszyny może trwać nawet 7-8 lat, co pozwala na bardzo niską ratę miesięczną.
                        </p>
                        <TrendingUp className="absolute -bottom-6 -right-6 text-white/5 w-24 h-24" />
                    </div>
                </div>
            </div>

            {/* FINALNE PODSUMOWANIE KOMPENDIUM */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-left max-w-2xl">
                    <h5 className="font-bold text-slate-900 mb-1">Świadomy wybór to większy zysk</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Niezależnie czy wybierasz leasing auta, czy maszyny produkcyjnej, zawsze analizuj <strong>RRSO leasingu jak sprawdzić</strong> faktyczny koszt finansowania. Leasing to najelastyczniejsza forma wspierania biznesu w 2026 roku, o ile pamiętasz o limitach, VAT i odpowiednim GAP-ie.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/b2b')} 
  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
>
  <Calculator size={14}/> Policz oszczędności B2B
</button>
                </div>
            </div>
        </div>

        {/* SEKCJA 7: DEFINICJA I HISTORIA */}
        <div id="sekcja-7-leasing" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">7</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Czym jest leasing w świetle prawa?</h3>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                            Leasing to specyficzna forma finansowania, będąca hybrydą kredytu i dzierżawy. W świetle prawa, właścicielem przedmiotu (samochodu, maszyny) przez cały okres trwania umowy jest <strong>finansujący (leasingodawca)</strong>. Ty, jako <strong>korzystający (leasingobiorca)</strong>, płacisz miesięczne raty za prawo do użytkowania tego przedmiotu.
                        </p>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Dopiero po opłaceniu ostatniej raty i tzw. <strong>wykupu</strong>, prawo własności przechodzi na Ciebie. To kluczowa różnica względem kredytu, gdzie od razu jesteś właścicielem pojazdu zapisanym w dowodzie rejestracyjnym.
                        </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm"><Globe size={18} className="text-slate-400"/> Krótka historia finansowania</h4>
                        <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                            Korzenie leasingu sięgają starożytności – już w 2000 r. p.n.e. w Sumerze kapłani leasingowali ziemię rolnikom. Współczesny leasing narodził się w USA w latach 50. XX wieku.
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Do Polski trafił po 1989 roku, stając się kołem zamachowym dla firm, które nie miały gotówki na zakup drogich maszyn i samochodów.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* SEKCJA 8: PORÓWNANIE FORM (TABELA) */}
        <div id="sekcja-8-leasing" className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-sm border border-white/20">8</div>
                <h3 className="text-2xl font-bold">Leasing operacyjny vs finansowy</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-700 font-black tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Cecha</th>
                            <th className="px-6 py-4 text-orange-400">Leasing operacyjny (popularny)</th>
                            <th className="px-6 py-4 text-blue-400">Leasing finansowy</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                        <tr>
                            <td className="px-6 py-4 font-bold text-slate-300">Własność</td>
                            <td className="px-6 py-4">Pojazd jest majątkiem leasingodawcy.</td>
                            <td className="px-6 py-4">Pojazd jest majątkiem Twoim (wpisujesz do ewidencji).</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-bold text-slate-300">Amortyzacja</td>
                            <td className="px-6 py-4">Odpisuje firma leasingowa.</td>
                            <td className="px-6 py-4">Odpisujesz Ty (leasingobiorca).</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-bold text-slate-300">Koszt pit/cit</td>
                            <td className="px-6 py-4 text-orange-200">Cała rata netto (kapitał + odsetki).</td>
                            <td className="px-6 py-4">Tylko odsetki + amortyzacja.</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-bold text-slate-300">Płatność vat</td>
                            <td className="px-6 py-4">Doliczany do każdej raty (stopniowo).</td>
                            <td className="px-6 py-4 text-red-400">Płatny z góry od całej wartości przedmiotu!</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {/* SEKCJA 9: CHECKLISTA PRZEDSIĘBIORCY */}
        <div id="sekcja-9-leasing" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">9</div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Checklista: zanim podpiszesz umowę</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-300 transition-colors">
                    <div className="w-10 h-10 bg-white text-orange-600 rounded-lg flex items-center justify-center mb-4 shadow-sm"><FileSignature size={20}/></div>
                    <h4 className="font-bold text-slate-900 mb-2 text-sm">Zweryfikuj ofertę</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                        Sprawdź nie tylko ratę, ale i koszty dodatkowe: opłatę za rejestrację, koszt ubezpieczenia u innego ubezpieczyciela oraz <strong>rrso leasingu jak sprawdzić</strong> faktyczny koszt długu.
                    </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-300 transition-colors">
                    <div className="w-10 h-10 bg-white text-orange-600 rounded-lg flex items-center justify-center mb-4 shadow-sm"><ShieldCheck size={20}/></div>
                    <h4 className="font-bold text-slate-900 mb-2 text-sm">Wybierz mądrze gap</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                        Dla aut premium <strong>ubezpieczenie gap czy warto</strong> to pytanie retoryczne. Wybierz wariant fakturowy (RTI), aby w razie kradzieży otrzymać zwrot do pełnej kwoty z faktury.
                    </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-300 transition-colors">
                    <div className="w-10 h-10 bg-white text-orange-600 rounded-lg flex items-center justify-center mb-4 shadow-sm"><Repeat size={20}/></div>
                    <h4 className="font-bold text-slate-900 mb-2 text-sm">Zasada 150 tys.</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                        Pamiętaj, że <strong>limit 150 tys. w leasingu 2026</strong> dotyczy proporcji odliczeń. Jeśli Twoje wymarzone auto kosztuje 300 tys., połowa Twoich rat nie będzie obniżać podatku dochodowego.
                    </p>
                </div>
            </div>
        </div>


    </div>
</div>


    </>
  );
};
