import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Dodano useNavigate
import { Helmet } from 'react-helmet-async';
import {
  Briefcase, Banknote, Target, Sparkles, AlertTriangle, CheckCircle,
  PieChart, TrendingUp, Scale, XCircle, FileSignature, ArrowRight,
  TrendingDown, Car, ShieldCheck, FileText, Calculator, HelpCircle,
  BookOpen, Users, Lock, Scroll, Umbrella,
  Globe, Repeat, Shuffle, Key, BadgeCheck, LayoutGrid, ListTree // <-- Dodane te ikony naprawią białą stronę
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';

// --- POMOCNICZE FUNKCJE ---

const formatMoney = (amount) => {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(amount);
};

// --- KOMPONENTY UI ---

const InputGroup = ({ label, value, onChange, type = "number", suffix, step = "1", min }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        min={min}
        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-semibold rounded-xl p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
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
  <div className={`flex flex-col gap-2 p-4 rounded-xl border transition-all ${checked ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
    <div className="flex items-start gap-4 cursor-pointer" onClick={() => onChange(!checked)}>
        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checked ? 'bg-teal-600 border-teal-600' : 'border-slate-300 bg-white'}`}>
            {checked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon size={16} className={checked ? 'text-teal-600' : 'text-slate-400'} />}
                <span className={`font-semibold text-sm ${checked ? 'text-teal-900' : 'text-slate-700'}`}>{label}</span>
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

// --- LOGIKA OBLICZENIOWA ---

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
        const deductibleHealth = Math.min(healthZus, 12500/12);
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
        if (yearlyRevenue < 60000) healthZus = 453.30;
        else if (yearlyRevenue < 300000) healthZus = 755.50;
        else healthZus = 1359.90;
        
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

// --- GŁÓWNY KOMPONENT ---

export const B2BView = () => {
   const navigate = useNavigate();
   const scrollToB2B = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };
    // State
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

    // Calculation
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

    const chartData = [
        { name: 'Przychód', value: b2bResult.revenue, color: '#cbd5e1' },
        { name: 'Netto', value: Math.max(0, b2bResult.netIncome), color: '#0d9488' },
        { name: 'Podatek', value: b2bResult.incomeTax, color: '#f87171' },
        { name: 'ZUS', value: b2bResult.totalZus, color: '#fb923c' },
    ];

    return (
        <>
            <Helmet>
                <title>Kalkulator B2B 2026 - Ryczałt, Liniowy, Koszty | Finanse Proste</title>
                <script type="application/ld+json">
{`
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Kalkulator B2B i Kosztów Firmowych",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PLN"
    },
    "description": "Porównywarka form opodatkowania dla B2B: Ryczałt, Podatek Liniowy, Skala. Obliczanie składki zdrowotnej i ZUS."
  }
`}
</script>
                <meta name="description" content="Kompendium wiedzy dla samozatrudnionych. Oblicz zysk netto, ZUS i podatki. Dowiedz się co wrzucić w koszty, jak wybrać księgową i ubezpieczenie OC." />
            <link rel="canonical" href="https://www.finanse-proste.pl/b2b" />
            </Helmet>

            <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">
                
                {/* HEADER */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                        <Briefcase className="text-teal-600" size={36}/>
                        Kalkulator B2B
                    </h2>
                    <p className="text-slate-600 max-w-3xl text-lg">
                        Precyzyjna symulacja Twojego wyniku finansowego. Sprawdź, ile realnie zostanie w Twojej kieszeni po opłaceniu "daniny" dla Państwa.
                    </p>
                </div>
{/* --- SPIS TREŚCI B2B --- */}
        <div className="mb-16 bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm flex flex-wrap justify-center gap-2 md:gap-4 text-left">
          <div className="w-full flex items-center justify-center gap-2 mb-2 text-slate-400">
            <ListTree size={16}/>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Nawigacja po kompendium</span>
          </div>
          
          <button
            onClick={() => scrollToB2B('kalkulator-b2b-sekcja')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
          >
            <Calculator size={14}/> URUCHOM KALKULATOR
          </button>

          {[
            { title: "Klient z zagranicy", icon: Globe, id: "b2b-zagranica" },
            { title: "B2B a wspólny pit", icon: Users, id: "b2b-malzenstwo" },
            { title: "Emerytura na jdg", icon: Umbrella, id: "b2b-emerytura" },
            { title: "Gotówka na start", icon: Banknote, id: "b2b-dotacje" },
            { title: "Samochód w firmie", icon: Car, id: "b2b-samochod" },
            { title: "Dyscyplina i terminy", icon: ShieldCheck, id: "b2b-bezpieczenstwo" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => scrollToB2B(item.id)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition-all border border-transparent hover:border-slate-100"
            >
              <item.icon size={14} className="text-slate-400"/>
              {item.title}
            </button>
          ))}
        </div>
                {/* --- SEKCJA KALKULATORA --- */}
                <div id="kalkulator-b2b-sekcja" className="grid lg:grid-cols-12 gap-8">
                    
                    {/* LEWA STRONA (INPUTY) */}
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
                                            <span className="text-xs text-slate-500">Stała stawka. Zdrowotna 4.9%.</span>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${b2bTaxType === 'skala' ? 'bg-teal-50 border-teal-200 ring-1 ring-teal-200' : 'bg-white border-slate-200'}`}>
                                        <input type="radio" name="tax" checked={b2bTaxType === 'skala'} onChange={() => setB2bTaxType('skala')} className="text-teal-600 focus:ring-teal-500"/>
                                        <div>
                                            <span className="block font-bold text-slate-900">Skala (12% / 32%)</span>
                                            <span className="text-xs text-slate-500">Kwota wolna 30 tys. zł.</span>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${b2bTaxType === 'ryczalt' ? 'bg-teal-50 border-teal-200 ring-1 ring-teal-200' : 'bg-white border-slate-200'}`}>
                                        <input type="radio" name="tax" checked={b2bTaxType === 'ryczalt'} onChange={() => setB2bTaxType('ryczalt')} className="text-teal-600 focus:ring-teal-500"/>
                                        <div className="w-full">
                                            <span className="block font-bold text-slate-900">Ryczałt</span>
                                            <span className="text-xs text-slate-500 mb-2 block">Podatek od przychodu.</span>
                                            {b2bTaxType === 'ryczalt' && (
                                                <select value={b2bRyczaltRate} onChange={(e) => setB2bRyczaltRate(parseFloat(e.target.value))} className="w-full text-sm p-2 border border-slate-300 rounded-lg mt-1 bg-white">
                                                    <option value={12}>12% (IT, programista)</option>
                                                    <option value={15}>15% (doradztwo, usługi)</option>
                                                    <option value={8.5}>8.5% (usługi edukacyjne)</option>
                                                    <option value={17}>17% (wolne zawody)</option>
                                                    <option value={14}>14% (inżynierowie)</option>
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
                                <CheckboxGroup label="Dobrowolne chorobowe" description="Płatne L4 po 90 dniach." checked={b2bSickLeave} onChange={setB2bSickLeave} icon={Target} />
                                {(b2bTaxType === 'liniowy' || b2bTaxType === 'skala') && (
                                    <CheckboxGroup label="Ulga IP BOX (5%)" description="Dla twórców (wymaga interpretacji)." checked={b2bIpBox} onChange={setB2bIpBox} icon={Sparkles} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PRAWA STRONA (WYNIKI + KPI) */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        
                        {/* GLOWNA KARTA WYNIKU */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-xl">Twoja ręka (Netto)</h4>
                                    <p className="text-slate-500 text-sm mt-1">Realny zysk po opłaceniu podatków i ZUS.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Do wypłaty</span>
                                    <div className={`text-4xl font-black ${b2bResult.netIncome < 0 ? 'text-red-500' : 'text-teal-600'}`}>
                                        {formatMoney(b2bResult.netIncome)}
                                    </div>
                                </div>
                            </div>

                            {b2bResult.netIncome < 0 && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold text-sm flex items-center gap-2">
                                    <AlertTriangle size={18}/>
                                    Uwaga: Działalność przynosi stratę.
                                </div>
                            )}

                            {/* KAFELKI SUMMARY */}
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
                                    <BarChart data={chartData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tickMargin={10}/>
                                        <YAxis fontSize={12} tickMargin={10}/>
                                        <RechartsTooltip 
                                            cursor={{fill: 'transparent'}}
                                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                            formatter={(value) => [formatMoney(value), 'Kwota']}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* DODATKOWA KARTA POD WYKRESEM - WYPEŁNIENIE */}
                        <div className="bg-teal-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center flex-grow shadow-xl">
                            <div className="relative z-10">
                                <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-teal-300">
                                    <Target size={20}/> Szybka Analiza Rentowności
                                </h4>
                                <ul className="space-y-4 text-sm text-teal-50">
                                    <li className="flex justify-between items-center border-b border-teal-800 pb-3">
                                        <span>Efektywne opodatkowanie (Real Tax):</span>
                                        <span className="font-bold text-white text-lg">
                                            {b2bResult.revenue > 0 ? ((b2bResult.totalZus + b2bResult.incomeTax) / b2bResult.revenue * 100).toFixed(1) : 0}%
                                        </span>
                                    </li>
                                    <li className="flex justify-between items-center border-b border-teal-800 pb-3">
                                        <span>Koszt dla kontrahenta (Netto):</span>
                                        <span className="font-bold text-white">{formatMoney(b2bResult.revenue)}</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>Kwota faktury brutto (z VAT):</span>
                                        <span className="font-bold text-white text-lg">{formatMoney(b2bResult.grossInvoice)}</span>
                                    </li>
                                </ul>
                                <div className="mt-8 p-4 bg-white/10 rounded-xl text-xs text-teal-200 leading-relaxed flex gap-3">
                                    <AlertTriangle size={16} className="shrink-0 text-yellow-400 mt-0.5"/>
                                    <div>
                                        <strong>Pamiętaj:</strong> Jako B2B musisz samodzielnie odkładać na emeryturę (ZUS to absolutne minimum socjalne) oraz sfinansować sobie urlop.
                                    </div>
                                </div>
                            </div>
                            <PieChart className="absolute -bottom-10 -right-10 opacity-5 text-white w-64 h-64" />
                        </div>

                    </div>
                </div>

                {/* --- KOMPENDIUM WIEDZY (BIBLIA B2B) --- */}
                <div className="space-y-20 mt-24">

                    {/* SEKCJA 1: CZYM TO SIĘ RÓŻNI OD ETATU? (DARK MODE) */}
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-teal-500/30">
                                    <Briefcase size={14}/> Kompendium Przedsiębiorcy
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                    Faktura to nie<br/> <span className="text-teal-400">Pensja</span>
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                                    Przejście na B2B to nie tylko zmiana umowy. To zmiana mentalności. Stajesz się firmą. Twoje 15 000 zł netto na fakturze, to nie to samo co 15 000 zł "na rękę" na etacie.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                                        <strong className="text-teal-300 mb-2 flex items-center gap-2 text-lg"><Scale size={20}/> Odpowiedzialność</strong>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Na etacie chroni Cię Kodeks Pracy (odpowiedzialność do 3 pensji). Na B2B odpowiadasz <strong>całym swoim majątkiem</strong> za błędy, niewykonanie zlecenia czy szkody wyrządzone klientowi. Dlatego ubezpieczenie OC to konieczność, a nie opcja.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <Link to="/wynagrodzenia" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-teal-300 transition-colors border-b border-teal-500/30 pb-1">
                                        Porównaj to z etatem w Kalkulatorze Wynagrodzeń <ArrowRight size={16}/>
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute -inset-4 bg-teal-500/20 blur-3xl rounded-full"></div>
                                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-8 relative">
                                    <h3 className="font-bold text-2xl text-white mb-6">Różnice w pigułce</h3>
                                    
                                    <div className="flex gap-5 items-start">
                                        <div className="bg-teal-500/20 p-3 rounded-xl text-teal-400 shrink-0"><CheckCircle size={24}/></div>
                                        <div>
                                            <strong className="block text-white text-lg mb-1">Wyższe zarobki netto</strong>
                                            <span className="text-sm text-slate-400 leading-relaxed">Dzięki optymalizacji podatkowej (liniowy/ryczałt) w Twojej kieszeni zostaje często 20-30% więcej gotówki niż na etacie przy tym samym koszcie dla firmy.</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-5 items-start">
                                        <div className="bg-red-500/20 p-3 rounded-xl text-red-400 shrink-0"><XCircle size={24}/></div>
                                        <div>
                                            <strong className="block text-white text-lg mb-1">Brak urlopu i L4</strong>
                                            <span className="text-sm text-slate-400 leading-relaxed">Płatny urlop to tylko "dobra wola" wpisana w kontrakt B2B. Jeśli nie pracujesz – nie zarabiasz. Chorobowe z ZUS jest symboliczne (kilkanaście złotych dziennie na start).</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-5 items-start">
                                        <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400 shrink-0"><FileSignature size={24}/></div>
                                        <div>
                                            <strong className="block text-white text-lg mb-1">Formalności</strong>
                                            <span className="text-sm text-slate-400 leading-relaxed">Musisz wystawiać faktury, pilnować kosztów, opłacać ZUS do 20-go każdego miesiąca i PIT. Bez księgowej zginiesz.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEKCJA 2: FORMY OPODATKOWANIA */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h3 className="text-3xl font-bold mb-4 text-slate-900">Serce B2B: Jak płacić podatki?</h3>
                            <p className="text-slate-600 text-lg">
                                Wybór formy opodatkowania to najważniejsza decyzja finansowa. Możesz ją zmienić <strong>tylko raz w roku</strong> (w styczniu). Zły wybór to strata tysięcy złotych.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* RYCZAŁT */}
                            <div className="bg-teal-50 p-8 rounded-[2rem] border-2 border-teal-100 relative group hover:-translate-y-1 transition-transform flex flex-col">
                                <div className="absolute top-4 right-4 bg-white p-2 rounded-lg text-teal-600 shadow-sm"><PieChart size={24}/></div>
                                <h4 className="text-2xl font-black text-teal-800 mb-2">Ryczałt</h4>
                                <div className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-6">Król branży IT</div>
                                <p className="text-base text-slate-700 mb-6 leading-relaxed flex-grow">
                                    Płacisz podatek od <strong>przychodu</strong>. Stawki są bardzo niskie (12% dla programistów, 8.5% dla usług). Składka zdrowotna jest stała (zależna od progu przychodu rocznego: 60 tys. lub 300 tys. zł).
                                </p>
                                <div className="pt-6 border-t border-teal-200">
                                    <div className="flex items-center gap-2 text-sm text-slate-800 font-bold mb-2">
                                        <CheckCircle size={16} className="text-green-600"/> Prosta księgowość
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-800 font-bold">
                                        <XCircle size={16} className="text-red-500"/> BRAK KOSZTÓW
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 ml-6">Nie odliczysz paliwa, laptopa ani leasingu.</p>
                                </div>
                            </div>

                            {/* LINIOWY */}
                            <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-200 relative group hover:-translate-y-1 transition-transform flex flex-col shadow-sm">
                                <div className="absolute top-4 right-4 bg-slate-100 p-2 rounded-lg text-slate-600"><TrendingUp size={24}/></div>
                                <h4 className="text-2xl font-black text-slate-900 mb-2">Liniowy (19%)</h4>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Dla "Kosztowców"</div>
                                <p className="text-base text-slate-600 mb-6 leading-relaxed flex-grow">
                                    Stała stawka niezależnie od tego ile zarobisz. Opłaca się przy dochodach powyżej 120 000 zł rocznie, jeśli planujesz duże zakupy (samochód, biuro).
                                </p>
                                <div className="pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-sm text-slate-800 font-bold mb-2">
                                        <CheckCircle size={16} className="text-green-600"/> Możesz odliczać koszty
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-800 font-bold">
                                        <XCircle size={16} className="text-orange-500"/> Zdrowotna 4.9%
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 ml-6">Płacisz 4.9% od dochodu co miesiąc.</p>
                                </div>
                            </div>

                            {/* SKALA */}
                            <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-200 relative group hover:-translate-y-1 transition-transform flex flex-col shadow-sm">
                                <div className="absolute top-4 right-4 bg-slate-100 p-2 rounded-lg text-slate-600"><Scale size={24}/></div>
                                <h4 className="text-2xl font-black text-slate-900 mb-2">Skala (Zasady)</h4>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Na start / Małe zarobki</div>
                                <p className="text-base text-slate-600 mb-6 leading-relaxed flex-grow">
                                    Opłaca się tylko przy niskich zarobkach (do ok. 100 tys. zł rocznie) lub przy wspólnym rozliczeniu z niepracującym małżonkiem.
                                </p>
                                <div className="pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-sm text-slate-800 font-bold mb-2">
                                        <CheckCircle size={16} className="text-green-600"/> Kwota wolna 30 tys. zł
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-800 font-bold">
                                        <XCircle size={16} className="text-red-600"/> Próg 32% + Zdrowotna 9%
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 ml-6">Powyżej 120 tys. zł oddajesz państwu prawie połowę zarobków.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEKCJA 3: OŚ CZASU ZUS (NAPRAWIONA WIZUALNIE) */}
                    <div className="relative py-8">
                        <h3 className="text-3xl font-bold mb-16 text-center text-slate-900">
                            Ile zapłacisz ZUS? <span className="text-teal-600">Timeline</span>
                        </h3>

                        <div className="space-y-0 relative">
                            {/* LINIA PIONOWA - FLEXBOX TRICK (Żeby nie najeżdżała na tekst) */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 z-0"></div>

                            {/* ROW 1: ULGA NA START */}
                            <div className="flex flex-col md:flex-row items-center relative z-10 group">
                                <div className="w-full md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-colors shadow-sm inline-block w-full">
                                        <div className="text-xs font-bold uppercase text-green-600 mb-1">Miesiące 0 - 6</div>
                                        <h4 className="font-black text-green-800 text-xl mb-2">Ulga na Start</h4>
<p className="text-sm text-slate-700">
    Płacisz <strong>tylko składkę zdrowotną</strong>. <br/>
    Koszt: ok. <strong>432 - 755 zł</strong> / msc.
</p>
                                    </div>
                                </div>
                                <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-lg shrink-0 my-2 md:my-0">1</div>
                                <div className="w-full md:w-1/2 md:pl-12 hidden md:block"></div>
                            </div>

                            {/* ROW 2: ZUS PREFERENCYJNY */}
                            <div className="flex flex-col md:flex-row items-center relative z-10 group mt-8 md:mt-16">
                                <div className="w-full md:w-1/2 md:pr-12 hidden md:block"></div>
                                <div className="bg-teal-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-lg shrink-0 my-2 md:my-0">2</div>
                                <div className="w-full md:w-1/2 md:pl-12 mb-6 md:mb-0">
                                    <div className="bg-teal-50 p-6 rounded-2xl border-2 border-teal-100 hover:border-teal-300 transition-colors shadow-sm inline-block w-full">
                                        <div className="text-xs font-bold uppercase text-teal-600 mb-1">Miesiące 7 - 30</div>
                                        <h4 className="font-black text-teal-800 text-xl mb-2">Mały ZUS (Preferencyjny)</h4>
                                        <p className="text-sm text-slate-700">
    Zaczynasz płacić składki społeczne, ale od bardzo niskiej podstawy (30% minimalnej krajowej).<br/>
    Koszt: ok. <strong>890 - 1200 zł</strong> / msc.
</p>
                                    </div>
                                </div>
                            </div>

                            {/* ROW 3: DUŻY ZUS */}
                            <div className="flex flex-col md:flex-row items-center relative z-10 group mt-8 md:mt-16">
                                <div className="w-full md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                                    <div className="bg-slate-100 p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-colors shadow-sm inline-block w-full">
                                        <div className="text-xs font-bold uppercase text-slate-500 mb-1">Po 30 miesiącach</div>
                                        <h4 className="font-black text-slate-800 text-xl mb-2">Duży ZUS (Pełny)</h4>
                                       <p className="text-sm text-slate-600">
    Koniec taryfy ulgowej. Płacisz pełne składki społeczne.
    <br/>
    Koszt: <strong>ok. 1927 zł + Zdrowotna</strong>. Łącznie to ok. 2400-2600 zł miesięcznie!
</p>
                                    </div>
                                </div>
                                <div className="bg-slate-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-lg shrink-0 my-2 md:my-0">3</div>
                                <div className="w-full md:w-1/2 md:pl-12 hidden md:block"></div>
                            </div>
                        </div>
                    </div>

                    {/* SEKCJA 4: UBEZPIECZENIA I KSIĘGOWOŚĆ (NOWA TREŚĆ) */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* UBEZPIECZENIA */}
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-teal-600"/> Czy warto mieć OC?
                            </h3>
                            <div className="text-sm text-slate-600 mb-6 space-y-4 flex-grow">
                                <p>
                                    <strong>Absolutnie tak.</strong> Na etacie odpowiadasz do 3 pensji. Na B2B odpowiadasz całym majątkiem (mieszkaniem, samochodem). Jeden błąd w kodzie, który zatrzyma sklep online klienta na 4h, może kosztować Cię 200 000 zł odszkodowania.
                                </p>
                                <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-teal-500">
                                    <h4 className="font-bold text-slate-900 mb-2">Rodzaje OC dla B2B:</h4>
                                    <ul className="list-disc ml-4 space-y-1">
                                        <li><strong>OC Zawodowe (Professional Indemnity):</strong> Chroni przed błędami w sztuce, niedotrzymaniem terminów, naruszeniem praw autorskich. <em>Koszt: 500-1200 zł rocznie.</em></li>
                                        <li><strong>OC Ogólne:</strong> Chroni przed szkodami fizycznymi (np. wylejesz kawę na serwer w biurze klienta). <em>Koszt: ok. 200 zł rocznie.</em></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 p-3 rounded-lg mt-auto">
                                <CheckCircle size={14}/> Ubezpieczenie wliczasz w koszty firmy!
                            </div>
                        </div>

                        {/* KSIĘGOWOŚĆ */}
                        <div className="bg-indigo-900 text-white p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-center">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Calculator className="text-orange-400"/> Księgowa czy Aplikacja?
                                </h3>
                                <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                                    Nigdy nie rozliczaj się sam w Excelu. Ryzyko błędu w JPK_V7 czy deklaracji ZUS DRA jest ogromne, a kary liczone są w tysiącach.
                                </p>
                                <div className="space-y-4">
                                    <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                        <div className="flex justify-between items-center mb-1">
                                            <strong className="text-white text-base">Aplikacja (np. inFakt)</strong>
                                            <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded">Polecane</span>
                                        </div>
                                        <p className="text-xs text-indigo-300">
                                            Koszt: <strong>~200 zł/msc</strong>. Sam wystawiasz faktury i robisz przelewy, system liczy podatki. Masz dostęp do dedykowanej księgowej przez czat/telefon. Idealne dla IT/Usług.
                                        </p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-center mb-1">
                                            <strong className="text-slate-300 text-base">Biuro Rachunkowe</strong>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            Koszt: <strong>~400+ zł/msc</strong>. Wysyłasz tylko dokumenty, oni robią resztę. Warto, jeśli masz pracowników, magazyn, kasę fiskalną lub handel zagraniczny.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEKCJA 5: KATALOG KOSZTÓW */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                        <h3 className="text-2xl font-bold mb-2 text-center flex items-center justify-center gap-2">
                            <TrendingDown className="text-teal-600"/> Wielki Katalog Kosztów
                        </h3>
                        <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10 text-sm">
                            Zasada Złota: Wydatek musi służyć <strong>uzyskaniu przychodu</strong> lub zabezpieczeniu jego źródła.
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* BEZPIECZNE */}
                            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2"><CheckCircle size={18}/> Bezpieczne (Pewniaki)</h4>
                                <ul className="space-y-3 text-sm text-slate-700">
                                    <li>• <strong>Elektronika:</strong> Laptop, telefon, monitor, tablet, drukarka.</li>
                                    <li>• <strong>Software:</strong> Office 365, Adobe, IDE, hosting, domeny.</li>
                                    <li>• <strong>Biuro:</strong> Wynajem, biurko, fotel ergonomiczny.</li>
                                    <li>• <strong>Edukacja:</strong> Kursy online, szkolenia, książki branżowe.</li>
                                    <li>• <strong>Usługi:</strong> Internet, telefon, księgowość, prawnik.</li>
                                    <li>• <strong>Leasing:</strong> Rata samochodu + paliwo.</li>
                                </ul>
                            </div>

                            {/* SZARA STREFA */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><HelpCircle size={18}/> Szara Strefa (Ryzyko)</h4>
                                <ul className="space-y-3 text-sm text-slate-700">
                                    <li>• <strong>Biuro w domu:</strong> Możesz odliczyć % czynszu i prądu, ale musisz wydzielić pokój WYŁĄCZNIE do pracy. Ryzykowne przy sprzedaży mieszkania (podatek!).</li>
                                    <li>• <strong>Okulary:</strong> US często kwestionuje. Bezpieczniej mieć opinię lekarza medycyny pracy.</li>
                                    <li>• <strong>Rower/Hulajnoga:</strong> Tylko jeśli udowodnisz dojazdy do klienta (ewidencja przebiegu).</li>
                                    <li>• <strong>Spotkania w restauracji:</strong> Traktowane jako reprezentacja (NKUP). Trudne do obrony.</li>
                                </ul>
                            </div>

                            {/* ZAKAZANE */}
                            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2"><XCircle size={18}/> Zakazane (NKUP)</h4>
                                <ul className="space-y-3 text-sm text-slate-700">
                                    <li>• <strong>Ubrania:</strong> Garnitur czy buty to wydatek osobisty. (Chyba że odzież BHP z logo).</li>
                                    <li>• <strong>Lunch w pracy:</strong> Kanapka to wydatek osobisty.</li>
                                    <li>• <strong>Kurs językowy:</strong> Jeśli jest zbyt ogólny (np. angielski A1). Musi być specjalistyczny biznesowy.</li>
                                    <li>• <strong>Wakacje:</strong> Wyjazd "integracyjny" samemu ze sobą to oszustwo podatkowe.</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-center">
                            <Link to="/leasing" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/30">
                                <Car size={18}/> Oblicz ratę auta w koszty (Kalkulator Leasingu)
                            </Link>
                        </div>
                    </div>

                    {/* SEKCJA 6: DOBRE PRAKTYKI I OSTRZEŻENIA */}
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm mb-16">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2"><BookOpen className="text-slate-700"/> Dobre Praktyki B2B</h3>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h4 className="font-bold text-slate-900 text-base mb-3">Znamiona stosunku pracy (Ryzyko PIP)</h4>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    Fiskus nie lubi "fikcyjnego samozatrudnienia" (gdy jesteś pracownikiem, ale udajesz firmę, by płacić niższe podatki). Aby być bezpiecznym, Twoja umowa i praca NIE mogą mieć cech etatu:
                                </p>
                                <ul className="text-sm text-slate-600 space-y-2">
                                    <li className="flex gap-2"><XCircle size={16} className="text-red-500 shrink-0"/> Nie możesz mieć narzuconych sztywnych godzin (np. 8:00-16:00).</li>
                                    <li className="flex gap-2"><XCircle size={16} className="text-red-500 shrink-0"/> Nie możesz mieć bezpośredniego "kierownika" wydającego polecenia.</li>
                                    <li className="flex gap-2"><XCircle size={16} className="text-red-500 shrink-0"/> Nie możesz podpisywać listy obecności.</li>
                                    <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0"/> Musisz ponosić ryzyko gospodarcze i odpowiadać za rezultaty.</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-base mb-3">VAT i Biała Lista</h4>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    Jeśli jesteś VAT-owcem, pamiętaj o płatnościach. Faktury powyżej 15 000 zł brutto MUSISZ opłacać metodą <strong>Split Payment</strong> (podzielona płatność). Sprawdzaj też kontrahentów na "Białej Liście Podatników VAT", aby nie mieć problemów z odliczeniem.
                                </p>
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                    <strong className="block text-yellow-800 text-sm mb-1">Urlop na B2B?</strong>
                                    <p className="text-xs text-slate-600">Oficjalnie nie istnieje. W kontrakcie wpisuje się "płatne dni wolne od świadczenia usług". Negocjuj to przed podpisaniem umowy!</p>
                                </div>
                            </div>
                        </div>
                    </div>

{/* EKSPORT USŁUG I VAT UE */}
        <div id="b2b-zagranica" className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
                    <Globe size={24}/>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Klient z zagranicy? Eksport usług i vat ue</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 text-left">
                <div className="space-y-6">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Praca dla kontrahenta z Berlina, Londynu czy Nowego Jorku to standard w branży IT. W takim przypadku Twój <strong>kalkulator B2B 2026</strong> nie dolicza 23% vat do faktury. Stosuje się tzw. <strong>reverse charge</strong> (odwrotne obciążenie).
                    </p>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm">Niezbędne formalności:</h4>
                        <ul className="space-y-3 text-xs text-slate-600">
                            <li className="flex gap-2"><strong>Vat-r:</strong> Musisz zarejestrować się jako podatnik vat ue, nawet jeśli w Polsce korzystasz ze zwolnienia podmiotowego.</li>
                            <li className="flex gap-2"><strong>Vies:</strong> Przed wystawieniem faktury sprawdź kontrahenta w europejskiej bazie danych, aby uniknąć problemów z urzędem.</li>
                            <li className="flex gap-2"><strong>Formularz w-8ben:</strong> Kluczowy dokument dla klientów z USA, który chroni Cię przed podwójnym opodatkowaniem u źródła.</li>
                        </ul>
                    </div>
                </div>
                <div className="bg-blue-900 text-white p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-center">
                    <h4 className="text-xl font-bold mb-4 italic">Zaleta walutowa</h4>
                    <p className="text-blue-200 text-sm leading-relaxed mb-6">
                        Zarabiając w eur lub usd, stajesz się naturalnym importerem kapitału. Pamiętaj, że przychód przeliczasz według średniego kursu nbp z dnia poprzedzającego wystawienie faktury. To stwarza okazję do dodatkowych zysków przy mocnym dolarze.
                    </p>
                    <Link to="/zloto" className="flex items-center gap-2 text-sm font-bold text-teal-400 hover:text-teal-300 transition-colors">
                        Chroń oszczędności walutowe <ArrowRight size={16}/>
                    </Link>
                    <TrendingUp className="absolute -bottom-10 -right-10 opacity-10 w-48 h-48" />
                </div>
            </div>
        </div>

        {/* PUŁAPKA MAŁŻEŃSKA I EMERYTURA */}
        <div className="grid lg:grid-cols-2 gap-8">
            <div id="b2b-malzenstwo" className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm text-left">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                    <Users size={24} className="text-pink-600"/> B2b a wspólny pit
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                    <p>
                        To krytyczny punkt analizy przy wyborze formy opodatkowania. Jeśli Twoja żona lub mąż zarabia mało (np. na etacie) lub nie pracuje, wybierając ryczałt lub podatek liniowy – <strong>tracisz prawo do wspólnego rozliczenia</strong>.
                    </p>
                    <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100">
                        <h4 className="font-bold text-pink-900 mb-1 text-xs uppercase tracking-wider">Kiedy skala (12/32%) wygrywa?</h4>
                        <p className="text-xs text-pink-800 leading-relaxed font-medium">
                            Gdy wspólny dochód po uśrednieniu nie wpada w drugi próg podatkowy. Wtedy oszczędność na "niskim" podatku małżonka może być większa niż zysk z ryczałtu 12%. Zawsze liczcie to wspólnie.
                        </p>
                    </div>
                </div>
            </div>

            <div id="b2b-emerytura" className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center text-left">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                    <Umbrella size={24} className="text-blue-500"/> Emerytura na jdg
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-8 font-medium">
                    Składki społeczne na b2b są liczone od minimalnej podstawy. Twoja przyszła emerytura z zus będzie prawdopodobnie oscylować wokół świadczenia minimalnego. Ekspert nie liczy na państwo, tylko buduje własny kapitał.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/ike-ikze')} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                        <Target size={14}/> Zobacz ike / ikze
                    </button>
                    <button onClick={() => navigate('/obligacje')} className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">
                        Obligacje edo
                    </button>
                </div>
            </div>
        </div>

        {/* DOTACJE I START-UP */}
        <div id="b2b-dotacje" className="bg-teal-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-left">
                <div>
                    <h3 className="text-3xl font-black mb-6">Gotówka na start (Dotacje)</h3>
                    <p className="text-teal-100 mb-8 leading-relaxed text-sm">
                        Zanim zarejestrujesz firmę, sprawdź dostępne środki. <strong>Dotacja z urzędu pracy (pup)</strong> w 2026 roku może wynieść nawet 45 000 zł. To darmowy kapitał na sprzęt, którego nie musisz oddawać.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="text-teal-400 mt-1" size={18}/>
                            <p className="text-sm text-teal-100"><strong>Warunek:</strong> Musisz mieć status bezrobotnego przed złożeniem wniosku – nie zakładaj firmy za wcześnie!</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="text-teal-400 mt-1" size={18}/>
                            <p className="text-sm text-teal-100"><strong>Przeznaczenie:</strong> Zakup laptopa, oprogramowania, mebli biurowych czy marketing.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="text-teal-400 mt-1" size={18}/>
                            <p className="text-sm text-teal-100"><strong>Bezzwrotność:</strong> Pieniądze są Twoje, jeśli utrzymasz działalność przez min. 12 miesięcy.</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-sm shadow-2xl">
                    <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs opacity-70">Planowana ścieżka b2b 2026:</h4>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">1</div>
                            <span className="text-sm font-medium">Zbadaj rynek i znajdź pierwszego klienta</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">2</div>
                            <span className="text-sm font-medium">Złóż wniosek o dotację w pup (przed wpisem do ceidg)</span>
                        </div>
                        <div className="flex items-center gap-4 group text-teal-300">
                            <div className="w-8 h-8 bg-teal-800 rounded-lg flex items-center justify-center font-bold group-hover:scale-110 transition-transform text-white">3</div>
                            <span className="text-sm font-bold">Wystaw pierwszą fakturę i zacznij zarabiać 🚀</span>
                        </div>
                    </div>
                </div>
            </div>
            <Key size={200} className="absolute -bottom-20 -right-20 opacity-5 text-white -rotate-45" />
        </div>
        {/* SAMOCHÓD W KOSZTACH FIRMY */}
        <div id="b2b-samochod" className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm text-left">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <Car size={24}/>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Samochód w kosztach: limity 150 tys. i 225 tys. zł</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        Samochód to najpopularniejsza metoda optymalizacji w b2b. Musisz jednak znać "szklany sufit" amortyzacji. Jeśli kupujesz auto spalinowe droższe niż <strong>150 000 zł</strong>, raty i odpisy zaliczysz w koszty tylko proporcjonalnie.
                    </p>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-widest">Limity amortyzacji 2026:</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-xs text-slate-500 italic">Auto spalinowe i hybryda</span>
                                <span className="font-bold text-slate-900 text-sm">150 000 zł</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-xs text-slate-500 italic">Auto elektryczne (beV)</span>
                                <span className="font-bold text-teal-600 text-sm">225 000 zł</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed italic">
                            Wszystko powyżej tych kwot płacisz z zysku "po opodatkowaniu". Dlatego przy drogich autach ryczałt często staje się bardziej opłacalny niż liniowy.
                        </p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="p-6 bg-teal-50 rounded-3xl border border-teal-100">
                        <h4 className="font-bold text-teal-900 mb-2 flex items-center gap-2 text-sm"><TrendingDown size={18}/> Odliczenie paliwa i serwisu</h4>
                        <p className="text-xs text-teal-800 leading-relaxed">
                            Jeśli używasz auta w trybie mieszanym (firma + dom), odliczasz <strong>75% wydatków</strong> na paliwo i naprawy od dochodu oraz 50% podatku vat. To najbezpieczniejsza forma rozliczenia, która nie wymaga prowadzenia kilometrówki.
                        </p>
                    </div>
                    <Link to="/leasing" className="group block p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden transition-all hover:bg-slate-800">
                        <div className="relative z-10">
                            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1 block">Narzędzie</span>
                            <h4 className="text-lg font-black mb-2">Kalkulator leasingu operacyjnego</h4>
                            <p className="text-xs text-slate-400 mb-4">Sprawdź, jak rata za auto wpłynie na Twój podatek b2b.</p>
                            <span className="inline-flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-xl group-hover:bg-white/20 transition-all">Otwórz symulator <ArrowRight size={14}/></span>
                        </div>
                        <Car size={120} className="absolute -bottom-6 -right-6 opacity-5 rotate-12" />
                    </Link>
                </div>
            </div>
        </div>

        {/* DYSCYPLINA I BEZPIECZEŃSTWO FINANSOWE */}
        <div id="b2b-bezpieczenstwo" className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center font-bold text-xl border border-white/20 shadow-sm">
                        <Lock size={24}/>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Dyscyplina finansowa: terminy i płatności</h3>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 text-left">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-teal-500/50 transition-colors">
                        <h4 className="font-bold text-teal-400 mb-3 flex items-center gap-2 text-sm"><BadgeCheck size={18}/> Zasada 20-go dnia</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            To najważniejsza data w kalendarzu b2b. Do <strong>20-go dnia każdego miesiąca</strong> musisz opłacić podatek dochodowy (pit) oraz składki zus za miesiąc poprzedni. Spóźnienie może skutkować naliczeniem odsetek, a w skrajnych przypadkach – utratą prawa do niektórych ulg.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-colors">
                        <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2 text-sm"><ShieldCheck size={18}/> Klauzule inflacyjne</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            W 2026 roku inflacja wciąż jest istotnym czynnikiem. Jako ekspert b2b, zawsze negocjuj <strong>zapis o waloryzacji stawki</strong> w swoim kontrakcie. Pozwala to na automatyczne podniesienie wynagrodzenia o wskaźnik gus bez konieczności renegocjowania całej umowy.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-orange-500/50 transition-colors">
                        <h4 className="font-bold text-orange-400 mb-3 flex items-center gap-2 text-sm"><Repeat size={18}/> Zawieszenie firmy</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            Planujesz dłuższy urlop lub przerwę w zleceniach? Możesz <strong>zawiesić działalność gospodarczą</strong> na dowolny czas (min. 30 dni). W tym okresie nie płacisz składek społecznych zus ani podatków dochodowych. To jedyny legalny sposób na "wakacje od zus".
                        </p>
                    </div>
                </div>

                <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/5 text-center flex flex-col md:flex-row items-center justify-center gap-6">
                    <p className="text-xs text-slate-400 max-w-lg italic font-medium">
                        Wskazówka: Załóż osobne subkonto techniczne na podatki. Przelewaj tam od razu 20-30% z każdej opłaconej faktury. Dzięki temu nigdy nie zabraknie Ci gotówki na przelewy do urzędu i zus.
                    </p>
                    <div className="flex gap-4">
                         <Link to="/konta-osobiste" className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-teal-500 transition-all shadow-lg">Wybierz konto firmowe</Link>
                    </div>
                </div>
            </div>
            <FileText size={200} className="absolute -bottom-20 -left-20 opacity-5 text-white -rotate-12" />
        </div>


                </div>
            </div>
        </>
    );
};