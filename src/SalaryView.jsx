import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import {
  Wallet, Building2, User, Landmark, AlertTriangle, PieChart, CheckCircle, PiggyBank,
  Briefcase, FileText, TrendingUp, ShieldCheck, GraduationCap, Table2, ArrowRight, XCircle,
  Info, PenTool, Users, Scale, Clock, Zap, Activity, Heart, Sun, Wifi, AlertCircle,
  ListTree, Calculator 
} from 'lucide-react';

const MONTHS = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];

const formatMoney = (val) =>
new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

// --- KOMPONENTY UI ---
const InputGroup = ({ label, value, onChange, suffix }) => (
<div id="kalkulator-sekcja" className="flex flex-col gap-2">
<label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
<div className="relative">
<input
type="number"
value={value}
onChange={(e) => onChange(Number(e.target.value))}
className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-2xl font-bold rounded-xl p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
/>
<span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{suffix}</span>
</div>
</div>
);

const CheckboxGroup = ({ label, checked, onChange, icon: Icon, description, children }) => (
<div
className={`
flex flex-col gap-2 p-4 rounded-xl border transition-all cursor-pointer select-none
${checked ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:border-slate-200'}
`}
onClick={(e) => {
if(e.target.type !== 'range') onChange(!checked);
}}
>
<div className="flex items-start gap-4">
<div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checked ? 'bg-green-600 border-green-600' : 'border-slate-300 bg-white'}`}>
{checked && <CheckCircle size={14} className="text-white" />}
</div>
<div className="flex-1">
<div className="flex items-center gap-2 mb-1">
{Icon && <Icon size={18} className={checked ? 'text-green-600' : 'text-slate-400'} />}
<span className={`font-semibold text-sm ${checked ? 'text-green-900' : 'text-slate-700'}`}>{label}</span>
</div>
{description && <p className="text-xs text-slate-500 leading-relaxed">{description}</p>}
</div>
</div>
{checked && children && (
<div className="pl-12 pt-2 animate-in fade-in slide-in-from-top-1 cursor-default">
{children}
</div>
)}
</div>
);

// --- LOGIKA OBLICZEŃ ---
const calcSalaryMonth = (amount, type, params) => {
let netto = 0, tax = 0, zus = 0, ppk = 0;
if (type === 'uz') {
if (params.under26 && params.student) {
netto = amount;
} else {
const zusSocial = amount * 0.1126;
const baseHealth = amount - zusSocial;
const zusHealth = baseHealth * 0.09;
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
let cTax = taxBase * 0.12;
if (params.under26) cTax = 0;
tax = Math.max(0, cTax);
netto = amount - tax;
}
return { netto, tax, zus, ppk };
};

const calcSalaryYearly = (brutto, type, params) => {
const amount = parseFloat(brutto) || 0;
const THRESHOLD_TAX = 120000;
const LIMIT_ZUS_30 = 282600;
const KUP_STANDARD = 250;
const KUP_ELEVATED = 300;
const TAX_FREE_REDUCTION = 300;

let accumulatedTaxBase = 0;
let accumulatedRetirementBase = 0;
const yearlyBreakdown = [];

for (let i = 0; i < 12; i++) {
let currentBrutto = amount;
let zusSocial = 0, zusHealth = 0, tax = 0, ppk = 0;
const isZusCapped = accumulatedRetirementBase >= LIMIT_ZUS_30;
let zusRate = 0.1371;
let inSecondThreshold = false;
if (type === 'uop') {
let baseForZus = currentBrutto;
if (isZusCapped) {
zusRate = 0.0245;
} else if (accumulatedRetirementBase + currentBrutto > LIMIT_ZUS_30) {
const overLimit = (accumulatedRetirementBase + currentBrutto) - LIMIT_ZUS_30;
const underLimit = currentBrutto - overLimit;
zusSocial = (underLimit * 0.1371) + (overLimit * 0.0245);
baseForZus = 0;
}
if (baseForZus > 0) zusSocial = baseForZus * zusRate;
accumulatedRetirementBase += currentBrutto;

const baseForHealth = currentBrutto - zusSocial;
zusHealth = baseForHealth * 0.09;

const kup = params.workWhereLive ? KUP_STANDARD : KUP_ELEVATED;
const taxBase = Math.max(0, currentBrutto - zusSocial - kup);
let calculatedTax = 0;

if (accumulatedTaxBase > THRESHOLD_TAX) {
calculatedTax = taxBase * 0.32;
inSecondThreshold = true;
} else if (accumulatedTaxBase + taxBase > THRESHOLD_TAX) {
const inFirstBracket = THRESHOLD_TAX - accumulatedTaxBase;
const inSecondBracket = taxBase - inFirstBracket;
calculatedTax = (inFirstBracket * 0.12) + (inSecondBracket * 0.32);
inSecondThreshold = true;
} else {
calculatedTax = taxBase * 0.12;
inSecondThreshold = false;
}
if (accumulatedTaxBase < THRESHOLD_TAX) calculatedTax -= TAX_FREE_REDUCTION;
if (params.under26 && accumulatedTaxBase < 85528) calculatedTax = 0;
tax = Math.max(0, Math.round(calculatedTax));
accumulatedTaxBase += taxBase;

if (params.ppk) {
ppk = currentBrutto * (params.ppkRate / 100);
const ppkEmployer = currentBrutto * 0.015;
tax += (ppkEmployer * 0.12);
}

const netto = currentBrutto - zusSocial - zusHealth - tax - ppk;
yearlyBreakdown.push({
month: MONTHS[i], netto, gross: currentBrutto, tax, zus: zusSocial + zusHealth, ppk,
inSecondThreshold: inSecondThreshold
});

} else {
const singleMonth = calcSalaryMonth(amount, type, params);
yearlyBreakdown.push({ month: MONTHS[i], ...singleMonth, inSecondThreshold: false });
}
}
return yearlyBreakdown;
};

// --- GŁÓWNY KOMPONENT ---
export const SalaryView = () => {
const navigate = useNavigate();
const [salaryBrutto, setSalaryBrutto] = useState(8000);
const [contractType, setContractType] = useState('uop');
const [salaryParams, setSalaryParams] = useState({
under26: false,
ppk: true,
ppkRate: 2.0,
workWhereLive: true,
student: false
});

const salaryYearlyData = useMemo(() => calcSalaryYearly(salaryBrutto, contractType, salaryParams), [salaryBrutto, contractType, salaryParams]);
const currentMonth = salaryYearlyData[0];
const employerCost = salaryBrutto * 1.2048;

const comparison = useMemo(() => {
const uop = calcSalaryMonth(salaryBrutto, 'uop', salaryParams).netto;
const uz = calcSalaryMonth(salaryBrutto, 'uz', salaryParams).netto;
const uod = calcSalaryMonth(salaryBrutto, 'uod', salaryParams).netto;
return { uop: currentMonth.netto, uz, uod };
}, [salaryBrutto, salaryParams, currentMonth]);

const yearlyTotal = salaryYearlyData.reduce((acc, curr) => ({
gross: acc.gross + curr.gross,
netto: acc.netto + curr.netto,
tax: acc.tax + curr.tax,
zus: acc.zus + curr.zus,
ppk: acc.ppk + curr.ppk
}), { gross: 0, netto: 0, tax: 0, zus: 0, ppk: 0 });

return (
<>
<Helmet>
<title>Kalkulator Wynagrodzeń 2026 - Brutto na Netto | Finanse Proste</title>
<meta name="description" content="Kompleksowa analiza wynagrodzenia. Sprawdź II próg podatkowy, porównaj umowę o pracę, zlecenie i dzieło. Dowiedz się, co wpływa na Twoją pensję netto." />
<link rel="canonical" href="https://www.finanse-proste.pl/wynagrodzenia" />
{/* UKRYTE SEO: SCHEMA MARKUP */}
<script type="application/ld+json">
{`
{
"@context": "https://schema.org",
"@type": "SoftwareApplication",
"name": "Kalkulator Wynagrodzeń 2026",
"applicationCategory": "FinanceApplication",
"operatingSystem": "Web",
"offers": {
"@type": "Offer",
"price": "0",
"priceCurrency": "PLN"
},
"description": "Oblicz pensję netto, ZUS i podatki dla umowy o pracę, zlecenia i o dzieło. Symulacja roczna z uwzględnieniem II progu podatkowego."
}
`}
</script>
</Helmet>

<div className="animate-in slide-in-from-right duration-500 max-w-7xl mx-auto pb-16">
{/* HERO */}
{/* --- DYNAMICZNY SPIS TREŚCI --- */}
        <div className="mb-16 bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm flex flex-wrap justify-center gap-2 md:gap-4">
          <div className="w-full flex items-center justify-center gap-2 mb-2 text-slate-400">
            <ListTree size={16}/>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Nawigacja po kompendium</span>
          </div>
          
          {/* WYRÓŻNIONY KALKULATOR - PRIORYTET */}
          <button
            onClick={() => document.getElementById('kalkulator-sekcja')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-100"
          >
            <Calculator size={14}/>
            URUCHOM KALKULATOR
          </button>

          {[
            { title: "1. Anatomia płacy", icon: ShieldCheck, id: "sekcja-1" },
            { title: "2. Podatki i PIT-2", icon: TrendingUp, id: "sekcja-2" },
            { title: "3. Umowy i ulgi", icon: Briefcase, id: "sekcja-3" },
            { title: "4. Premie i L4", icon: Zap, id: "sekcja-4" },
            { title: "5. Ulgi roczne", icon: Heart, id: "sekcja-5" },
            { title: "6. Fakty i mity", icon: AlertCircle, id: "sekcja-6" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-green-600 transition-all border border-transparent hover:border-slate-100"
            >
              <item.icon size={14} className="text-slate-400"/>
              {item.title}
            </button>
          ))}
        </div>
<div className="text-center mb-16 mt-8">
<div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-green-200 shadow-sm">
<Wallet size={14}/> Analiza Płacowa 2026
</div>
{/* H1 - KLUCZOWE DLA SEO */}
<h1 className="text-4xl md:text-6xl font-black mb-6 text-slate-900">
Kalkulator <span className="text-green-600">wynagrodzeń</span>
</h1>
<p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
Zarabiasz brutto, wydajesz netto. Sprawdź pełną symulację roczną, zobacz kiedy wpadniesz w II próg podatkowy i porównaj opłacalność różnych form zatrudnienia.
</p>
</div>

<div className="grid xl:grid-cols-12 gap-8 mb-16">


{/* LEWA KOLUMNA - INPUTY */}
<div className="xl:col-span-4 space-y-6">
<div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm sticky top-24">
<div className="grid grid-cols-3 gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
<button onClick={() => setContractType('uop')} className={`py-3 text-xs font-bold rounded-lg transition-all ${contractType === 'uop' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Umowa o Pracę</button>
<button onClick={() => setContractType('uz')} className={`py-3 text-xs font-bold rounded-lg transition-all ${contractType === 'uz' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Zlecenie</button>
<button onClick={() => setContractType('uod')} className={`py-3 text-xs font-bold rounded-lg transition-all ${contractType === 'uod' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Dzieło</button>
</div>

<div className="space-y-6">
<InputGroup label="Wynagrodzenie brutto" value={salaryBrutto} onChange={setSalaryBrutto} suffix="PLN" />
<div className="space-y-3">
<label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ustawienia</label>
{contractType === 'uop' && (
<>
<CheckboxGroup label="Praca w miejscu zamieszkania" description="Koszt uzyskania przychodu: 250 zł" checked={salaryParams.workWhereLive} onChange={(v) => setSalaryParams({...salaryParams, workWhereLive: v})} icon={Building2} />
<CheckboxGroup label="PPK (Pracownicze Plany Kapitałowe)" description="Oszczędzanie z pracodawcą" checked={salaryParams.ppk} onChange={(v) => setSalaryParams({...salaryParams, ppk: v})} icon={PiggyBank}>
<div className="space-y-2 pt-2 border-t border-green-100 mt-2">
<div className="flex justify-between text-xs font-bold text-slate-500"><span>Twoja wpłata: {salaryParams.ppkRate}%</span></div>
<input type="range" min="0.5" max="4.0" step="0.5" value={salaryParams.ppkRate} onChange={(e) => setSalaryParams({...salaryParams, ppkRate: parseFloat(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
</div>
</CheckboxGroup>
</>
)}
<CheckboxGroup label="Ulga dla młodych (< 26 lat)" description="PIT 0% do 85 528 zł" checked={salaryParams.under26} onChange={(v) => setSalaryParams({...salaryParams, under26: v})} icon={User} />
{contractType === 'uz' && salaryParams.under26 && (
<CheckboxGroup label="Status studenta" description="Brutto = Netto (Brak ZUS i PIT)" checked={salaryParams.student} onChange={(v) => setSalaryParams({...salaryParams, student: v})} icon={Landmark} />
)}
</div>
</div>
</div>
</div>

{/* PRAWA KOLUMNA - WYNIKI I TABELA */}
<div className="xl:col-span-8 space-y-8">
{/* GŁÓWNA KARTA WYNIKU */}
<div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
<div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
<div>
<div className="text-xs font-bold text-slate-400 uppercase mb-2">Twoja pensja netto (styczeń)</div>
<div className="text-6xl font-black text-slate-900 tracking-tight">{formatMoney(currentMonth.netto)}</div>
<div className="text-sm font-medium text-slate-500 mt-2 bg-slate-100 px-3 py-1 rounded-lg inline-block">
~{((currentMonth.netto / salaryBrutto)*100).toFixed(1)}% kwoty brutto trafia do Ciebie
</div>
</div>
<div className="text-left md:text-right space-y-1">
<div className="text-xs font-bold text-slate-400 uppercase">Całkowity koszt pracodawcy</div>
<div className="text-xl font-bold text-slate-600">{contractType === 'uop' ? formatMoney(employerCost) : 'Zależne od umowy'}</div>
<div className="text-xs text-slate-400">Tyle łącznie wydaje firma na Twoje miejsce pracy</div>
</div>
</div>

{/* PASEK ROZKŁADU */}
<div className="mb-10">
<div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
<div style={{width: `${(currentMonth.netto / salaryBrutto) * 100}%`}} className="bg-green-500"></div>
<div style={{width: `${(currentMonth.zus / salaryBrutto) * 100}%`}} className="bg-blue-500"></div>
<div style={{width: `${(currentMonth.tax / salaryBrutto) * 100}%`}} className="bg-orange-400"></div>
{currentMonth.ppk > 0 && <div style={{width: `${(currentMonth.ppk / salaryBrutto) * 100}%`}} className="bg-purple-500"></div>}
</div>
<div className="flex flex-wrap gap-6 mt-4 text-sm font-medium text-slate-600">
<div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Netto: {formatMoney(currentMonth.netto)}</div>
<div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> ZUS: {formatMoney(currentMonth.zus)}</div>
<div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-400 rounded-full"></div> PIT: {formatMoney(currentMonth.tax)}</div>
</div>
</div>

{/* PORÓWNANIE (MINI KAFELKI) */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-100">
<div className={`p-4 rounded-2xl border ${contractType === 'uop' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}>
<div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Umowa o pracę</div>
<div className="font-bold text-slate-900">{formatMoney(comparison.uop)}</div>
</div>
<div className={`p-4 rounded-2xl border ${contractType === 'uz' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}>
<div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Umowa zlecenie</div>
<div className="font-bold text-slate-900">{formatMoney(comparison.uz)}</div>
</div>
<div className={`p-4 rounded-2xl border ${contractType === 'uod' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}>
<div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Umowa o dzieło</div>
<div className="font-bold text-slate-900">{formatMoney(comparison.uod)}</div>
</div>
<div className="p-4 rounded-2xl border bg-slate-50 border-slate-100 cursor-pointer hover:border-teal-300 transition-colors group" onClick={() => navigate('/b2b')}>
<div className="text-[10px] uppercase font-bold text-teal-600 mb-1 flex items-center gap-1">Kontrakt B2B <ArrowRight size={10}/></div>
<div className="font-bold text-slate-900 group-hover:text-teal-700">Sprawdź &rarr;</div>
</div>
</div>
</div>

{/* TABELA ROCZNA */}
{contractType === 'uop' && (
<div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
<div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
<div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
<Table2 size={20} className="text-slate-700"/>
</div>
<h3 className="font-bold text-slate-900">Symulacja roczna (miesiąc po miesiącu)</h3>
</div>
<div className="overflow-x-auto">
<table className="w-full text-sm text-left">
<thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
<tr>
<th className="px-6 py-4">Miesiąc</th>
<th className="px-6 py-4 text-slate-900">Brutto</th>
<th className="px-6 py-4 text-green-700">Netto (Na rękę)</th>
<th className="px-6 py-4">ZUS</th>
<th className="px-6 py-4">PIT (Zaliczka)</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100">
{salaryYearlyData.map((row, idx) => (
<tr key={idx} className={`hover:bg-slate-50/80 transition-colors ${row.inSecondThreshold ? 'bg-orange-50' : ''}`}>
<td className="px-6 py-3 font-bold text-slate-700 flex items-center gap-2">
{row.month}
{row.inSecondThreshold && (
<span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full uppercase flex items-center gap-1 border border-orange-200 shadow-sm">
<AlertTriangle size={10}/> II Próg (32%)
</span>
)}
</td>
<td className="px-6 py-3 text-slate-500">{formatMoney(row.gross)}</td>
<td className="px-6 py-3 font-bold text-green-700 text-base">{formatMoney(row.netto)}</td>
<td className="px-6 py-3 text-slate-500">{formatMoney(row.zus)}</td>
<td className="px-6 py-3 text-slate-500">{formatMoney(row.tax)}</td>
</tr>
))}
</tbody>
<tfoot className="bg-slate-900 text-white font-bold">
<tr>
<td className="px-6 py-4 text-orange-200">SUMA ROCZNA</td>
<td className="px-6 py-4 text-slate-300">{formatMoney(yearlyTotal.gross)}</td>
<td className="px-6 py-4 text-green-400 text-lg">{formatMoney(yearlyTotal.netto)}</td>
<td className="px-6 py-4 text-slate-300">{formatMoney(yearlyTotal.zus)}</td>
<td className="px-6 py-4 text-slate-300">{formatMoney(yearlyTotal.tax)}</td>
</tr>
</tfoot>
</table>
</div>
</div>
)}

<div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-center justify-between gap-4 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => document.getElementById('baza-wiedzy').scrollIntoView({behavior: 'smooth'})}>
<div className="flex items-center gap-4">
<div className="bg-white p-3 rounded-full text-blue-600 shadow-sm"><GraduationCap size={24}/></div>
<div>
<h4 className="font-bold text-blue-900">Chcesz zarabiać więcej?</h4>
<p className="text-sm text-blue-700">Przejdź do kompendium wiedzy o formach zatrudnienia &rarr;</p>
</div>
</div>
<ArrowRight size={24} className="text-blue-400"/>
</div>

</div>
</div>

{/* ==========================================================================
    KOMPENDIUM WIEDZY: JAK OBLICZYĆ PENSJĘ NETTO Z BRUTTO
    ========================================================================== */}
<div id="baza-wiedzy" className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden mt-16">
  
  {/* Header Sekcji Edukacyjnej - USUNIĘTO WZMIANKI O AI */}
  <div className="bg-slate-900 text-white p-12 text-center relative overflow-hidden">
    <div className="relative z-10 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
        <GraduationCap size={16} className="text-yellow-400"/> Akademia rynku pracy
      </div>
      <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
        Więcej niż "pasek wypłaty".<br/>Kompletna strategia Twoich dochodów.
      </h3>
      <p className="text-slate-300 text-lg leading-relaxed font-medium">
        W Finanse Proste wierzymy, że świadomość finansowa zaczyna się od zrozumienia własnego odcinka z wypłaty. Dowiedz się, dlaczego <strong>płaca netto</strong> tak drastycznie różni się od kosztów firmy i jak <strong>kalkulator wynagrodzeń 2026</strong> pozwala przejąć kontrolę nad budżetem.
      </p>
    </div>
  </div>

  <div className="p-8 md:p-16 space-y-24">

    {/* SEKCJA 1: ANATOMIA PŁACY - ROZBUDOWANA O EKSPERCKIE DETALE */}
    <div>
        <div id="sekcja-1" className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">1</div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Anatomia wynagrodzenia: gdzie znikają Twoje pieniądze?</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed text-sm">
                    Dla laika pensja to kwota przelewu. Dla eksperta to tzw. <strong>klin podatkowy</strong> – różnica między tym, co wydaje pracodawca, a tym, co dostajesz Ty. Aby zrozumieć <strong>zarobki netto umowa o pracę</strong>, musisz rozróżnić trzy warstwy Twojego wynagrodzenia.
                </p>
                
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Pełny koszt Twojego miejsca pracy:</h4>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                            <span className="text-slate-500 italic">Koszt pracodawcy (Brutto + ZUS firmy)</span>
                            <span className="font-bold text-slate-900">~120,48%</span>
                        </li>
                        <li className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                            <span className="text-slate-500 italic">Kwota Brutto (Zapisana w umowie)</span>
                            <span className="font-bold text-slate-900">100%</span>
                        </li>
                        <li className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                            <span className="text-slate-500 italic">Twoje Składki ZUS (Emeryt., Rent., Chorob.)</span>
                            <span className="font-bold text-blue-600">- 13,71%</span>
                        </li>
                        <li className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                            <span className="text-slate-500 italic">Składka Zdrowotna (NFZ)</span>
                            <span className="font-bold text-pink-600">- 9,00%</span>
                        </li>
                        <li className="flex justify-between items-center text-sm pt-1">
                            <span className="text-slate-700 font-bold uppercase text-[10px]">Twoja płaca na rękę (Netto)</span>
                            <span className="font-black text-green-600 text-lg">Zależne od PIT</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm"><Building2 size={16} className="text-slate-400"/> Pozapłacowe koszty pracy</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Szef płaci za Ciebie więcej, niż myślisz. Oprócz Brutto, odprowadza składki na <strong>Fundusz Pracy (FP)</strong> oraz <strong>FGŚP</strong>. To dlatego przy pensji 10 000 zł brutto, realny <strong>koszt pracodawcy</strong> to ponad 12 000 zł.
                    </p>
                </div>
                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm"><Info size={16}/> Pułapka składki zdrowotnej</h4>
                    <p className="text-xs text-blue-800 leading-relaxed">
                        Pamiętaj: <strong>składka zdrowotna kalkulator</strong> liczy ją od brutto pomniejszonego o składki społeczne. Od 2022 roku nie możesz jej odliczyć od podatku, co sprawiło, że realne opodatkowanie pracy w Polsce wzrosło o blisko 9%.
                    </p>
                </div>
                <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
                    <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2 text-sm"><TrendingUp size={16}/> Limit 30-krotności ZUS 2026</h4>
                    <p className="text-xs text-green-800 leading-relaxed">
                        To "bezpiecznik" dla najbogatszych. Jeśli zarabiasz bardzo dużo, po przekroczeniu limitu (ok. 282 tys. zł rocznie) Twoje <strong>ile na rękę</strong> gwałtownie wzrośnie, bo przestajesz płacić składkę emerytalną i rentową.
                    </p>
                </div>
            </div>
        </div>
    </div>

 {/* SEKCJA 2: MECHANIKA PODATKOWA I TARCZE OCHRONNE */}
    <div id="sekcja-2" className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-200">
        <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">2</div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight text-slate-900">Mechanika podatkowa: jak realnie płacić mniejszy PIT?</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8 text-slate-600">
                <p className="text-sm leading-relaxed">
                    Podatek dochodowy nie jest liczony od całej kwoty brutto. Najpierw odejmuje się składki ZUS oraz <strong>koszty uzyskania przychodu</strong>. W 2026 roku kluczowym dokumentem pozostaje <strong>PIT-2 – co to jest i czy podpisać?</strong> To Twoja zgoda na to, by pracodawca co miesiąc stosował <strong>kwotę zmniejszającą podatek 300 zł</strong>.
                </p>

                {/* KOSZTY UZYSKANIA PRZYCHODU - NOWY ELEMENT EKSPERCKI */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                        <PenTool size={18} className="text-blue-500"/> Koszty uzyskania przychodu (KUP)
                    </h4>
                    <div className="space-y-4 text-xs">
                        <div className="flex justify-between items-center">
                            <span>Praca w miejscu zamieszkania:</span>
                            <span className="font-bold text-slate-900 text-sm">250 zł / msc</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Dojazdy z innej miejscowości:</span>
                            <span className="font-bold text-slate-900 text-sm">300 zł / msc</span>
                        </div>
                        <p className="text-[10px] text-slate-400 italic pt-2 border-t">
                            <strong>Praca w miejscu zamieszkania a koszty uzyskania przychodu:</strong> Wybór 300 zł wymaga złożenia oświadczenia o dojazdach, co rocznie pozwala zaoszczędzić dodatkowe kilkadziesiąt złotych na podatku.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200 flex flex-col h-full">
                <h4 className="font-bold text-slate-800 mb-6 text-center italic text-sm">Zasady ogólne i drugi próg podatkowy 2026</h4>
                
                <div className="space-y-8 flex-grow">
                    <div className="relative">
                        <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="flex items-center gap-1 text-green-600"><CheckCircle size={14}/> I Próg (12%)</span> 
                            <span>Do 120 000 zł dochodu</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full"></div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">Dla większości Polaków <strong>przelicznik brutto netto</strong> kończy się tutaj.</p>
                    </div>

                    <div className="relative">
                        <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="flex items-center gap-1 text-red-600"><AlertTriangle size={14}/> II Próg (32%)</span> 
                            <span>Powyżej 120 000 zł</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-1/3"></div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">Płacisz 32% tylko od nadwyżki ponad 120 tys. zł dochodu rocznego.</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <h5 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <Users size={16} className="text-blue-500"/> Ratunek: rozliczenie z małżonkiem
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                        Jeśli jeden z małżonków wpada w <strong>drugi próg podatkowy 2026</strong>, a drugi zarabia mniej (lub wcale), wspólny PIT pozwala uśrednić dochód. Może to „cofnąć” zarobki do progu 12%, ratując w domowym budżecie nawet <strong>kilkanaście tysięcy złotych</strong>.
                    </p>
                </div>
            </div>
        </div>

        <div className="mt-12 bg-slate-900 rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="flex items-center gap-4 relative z-10">
                <div className="bg-blue-600 p-3 rounded-xl"><Scale size={24}/></div>
                <div>
                    <h5 className="font-bold text-sm">Wyzwanie wysokich zarobków?</h5>
                    <p className="text-[11px] text-slate-400">Przy zarobkach rzędu 15-20 tys. zł brutto, różnice w podatkach stają się kluczowe.</p>
                </div>
            </div>
            <div className="flex gap-4 relative z-10">
                <button onClick={() => navigate('/b2b')} className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all shadow-lg">B2B kalkulator</button>
            </div>
            <TrendingUp className="absolute -bottom-10 -right-10 text-white/5 w-48 h-48" />
        </div>
    </div>

           {/* SEKCJA 3: FORMY ZATRUDNIENIA I ULGI CELOWE */}
            <div>
                <div id="sekcja-3" className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">3</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight text-slate-900">Formy zatrudnienia: jak typ umowy zmienia Twoje netto?</h3>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* KARTA: MLODZI I ZLECENIE */}
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-blue-300 transition-colors group">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <GraduationCap size={20}/>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2 italic">Studenci i ulga dla młodych</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                            <strong>Ulga dla młodych do 26 lat</strong> to finansowy "fory" na start. Jeśli jesteś studentem na zleceniu, Twój <strong>przelicznik brutto netto</strong> jest uproszczony do maksimum: <strong>umowa zlecenie student netto</strong> równa się zazwyczaj kwocie brutto (brak składek ZUS i PIT 0%).
                        </p>
                        <div className="bg-white p-3 rounded-xl border border-blue-50 text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                            Limit przychodów 0% PIT: 85 528 zł
                        </div>
                    </div>

                    {/* KARTA: PLACA MINIMALNA */}
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-orange-300 transition-colors">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-orange-600 shadow-sm mb-4">
                            <Briefcase size={20}/>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2 italic">Płaca minimalna 2026</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                            W 2026 roku <strong>najniższa krajowa 2026 na rękę</strong> ewoluuje. Dla pracownika na etacie kwota <strong>4806 brutto ile to netto</strong> zależy od wpłat na PPK, natomiast zleceniobiorców chroni <strong>minimalna stawka godzinowa 2026</strong>, poniżej której firma nie może zejść.
                        </p>
                        <Link to="/wynagrodzenia" className="text-[10px] font-black text-orange-600 uppercase flex items-center gap-1 hover:gap-2 transition-all">
                            Przelicz płacę minimalną <ArrowRight size={12}/>
                        </Link>
                    </div>

                    {/* KARTA: PPK I EMERYTURA */}
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-purple-300 transition-colors">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-purple-600 shadow-sm mb-4">
                            <PiggyBank size={20}/>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2 italic">Oszczędzanie w PPK</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                            Każdy <strong>ppk kalkulator wynagrodzenia</strong> potwierdzi: Twoja dobrowolna wpłata obniża obecne netto, ale uruchamia dopłaty od pracodawcy i państwa. To jedyny system, w którym realnie zyskujesz blisko 100% zwrotu na starcie.
                        </p>
                        <Link to="/ppk" className="text-[10px] font-black text-purple-600 uppercase flex items-center gap-1 hover:gap-2 transition-all">
                            Zalety PPK w 2026 <ArrowRight size={12}/>
                        </Link>
                    </div>
                </div>

                {/* EKSPERCKI DODATEK: TARCZE DLA RODZIN I SENIORÓW */}
                <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-start gap-4">
                        <div className="bg-blue-600 p-2 rounded-lg text-white"><ShieldCheck size={20}/></div>
                        <div>
                            <h5 className="text-white font-bold text-sm mb-1">Ulga 4+ i dla pracujących seniorów</h5>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Jeśli wychowujesz min. 4 dzieci lub mimo wieku emerytalnego nadal pracujesz, przysługuje Ci dodatkowe zwolnienie z PIT do limitu 85 528 zł. To potężne narzędzie zwiększające <strong>zarobki netto</strong> bez podwyżki brutto.
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
                        <div className="bg-slate-200 p-2 rounded-lg text-slate-600"><TrendingUp size={20}/></div>
                        <div>
                            <h5 className="text-slate-900 font-bold text-sm mb-1">Zbieg tytułów ubezpieczeń</h5>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Pracujesz w dwóch miejscach? Jeśli na pierwszej umowie zarabiasz co najmniej płacę minimalną, z drugiej umowy (zlecenie) płacisz zazwyczaj tylko składkę zdrowotną. To klucz do wysokiego netto przy "fuchach".
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEKCJA 4: STATYSTYKI */}
            <div id="sekcja-4" className="bg-slate-900 rounded-[3rem] p-12 text-white text-center relative overflow-hidden">
                <div className="relative z-10 grid md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-700">
                    <div className="text-center">
                        <div className="text-4xl font-black text-blue-400 mb-2">40%</div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Klin podatkowy</p>
                        <p className="text-sm text-slate-300 mt-2">Średnia suma obciążeń (ZUS+PIT) w całkowitym koszcie pracy.</p>
                    </div>
                    <div className="text-center px-4">
                        <div className="text-4xl font-black text-green-400 mb-2">30k zł</div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Kwota wolna</p>
                        <p className="text-sm text-slate-300 mt-2">Zabezpiecza najniższe dochody przed opodatkowaniem.</p>
                    </div>
                    <div className="text-center pt-8 md:pt-0">
                        <div className="text-4xl font-black text-purple-400 mb-2">~107%</div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Dynamika płac</p>
                        <p className="text-sm text-slate-300 mt-2">Spodziewany stosunek średniej krajowej netto do roku poprzedniego.</p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><Wallet size={240}/></div>
            </div>
          </div>

{/* SEKCJA 4: SKŁADNIKI ZMIENNE I UKRYTE KOSZTY BENEFITÓW */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">4</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Składniki zmienne: jak premie i benefity zmieniają przelew?</h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Twoja stała pensja to tylko podstawa. Ekspert wie, że <strong>premia brutto netto</strong> rozliczana jest identycznie jak wynagrodzenie zasadnicze, co przy wysokich kwotach może nagle „wpchnąć” Cię w <strong>drugi próg podatkowy 2026</strong> już w połowie roku.
                        </p>

                        {/* KARTA: BENEFITY - TO CZĘSTO MYLI POCZĄTKUJĄCYCH */}
                        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm">
                                    <Activity size={18} className="text-blue-600"/> Benefity to też przychód
                                </h4>
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    Karta sportowa czy prywatna opieka medyczna nie są darmowe w oczach urzędu skarbowego. Ich wartość (np. 100 zł) dolicza się do Twojego brutto, co podnosi podstawę opodatkowania. To dlatego po otrzymaniu benefitu Twoje netto może być o kilka złotych niższe niż wskazuje <strong>kalkulator wynagrodzeń 2026</strong>.
                                </p>
                            </div>
                            <Zap className="absolute -bottom-6 -right-6 text-blue-200/50 w-24 h-24 rotate-12" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* KARTA: CHOROBOWE */}
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-start gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-sm text-red-500"><Clock size={24}/></div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm mb-1 italic">Wynagrodzenie chorobowe netto</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Standardowe L4 to 80% wynagrodzenia. Co ważne, od tego świadczenia nie odprowadza się składek emerytalnych i rentowych, a jedynie składkę zdrowotną i podatek. To zmienia <strong>przelicznik brutto netto</strong> na Twoją korzyść, mimo niższej kwoty bazowej.
                                </p>
                            </div>
                        </div>

                        {/* KARTA: DELEGACJE */}
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-start gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-sm text-green-600"><Briefcase size={24}/></div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm mb-1 italic">Diety i delegacje</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    To jedyny element przelewu od pracodawcy, który jest w 100% wolny od podatku i ZUS. Jeśli podróżujesz służbowo, Twoje realne <strong>zarobki netto</strong> są wyższe, ale kwoty te nie budują Twojej przyszłej emerytury ani zdolności kredytowej.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PODSUMOWANIE RYNKOWE */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-sm text-slate-500 max-w-xl text-center md:text-left">
                        Porównując swoje dochody, pamiętaj, że <strong>średnia krajowa 2026 netto</strong> jest często zawyżona przez wysokie premie w górnictwie i energetyce. Najlepszym punktem odniesienia dla Twojej pensji jest mediana zarobków w Twojej branży.
                    </div>
                    <button 
                        onClick={() => navigate('/b2b')}
                        className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-xs hover:bg-slate-800 transition-all shadow-lg shrink-0"
                    >
                        Sprawdź alternatywę B2B
                    </button>
                </div>
            </div>

            {/* SEKCJA 5: ROZLICZENIE ROCZNE I STRATEGIE ULGI */}
            <div id="sekcja-5" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">5</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Rozliczenie roczne: jak wygenerować zwrot podatku?</h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Miesięczny <strong>kalkulator płac 2026</strong> nie uwzględnia Twojej sytuacji osobistej. Dopiero składając <strong>PIT-37</strong>, masz szansę odzyskać nadpłacony podatek. Ekspert wie, że odpowiednia strategia odliczeń potrafi zwiększyć realną roczną pensję o równowartość trzynastej wypłaty.
                        </p>

                        {/* KARTA: ULGA NA DZIECKO - NAJPOPULARNIEJSZA */}
                        <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-sm">
                                    <Heart size={18} className="text-green-600"/> Ulga na dziecko (Prorodzinna)
                                </h4>
                                <p className="text-xs text-green-800 leading-relaxed">
                                    To najprostszy sposób na wysoki <strong>zwrot podatku</strong>. Przy jednym dziecku odliczysz od podatku 1112,04 zł rocznie. Przy większej rodzinie kwoty te rosną skokowo. Jeśli Twój podatek jest niższy niż przysługująca ulga, możesz ubiegać się o zwrot niewykorzystanej kwoty z zapłaconych składek ZUS.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* KARTA: ULGI NOWOCZESNE */}
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-start gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-500"><Wifi size={24}/></div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm mb-1 italic">Ulga na internet i darowizny</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Możesz odliczyć faktycznie poniesione koszty internetu (limit 760 zł) przez dwa następujące po sobie lata. Pamiętaj też o darowiznach na cele pożytku publicznego czy krew – każda taka operacja obniża podstawę opodatkowania i poprawia Twój roczny <strong>przelicznik brutto netto</strong>.
                                </p>
                            </div>
                        </div>

                        {/* KARTA: TERMOMODERNIZACJA */}
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-start gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-sm text-orange-500"><Sun size={24}/></div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm mb-1 italic">Ulga termomodernizacyjna</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Inwestujesz w pompę ciepła lub fotowoltaikę? Możesz odliczyć od dochodu nawet 53 000 zł. To potężna tarcza, która potrafi całkowicie wyzerować podatek dochodowy za dany rok, co dla osób w <strong>drugim progu podatkowym 2026</strong> jest najbardziej opłacalnym ruchem finansowym.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODUŁ: ZWROT Z IKZE - LINKOWANIE WEWNĘTRZNE */}
                <div className="mt-12 bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="max-w-xl">
                            <h5 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
                                <TrendingUp size={18}/> Bonus: zwrot podatku z IKZE
                            </h5>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Chcesz dostać od państwa przelew na kwotę nawet 3000-4000 zł? Wpłacając środki na Indywidualne Konto Zabezpieczenia Emerytalnego, odliczasz całą kwotę od dochodu. To najskuteczniejsza metoda na natychmiastowe zwiększenie swoich <strong>zarobków netto</strong> w ujęciu rocznym.
                            </p>
                        </div>
                        <button 
                            onClick={() => navigate('/ike-ikze')}
                            className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold text-xs hover:bg-slate-100 transition-all shadow-lg shrink-0"
                        >
                            Oblicz zwrot z IKZE
                        </button>
                    </div>
                    <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* SEKCJA 6: NAJCZĘSTSZE BŁĘDY I PUŁAPKI NA PASKU PŁAC */}
            <div id="sekcja-6" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">6</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Katalog błędów: czego nie mylić na pasku płac?</h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 text-slate-600">
                    <div className="space-y-6">
                        <p className="text-sm leading-relaxed">
                            Nawet jeśli Twój <strong>kalkulator wynagrodzeń 2026</strong> wskazuje poprawną kwotę, łatwo o pomyłkę w interpretacji składowych. Ekspert potrafi odróżnić daniny publiczne od prywatnych oszczędności i rozumie, dlaczego „Brutto” to pojęcie czysto teoretyczne.
                        </p>

                        {/* TABELA PUŁAPEK */}
                        <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden">
                            <div className="p-4 bg-slate-100 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                Porównanie: Mit vs Fakt
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex gap-3">
                                    <XCircle size={18} className="text-red-500 shrink-0"/>
                                    <p className="text-xs"><strong>Mit:</strong> Składka zdrowotna (NFZ) obniża mój podatek dochodowy.</p>
                                </div>
                                <div className="flex gap-3 pb-4 border-b border-slate-200">
                                    <CheckCircle size={18} className="text-green-600 shrink-0"/>
                                    <p className="text-xs"><strong>Fakt:</strong> Od 2022 roku składka zdrowotna 9% jest w całości nieodliczalna. To realny podatek, który płacisz od dochodu.</p>
                                </div>
                                <div className="flex gap-3">
                                    <XCircle size={18} className="text-red-500 shrink-0"/>
                                    <p className="text-xs"><strong>Mit:</strong> Kwota Brutto to całkowity koszt mojej pracy.</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle size={18} className="text-green-600 shrink-0"/>
                                    <p className="text-xs"><strong>Fakt:</strong> Do brutto dolicza się ZUS płacony przez firmę. Dopiero suma tych kwot to realny koszt dla szefa.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* KARTA: PUŁAPKA DRUGIEGO PROGU */}
                        <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                            <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2 text-sm">
                                <AlertCircle size={18}/> Pułapka „grudniowej pensji”
                            </h4>
                            <p className="text-xs text-orange-800 leading-relaxed">
                                Wiele osób dziwi się, dlaczego ich <strong>ile na rękę</strong> spada w ostatnich miesiącach roku. To efekt wejścia w <strong>drugi próg podatkowy 2026</strong>. Gdy Twój roczny dochód skumulowany przekroczy 120 000 zł, system automatycznie zaczyna pobierać 32% zamiast 12% od nadwyżki.
                            </p>
                        </div>

                        {/* KARTA: BENEFITY A ZDOLNOŚĆ KREDYTOWA */}
                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm">
                                <Landmark size={18}/> Brutto a bank
                            </h4>
                            <p className="text-xs text-blue-800 leading-relaxed">
                                Pamiętaj, że banki liczą Twoją zdolność kredytową na podstawie średniego <strong>netto</strong>, ale odejmują od niego raty innych zobowiązań i... wpłaty na PPK, jeśli traktujesz je jako koszt stały. Z kolei benefity jak auto służbowe podnoszą Twoje brutto, co paradoksalnie może pomóc w procesie kredytowym.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ZAMKNIĘCIE MERYTORYCZNE */}
                <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 text-center">
                    <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
                        Zrozumienie tych detali to różnica między biernym sprawdzaniem konta a świadomym planowaniem kariery. Jeśli Twój <strong>przelicznik brutto netto</strong> na obecnej umowie Cię nie satysfakcjonuje, nadszedł czas na analizę optymalizacji.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <button onClick={() => navigate('/b2b')} className="flex items-center gap-2 text-teal-700 font-black text-[10px] uppercase tracking-widest border-b-2 border-teal-200 hover:border-teal-500 transition-all pb-1">
                            Sprawdź ścieżkę B2B <ArrowRight size={14}/>
                        </button>
                    </div>
                </div>
            </div>

         
        </div>
      </div>
    </>
  );
};