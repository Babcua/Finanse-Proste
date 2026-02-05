import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Dodano useNavigate
import { Helmet } from 'react-helmet-async';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell // Dodano komponenty BarChart
} from 'recharts';
import {
  Building2, Key, Calculator, Scale, Info, Home, Banknote, CalendarClock, 
  BookOpen, Percent, Landmark, ArrowRight, ShieldCheck, Activity, ArrowDown, 
  PiggyBank, TrendingUp, TrendingDown, PieChart, ArrowRightLeft, ShieldAlert,
  Zap, Clock, Target, ListTree, Gavel, FileCheck, Search, Compass, Heart,
  Receipt, History, MinusCircle, Coins, MousePointer2, Sparkles, MapPin, Umbrella, CheckCircle, Briefcase
} from 'lucide-react';

const formatMoney = (val) => 
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

// POPRAWKA 1: Dodano klasy usuwające domyślne strzałki (spin-button) w inputach
const InputGroup = ({ label, value, onChange, suffix, step = 100, min = 0, description }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-baseline">
        <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
    </div>
    <div className="relative group">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        step={step}
        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-semibold rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium select-none pointer-events-none">{suffix}</span>
    </div>
    {description && (
        <p className="text-xs text-slate-500 leading-tight ml-1">{description}</p>
    )}
  </div>
);

export const RentVsBuyView = () => {
    const navigate = useNavigate();
    // Funkcja przewijania dla Spisu Treści
  const scrollToSection = (id) => {
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
  // --- STAN ---
  const [propertyPrice, setPropertyPrice] = useState(700000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(7.5);
  const [loanYears, setLoanYears] = useState(30);
  const [monthlyRent, setMonthlyRent] = useState(3500);
  const [rentIncrease, setRentIncrease] = useState(4.0); 
  const [investmentReturn, setInvestmentReturn] = useState(6.0); 
  const [propertyAppreciation, setPropertyAppreciation] = useState(4.0); 
  const [maintenanceCost, setMaintenanceCost] = useState(700); 

  // Funkcja przewijania do kompendium
  const scrollToKnowledge = () => {
    const element = document.getElementById('kompendium');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- OBLICZENIA ---
  const simulation = useMemo(() => {
    const data = [];
    const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPaymentAmount;
    
    const r = (mortgageRate / 100) / 12;
    const n = loanYears * 12;
    const monthlyMortgage = r > 0 
        ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        : loanAmount / n;

    let currentPropertyValue = propertyPrice;
    let currentLoanBalance = loanAmount;
    let currentRent = monthlyRent;
    
    const startCosts = downPaymentAmount + (propertyPrice * 0.02) + 4000;
    let renterPortfolio = startCosts; 

    for (let year = 1; year <= loanYears; year++) {
        let yearlyCostOwner = 0;
        let yearlyCostRenter = 0;

        for(let m=0; m<12; m++) {
            yearlyCostOwner += monthlyMortgage + maintenanceCost;
            
            const interestPart = currentLoanBalance * r;
            const capitalPart = monthlyMortgage - interestPart;
            currentLoanBalance -= capitalPart;
            if(currentLoanBalance < 0) currentLoanBalance = 0;

            yearlyCostRenter += currentRent;
        }

        const diff = yearlyCostOwner - yearlyCostRenter;
        
        renterPortfolio = renterPortfolio * (1 + investmentReturn/100);
        renterPortfolio += diff; 

        currentPropertyValue = currentPropertyValue * (1 + propertyAppreciation/100);
        currentRent = currentRent * (1 + rentIncrease/100);

        const ownerNetWorth = currentPropertyValue - currentLoanBalance;
        
        data.push({
            year: `Rok ${year}`,
            owner: Math.round(ownerNetWorth),
            renter: Math.round(renterPortfolio),
            loan: Math.round(currentLoanBalance),
            property: Math.round(currentPropertyValue)
        });
    }

    const winner = data[data.length-1].owner > data[data.length-1].renter ? 'owner' : 'renter';
    const difference = Math.abs(data[data.length-1].owner - data[data.length-1].renter);

    return { data, winner, difference, monthlyMortgage };
  }, [propertyPrice, downPaymentPercent, mortgageRate, loanYears, monthlyRent, rentIncrease, investmentReturn, propertyAppreciation, maintenanceCost]);

  return (
    <>
      <Helmet>
        <title>Wynajem czy kupno? Kalkulator opłacalności | Finanse Proste</title>
        <meta name="description" content="Sprawdź co się bardziej opłaca: kredyt hipoteczny czy wynajem i inwestowanie różnicy? Poznaj podatki, PCC i zasady rynku nieruchomości." />
        <link rel="canonical" href="https://www.finanse-proste.pl/wynajem-czy-kupno" />
      </Helmet>

      <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">
        
        {/* HERO */}
        <div className="text-center mb-12 mt-8">
           <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200">
              <Scale size={14}/> Decyzja życia
           </div>
           <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900">
              Wynajem czy <span className="text-indigo-600">kupno</span>?
           </h2>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Matematyczne porównanie dwóch dróg życiowych. Sprawdź, czy lepiej "płacić na swoje", czy wynajmować mieszkanie i inwestować nadwyżki finansowe na giełdzie.
           </p>
        </div>

{/* --- SPIS TREŚCI: BIBLIA NAJMU I ZAKUPU 2026 --- */}
        <div className="mb-16 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex flex-wrap justify-center gap-2 md:gap-3">
          <div className="w-full text-center mb-4">
            <ListTree size={16} className="inline-block mr-2 text-slate-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Nawigacja po kompendium eksperckim</span>
          </div>
          
          <button onClick={() => scrollToSection('kalkulator-wynajem-kupno')} className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Calculator size={14}/> KALKULATOR
          </button>

          {[
            { title: "Majątek Netto", id: "analiza-majatku-netto", icon: Activity },
            { title: "Finansowanie i PPK", id: "finansowanie-i-ppk", icon: PiggyBank },
            { title: "Podatki i Koszty", id: "podatki-i-koszty-transakcyjne", icon: Gavel },
            { title: "Sprzedaż i PIT", id: "podatek-pit-sprzedaz", icon: History },
            { title: "Psychologia i Wolność", id: "wolnosc-vs-stabilizacja", icon: Heart },
            { title: "Wykończenie i Eksploatacja", id: "eksploatacja-i-wykonczenie", icon: Zap },
            { title: "Klasa Energetyczna", id: "efektywnosc-energetyczna-koszty", icon: ShieldAlert },
            { title: "Werdykt Decyzyjny", id: "checklist-decyzyjna", icon: Sparkles },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(item.id)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-50 bg-white"
            >
              <item.icon size={14} className="opacity-50"/>
              {item.title}
            </button>
          ))}
        </div>

        {/* DODAJ ID DO GŁÓWNEGO GRIDA KALKULATORA */}
        <div id="kalkulator-wynajem-kupno" className="grid lg:grid-cols-12 gap-8 mb-12 scroll-mt-24"></div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          
          {/* LEWA KOLUMNA - PARAMETRY */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
              
              {/* SEKCJA KUPNO */}
              <div className="mb-8">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm border-b pb-2">
                   <Key className="text-indigo-600"/> Scenariusz kupna (Właściciel)
                </h3>
                <div className="space-y-4">
                    <InputGroup label="Cena nieruchomości" value={propertyPrice} onChange={setPropertyPrice} suffix="PLN" step={5000} description="Rynkowa cena mieszkania."/>
                    <InputGroup label="Wkład własny" value={downPaymentPercent} onChange={setDownPaymentPercent} suffix="%" step={5} description="Minimum 10-20% wartości."/>
                    <InputGroup label="Oprocentowanie kredytu" value={mortgageRate} onChange={setMortgageRate} suffix="%" step={0.1} description="RRSO twojego kredytu (WIBOR + marża)."/>
                    <InputGroup label="Czynsz i remonty" value={maintenanceCost} onChange={setMaintenanceCost} suffix="PLN/msc" step={50} description="Czynsz do spółdzielni + fundusz remontowy."/>
                    <InputGroup label="Wzrost wartości" value={propertyAppreciation} onChange={setPropertyAppreciation} suffix="%" step={0.5} description="Średni roczny wzrost cen mieszkań (historycznie ok. 3-5%)."/>
                </div>
              </div>

              {/* SEKCJA WYNAJEM */}
              <div>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm border-b pb-2">
                   <Building2 className="text-green-600"/> Scenariusz wynajmu (Inwestor)
                </h3>
                <div className="space-y-4">
                    <InputGroup label="Koszt najmu" value={monthlyRent} onChange={setMonthlyRent} suffix="PLN" step={100} description="Ile płaciłbyś za wynajem podobnego mieszkania."/>
                    <InputGroup label="Wzrost czynszu" value={rentIncrease} onChange={setRentIncrease} suffix="%" step={0.5} description="Coroczna podwyżka czynszu (zazwyczaj o inflację)."/>
                    <InputGroup label="Zysk z inwestycji" value={investmentReturn} onChange={setInvestmentReturn} suffix="%" step={0.5} description="Ile zarobisz inwestując różnicę (np. 6-7% na giełdzie)."/>
                </div>
              </div>

            </div>
          </div>

          {/* PRAWA KOLUMNA - WYNIKI */}
          <div className="lg:col-span-8 space-y-6">
             
             {/* PODSUMOWANIE */}
             <div className={`rounded-3xl p-8 text-white shadow-xl transition-colors duration-500 ${simulation.winner === 'owner' ? 'bg-indigo-600 shadow-indigo-200' : 'bg-green-600 shadow-green-200'}`}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="text-xs font-bold uppercase opacity-80 mb-2">Werdykt matematyczny</div>
                        <h3 className="text-3xl md:text-4xl font-black mb-2">
                            {simulation.winner === 'owner' ? 'Kupno się opłaca!' : 'Wynajem wygrywa!'}
                        </h3>
                        <p className="opacity-90 text-sm leading-relaxed max-w-md">
                            Po {loanYears} latach majątek netto {simulation.winner === 'owner' ? 'właściciela' : 'najemcy'} będzie wyższy o <strong>{formatMoney(simulation.difference)}</strong>.
                        </p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 min-w-[200px]">
                        <div className="text-xs opacity-70 mb-1">Rata kredytu (Start)</div>
                        <div className="text-2xl font-bold">{formatMoney(simulation.monthlyMortgage)}</div>
                        <div className="text-xs opacity-70 mt-2 mb-1">Czynsz najmu (Start)</div>
                        <div className="text-2xl font-bold">{formatMoney(monthlyRent)}</div>
                    </div>
                </div>
             </div>

             {/* WYKRES */}
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-[400px]">
                <h4 className="font-bold text-slate-800 mb-6 text-center">Porównanie majątku netto w czasie</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simulation.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorOwner" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRenter" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year" fontSize={12} minTickGap={30}/>
                        <YAxis fontSize={12} tickFormatter={(val) => `${val/1000}k`}/>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(val) => formatMoney(val)}/>
                        <Legend verticalAlign="top" height={36}/>
                        <Area type="monotone" dataKey="owner" name="Majątek Właściciela (Dom - Kredyt)" stroke="#4f46e5" fill="url(#colorOwner)" strokeWidth={3}/>
                        <Area type="monotone" dataKey="renter" name="Majątek Najemcy (Inwestycje)" stroke="#16a34a" fill="url(#colorRenter)" strokeWidth={3}/>
                    </AreaChart>
                </ResponsiveContainer>
             </div>
             
             {/* INFO BOX Z ZAŁOŻENIAMI */}
             <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-xs border border-blue-100 flex gap-3">
                 <Info size={20} className="shrink-0"/>
                 <p className="leading-relaxed">
                    <strong>Ważne założenie:</strong> Model zakłada, że najemca jest zdyscyplinowany. Jeśli rata kredytu wynosi np. 4000 zł, a czynsz 3000 zł, to najemca <strong>musi</strong> inwestować pozostałe 1000 zł co miesiąc (np. w <Link to="/obligacje" className="underline font-bold hover:text-blue-600">Obligacje</Link> lub <Link to="/gielda" className="underline font-bold hover:text-blue-600">ETF</Link>), aby wynik był prawdziwy. Jeśli różnica zostanie "przejedzona", kupno nieruchomości prawie zawsze okaże się lepsze finansowo.
                 </p>
             </div>

{/* BELKA: WKŁAD WŁASNY PPK (Zgodnie z obrazkiem) */}
             <div 
                onClick={() => scrollToSection('finansowanie-i-ppk')} 
                className="mt-8 bg-slate-900 p-8 rounded-[2rem] shadow-xl cursor-pointer group flex items-center justify-between hover:bg-slate-800 transition-all border border-slate-700 relative overflow-hidden"
             >
                <div className="relative z-10">
                   <h4 className="text-white font-black text-xl mb-2 group-hover:text-indigo-300 transition-colors text-left">
                        Brakuje Ci na wkład własny?
                   </h4>
                   <p className="text-slate-400 text-sm text-left">
                        Sprawdź, jak legalnie wypłacić środki z PPK na zakup mieszkania 👇
                   </p>
                </div>
                <div className="bg-white/10 p-4 rounded-full group-hover:bg-white/20 transition-colors shrink-0 relative z-10">
                   <ArrowDown className="text-white animate-bounce" size={28}/>
                </div>
                <PiggyBank size={150} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12" />
             </div>

          </div>
        </div>

{/* SEKCJA 1: ANALIZA MAJĄTKU NETTO */}
<div id="analiza-majatku-netto" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-left scroll-mt-24">
    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
    
    <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-start">
        {/* LEWA KOLUMNA: KOMPLEKSOWA ANALIZA MERYTORYCZNA */}
        <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0 font-black text-2xl">
                    1
                </div>
                <div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">Analiza Majątku Netto: Własność kontra Wynajem</h4>
                    <p className="text-slate-500 font-medium">Zrozumienie różnicy między wydatkiem a inwestycją</p>
                </div>
            </div>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
                <p>
                    Decyzja o zakupie nieruchomości lub pozostaniu przy najmie to w rzeczywistości wybór strategii budowania długoterminowego bogactwa. Kluczowym wskaźnikiem jest tutaj **Majątek Netto**, który obliczamy jako sumę wszystkich posiadanych zasobów pomniejszoną o zadłużenie.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-4">
                    <div className="space-y-4">
                        <h5 className="font-bold text-slate-900 flex items-center gap-2">
                            <Home size={18} className="text-indigo-600"/> Scenariusz Właściciela
                        </h5>
                        <p className="text-sm">
                            Właściciel mieszkania realizuje strategię wymuszonego oszczędzania. Każda wpłacona rata kredytowa dzieli się na odsetki (koszt) oraz kapitał (oszczędność). Kapitał ten nie znika, lecz zamraża się w murach nieruchomości, której wartość dodatkowo wzrasta w czasie wraz z inflacją.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h5 className="font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp size={18} className="text-green-600"/> Scenariusz Najemcy
                        </h5>
                        <p className="text-sm">
                            Najemca unika kosztów odsetkowych i podatkowych, jednak ponosi pełny koszt czynszu, który jest wydatkiem bezpowrotnym. Przewagę finansową uzyskuje on tylko pod warunkiem, że **Wkład Własny** oraz miesięczne nadwyżki finansowe są systematycznie inwestowane na rynkach kapitałowych.
                        </p>
                    </div>
                </div>
            </div>

            {/* EKSPERCKI WZÓR MATEMATYCZNY */}
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10 text-center">
                    <span className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] mb-4 block">Formuła budowy kapitału</span>
                    <div className="text-lg md:text-xl font-mono py-4 border-y border-white/10">
                        {"Majątek Netto = (Wartość Nieruchomości - Saldo Kredytu) + Oszczędności"}
                    </div>
                    <p className="mt-4 text-[10px] text-slate-400 leading-relaxed uppercase tracking-wider font-medium">
                        Wartość nieruchomości powinna być korygowana o przewidywany wzrost cen rynkowych
                    </p>
                </div>
                <Coins size={150} className="absolute -bottom-10 -left-10 text-white/5 rotate-12" />
            </div>
        </div>

        {/* PRAWA KOLUMNA: KONKRET I DZIAŁANIE */}
        <div className="lg:col-span-5 space-y-6">
            <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 shadow-sm text-left">
                <h5 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-600" /> Koszt Alternatywny
                </h5>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Największą pułapką własności jest koszt alternatywny wkładu własnego. Środki, które wpłacasz do banku na start, mogłyby w tym samym czasie pracować na giełdzie, wykorzystując mechanizm procentu składanego.
                </p>
                <button 
                    onClick={() => navigate('/procent-skladany')}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
                >
                    <Sparkles size={16} className="group-hover:animate-pulse"/> OBLICZ POTENCJAŁ INWESTYCYJNY
                </button>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm text-left relative overflow-hidden">
                <h5 className="font-bold text-slate-900 text-sm mb-4">Wniosek dla portfela:</h5>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-xs text-slate-500">
                        <CheckCircle size={16} className="text-green-500 shrink-0"/>
                        <span>Nieruchomość chroni kapitał przed inflacją dzięki dźwigni kredytowej.</span>
                    </li>
                    <li className="flex gap-3 text-xs text-slate-500">
                        <CheckCircle size={16} className="text-green-500 shrink-0"/>
                        <span>Najem daje wolność wyboru i mobilność kapitału inwestycyjnego.</span>
                    </li>
                </ul>
                <div className="absolute -bottom-6 -right-6 opacity-5">
                    <Calculator size={120} />
                </div>
            </div>
        </div>
    </div>
</div>

{/* SEKCJA 2: FINANSOWANIE I WKŁAD WŁASNY */}
<div id="finansowanie-i-ppk" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-left scroll-mt-24 mt-16">
    <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-start text-left">
        
        {/* LEWA KOLUMNA: MERYTORYKA */}
        <div className="lg:col-span-7 space-y-8 text-left">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0 font-black text-2xl">
                    2
                </div>
                <div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Finansowanie i Wkład Własny</h4>
                    <p className="text-slate-500 font-medium text-left text-sm uppercase tracking-wider">Jak sfinansować zakup w 2026 roku?</p>
                </div>
            </div>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
                <p>
                    W 2026 roku standardowy <strong>Wkład Własny</strong> wymagany przez banki wynosi 20% wartości nieruchomości. Jeśli dysponujesz jedynie 10-procentowym kapitałem, Twoim kosztem będzie <strong>Ubezpieczenie Niskiego Wkładu Własnego</strong>, które podwyższy marżę kredytu do czasu spłaty brakującej części kapitału.
                </p>

                {/* MODUŁ PPK - ODPOWIEDŹ NA BELKĘ */}
                <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 relative overflow-hidden text-left">
                    <h5 className="font-black text-orange-900 text-xl mb-4 flex items-center gap-2 text-left">
                        <PiggyBank className="text-orange-600"/> Wykorzystanie środków z PPK
                    </h5>
                    <p className="text-sm text-orange-800 leading-relaxed mb-6 text-left">
                        <strong>Pracownicze Plany Kapitałowe</strong> to potężne, a często pomijane źródło gotówki na start. Jeśli nie ukończyłeś 45. roku życia, możesz wypłacić do 100% zgromadzonych środków na pokrycie wkładu własnego.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-left">
                        <div className="bg-white/60 p-4 rounded-2xl text-xs text-orange-900 font-medium">
                            <strong className="block mb-1">Nieoprocentowana pożyczka</strong>
                            Masz 15 lat na zwrócenie wypłaconej kwoty do swojego portfela PPK (pierwsza wpłata po 5 latach).
                        </div>
                        <div className="bg-white/60 p-4 rounded-2xl text-xs text-orange-900 font-medium text-left">
                            <strong className="block mb-1 text-left">Brak Podatku Belki</strong>
                            Wypłata na cele mieszkaniowe jest zwolniona z 19% podatku od zysków kapitałowych.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* PRAWA KOLUMNA: WSKAŹNIKI RYNKOWE */}
        <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 text-left">
                <h5 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2 text-left uppercase tracking-widest">
                    <Landmark size={18} className="text-indigo-600" /> Reforma Wskaźników
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 text-left">
                    Pamiętaj, że w 2026 roku wciąż trwa okres przejściowy między wskaźnikami <strong>WIBOR</strong> a <strong>WIRON</strong>.
                </p>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-xs text-slate-600 text-left items-start">
                        <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5"/>
                        <span><strong>Ryzyko Stopy Procentowej:</strong> Wybór między stopą zmienną a okresowo stałą (np. na 5 lat) to klucz do stabilności domowego budżetu.</span>
                    </li>
                </ul>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden text-left group">
                <h5 className="text-lg font-bold mb-2 flex items-center gap-2 text-left">
                    <Percent className="text-indigo-400" size={20}/> Zdolność Kredytowa
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 text-left">
                    Twoja zdolność zależy od <strong>Wskaźnika Obsługi Długu do Dochodu</strong>. Sprawdź, jak Twoja pensja wpływa na maksymalną kwotę kredytu.
                </p>
                <button 
                    onClick={() => navigate('/wynagrodzenia')}
                    className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-lg relative z-10"
                >
                    <Briefcase size={16}/> OBLICZ DOCHÓD NETTO
                </button>
            </div>
        </div>
    </div>
</div>

{/* SEKCJA 3: PODATKI I KOSZTY TRANSAKCYJNE */}
<div id="podatki-pcc-notariusz" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-left scroll-mt-24 mt-16">
    <div className="relative z-10 space-y-12">
        
        {/* NAGŁÓWEK SEKCJI */}
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg font-black text-2xl shadow-indigo-200 shrink-0">
                3
            </div>
            <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Podatki i Koszty: Ile faktycznie kosztuje zakup?</h4>
                <p className="text-slate-500 font-medium text-left text-sm uppercase tracking-wider">Analiza kosztów okołotransakcyjnych na rynku nieruchomości</p>
            </div>
        </div>

        <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
            <p>
                Cena widniejąca w ogłoszeniu to dopiero początek wydatków. Jako przyszły właściciel musisz przygotować „bufor gotówkowy” na pokrycie opłat skarbowych i usług profesjonalistów. W zależności od rodzaju rynku (pierwotny lub wtórny), koszty te mogą wynieść od <strong>2% do nawet 5% wartości nieruchomości</strong>.
            </p>
        </div>

        {/* SIATKA KOSZTÓW */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            
            {/* KARTA: PODATEK PCC */}
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all text-left">
                <div>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-6">
                        <Receipt size={24}/>
                    </div>
                    <h5 className="font-bold text-slate-900 mb-2 text-left">Podatek od Czynności Cywilnoprawnych</h5>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6 text-left">
                        To danina w wysokości <strong>2% wartości rynkowej</strong> nieruchomości. Obowiązuje wyłącznie przy zakupie mieszkań używanych (rynek wtórny). 
                    </p>
                </div>
                <div className="bg-green-100 text-green-700 p-3 rounded-xl text-[10px] font-black text-center uppercase tracking-widest">
                    0% przy zakupie pierwszego mieszkania
                </div>
            </div>

            {/* KARTA: TAKSA NOTARIALNA */}
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col text-left hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-6">
                    <Gavel size={24}/>
                </div>
                <h5 className="font-bold text-slate-900 mb-2 text-left">Taksa Notarialna</h5>
                <p className="text-xs text-slate-500 leading-relaxed text-left">
                    Wynagrodzenie notariusza za sporządzenie aktu notarialnego. Choć Minister Sprawiedliwości określa stawki maksymalne, pamiętaj, że <strong>podlegają one negocjacji</strong>. Przy transakcji za 700 000 PLN koszt ten wyniesie ok. 3000-4000 PLN.
                </p>
            </div>

            {/* KARTA: KSIĘGI WIECZYSTE */}
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col text-left hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-6">
                    <FileCheck size={24}/>
                </div>
                <h5 className="font-bold text-slate-900 mb-2 text-left">Opłaty Sądowe</h5>
                <p className="text-xs text-slate-500 leading-relaxed text-left">
                    Każdy wpis w <strong>Księdze Wieczystej</strong> jest płatny. Zapłacisz 200 PLN za wpis prawa własności oraz 200 PLN za założenie hipoteki na rzecz banku (jeśli korzystasz z kredytu).
                </p>
            </div>
        </div>

        {/* PRZEKIEROWANIE DO INNEJ PODSTRONY - KALKULATOR VAT (Dla urozmaicenia) */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 text-left relative overflow-hidden">
            <div className="relative z-10 text-left">
                <h5 className="text-xl font-bold mb-1 text-left">Kupujesz nieruchomość na firmę?</h5>
                <p className="text-slate-400 text-sm text-left leading-relaxed">
                    Pamiętaj, że przy zakupie od dewelopera lub na fakturę, kluczowe znaczenie ma <strong>Podatek od Towarów i Usług (VAT)</strong>, który możesz odliczyć.
                </p>
            </div>
            <button 
                onClick={() => navigate('/kalkulator-vat')}
                className="relative z-10 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shrink-0 flex items-center gap-2 shadow-lg"
            >
                <Calculator size={16}/> OBLICZ PODATEK VAT
            </button>
            <Banknote size={150} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
        </div>
    </div>
</div>

{/* SEKCJA 4: SPRZEDAŻ I PODATEK DOCHODOWY */}
<div id="podatek-pit-sprzedaz" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-left scroll-mt-24 mt-16">
    <div className="relative z-10 space-y-12">
        
        {/* NAGŁÓWEK SEKCJI */}
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg font-black text-2xl shadow-indigo-200 shrink-0">
                4
            </div>
            <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Sprzedaż i PIT: Jak zachować wypracowany zysk?</h4>
                <p className="text-slate-500 font-medium text-left text-sm uppercase tracking-wider">Zasady opodatkowania zbycia nieruchomości w 2026 roku</p>
            </div>
        </div>

        <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
            <p>
                Wzrost wartości nieruchomości to czysty zysk, ale tylko pod warunkiem, że wiesz, jak rozliczyć się z fiskusem. Standardowa stawka <strong>Podatku Dochodowego od Osób Fizycznych (PIT)</strong> przy sprzedaży nieruchomości wynosi <strong>19% od wypracowanego dochodu</strong>. Istnieją jednak dwie kluczowe drogi, aby tego kosztu uniknąć.
            </p>
        </div>

        {/* WIZUALIZACJA: OŚ CZASU - ZASADA 5 LAT */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
                <h5 className="text-xl font-bold mb-8 flex items-center gap-2 text-left">
                    <History className="text-indigo-400" size={24}/> Magiczna Granica: Zasada 5 lat
                </h5>
                
                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Linia łącząca na desktopie */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2"></div>
                    
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative z-20">
                        <div className="text-indigo-400 font-black text-lg mb-2 text-left tracking-tighter">KROK 1: Zakup</div>
                        <p className="text-xs text-slate-400 leading-relaxed text-left">
                            Moment podpisania aktu notarialnego. Od tego dnia czekasz do końca roku kalendarzowego.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative z-20 shadow-2xl scale-105 bg-indigo-500/10 border-indigo-500/30">
                        <div className="text-indigo-400 font-black text-lg mb-2 text-left tracking-tighter">KROK 2: Odliczanie</div>
                        <p className="text-xs text-slate-400 leading-relaxed text-left">
                            Musisz odczekać <strong>5 pełnych lat podatkowych</strong>, licząc od końca roku, w którym nabyłeś nieruchomość.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative z-20">
                        <div className="text-green-400 font-black text-lg mb-2 text-left tracking-tighter">KROK 3: Wolność</div>
                        <p className="text-xs text-slate-400 leading-relaxed text-left">
                            Po upływie tego czasu sprzedaż jest całkowicie <strong>zwolniona z podatku dochodowego</strong>.
                        </p>
                    </div>
                </div>

                <div className="mt-10 p-4 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-center">
                    <p className="text-xs italic text-indigo-200">
                        <strong>Przykład:</strong> Mieszkanie kupione w marcu 2021 r. 5 lat liczymy od 1 stycznia 2022 r. Bez podatku sprzedasz je dopiero <strong>1 stycznia 2027 r.</strong>
                    </p>
                </div>
            </div>
            <Activity size={300} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
        </div>

        {/* DRUGA OPCJA: ULGA MIESZKANIOWA */}
        <div className="grid lg:grid-cols-2 gap-12 items-center text-left">
            <div className="space-y-6 text-left">
                <h4 className="text-2xl font-black text-slate-900 flex items-center gap-3 text-left">
                    <ShieldCheck className="text-indigo-600" size={28}/>
                    Własne Cele Mieszkaniowe
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed text-left">
                    Jeśli musisz sprzedać nieruchomość przed upływem 5 lat, Twoją deską ratunku jest <strong>Własna Ulga Mieszkaniowa</strong>. Pozwala ona uniknąć 19% podatku, jeśli w ciągu <strong>3 lat</strong> od końca roku sprzedaży przeznaczysz uzyskane środki na inny cel mieszkaniowy.
                </p>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-xs text-slate-500 text-left">
                        <CheckCircle size={16} className="text-green-500 shrink-0"/>
                        <span>Zakup innego mieszkania lub budowa domu w Polsce lub UE.</span>
                    </li>
                    <li className="flex gap-3 text-xs text-slate-500 text-left">
                        <CheckCircle size={16} className="text-green-500 shrink-0"/>
                        <span>Spłata kredytu hipotecznego zaciągniętego przed dniem sprzedaży.</span>
                    </li>
                    <li className="flex gap-3 text-xs text-slate-500 text-left">
                        <CheckCircle size={16} className="text-green-500 shrink-0"/>
                        <span>Remont lub modernizacja nowej nieruchomości.</span>
                    </li>
                </ul>
            </div>

            <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 text-left">
                <h5 className="font-bold text-indigo-900 mb-4 flex items-center gap-2 text-left">
                    <Info size={20}/> Ważne zastrzeżenie
                </h5>
                <p className="text-xs text-indigo-800 leading-relaxed text-left mb-4">
                    Ulga przysługuje tylko wtedy, gdy nowa nieruchomość służy <strong>zaspokojeniu Twoich własnych potrzeb</strong>. Zakup mieszkania wyłącznie pod wynajem (jako kolejna inwestycja) może zostać zakwestionowany przez Urząd Skarbowy.
                </p>
                <div className="pt-4 border-t border-indigo-200">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-left block mb-2">Alternatywa dla gotówki</span>
                    <p className="text-[10px] text-indigo-600 italic leading-relaxed text-left">
                        Zamiast mrozić środki w kolejnym lokalu, wielu inwestorów po 5 latach wybiera płynne aktywa państwowe.
                    </p>
                </div>
            </div>
        </div>

        {/* PRZEKIEROWANIE DO OBLIGACJI (Dywersyfikacja kapitału) */}
        <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="text-left flex gap-6 items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                    <Coins size={32}/>
                </div>
                <div>
                    <h5 className="text-xl font-bold mb-1 text-left">Masz gotówkę ze sprzedaży?</h5>
                    <p className="text-slate-500 text-sm text-left leading-relaxed">
                        Sprawdź, jak ochronić kapitał przed inflacją, wybierając <strong>Obligacje Skarbowe Państwa</strong> zamiast kolejnego mieszkania.
                    </p>
                </div>
            </div>
            <button 
                onClick={() => navigate('/obligacje')}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all shrink-0 flex items-center gap-2 shadow-lg"
            >
                <Target size={16}/> KALKULATOR OBLIGACJI
            </button>
        </div>
    </div>
</div>

{/* SEKCJA 5: PSYCHOLOGIA I MOBILNOŚĆ */}
<div id="wolnosc-vs-stabilizacja" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-left scroll-mt-24 mt-16">
    <div className="relative z-10 space-y-12">
        
        {/* NAGŁÓWEK SEKCJI */}
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg font-black text-2xl shadow-indigo-200 shrink-0">
                5
            </div>
            <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Wolność czy Stabilizacja: Poza arkuszem kalkulacyjnym</h4>
                <p className="text-slate-500 font-medium text-left text-sm uppercase tracking-wider">Psychologiczne i zawodowe aspekty wyboru mieszkania</p>
            </div>
        </div>

        <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
            <p>
                Excel potrafi obliczyć odsetki, ale nie wyceni poczucia spokoju ani stresu związanego z przeprowadzką. Wybór między wynajmem a kupnem to w dużej mierze decyzja o Twoim <strong>Stylu Życia</strong> i elastyczności na rynku pracy.
            </p>
        </div>

        {/* WIZUALIZACJA: DYLEMAT WOLNOŚCI */}
        <div className="grid lg:grid-cols-2 gap-8">
            {/* KARTA: WŁASNOŚĆ */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
                <div className="relative z-10">
                    <Heart className="text-pink-500 mb-6" size={40} />
                    <h5 className="text-xl font-black text-slate-900 mb-4">Psychologia „Płacenia na Swoje”</h5>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                        Własne mieszkanie to dla wielu osób <strong>Emerytura Bezczynszowa</strong>. Poczucie bezpieczeństwa, możliwość dowolnej aranżacji wnętrz i brak ryzyka wypowiedzenia umowy przez właściciela to wartości, których nie da się przeliczyć na pieniądze.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <ShieldCheck size={16} className="text-green-500" /> Pełna kontrola nad przestrzenią
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <ShieldCheck size={16} className="text-green-500" /> Stabilizacja dla rodziny i dzieci
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform">
                    <Home size={200} />
                </div>
            </div>

            {/* KARTA: WYNAJEM */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="relative z-10">
                    <Compass className="text-blue-400 mb-6" size={40} />
                    <h5 className="text-xl font-black mb-4">Kapitał Mobilności Zawodowej</h5>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                        Najemca jest lżejszy. Jeśli otrzymasz propozycję pracy z wynagrodzeniem wyższym o 50% w innym mieście lub kraju, możesz się przeprowadzić w miesiąc. Właściciel mieszkania często wpada w <strong>Pułapkę Stabilizacji</strong>, odrzucając szanse zawodowe ze względu na trudność sprzedaży lub najmu swojej nieruchomości.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                            <MapPin size={16} /> Brak przywiązania do jednej lokalizacji
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                            <Briefcase size={16} /> Szybsza reakcja na zmiany rynkowe
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
                    <ArrowRightLeft size={200} />
                </div>
            </div>
        </div>

        {/* PRZEKIEROWANIE DO ZAROBKÓW B2B / ETAT */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="text-left flex gap-6 items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                    <Briefcase size={32}/>
                </div>
                <div>
                    <h5 className="text-xl font-bold mb-1 text-left">Chcesz zwiększyć swój dochód?</h5>
                    <p className="text-slate-500 text-sm text-left leading-relaxed">
                        Mobilność zawodowa to najszybsza droga do wyższej pensji. Sprawdź, ile zarobisz "na rękę" przy zmianie formy zatrudnienia na <strong>Kontrakt B2B</strong> lub wyższą stawkę na etacie.
                    </p>
                </div>
            </div>
            <button 
                onClick={() => navigate('/b2b')}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shrink-0 flex items-center gap-2 shadow-xl shadow-indigo-100"
            >
                <Calculator size={16}/> OBLICZ ZYSK Z MOBILNOŚCI
            </button>
        </div>

        <div className="text-center pt-8 border-t border-slate-100">
            <p className="text-xs text-slate-400 italic">
                *Pamiętaj, że decyzja o zakupie nieruchomości powinna uwzględniać Twoje plany życiowe na najbliższe 5-10 lat.
            </p>
        </div>
    </div>
</div>

{/* SEKCJA 6: EKSPLOATACJA I WYKOŃCZENIE */}
<div id="eksploatacja-i-wykonczenie" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-left scroll-mt-24 mt-16">
    <div className="relative z-10 space-y-12">
        
        {/* NAGŁÓWEK SEKCJI */}
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg font-black text-2xl shadow-indigo-200 shrink-0">
                6
            </div>
            <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Eksploatacja i Wykończenie: Ukryty Koszt Właściciela</h4>
                <p className="text-slate-500 font-medium text-left text-sm uppercase tracking-wider">Poza ratą kredytu – co obciąża portfel właściciela?</p>
            </div>
        </div>

        <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
            <p>
                Wiele osób porównuje czynsz najmu do raty kredytu, zapominając, że jako najemca płacisz za produkt „gotowy”. Jako właściciel stajesz się zarządcą małego przedsiębiorstwa, które wymaga stałych nakładów na utrzymanie sprawności technicznej i wizualnej. W 2026 roku <strong>Koszty Eksploatacyjne</strong> mogą stanowić nawet 20-30% miesięcznego obciążenia związanego z mieszkaniem.
            </p>
        </div>

        {/* WIZUALIZACJA: KOSZTY WYKOŃCZENIA 2026 */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden text-left">
                <h5 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Zap className="text-indigo-400" size={24}/> Realia wykończenia „pod klucz”
                </h5>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                    Kupując mieszkanie w stanie deweloperskim, musisz doliczyć koszt wykończenia. W 2026 roku średnie stawki w standardzie optymalnym kształtują się następująco:
                </p>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-xs font-bold text-slate-300">Robocizna i materiały (m2)</span>
                        <span className="text-indigo-400 font-black">3 500 - 5 000 PLN</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-xs font-bold text-slate-300">Zabudowy stolarskie (kuchnia/szafy)</span>
                        <span className="text-indigo-400 font-black">40 000 - 70 000 PLN</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-300">Sprzęt AGD i RTV (zestaw)</span>
                        <span className="text-indigo-400 font-black">15 000 - 25 000 PLN</span>
                    </div>
                </div>
                <div className="mt-8 p-4 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-[10px] text-indigo-200 italic text-center">
                    To kapitał, który właściciel zamraża na start, a najemca może zainwestować.
                </div>
                <Building2 size={200} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
            </div>

            <div className="space-y-8 text-left">
                <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <Receipt size={24}/>
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-900 text-lg mb-2">Podatki i Ubezpieczenia</h5>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Jako właściciel opłacasz roczny <strong>Podatek od Nieruchomości</strong> oraz obowiązkowe <strong>Ubezpieczenie Murów</strong> (wymagane przez bank). Choć są to kwoty rzędu kilkuset złotych rocznie, stanowią stały element kosztów stałych.
                        </p>
                    </div>
                </div>

                <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <History size={24}/>
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-900 text-lg mb-2">Fundusz Remontowy</h5>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            To Twój wkład w utrzymanie budynku. Składka na <strong>Fundusz Remontowy</strong> rośnie wraz z wiekiem nieruchomości. W przeciwieństwie do najemcy, to Ty ponosisz koszt naprawy dachu, wymiany windy czy termomodernizacji bloku.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* PRZEKIEROWANIE DO VAT (Materiały budowlane) */}
        <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="text-left flex gap-6 items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                    <MousePointer2 size={32}/>
                </div>
                <div>
                    <h5 className="text-xl font-bold mb-1 text-left">Planujesz wykończenie lub remont?</h5>
                    <p className="text-slate-500 text-sm text-left leading-relaxed">
                        Sprawdź, ile wyniesie <strong>Podatek od Towarów i Usług</strong> przy zakupie materiałów budowlanych oraz jakie stawki stosują firmy wykończeniowe.
                    </p>
                </div>
            </div>
            <button 
                onClick={() => navigate('/kalkulator-vat')}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all shrink-0 flex items-center gap-2 shadow-lg"
            >
                <Calculator size={16}/> KALKULATOR PODATKU VAT
            </button>
        </div>
    </div>
</div>

{/* SEKCJA 7: EFEKTYWNOŚĆ ENERGETYCZNA */}
<div id="efektywnosc-energetyczna-koszty" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-left scroll-mt-24 mt-16">
    <div className="relative z-10 space-y-12">
        
        {/* NAGŁÓWEK SEKCJI */}
        <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg font-black text-2xl shadow-indigo-200 shrink-0">
                7
            </div>
            <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Klasa Energetyczna: Nowy wymiar wartości</h4>
                <p className="text-slate-500 font-medium text-left text-sm uppercase tracking-wider">Wpływ dyrektywy EPBD na koszty utrzymania w 2026 roku</p>
            </div>
        </div>

        <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
            <p>
                W 2026 roku rynek nieruchomości nie patrzy już tylko na lokalizację, ale przede wszystkim na <strong>Świadectwo Charakterystyki Energetycznej</strong>. Zgodnie z unijną dyrektywą w sprawie charakterystyki energetycznej budynków (EPBD), budynki o najniższej klasie energetycznej będą wymagały kosztownych modernizacji, co staje się ukrytym kosztem dla właściciela.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-8 bg-green-50 rounded-[2rem] border border-green-100 relative overflow-hidden text-left">
                <div className="relative z-10 text-left">
                    <Zap size={32} className="text-green-600 mb-4"/>
                    <h5 className="font-bold text-slate-900 text-lg mb-2 text-left text-left">Zysk z "Zielonego Standardu"</h5>
                    <p className="text-sm text-slate-600 leading-relaxed text-left">
                        Mieszkania w klasie A i B charakteryzują się znacznie niższymi kosztami <strong>Czynszu Administracyjnego</strong> ze względu na mniejsze zapotrzebowanie na ogrzewanie. Najemca płaci za to w czynszu, ale właściciel starej nieruchomości może stanąć przed koniecznością przymusowej termomodernizacji.
                    </p>
                </div>
            </div>

            <div className="p-8 bg-slate-900 text-white rounded-[2rem] relative overflow-hidden text-left">
                <div className="relative z-10 text-left">
                    <ShieldAlert size={32} className="text-indigo-400 mb-4 text-left"/>
                    <h5 className="font-bold text-xl mb-2 text-left">Podatek od Emisji?</h5>
                    <p className="text-sm text-slate-400 leading-relaxed text-left">
                        Jako właściciel w 2026 roku musisz liczyć się z systemem <strong>ETS2</strong>, który docelowo obciąży budynki ogrzewane paliwami kopalnymi. To kolejny koszt, którego najemca może uniknąć, po prostu zmieniając lokal na nowocześniejszy.
                    </p>
                </div>
                <Activity size={180} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
            </div>
        </div>
    </div>
</div>

{/* SEKCJA 8: PODSUMOWANIE DECYZYJNE */}
<div id="checklist-decyzyjna" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-left scroll-mt-24 mt-16">
    <div className="relative z-10 space-y-12">
        
        <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg font-black text-2xl shadow-indigo-200 shrink-0">
                8
            </div>
            <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Strategiczny Rachunek Sumienia</h4>
                <p className="text-slate-500 font-medium text-left text-sm uppercase tracking-wider">Kiedy matematyka ustępuje pola strategii życiowej</p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 text-left">
            {/* KOLUMNA: WYBIERZ WYNAJEM */}
            <div className="space-y-6 text-left">
                <h5 className="text-xl font-black text-indigo-600 flex items-center gap-2 text-left">
                    <Building2 size={24}/> Wybierz WYNAJEM, gdy:
                </h5>
                <ul className="space-y-4">
                    {[
                        "Planujesz zmianę miasta lub kraju w ciągu najbliższych 3-5 lat.",
                        "Masz szansę zainwestować wkład własny we własny biznes o wysokiej marży.",
                        "Cenisz płynność finansową i brak zobowiązań wobec instytucji bankowych.",
                        "Chcesz mieszkać w standardzie, na który obecnie nie masz zdolności kredytowej."
                    ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-500 text-left items-start">
                            <MinusCircle size={18} className="text-red-400 shrink-0 mt-0.5"/>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* KOLUMNA: WYBIERZ KUPNO */}
            <div className="space-y-6 text-left">
                <h5 className="text-xl font-black text-green-600 flex items-center gap-2 text-left">
                    <Key size={24}/> Wybierz KUPNO, gdy:
                </h5>
                <ul className="space-y-4">
                    {[
                        "Szukasz stabilizacji i bezpieczeństwa dla rodziny na min. 10 lat.",
                        "Twoja rata kredytowa (część kosztowa) jest niższa niż czynsz najmu.",
                        "Chcesz uchronić duże oszczędności przed inflacją poprzez twarde aktywa.",
                        "Masz niską dyscyplinę w oszczędzaniu nadwyżek finansowych."
                    ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-500 text-left items-start">
                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5"/>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* PRZEKIEROWANIE DO OSTATNIEGO NARZĘDZIA: FIRE */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-left">
                <div className="text-left">
                    <h5 className="text-2xl font-black mb-4 text-left">Twoje mieszkanie to element planu FIRE</h5>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 text-left">
                        Osiągnięcie <strong>Niezależności Finansowej (Financial Independence, Retire Early)</strong> wymaga optymalizacji największego kosztu życia – dachu nad głową. Sprawdź, jak wybór między kredytem a najmem wpłynie na datę Twojej wcześniejszej emerytury.
                    </p>
                    <button 
                        onClick={() => navigate('/kalkulator-fire')}
                        className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-xs hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
                    >
                        SYMULACJA WOLNOŚCI FINANSOWEJ
                    </button>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm text-left">
                    <h6 className="font-bold text-orange-400 mb-3 text-left">Złota Myśl Inwestycyjna:</h6>
                    <p className="text-xs text-slate-300 italic text-left">
                        "Kupno mieszkania to najczęściej konsumpcja finansowana długiem. Prawdziwą inwestycją staje się dopiero wtedy, gdy generuje dodatni przepływ pieniężny lub drastycznie obniża koszty życia na starość."
                    </p>
                </div>
            </div>
            <Sparkles size={300} className="absolute -bottom-20 -left-20 text-white/5 rotate-12" />
        </div>
    </div>
</div>

{/* --- SEKCJA SEO: NAJCZĘSTSZE PYTANIA W GOOGLE (KAFLE) --- */}
<div className="mt-24 border-t border-slate-100 pt-16">
    <div className="text-center mb-12">
        <h3 className="text-2xl font-black text-slate-900 mb-2 text-left md:text-center">Pytania, które zadają Polacy w 2026 roku</h3>
        <p className="text-sm text-slate-500 italic text-left md:text-center">Najpopularniejsze zapytania o rynek nieruchomości i podatki</p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
            { kw: "Wynajem czy kupno kalkulator 2026", id: "kalkulator-wynajem-kupno" },
            { kw: "Koszt wykończenia m2 2026", id: "eksploatacja-i-wykonczenie" },
            { kw: "Wkład własny z PPK zasady", id: "finansowanie-i-ppk" },
            { kw: "Podatek PCC 2 procent zwolnienie", id: "podatki-i-koszty-transakcyjne" },
            { kw: "Ulga mieszkaniowa PIT-39", id: "podatek-pit-sprzedaz" },
            { kw: "Dyrektywa EPBD a ceny mieszkań", id: "efektywnosc-energetyczna-koszty" },
            { kw: "Zasada 5 lat sprzedaży nieruchomości", id: "podatek-pit-sprzedaz" },
            { kw: "Majątek netto właściciela", id: "analiza-majatku-netto" },
            { kw: "Mobilność zawodowa a kredyt", id: "wolnosc-vs-stabilizacja" },
            { kw: "Co się bardziej opłaca w 2026?", id: "checklist-decyzyjna" }
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
    </>
  );
};