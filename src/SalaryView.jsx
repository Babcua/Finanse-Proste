import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import {
  Wallet, Building2, User, Landmark, AlertTriangle, PieChart, CheckCircle, PiggyBank,
  Briefcase, FileText, TrendingUp, ShieldCheck, GraduationCap, Table2, ArrowRight, XCircle
} from 'lucide-react';

const MONTHS = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];

const formatMoney = (val) => 
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

// --- KOMPONENTY UI ---
const InputGroup = ({ label, value, onChange, suffix }) => (
    <div className="flex flex-col gap-2">
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
            KOMPENDIUM WIEDZY (PROFESORSKIE)
            ==========================================================================
        */}
        <div id="baza-wiedzy" className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden mt-16">
            
            {/* Header Sekcji Edukacyjnej */}
            <div className="bg-slate-900 text-white p-12 text-center relative overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <GraduationCap size={16} className="text-yellow-400"/> Akademia Rynku Pracy
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                        Więcej niż "pasek wypłaty".<br/>Kompletna strategia kariery.
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Jako eksperci finansowi przygotowaliśmy kompleksową analizę polskiego rynku pracy. Dowiedz się, dlaczego umowa o pracę jest "najdroższa", kiedy opłaca się przejść na B2B i jak legalnie płacić mniejsze podatki.
                    </p>
                </div>
            </div>

            <div className="p-8 md:p-16 space-y-24">

                {/* MODUŁ 1: WIELKIE PORÓWNANIE UMÓW */}
                <div>
                    <div className="text-center mb-12">
                        <h4 className="text-3xl font-bold text-slate-900 mb-4">Architektura zatrudnienia w Polsce</h4>
                        <p className="text-slate-600">Trzy główne drogi, każda z innymi konsekwencjami dla Twojego portfela.</p>
                    </div>
                    
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* UoP */}
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 hover:border-blue-300 transition-all group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6">
                                <Briefcase size={28}/>
                            </div>
                            <h5 className="text-xl font-bold text-slate-900 mb-2">Umowa o pracę</h5>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6">Stabilny Fundament</p>
                            
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                To "małżeństwo" z pracodawcą. Jesteś pod pełną ochroną Kodeksu pracy. Najdroższa forma dla firmy, najbezpieczniejsza dla pracownika.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-700">
                                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-1"/> Płatny urlop (20/26 dni)</li>
                                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-1"/> Płatne chorobowe (L4)</li>
                                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-1"/> Okres wypowiedzenia i ochrona</li>
                                <li className="flex gap-2"><XCircle size={16} className="text-red-500 mt-1"/> <strong>Wada:</strong> Najniższe netto (wysokie koszty)</li>
                            </ul>
                        </div>

                        {/* UZ */}
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 hover:border-orange-300 transition-all group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm mb-6">
                                <FileText size={28}/>
                            </div>
                            <h5 className="text-xl font-bold text-slate-900 mb-2">Umowa zlecenie</h5>
                            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-6">Elastyczność</p>
                            
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Umowa cywilnoprawna regulowana przez Kodeks cywilny. Mniej formalności niż na etacie. Idealna na start kariery.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-700">
                                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-1"/> <strong>Studenci &lt;26 lat:</strong> Brutto = Netto (0% podatku, 0% ZUS)</li>
                                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-1"/> Elastyczny czas pracy</li>
                                <li className="flex gap-2"><XCircle size={16} className="text-red-500 mt-1"/> Brak płatnego urlopu (chyba że ustalony)</li>
                                <li className="flex gap-2"><XCircle size={16} className="text-red-500 mt-1"/> Brak okresu wypowiedzenia (z dnia na dzień)</li>
                            </ul>
                        </div>

                        {/* UoD */}
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 hover:border-purple-300 transition-all group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm mb-6">
                                <FileText size={28}/>
                            </div>
                            <h5 className="text-xl font-bold text-slate-900 mb-2">Umowa o dzieło</h5>
                            <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-6">Zadaniowość</p>
                            
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Umowa rezultatu. Liczy się efekt (np. napisany kod, projekt graficzny), a nie czas pracy. Najtańsza dla pracodawcy, najwyższe netto dla specjalisty.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-700">
                                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-1"/> <strong>Brak składek ZUS</strong> (Tylko podatek)</li>
                                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-1"/> Koszty autorskie 50% (Płacisz podatek od połowy!)</li>
                                <li className="flex gap-2"><XCircle size={16} className="text-red-500 mt-1"/> Brak ubezpieczenia zdrowotnego (NFZ)</li>
                                <li className="flex gap-2"><XCircle size={16} className="text-red-500 mt-1"/> Lata pracy nie liczą się do emerytury</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* MODUŁ 2: CO WPŁYWA NA PENSJĘ? */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h4 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <TrendingUp className="text-blue-600"/> Mechanika twojego wynagrodzenia
                        </h4>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Twoja pensja netto to wynik skomplikowanego równania podatkowego. Oto czynniki, które decydują o tym, ile realnie dostaniesz przelewu:
                        </p>
                        
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="bg-red-100 p-3 rounded-xl h-fit text-red-600"><AlertTriangle size={24}/></div>
                                <div>
                                    <strong className="block text-slate-900 text-lg mb-1">Drugi próg podatkowy (32%)</strong>
                                    <p className="text-sm text-slate-600">
                                        W Polsce obowiązuje progresja podatkowa. Do 120 000 zł dochodu rocznie płacisz 12%. Powyżej tej kwoty państwo zabiera aż <strong>32%</strong> każdej zarobionej złotówki. To dlatego w naszej tabeli rocznej (powyżej) możesz zobaczyć spadek pensji w listopadzie lub grudniu.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="bg-green-100 p-3 rounded-xl h-fit text-green-600"><ShieldCheck size={24}/></div>
                                <div>
                                    <strong className="block text-slate-900 text-lg mb-1">Limit 30-krotności ZUS</strong>
                                    <p className="text-sm text-slate-600">
                                        Dobra wiadomość dla najlepiej zarabiających (powyżej ~20 tys. brutto). Po przekroczeniu rocznego limitu podstawy składek (ok. 282,6 tys. zł), przestajesz płacić składki emerytalne i rentowe. Twoja pensja netto nagle rośnie o ok. 11%!
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-purple-100 p-3 rounded-xl h-fit text-purple-600"><PiggyBank size={24}/></div>
                                <div>
                                    <strong className="block text-slate-900 text-lg mb-1">PPK (Oszczędzanie)</strong>
                                    <p className="text-sm text-slate-600">
                                        Dobrowolny system oszczędzania. Ty wpłacasz 2%, pracodawca dokłada 1.5%. To obniża Twoją pensję netto "tu i teraz", ale jest jedną z najbardziej opłacalnych form inwestycji długoterminowej. <Link to="/ppk" className="text-purple-600 font-bold hover:underline">Zobacz nasz kalkulator PPK.</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200">
                        <h4 className="text-2xl font-bold text-slate-900 mb-8 text-center">Jak zwiększyć wynagrodzenie netto?</h4>
                        
                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-2xl shadow-sm flex gap-4 items-center cursor-pointer hover:border-teal-300 border border-transparent transition-all group" onClick={() => navigate('/b2b')}>
                                <div className="bg-teal-100 p-3 rounded-xl text-teal-700"><Building2 size={24}/></div>
                                <div>
                                    <strong className="block text-slate-900 group-hover:text-teal-700 transition-colors">Przejście na B2B</strong>
                                    <span className="text-xs text-slate-500">Zastąpienie umowy o pracę fakturą pozwala wybrać podatek liniowy (19%) lub ryczałt (12%/8.5%), omijając II próg podatkowy.</span>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl shadow-sm flex gap-4 items-center cursor-pointer hover:border-indigo-300 border border-transparent transition-all group" onClick={() => navigate('/ike-ikze')}>
                                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-700"><Landmark size={24}/></div>
                                <div>
                                    <strong className="block text-slate-900 group-hover:text-indigo-700 transition-colors">Ulga IKZE (Zwrot podatku)</strong>
                                    <span className="text-xs text-slate-500">Wpłacając na konto emerytalne IKZE, możesz odliczyć wpłatę od dochodu w PIT. To nawet kilka tysięcy złotych zwrotu rocznie!</span>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl shadow-sm flex gap-4 items-center border border-transparent">
                                <div className="bg-orange-100 p-3 rounded-xl text-orange-700"><User size={24}/></div>
                                <div>
                                    <strong className="block text-slate-900">Wspólne rozliczenie z małżonkiem</strong>
                                    <span className="text-xs text-slate-500">Jeśli Twój małżonek zarabia mało lub wcale, możecie wspólnie "uciec" przed II progiem podatkowym, uśredniając dochody.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODUŁ 3: CIEKAWOSTKI I STATYSTYKI */}
<div className="bg-slate-900 rounded-[3rem] p-12 text-white text-center relative overflow-hidden">
    <div className="relative z-10 grid md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-700">
        <div className="text-center"> {/* Dodano text-center */}
            <div className="text-4xl font-black text-blue-400 mb-2">40%</div>
            <p className="text-sm text-slate-300">Tyle średnio wynosi "klin podatkowy" w Polsce. Tyle z całkowitego kosztu pracy zabiera państwo (ZUS + PIT).</p>
        </div>
        <div className="text-center px-4"> {/* Środkowy już jest OK */}
            <div className="text-4xl font-black text-green-400 mb-2">85 528 zł</div>
            <p className="text-sm text-slate-300">Roczny limit przychodów dla "Ulgi dla Młodych" (do 26 r.ż.). Poniżej tej kwoty Twój PIT wynosi 0%.</p>
        </div>
        <div className="text-center pt-8 md:pt-0"> {/* Dodano text-center */}
            <div className="text-4xl font-black text-purple-400 mb-2">50% KUP</div>
            <p className="text-sm text-slate-300">Koszty Uzyskania Przychodu dla twórców. Jeśli Twoja praca to dzieło twórcze, płacisz podatek tylko od połowy pensji.</p>
        </div>
    </div>
    <div className="absolute top-0 right-0 p-12 opacity-5"><Wallet size={200}/></div>
</div>

            </div>
            
            {/* CTA FOOTER */}
            <div className="bg-slate-50 p-12 text-center border-t border-slate-200">
                <h4 className="text-2xl font-bold text-slate-900 mb-6">Chcesz wiedzieć więcej?</h4>
                <div className="flex flex-wrap justify-center gap-4">
                     <button onClick={() => navigate('/b2b')} className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-sm">
                        Symulacja B2B
                     </button>
                     <button onClick={() => navigate('/ike-ikze')} className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-sm">
                        Ulgi Podatkowe (IKE/IKZE)
                     </button>
                </div>
            </div>
        </div>

      </div>
    </>
  );
};