import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Calculator, Home, TrendingUp, TrendingDown, DollarSign,
  AlertTriangle, CheckCircle, HelpCircle, Info, Calendar,
  PieChart, ArrowRight, ShieldCheck, XCircle, FileText, CreditCard,
  Briefcase, Lock, Percent, Search, BarChart3, Activity, FileCheck, Coins
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line
} from 'recharts';

// --- DANE DO WYKRESU WIBOR (MOCK HISTORYCZNY) ---
const WIBOR_HISTORY = [
    { date: '2020', wibor: 0.21, desc: 'Pandemia' },
    { date: '2021', wibor: 2.50, desc: 'Inflacja' },
    { date: '2022', wibor: 6.80, desc: 'Szczyt' },
    { date: '2023', wibor: 6.90, desc: 'Płaskowyż' },
    { date: '2024', wibor: 5.85, desc: 'Obecnie' },
];

// Pomocnicza funkcja formatowania waluty
const formatMoney = (amount) => {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(amount);
};

// Komponent InputGroup
const InputGroup = ({ label, value, onChange, type = "number", suffix, step = "1", min, tooltip }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
      {label}
      {tooltip && (
        <div className="group relative">
          <Info size={14} className="cursor-help hover:text-indigo-500 transition-colors" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 normal-case font-normal">
            {tooltip}
          </div>
        </div>
      )}
    </label>
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        min={min}
        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-semibold rounded-xl p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium select-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

export const MortgageView = () => {
  // --- STATE ---
  const [amount, setAmount] = useState(400000);
  const [years, setYears] = useState(25);
  const [months, setMonths] = useState(0);
  const [rate, setRate] = useState(7.5);
  const [type, setType] = useState('equal');
  const [overpaymentType, setOverpaymentType] = useState('monthly');
  const [overpaymentAmount, setOverpaymentAmount] = useState(1000);
  const [startMonth, setStartMonth] = useState(1);
  const [strategy, setStrategy] = useState('period');
  const [commission, setCommission] = useState(0);
  const [commissionYears, setCommissionYears] = useState(3);
  const [annexCost, setAnnexCost] = useState(0);
  const [wiborChange, setWiborChange] = useState(0);
  const [holidays, setHolidays] = useState(false);

  // --- LOGIKA ---
  const calculation = useMemo(() => {
    const totalMonths = parseInt(years) * 12 + parseInt(months);
    const monthlyRate = (parseFloat(rate) + parseFloat(wiborChange)) / 100 / 12;
    let balanceStandard = parseFloat(amount);
    let balanceOverpaid = parseFloat(amount);
    
    const data = [];
    let totalInterestStandard = 0;
    let totalInterestOverpaid = 0;
    let monthsSaved = 0;
    let commissionPaid = 0;

    const baseInstallment = (balanceStandard * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));

    for (let m = 1; m <= totalMonths + 60; m++) { 
        // Standardowy
        let interestStd = balanceStandard * monthlyRate;
        let capitalStd = 0;
        if (balanceStandard > 0) {
            if (type === 'equal') capitalStd = baseInstallment - interestStd;
            else capitalStd = parseFloat(amount) / totalMonths;
            if (capitalStd > balanceStandard) capitalStd = balanceStandard;
            balanceStandard -= capitalStd;
            totalInterestStandard += interestStd;
        }

        // Nadpłacany
        let interestOp = balanceOverpaid * monthlyRate;
        let installmentOp = 0;
        let capitalOp = 0;
        let extraPayment = 0;

        if (balanceOverpaid > 0) {
            const isHoliday = holidays && (m % 3 === 0) && (m <= 24); 
            if (!isHoliday) {
                if (strategy === 'period') {
                    if (type === 'equal') installmentOp = baseInstallment;
                    else installmentOp = (parseFloat(amount) / totalMonths) + interestOp;
                } else {
                    const remainingMonths = Math.max(1, totalMonths - m + 1);
                    if (type === 'equal') installmentOp = (balanceOverpaid * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -remainingMonths));
                    else installmentOp = (balanceOverpaid / remainingMonths) + interestOp;
                }
                capitalOp = installmentOp - interestOp;
            } else {
                interestOp = 0; capitalOp = 0;
            }

            if (m >= startMonth) {
                if (overpaymentType === 'one_time' && m === parseInt(startMonth)) extraPayment = parseFloat(overpaymentAmount);
                if (overpaymentType === 'monthly') extraPayment = parseFloat(overpaymentAmount);
                if (overpaymentType === 'yearly' && (m - parseInt(startMonth)) % 12 === 0) extraPayment = parseFloat(overpaymentAmount);
            }

            if (extraPayment > 0 && m <= (commissionYears * 12)) commissionPaid += extraPayment * (commission / 100);

            let totalCapitalPaid = capitalOp + extraPayment;
            if (totalCapitalPaid > balanceOverpaid) {
                totalCapitalPaid = balanceOverpaid;
                extraPayment = balanceOverpaid - capitalOp;
            }
            balanceOverpaid -= totalCapitalPaid;
            totalInterestOverpaid += interestOp;
        } else {
            if (monthsSaved === 0) monthsSaved = totalMonths - m + 1;
        }

        if (m <= totalMonths || balanceOverpaid > 0) {
            data.push({
                month: m,
                year: (m / 12).toFixed(1),
                balanceStd: Math.max(0, balanceStandard),
                balanceOp: Math.max(0, balanceOverpaid)
            });
        }
        if (balanceStandard <= 0 && balanceOverpaid <= 0) break;
    }

    const interestSaved = totalInterestStandard - totalInterestOverpaid;
    const totalCost = commissionPaid + parseFloat(annexCost);
    const realProfit = interestSaved - totalCost;

    return {
        data, totalInterestStandard, totalInterestOverpaid, interestSaved, monthsSaved, commissionPaid, realProfit,
        yearsSaved: Math.floor(monthsSaved / 12), monthsSavedRem: monthsSaved % 12, totalInterestOverpaidRaw: totalInterestOverpaid
    };
  }, [amount, years, months, rate, type, overpaymentType, overpaymentAmount, startMonth, strategy, commission, commissionYears, annexCost, wiborChange, holidays]);

  return (
    <>
      <Helmet>
        <title>Kalkulator Nadpłaty Kredytu Hipotecznego 2025 | Finanse Proste</title>
        <script type="application/ld+json">
{`
  {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Kalkulator Nadpłaty Kredytu Hipotecznego",
    "description": "Oblicz ile zaoszczędzisz na odsetkach nadpłacając kredyt hipoteczny. Symulacja skrócenia okresu kredytowania lub zmniejszenia raty.",
    "brand": {
      "@type": "Brand",
      "name": "Finanse Proste"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PLN"
    },
    "featureList": "Harmonogram spłat, symulacja nadpłaty, koszty prowizji, wakacje kredytowe"
  }
`}
</script>
        <meta name="description" content="Czy warto nadpłacać kredyt? Sprawdź ile zaoszczędzisz. Dowiedz się jak wykreślić hipotekę i czym jest WIBOR." />
      </Helmet>

      <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">
        
        {/* NAGŁÓWEK */}
        <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                <Home className="text-indigo-600" size={36}/>
                Kalkulator Nadpłaty Kredytu
            </h2>
            <p className="text-slate-600 max-w-3xl text-lg">
                Sprawdź, ile tysięcy złotych zaoszczędzisz nadpłacając kredyt. Porównaj strategię "niższa rata" kontra "krótszy okres".
            </p>
        </div>

        {/* KALKULATOR - GRID */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
            {/* LEWA KOLUMNA - INPUTY */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calculator size={18}/> Twój Kredyt</h3>
                    <div className="space-y-4">
                        <InputGroup label="Pozostało do spłaty" value={amount} onChange={setAmount} suffix="PLN" step="1000" tooltip="Tylko kapitał, bez odsetek." />
                        <InputGroup label="Oprocentowanie" value={rate} onChange={setRate} suffix="%" step="0.1" />
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Lata" value={years} onChange={setYears} suffix="lat" />
                            <InputGroup label="Miesiące" value={months} onChange={setMonths} suffix="msc" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Rodzaj rat</label>
                            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                <button onClick={() => setType('equal')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'equal' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Równe</button>
                                <button onClick={() => setType('decreasing')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'decreasing' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Malejące</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2"><TrendingDown size={18}/> Plan Nadpłaty</h3>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1">Częstotliwość</label>
                            <select value={overpaymentType} onChange={(e) => setOverpaymentType(e.target.value)} className="w-full bg-white border border-indigo-200 text-indigo-900 font-bold rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="monthly">Co miesiąc</option>
                                <option value="one_time">Jednorazowo</option>
                                <option value="yearly">Raz w roku</option>
                            </select>
                        </div>
                        <InputGroup label="Kwota nadpłaty" value={overpaymentAmount} onChange={setOverpaymentAmount} suffix="PLN" step="100" />
                        <InputGroup label="Start od miesiąca" value={startMonth} onChange={setStartMonth} suffix="msc" min="1" />
                        
                        <div className="pt-4 border-t border-indigo-200/50">
                            <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider ml-1 mb-2 block">Co robimy z ratą?</label>
                            <div className="flex flex-col gap-2">
                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${strategy === 'period' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-indigo-900 border-indigo-200'}`}>
                                    <input type="radio" name="strat" checked={strategy === 'period'} onChange={() => setStrategy('period')} className="hidden"/>
                                    <TrendingDown size={18}/>
                                    <span className="font-bold text-sm">Skracam okres (Zysk Max)</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${strategy === 'installment' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-indigo-900 border-indigo-200'}`}>
                                    <input type="radio" name="strat" checked={strategy === 'installment'} onChange={() => setStrategy('installment')} className="hidden"/>
                                    <DollarSign size={18}/>
                                    <span className="font-bold text-sm">Zmniejszam ratę (Luz)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><AlertTriangle size={16}/> Koszty i Opcje</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Prowizja banku" value={commission} onChange={setCommission} suffix="%" step="0.5" tooltip="Często 0% po 3 latach."/>
                            <InputGroup label="Przez ile lat?" value={commissionYears} onChange={setCommissionYears} suffix="lat" />
                        </div>
                        <InputGroup label="Koszt aneksu" value={annexCost} onChange={setAnnexCost} suffix="PLN" step="50" tooltip="Opłata za zmianę harmonogramu."/>
                        
                        <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                            <input type="checkbox" checked={holidays} onChange={(e) => setHolidays(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                            <span className="text-sm font-bold text-slate-700">Wakacje Kredytowe?</span>
                        </label>
                        
                        <div className="pt-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block">Symulacja WIBOR (+/-)</label>
                            <input type="range" min="-5" max="5" step="0.25" value={wiborChange} onChange={(e) => setWiborChange(e.target.value)} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                            <div className="text-center text-sm font-bold text-indigo-600 mt-1">{wiborChange > 0 ? '+' : ''}{wiborChange}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRAWA KOLUMNA - WYNIKI */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={150} /></div>
                    <div className="relative z-10">
                        <div className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-2">Twój Zysk z nadpłaty (Netto)</div>
                        <div className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                            {formatMoney(calculation.realProfit)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/20">
                            <div>
                                <div className="text-xs text-indigo-200 mb-1">Oszczędzone odsetki</div>
                                <div className="text-xl font-bold">{formatMoney(calculation.interestSaved)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-indigo-200 mb-1">Krótszy okres o</div>
                                <div className="text-xl font-bold">{calculation.yearsSaved} lat {calculation.monthsSavedRem} msc</div>
                            </div>
                            <div>
                                <div className="text-xs text-indigo-200 mb-1">Zapłacona prowizja</div>
                                <div className="text-xl font-bold text-red-300">-{formatMoney(calculation.commissionPaid)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-indigo-200 mb-1">Całkowity koszt</div>
                                <div className="text-xl font-bold">{formatMoney(calculation.totalInterestOverpaid + parseFloat(amount))}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-[400px]">
                    <h3 className="font-bold text-slate-800 mb-6 text-center">Malejące Saldo Kredytu</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={calculation.data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorStd" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorOp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.5}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" fontSize={12} tickFormatter={(val) => `${val} lat`} tickMargin={10}/>
                            <YAxis fontSize={12} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} width={40}/>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                            <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} formatter={(val) => formatMoney(val)}/>
                            <Legend verticalAlign="top" height={36}/>
                            <Area type="monotone" dataKey="balanceStd" name="Standardowo" stroke="#94a3b8" fill="url(#colorStd)" strokeWidth={2}/>
                            <Area type="monotone" dataKey="balanceOp" name="Z nadpłatą" stroke="#4f46e5" fill="url(#colorOp)" strokeWidth={3}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6 text-center">Porównanie kosztów odsetkowych</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                                <span>Bez nadpłaty</span>
                                <span>{formatMoney(calculation.totalInterestStandard)}</span>
                            </div>
                            <div className="h-6 bg-slate-100 rounded-full w-full overflow-hidden">
                                <div className="h-full bg-slate-400 w-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-bold text-indigo-600 mb-2">
                                <span>Z nadpłatą</span>
                                <span>{formatMoney(calculation.totalInterestOverpaid)}</span>
                            </div>
                            <div className="h-6 bg-slate-100 rounded-full w-full overflow-hidden relative">
                                <div 
                                    className="h-full bg-indigo-600 absolute left-0 top-0 transition-all duration-500" 
                                    style={{width: `${(calculation.totalInterestOverpaidRaw / calculation.totalInterestStandard) * 100}%`}}
                                ></div>
                            </div>
                            <p className="text-right text-xs text-green-600 font-bold mt-2">
                                Płacisz o {Math.round((1 - calculation.totalInterestOverpaidRaw / calculation.totalInterestStandard) * 100)}% mniej odsetek!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CZĘŚĆ 2: STREFA EDUKACYJNA (LIGHT MODE) --- */}
        <div className="space-y-16">
            
            {/* HERO KOMPENDIUM - LIGHT MODE */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden border border-slate-100 shadow-sm">
                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-100">
                            <ShieldCheck size={14}/> Kompendium Kredytobiorcy
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">
                            Kredyt to nie tylko <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Rata</span>
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">
                            Banki to mistrzowie sprzedaży wiązanej (cross-sell). Zobacz, co tak naprawdę podpisujesz, jakie ubezpieczenia są obowiązkowe, a które to tylko "ukryta marża".
                        </p>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-sm font-bold bg-slate-50 px-4 py-2 rounded-xl text-slate-700">
                                <Lock size={16} className="text-indigo-500"/> LTV
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold bg-slate-50 px-4 py-2 rounded-xl text-slate-700">
                                <Percent size={16} className="text-indigo-500"/> RRSO
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold bg-slate-50 px-4 py-2 rounded-xl text-slate-700">
                                <FileText size={16} className="text-indigo-500"/> WIBOR
                            </div>
                        </div>
                    </div>
                    <div className="relative flex justify-center">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 relative shadow-2xl">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-slate-900"><AlertTriangle className="text-yellow-500"/> Pułapka Cross-sell</h3>
                            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                                Bank: <i>"Obniżymy marżę o 0.5%, jeśli weźmiesz naszą kartę kredytową i ubezpieczenie na życie."</i>
                            </p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                                <strong className="block text-green-600 mb-1">Zysk z niższej raty: +40 zł/msc</strong>
                                <strong className="block text-red-500">Koszt ubezpieczenia: -150 zł/msc</strong>
                                <div className="mt-2 pt-2 border-t border-slate-200 text-slate-500">
                                    Bilans: Jesteś 110 zł na minusie, mimo "promocji". Zawsze licz całkowity koszt!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEKCJA PRODUKTÓW DODATKOWYCH (PRZENIESIONA WYŻEJ) */}
            <div className="mb-20">
                <h3 className="text-3xl font-bold mb-10 text-center text-slate-900">Co bank dorzuca do kredytu?</h3>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* UBEZPIECZENIE NA ŻYCIE */}
                    <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-50 shadow-xl shadow-indigo-50/50 relative overflow-hidden group hover:-translate-y-2 transition-transform">
                        <div className="absolute top-0 right-0 p-6 opacity-5"><ShieldCheck size={80} className="text-indigo-500"/></div>
                        <h4 className="text-xl font-black text-indigo-600 mb-2">Ubezpieczenie na Życie</h4>
                        <div className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded mb-6 border border-indigo-100">CZĘSTO WYMAGANE</div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            Zabezpiecza bank (i Twoją rodzinę) na wypadek Twojej śmierci. Jeśli umrzesz, ubezpieczyciel spłaca kredyt.
                        </p>
                        <ul className="text-sm space-y-2 text-slate-700">
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0"/> <strong>Cesja:</strong> Pieniądze idą prosto do banku.</li>
                            <li className="flex gap-2"><AlertTriangle size={16} className="text-orange-500 shrink-0"/> <strong>Haczyk:</strong> Bankowe polisy są drogie. Lepiej kupić własną na rynku.</li>
                        </ul>
                    </div>

                    {/* NIERUCHOMOŚĆ */}
                    <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl shadow-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-transform">
                        <div className="absolute top-0 right-0 p-6 opacity-5"><Home size={80} className="text-slate-500"/></div>
                        <h4 className="text-xl font-black text-slate-800 mb-2">Ubezpieczenie Murów</h4>
                        <div className="inline-block bg-red-50 text-red-700 text-[10px] font-bold px-2 py-1 rounded mb-6 border border-red-100">OBOWIĄZKOWE</div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            Chroni zabezpieczenie kredytu (mieszkanie) przed ogniem, zalaniem itp. Bez tego bank nie wypłaci kredytu.
                        </p>
                        <ul className="text-sm space-y-2 text-slate-700">
                            <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0"/> <strong>Wymóg:</strong> Ubezpieczenie tylko murów (pod cesję).</li>
                            <li className="flex gap-2"><Info size={16} className="text-blue-500 shrink-0"/> <strong>Rada:</strong> Ubezpiecz też wyposażenie i OC.</li>
                        </ul>
                    </div>

                    {/* PRODUKTY BANKOWE */}
                    <div className="bg-white p-8 rounded-[2rem] border-2 border-purple-50 shadow-xl shadow-purple-50/50 relative overflow-hidden group hover:-translate-y-2 transition-transform">
                        <div className="absolute top-0 right-0 p-6 opacity-5"><CreditCard size={80} className="text-purple-500"/></div>
                        <h4 className="text-xl font-black text-purple-600 mb-2">Karta i Konto</h4>
                        <div className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded mb-6 border border-purple-100">WARUNEK PROMOCJI</div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            Aby utrzymać niższą marżę, bank zmusi Cię do aktywnego korzystania z konta i karty kredytowej przez min. 3-5 lat.
                        </p>
                        <ul className="text-sm space-y-2 text-slate-700">
                            <li className="flex gap-2"><Briefcase size={16} className="text-purple-500 shrink-0"/> <strong>Wpływy:</strong> Wymóg przelewania wynagrodzenia.</li>
                            <li className="flex gap-2"><CreditCard size={16} className="text-purple-500 shrink-0"/> <strong>Obrót:</strong> Np. wydaj 500 zł/msc kartą.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* SEKCJA: WIBOR i STOPY PROCENTOWE (LIGHT MODE) */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-sm">
                <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-8 flex items-center gap-3 text-slate-900">
                        <Activity className="text-pink-500"/> Serce Kredytu: WIBOR
                    </h3>
                    
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Wykres historyczny - Light Mode */}
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 h-[350px]">
                            <h4 className="text-sm font-bold text-slate-500 mb-4 text-center">Historia WIBOR 3M (2020-2024)</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={WIBOR_HISTORY} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorWibor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" tick={{fill: '#64748b', fontSize: 10}} tickMargin={10} axisLine={false} tickLine={false}/>
                                    <YAxis tick={{fill: '#64748b', fontSize: 10}} tickFormatter={(val) => `${val}%`} axisLine={false} tickLine={false}/>
                                    <RechartsTooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b'}} formatter={(val) => [`${val}%`, 'Stawka']}/>
                                    <Area type="monotone" dataKey="wibor" stroke="#ec4899" strokeWidth={3} fill="url(#colorWibor)" />
                                </AreaChart>
                            </ResponsiveContainer>
                            <p className="text-xs text-slate-400 text-center mt-2 italic">*Dane poglądowe WIBOR 3M</p>
                        </div>

                        {/* Opis WIBOR */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xl font-bold text-indigo-700 mb-2">Co to jest WIBOR?</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    WIBOR (Warsaw Interbank Offered Rate) to stawka, po jakiej banki pożyczają sobie pieniądze nawzajem. To <strong>zmienna część</strong> Twojego oprocentowania.
                                    <br/><br/>
                                    <strong>Twój % = Marża Banku (Stała, np. 2%) + WIBOR (Zmienny)</strong>
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <strong className="block text-slate-800 mb-1">WIBOR 3M</strong>
                                    <span className="text-xs text-slate-500">Aktualizowany co 3 miesiące. Rata zmienia się rzadziej, ale skoki mogą być większe.</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <strong className="block text-slate-800 mb-1">WIBOR 6M</strong>
                                    <span className="text-xs text-slate-500">Aktualizowany co pół roku. Przez 6 miesięcy masz spokój, nawet jak stopy rosną.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STAŁA VS ZMIENNA - PORÓWNANIE (Light Mode) */}
                    <div className="mt-16">
                        <h4 className="text-2xl font-bold mb-6 text-center text-slate-900">Wielki dylemat: Stopa Stała czy Zmienna?</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Zmienna */}
                            <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-50 hover:border-indigo-200 transition-colors shadow-sm">
                                <div className="flex items-center gap-3 mb-4 text-indigo-600">
                                    <Activity size={28}/>
                                    <h5 className="text-xl font-bold">Stopa Zmienna</h5>
                                </div>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0"/> Zazwyczaj tańsza na start (niższy %)</li>
                                    <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0"/> Jeśli stopy spadną, Twoja rata spadnie</li>
                                    <li className="flex gap-2"><XCircle size={16} className="text-red-500 shrink-0"/> <strong>Ryzyko:</strong> Jeśli inflacja wróci, rata może drastycznie wzrosnąć</li>
                                    <li className="flex gap-2"><XCircle size={16} className="text-red-500 shrink-0"/> Niepewność budżetowa</li>
                                </ul>
                            </div>

                            {/* Stała */}
                            <div className="bg-white p-8 rounded-[2rem] border-2 border-pink-50 hover:border-pink-200 transition-colors shadow-sm">
                                <div className="flex items-center gap-3 mb-4 text-pink-500">
                                    <Lock size={28}/>
                                    <h5 className="text-xl font-bold">Stopa Stała (na 5-10 lat)</h5>
                                </div>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0"/> <strong>Bezpieczeństwo:</strong> Wiesz dokładnie ile zapłacisz przez 5 lat</li>
                                    <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0"/> Chroni przed wzrostem inflacji i WIBOR</li>
                                    <li className="flex gap-2"><XCircle size={16} className="text-red-500 shrink-0"/> Zazwyczaj droższa na start (bank dolicza premię za ryzyko)</li>
                                    <li className="flex gap-2"><XCircle size={16} className="text-red-500 shrink-0"/> Jeśli stopy spadną, "przepłacasz" ratę</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NOWA SEKCJA: KROK PO KROKU & WYKREŚLENIE HIPOTEKI (SEO BOOST) */}
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                        <FileCheck className="text-blue-600"/> Krok po kroku: Jak nadpłacić?
                    </h3>
                    <ol className="relative border-l border-slate-200 space-y-8 ml-3">
                        <li className="mb-10 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white">
                                <span className="text-blue-600 font-bold text-xs">1</span>
                            </span>
                            <h4 className="flex items-center mb-1 text-sm font-semibold text-slate-900">Zaloguj się do bankowości</h4>
                            <p className="mb-4 text-xs text-slate-500">Większość banków (mBank, PKO, ING) ma przycisk "Nadpłać kredyt" w szczegółach hipoteki. Nie musisz iść do oddziału.</p>
                        </li>
                        <li className="mb-10 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white">
                                <span className="text-blue-600 font-bold text-xs">2</span>
                            </span>
                            <h4 className="mb-1 text-sm font-semibold text-slate-900">Wybierz rodzaj nadpłaty</h4>
                            <p className="text-xs text-slate-500">Zaznacz "Skrócenie okresu kredytowania" (jeśli chcesz oszczędzić max odsetek) lub "Zmniejszenie raty". Potwierdź przelew.</p>
                        </li>
                        <li className="ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white">
                                <span className="text-blue-600 font-bold text-xs">3</span>
                            </span>
                            <h4 className="mb-1 text-sm font-semibold text-slate-900">Pobierz nowy harmonogram</h4>
                            <p className="text-xs text-slate-500">Bank wygeneruje go automatycznie w PDF. Sprawdź, czy kapitał zmalał.</p>
                        </li>
                    </ol>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                        <Home className="text-green-600"/> Koniec kredytu? Wykreśl hipotekę!
                    </h3>
                    <p className="text-sm text-slate-600 mb-6">
                        Po spłacie ostatniej złotówki, bank sam nie wyczyści Księgi Wieczystej (KW). Musisz to zrobić Ty.
                    </p>
                    <div className="space-y-4">
                        <div className="flex gap-3 bg-slate-50 p-4 rounded-xl">
                            <FileText className="text-slate-400 shrink-0" size={20}/>
                            <div>
                                <strong className="block text-slate-800 text-sm">1. List Mazalny (Kwit)</strong>
                                <span className="text-xs text-slate-500">Pobierz z banku zaświadczenie o całkowitej spłacie kredytu i zgodę na wykreślenie hipoteki.</span>
                            </div>
                        </div>
                        <div className="flex gap-3 bg-slate-50 p-4 rounded-xl">
                            <ShieldCheck className="text-slate-400 shrink-0" size={20}/>
                            <div>
                                <strong className="block text-slate-800 text-sm">2. Wniosek do Sądu</strong>
                                <span className="text-xs text-slate-500">Wypełnij formularz KW-WPIS. Wpisz w nim żądanie wykreślenia hipoteki z Działu IV.</span>
                            </div>
                        </div>
                        <div className="flex gap-3 bg-slate-50 p-4 rounded-xl">
                            <Coins className="text-slate-400 shrink-0" size={20}/>
                            <div>
                                <strong className="block text-slate-800 text-sm">3. Opłata 100 zł</strong>
                                <span className="text-xs text-slate-500">Tyle kosztuje opłata sądowa. Wyślij przelew do sądu rejonowego właściwego dla nieruchomości.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SŁOWNIK POJĘĆ TRUDNYCH (LIGHT) */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-900"><Search className="text-slate-400"/> Słownik "Bankowy na Ludzki"</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-2">LTV (Loan to Value)</h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Stosunek kredytu do wartości mieszkania. Jeśli masz 10% wkładu własnego, LTV wynosi 90%.<br/>
                            <span className="text-xs font-bold text-orange-600">Uwaga:</span> Jeśli LTV &gt; 80%, bank może doliczyć "Ubezpieczenie Niskiego Wkładu" (podwyższona marża, dopóki nie spłacisz kapitału do poziomu 80% wartości).
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-2">RRSO (Rzeczywista Roczna Stopa Oprocentowania)</h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            To całkowity koszt kredytu wyrażony w procentach. Uwzględnia nie tylko odsetki, ale też prowizje, ubezpieczenia i koszty dodatkowe. <strong>Zawsze porównuj oferty po RRSO, a nie po oprocentowaniu nominalnym!</strong>
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-2">Prowizja za Wcześniejszą Spłatę</h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Kara za to, że oddajesz pieniądze szybciej (bank traci odsetki).<br/>
                            <strong>Dobra wiadomość:</strong> Ustawa ogranicza tę prowizję do max 3% i pozwala ją pobierać tylko przez pierwsze 3 lata kredytu. Potem spłata musi być darmowa.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-2">Karencja</h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Okres (zazwyczaj przy budowie domu), kiedy płacisz same odsetki, a kapitał nie maleje. Unikaj tego, jeśli możesz – to najdroższy czas kredytu.
                        </p>
                    </div>
                </div>
            </div>

            {/* NADPŁATA INFO (LIGHT) */}
            <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 md:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900">Strategia: Niższa rata czy Krótszy okres?</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Matematyka mówi jasno: <strong>Skrócenie okresu</strong> daje gigantyczne oszczędności (nawet kilkaset tysięcy złotych). Ale życie to nie excel.
                        </p>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="bg-green-100 p-3 rounded-xl h-fit text-green-700"><TrendingDown size={24}/></div>
                                <div>
                                    <strong className="block text-slate-900 mb-1">Wybierz skrócenie okresu, gdy:</strong>
                                    <span className="text-sm text-slate-600">Chcesz zapłacić bankowi jak najmniej odsetek i masz stabilną, wysoką sytuację finansową.</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-blue-100 p-3 rounded-xl h-fit text-blue-700"><DollarSign size={24}/></div>
                                <div>
                                    <strong className="block text-slate-900 mb-1">Wybierz niższą ratę, gdy:</strong>
                                    <span className="text-sm text-slate-600">Boisz się o utratę pracy, planujesz dzieci lub chcesz zwiększyć zdolność kredytową na inny cel. To opcja bezpieczniejsza.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4">Nadpłata a Wakacje Kredytowe</h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            To "złoty strzał" dla kredytobiorców. Wakacje kredytowe pozwalają zawiesić płatność raty.
                        </p>
                        <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm border border-green-100">
                            <strong>Tip:</strong> Zamiast wydać te pieniądze na konsumpcję, wpłać je jako nadpłatę. W czasie wakacji odsetki nie są naliczane, więc <strong>100% tej kwoty obniża Twój kapitał</strong>.
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="mb-20">
                <h3 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2 text-slate-900"><HelpCircle className="text-slate-400"/> FAQ - Szybkie odpowiedzi</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                        <h4 className="font-bold text-slate-900 text-sm mb-2">Czy muszę iść do oddziału, żeby nadpłacić?</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">Większość nowoczesnych banków (mBank, ING, PKO BP, Millennium) pozwala to zrobić jednym kliknięciem w aplikacji. W starszych umowach lub bankach spółdzielczych może być konieczna wizyta i aneks.</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                        <h4 className="font-bold text-slate-900 text-sm mb-2">Czy Urząd skarbowy widzi nadpłatę?</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">Nadpłata jest neutralna podatkowo. Ale jeśli wpłacisz gotówką 50 000 zł "z skarpety", bank ma obowiązek zaraportować transakcję powyżej 15 tys. EUR do GIIF (przeciwdziałanie praniu pieniędzy).</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                        <h4 className="font-bold text-slate-900 text-sm mb-2">Co z hipoteką po spłacie?</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">Sama nie zniknie. Dostaniesz z banku "list mazalny" (zgodę na wykreślenie). Musisz złożyć wniosek w sądzie o wykreślenie hipoteki z Księgi Wieczystej (koszt: 100 zł).</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                        <h4 className="font-bold text-slate-900 text-sm mb-2">Czy ubezpieczenie pomostowe wraca?</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">Tak! To podwyższona marża płacona do momentu wpisu hipoteki do księgi. Po wpisie bank powinien zwrócić Ci nadpłaconą kwotę lub zaliczyć na poczet rat (zależnie od daty umowy).</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </>
  );
};