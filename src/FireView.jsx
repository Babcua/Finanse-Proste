import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  Flame, TrendingUp, Target, Calculator, Info, Wallet, PieChart, ShieldCheck, ArrowRight, 
  Hourglass, Landmark, Sun, BookOpen, Zap, Clock, Repeat, ArrowUpRight, Compass, 
  MinusCircle, AlertOctagon, Ship, Anchor, Waves, Coffee, Stethoscope, Palmtree, ListTree, Search, CheckCircle, Wind, Mountain, Navigation, AlertTriangle, Leaf, Heart
} from 'lucide-react';

const formatMoney = (val) => 
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

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
        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-semibold rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium select-none pointer-events-none">{suffix}</span>
    </div>
    {description && (
        <p className="text-xs text-slate-500 leading-tight ml-1">{description}</p>
    )}
  </div>
);

export const FireView = () => {
    const navigate = useNavigate();
    const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Margines, aby nagłówek nie zasłaniał sekcji
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
  // --- STAN ---
  const [currentAge, setCurrentAge] = useState(30);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(5000); // Ile potrzebujesz na życie
  const [monthlySavings, setMonthlySavings] = useState(2000); // Ile odkładasz
  
  const [roi, setRoi] = useState(7.0); // Zysk roczny z inwestycji (nominalny)
  const [inflation, setInflation] = useState(4.0); // Inflacja
  const [withdrawalRate, setWithdrawalRate] = useState(4.0); // Bezpieczna stopa wypłaty (SWR)

  const scrollToKnowledge = () => {
    const element = document.getElementById('kompendium');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- OBLICZENIA ---
  const simulation = useMemo(() => {
    const realRoi = (1 + roi/100) / (1 + inflation/100) - 1; // Realna stopa zwrotu (skorygowana o inflację)
    
    // FIRE Number: Kwota potrzebna, by żyć z odsetek (Wydatki roczne / SWR)
    // Przyjmujemy wydatki w dzisiejszej sile nabywczej (dlatego Real ROI w symulacji)
    const annualExpenses = monthlyExpenses * 12;
    const fireNumber = annualExpenses / (withdrawalRate / 100);

    const data = [];
    let portfolio = currentSavings;
    let age = currentAge;
    let isFireReached = false;
    let fireAge = null;

    // Symulujemy do 100. roku życia lub max 60 lat w przód
    for (let year = 0; year <= 60; year++) {
        if (portfolio >= fireNumber && !isFireReached) {
            isFireReached = true;
            fireAge = age;
        }

        data.push({
            age: age,
            portfolio: Math.round(portfolio),
            target: Math.round(fireNumber),
            reached: portfolio >= fireNumber
        });

        // Kapitalizacja + dopłata (w ujęciu rocznym dla uproszczenia wykresu)
        portfolio = portfolio * (1 + realRoi) + (monthlySavings * 12);
        age++;
    }

    return { 
        data, 
        fireNumber, 
        fireAge, 
        yearsToGo: fireAge ? fireAge - currentAge : '>60',
        realRoi: (realRoi * 100).toFixed(2)
    };
  }, [currentAge, currentSavings, monthlyExpenses, monthlySavings, roi, inflation, withdrawalRate]);

  return (
    <>
<Helmet>
        {/* Zaktualizowano tytuł i opis na rok 2026 */}
        <title>Kalkulator FIRE 2026 - Kiedy przejdziesz na emeryturę? | Finanse Proste</title>
        <meta name="description" content="Oblicz swoją drogę do wolności finansowej (FIRE). Symulacja uwzględnia inflację i wskaźniki na 2026 rok. Sprawdź liczbę FIRE i regułę 4%." />
        <link rel="canonical" href="https://www.finanse-proste.pl/kalkulator-fire" />
      </Helmet>

      <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">
        
        {/* HERO */}
        <div className="text-center mb-12 mt-8">
           <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-rose-200">
              <Flame size={14}/> Ruch FIRE (Financial Independence)
           </div>
           <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900">
              Kalkulator wolności <span className="text-rose-600">finansowej</span>
           </h2>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Nie musisz pracować do 65. roku życia. Matematyka jest prosta: jeśli Twoje aktywa pokrywają Twoje wydatki, jesteś wolny. Sprawdź, kiedy to nastąpi.
           </p>
        </div>

        {/* --- NAWIGACJA: PROTOKÓŁ FIRE --- */}
<div className="mb-16 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex flex-wrap justify-center gap-2 md:gap-3">
  <div className="w-full text-center mb-4">
    <ListTree size={16} className="inline-block mr-2 text-slate-400"/>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-left">Nawigacja po etapach wolności</span>
  </div>
  
  <button onClick={() => scrollToSection('kalkulator-fire')} className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
    <Calculator size={14}/> KALKULATOR
  </button>

  {[
    { title: "Stopa Oszczędności", id: "stopa-oszczednosci", icon: Zap },
    { title: "Coast FIRE", id: "coast-fire", icon: Ship },
    { title: "Barista FIRE", id: "barista-fire", icon: Coffee },
    { title: "Ryzyko Sekwencji", id: "ryzyko-sekwencji", icon: AlertTriangle },
    { title: "Lean vs Fat FIRE", id: "style-fire", icon: PieChart },
  ].map((item, i) => (
    <button
      key={i}
      onClick={() => scrollToSection(item.id)}
      className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-all border border-slate-50 bg-white"
    >
      <item.icon size={14} className="opacity-50"/>
      {item.title}
    </button>
  ))}
</div>

{/* Kotwica dla kalkulatora */}
<div id="kalkulator-fire" className="scroll-mt-24"></div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          
          {/* LEWA KOLUMNA - PARAMETRY */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
              
              <div className="mb-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm border-b pb-2">
                   <Wallet className="text-rose-600"/> Twoje finanse
                </h3>
                <div className="space-y-4">
                    <InputGroup label="Twój wiek" value={currentAge} onChange={setCurrentAge} suffix="lat" step={1} description="Wiek startowy symulacji."/>
                    <InputGroup label="Obecny kapitał" value={currentSavings} onChange={setCurrentSavings} suffix="PLN" step={1000} description="Oszczędności, akcje, obligacje, IKE/IKZE."/>
                    <InputGroup label="Miesięczne wydatki" value={monthlyExpenses} onChange={setMonthlyExpenses} suffix="PLN" step={100} description="Ile potrzebujesz miesięcznie na życie (po rzuceniu pracy)."/>
                    <InputGroup label="Miesięczne oszczędności" value={monthlySavings} onChange={setMonthlySavings} suffix="PLN" step={100} description="Kwota, którą inwestujesz każdego miesiąca."/>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm border-b pb-2">
                   <TrendingUp className="text-blue-600"/> Parametry rynkowe
                </h3>
                <div className="space-y-4">
                    <InputGroup label="Zysk z inwestycji (Nominalny)" value={roi} onChange={setRoi} suffix="%" step={0.1} description="Średni roczny zwrot (np. 7-8% dla S&P 500)."/>
<InputGroup label="Inflacja" value={inflation} onChange={setInflation} suffix="%" step={0.1} description="Prognozowany średni wzrost cen w 2026 r."/>
                    <InputGroup label="Reguła wypłaty (SWR)" value={withdrawalRate} onChange={setWithdrawalRate} suffix="%" step={0.1} description="Standardowo 4%. Tyle kapitału wypłacasz rocznie na życie."/>
                </div>
              </div>

            </div>
          </div>

          {/* PRAWA KOLUMNA - WYNIKI */}
          <div className="lg:col-span-8 space-y-6">
             
             {/* LICZBA FIRE */}
             <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-center">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Twoja Liczba FIRE (Cel)</div>
                    <div className="text-3xl lg:text-4xl font-black mb-2">{formatMoney(simulation.fireNumber)}</div>
                    <div className="text-xs text-slate-400 leading-relaxed">
    Tyle kapitału potrzebujesz (w sile nabywczej z 2026 r.), aby przy wypłacie {withdrawalRate}% rocznie pokryć wydatki {formatMoney(monthlyExpenses)}/msc bez uszczuplania majątku.
</div>
                </div>

                <div className={`p-6 rounded-3xl shadow-lg flex flex-col justify-center text-white transition-colors duration-500 ${simulation.fireAge ? 'bg-gradient-to-br from-rose-500 to-orange-600' : 'bg-slate-500'}`}>
                    {simulation.fireAge ? (
                        <>
                            <div className="text-xs font-bold text-rose-100 uppercase mb-1">Wolność finansowa w wieku</div>
                            <div className="text-5xl font-black mb-2 flex items-baseline gap-2">
                                {simulation.fireAge} <span className="text-lg font-medium opacity-80">lat</span>
                            </div>
                            <div className="text-xs text-rose-100 font-medium">
                                To za <strong>{simulation.yearsToGo} lat</strong>. Wytrwałości!
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <span className="text-2xl font-bold">Cel poza zasięgiem</span>
                            <p className="text-xs mt-2 opacity-80">Przy obecnych parametrach nie osiągniesz wolności finansowej w ciągu najbliższych 60 lat. Zwiększ oszczędności lub zwrot z inwestycji.</p>
                        </div>
                    )}
                </div>
             </div>

             {/* WYKRES */}
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-[400px]">
                <h4 className="font-bold text-slate-800 mb-6 text-center text-sm uppercase tracking-wide">Ścieżka wzrostu Twojego majątku</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simulation.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="age" type="number" domain={['dataMin', 'dataMax']} tickCount={10} fontSize={12} label={{ value: 'Wiek', position: 'insideBottomRight', offset: -5, fontSize: 10 }}/>
                        <YAxis fontSize={12} tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(val) => formatMoney(val)} labelFormatter={(val) => `Wiek: ${val}`}/>
                        <ReferenceLine y={simulation.fireNumber} label="Cel FIRE" stroke="#10b981" strokeDasharray="5 5" />
                        <Area type="monotone" dataKey="portfolio" name="Majątek" stroke="#f43f5e" fill="url(#colorPortfolio)" strokeWidth={3}/>
                    </AreaChart>
                </ResponsiveContainer>
             </div>
             
             {/* LINK DO INWESTOWANIA */}
             <div onClick={scrollToKnowledge} className="mt-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm cursor-pointer group hover:border-rose-300 transition-all">
                <div className="flex items-center gap-4">
                   <div className="bg-rose-100 p-3 rounded-full text-rose-600 group-hover:scale-110 transition-transform">
                       <ArrowRight size={24}/>
                   </div>
                   <div>
                       <h4 className="font-bold text-slate-900 text-lg group-hover:text-rose-600 transition-colors">Jak zbudować taki kapitał?</h4>
                       <p className="text-slate-500 text-sm">Przejdź do kompendium wiedzy o strategii FIRE i regule 4% 👇</p>
                   </div>
                </div>
             </div>

          </div>
        </div>

        {/* ==========================================================================
            KOMPENDIUM WIEDZY (PROFESOR LEVEL)
            ==========================================================================
        */}
        <div id="kompendium" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-slate-700 leading-relaxed scroll-mt-24">
            
            {/* Header sekcji edukacyjnej */}
            <div className="max-w-4xl mx-auto mb-16">
                <div className="flex items-center gap-2 mb-4 text-rose-600 font-bold text-sm uppercase tracking-widest">
                    <BookOpen size={16}/> Uniwersytet Finansowy
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                    Filozofia FIRE: Więcej niż pieniądze
                </h3>
                <p className="text-lg text-slate-600">
                    FIRE (Financial Independence, Retire Early) to nie tylko akronim. To zmiana paradygmatu myślenia o pracy i pieniądzach. Celem nie jest "leżenie na plaży", ale <strong>odzyskanie kontroli nad swoim czasem</strong>. Kiedy Twoje aktywa generują wystarczający dochód, praca staje się opcją, a nie koniecznością.
                </p>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-20">

                {/* CZĘŚĆ 1: MATEMATYKA (Reguła 4% i 25x) */}
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Calculator className="text-rose-600"/> Fundament: Reguła 4%
                        </h4>
                        <p className="text-sm text-justify">
                            Reguła ta pochodzi ze słynnego badania <em>Trinity Study</em> (1998). Naukowcy przeanalizowali historyczne stopy zwrotu z giełdy i obligacji w USA w XX wieku. Wniosek?
                        </p>
                        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                            <p className="text-rose-900 font-medium italic mb-2">
                                "Jeśli posiadasz portfel inwestycyjny (np. 50% akcji / 50% obligacji), możesz bezpiecznie wypłacać z niego <strong>4% wartości początkowej</strong> rocznie (korygując o inflację), a pieniędzy wystarczy Ci na co najmniej 30 lat."
                            </p>
                        </div>
                        <p className="text-sm">
                            W praktyce oznacza to odwrócenie równania. Aby wiedzieć, ile potrzebujesz zgromadzić (Liczba FIRE), mnożysz swoje roczne wydatki przez 25.
                            <br/><br/>
                            <code>Wydatki roczne × 25 = Wolność</code>
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Target className="text-blue-600"/> Odmiany FIRE (Trendy)
                        </h4>
                        <p className="text-sm text-slate-600 mb-4">
                            Nie każdy celuje w to samo. Społeczność wykształciła kilka strategii:
                        </p>
                        
                        <div className="space-y-3">
                            <div className="group bg-white border border-slate-200 p-4 rounded-xl hover:border-rose-300 transition-all">
                                <strong className="text-slate-900 block mb-1 group-hover:text-rose-600">Lean FIRE (Wersja minimalistyczna)</strong>
                                <p className="text-xs text-slate-500">
                                    Dla osób, które potrafią żyć bardzo oszczędnie. Celujesz w pokrycie tylko podstawowych wydatków. Wymaga najmniej kapitału (np. 300-500 tys. zł + własny dom).
                                </p>
                            </div>
                            <div className="group bg-white border border-slate-200 p-4 rounded-xl hover:border-purple-300 transition-all">
                                <strong className="text-slate-900 block mb-1 group-hover:text-purple-600">Fat FIRE (Wersja luksusowa)</strong>
                                <p className="text-xs text-slate-500">
                                    Dla tych, którzy na emeryturze chcą podróżować i nie liczyć każdej złotówki. Wymaga dużego portfela (często &gt; 5 mln zł), ale daje pełną swobodę.
                                </p>
                            </div>
                            <div className="group bg-white border border-slate-200 p-4 rounded-xl hover:border-green-300 transition-all">
                                <strong className="text-slate-900 block mb-1 group-hover:text-green-600">Barista FIRE (Pół-emerytura)</strong>
                                <p className="text-xs text-slate-500">
                                    Zgromadziłeś połowę potrzebnej kwoty? Możesz rzucić stresującą korporację i pracować na pół etatu w kawiarni (stąd nazwa) lub realizować pasje, by pokryć tylko bieżące rachunki. Kapitał rośnie w tle (<Link to="/procent-skladany" className="underline hover:text-green-600 font-bold">procent składany</Link>).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100"/>

                {/* CZĘŚĆ 2: NARZĘDZIA INWESTYCYJNE */}
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Gdzie budować ten kapitał?</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link to="/gielda" className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all group">
                            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                <TrendingUp size={24}/>
                            </div>
                            <h4 className="font-bold text-slate-900 mb-2">ETF i Giełda</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Podstawa strategii FIRE. Inwestując w fundusze indeksowe (np. na S&P 500 lub cały świat), kupujesz kawałek globalnej gospodarki. Historycznie daje to ok. 7-10% zysku rocznie (przed inflacją).
                            </p>
                        </Link>

                        <Link to="/obligacje" className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all group">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ShieldCheck size={24}/>
                            </div>
                            <h4 className="font-bold text-slate-900 mb-2">Obligacje EDO</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Bezpieczna przystań. Polskie 10-letnie obligacje skarbowe (EDO) są indeksowane inflacją. To idealne narzędzie do ochrony zgromadzonego kapitału przed utratą siły nabywczej.
                            </p>
                        </Link>

                        <Link to="/ike-ikze" className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all group">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Landmark size={24}/>
                            </div>
                            <h4 className="font-bold text-slate-900 mb-2">IKE oraz IKZE</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Wróg numer 1 to podatki. Konta emerytalne pozwalają uniknąć 19% podatku Belki. W horyzoncie 20-30 lat daje to dodatkowe setki tysięcy złotych zysku dzięki procentowi składanemu.
                            </p>
                        </Link>
                    </div>
                </div>

                {/* CZĘŚĆ 3: ZAGROŻENIA */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                    <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-3 rounded-full text-orange-600 shrink-0">
                            <Hourglass size={24}/>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Pułapka: Sekwencja stóp zwrotu (Sequence of Returns Risk)</h4>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Największym zagrożeniem dla emeryta FIRE jest krach na giełdzie w pierwszych latach po rzuceniu pracy. Jeśli Twoje portfolio spadnie o 40% zaraz po przejściu na emeryturę, a Ty nadal będziesz wypłacać pieniądze na życie, kapitał może się wyczerpać zbyt szybko.
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                                <strong>Rozwiązanie:</strong> Posiadanie poduszki finansowej ("Cash Cushion") na 2-3 lata wydatków w bezpiecznych obligacjach lub gotówce, aby nie musieć sprzedawać akcji podczas bessy.
                            </p>
                        </div>
                    </div>
                </div>

{/* SEKCJA: STOPA OSZCZĘDNOŚCI - SILNIK RAKIETY */}
<div id="stopa-oszczednosci" className="mt-20 scroll-mt-24">
    <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
        {/* Dekoracja w tle */}
        <Zap size={400} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-rose-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                    <TrendingUp size={14}/> Turbo-doładowanie Wolności
                </div>
                <h4 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-left">
                    Stopa Oszczędności: <br/>
                    <span className="text-rose-500">Ważniejsza niż zysk</span>
                </h4>
                <p className="text-slate-400 text-lg leading-relaxed text-left">
                    Wielu inwestorów traci czas na szukanie "magicznego" instrumentu dającego 2% więcej zysku. Tymczasem zwiększenie stopy oszczędności o 10% potrafi skrócić Twoją drogę do emerytury o dekadę. 
                </p>
                
                <div className="space-y-4 text-left">
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                        <div className="p-2 bg-rose-500/20 text-rose-500 rounded-lg"><Clock size={20}/></div>
                        <div>
                            <p className="text-sm font-bold">Matematyka czasu</p>
                            <p className="text-xs text-slate-500 leading-relaxed">Jeśli odkładasz 10% dochodu, musisz pracować 9 lat, by opłacić 1 rok wolności. Jeśli odkładasz 50% – każdy rok pracy daje Ci rok wolności.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-left">
                        <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><Repeat size={20}/></div>
                        <div>
                            <p className="text-sm font-bold">Podwójna korzyść</p>
                            <p className="text-xs text-slate-500 leading-relaxed">Niższe wydatki to nie tylko więcej pieniędzy na inwestycje, ale też niższa <strong className="text-slate-300">Liczba FIRE</strong>, którą musisz osiągnąć.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* WIZUALIZACJA: TABELA PRĘDKOŚCI */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-sm">
                <h5 className="text-center font-bold text-sm uppercase tracking-widest mb-8 text-slate-400">
                    Czas do FIRE (przy 5% zysku realnego)
                </h5>
                <div className="space-y-6">
                    {[
                        { rate: "10%", years: "51 lat", color: "bg-slate-700", width: "w-[100%]" },
                        { rate: "25%", years: "32 lata", color: "bg-indigo-700", width: "w-[65%]" },
                        { rate: "50%", years: "17 lat", color: "bg-rose-600", width: "w-[35%]" },
                        { rate: "70%", years: "8,5 roku", color: "bg-orange-500", width: "w-[18%]" },
                    ].map((item, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase">
                                <span>Oszczędzasz {item.rate}</span>
                                <span className="text-slate-400">{item.years} pracy</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full ${item.color} ${item.width} rounded-full transition-all duration-1000`}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-10 p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-center">
                    <p className="text-[10px] text-rose-300 font-medium leading-relaxed">
                        To dlatego <Link to="/procent-skladany" className="underline font-black hover:text-white">procent składany</Link> najlepiej działa na dużych kwotach. Im wyższa stopa oszczędności na starcie, tym szybciej "odpalasz" silnik bogactwa.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

{/* SEKCJA: COAST FIRE - JASNA I CZYTELNA WERSJA */}
<div id="coast-fire" className="mt-16 scroll-mt-24">
    <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-xl relative overflow-hidden text-left">
        
        {/* Dekoracyjne błękitne koło w tle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 space-y-12">
            
            {/* NAGŁÓWEK */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8 text-left">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 shrink-0">
                        <Ship size={28} />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Coast FIRE</h4>
                        <p className="text-blue-600 font-bold text-left text-xs uppercase tracking-[0.2em]">Strategia: Odstawienie wioseł</p>
                    </div>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-widest">
                    Status: Automatyczny Wzrost
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
                    <p>
                        To najbardziej wyzwalający etap drogi do wolności. <strong>Coast FIRE</strong> to moment, w którym masz już w portfelu tyle pieniędzy, że nawet jeśli <strong>nigdy więcej nie wpłacisz ani złotówki</strong>, Twój kapitał i tak urośnie do miliona przed Twoją emeryturą.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-bold text-slate-900">Koniec presji oszczędzania</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-bold text-slate-900">Wolność wyboru pracy</span>
                        </div>
                    </div>
                </div>

                {/* WIZUALNY WZÓR - CZYTELNY DLA CZŁOWIEKA */}
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 relative">
                    <div className="absolute -top-3 left-8 bg-white px-4 py-1 rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                        Jak to obliczyć?
                    </div>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="text-slate-400 font-bold text-xs uppercase">Kwota Coast FIRE =</div>
                        <div className="flex flex-col items-center">
                            <div className="text-xl md:text-2xl font-black text-slate-900 border-b-2 border-slate-300 pb-2 mb-2 px-6">
                                Twój Cel (Liczba FIRE)
                            </div>
                            <div className="text-xl md:text-2xl font-black text-blue-600 italic">
                                (1 + zysk) <sup className="text-xs font-bold text-slate-400">lata do celu</sup>
                            </div>
                        </div>
                    </div>
                    <p className="mt-6 text-[10px] text-slate-400 text-center italic leading-relaxed">
                        To "odwrócony" <Link to="/procent-skladany" className="text-blue-600 underline font-bold">procent składany</Link>. Sprawdzamy, jaką kwotę musisz mieć dzisiaj, aby czas dowiezie Cię do celu.
                    </p>
                </div>
            </div>

            {/* TABELA - CZYSTA I CZYTELNA */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="bg-slate-50 p-6 border-b border-slate-100">
                    <h5 className="font-bold text-center text-slate-900 text-sm uppercase tracking-widest">Ile musisz mieć dziś, by mieć 2 mln na emeryturze?</h5>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                                <th className="p-6">Twój wiek</th>
                                <th className="p-6">Kwota potrzebna "na już"</th>
                                <th className="p-6">Wniosek</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                                <td className="p-6 font-black text-slate-900">25 lat</td>
                                <td className="p-6 font-black text-blue-600 text-lg">~ 135 000 PLN</td>
                                <td className="p-6 text-slate-500 text-xs leading-relaxed">Przy 7% zysku, te pieniądze same urosną do 2 mln zł w wieku 65 lat.</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                                <td className="p-6 font-black text-slate-900">35 lat</td>
                                <td className="p-6 font-black text-blue-600 text-lg">~ 270 000 PLN</td>
                                <td className="p-6 text-slate-500 text-xs leading-relaxed">Masz mniej czasu, więc Twoja baza startowa musi być dwukrotnie większa.</td>
                            </tr>
                            <tr className="hover:bg-blue-50/30 transition-colors">
                                <td className="p-6 font-black text-slate-900">45 lat</td>
                                <td className="p-6 font-black text-blue-600 text-lg">~ 540 000 PLN</td>
                                <td className="p-6 text-slate-500 text-xs leading-relaxed">Zostało tylko 20 lat wzrostu. Twoja rakieta potrzebuje więcej paliwa na start.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SYNERGIA - GDZIE SZUKAĆ WIEDZY? */}
            <div className="grid md:grid-cols-3 gap-6 pt-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left group hover:border-blue-200 transition-all">
                    <Anchor className="text-blue-500 mb-3" size={24}/>
                    <h6 className="font-bold text-slate-900 text-xs mb-1 uppercase">Ochrona Bazy</h6>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                        W modelu Coast FIRE nie ryzykujesz. Część kapitału przenieś do <Link to="/zloto" className="text-blue-600 font-bold hover:underline">Złota</Link>, aby chronić wypracowany fundament.
                    </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left group hover:border-blue-200 transition-all">
                    <ShieldCheck className="text-blue-500 mb-3" size={24}/>
                    <h6 className="font-bold text-slate-900 text-xs mb-1 uppercase">Tarcza Podatkowa</h6>
                    <p className="text-[11px] text-slate-500 leading-relaxed text-left">
                        Uniknięcie podatku Belki w <Link to="/ike-ikze" className="text-blue-600 font-bold hover:underline">IKE</Link> skraca czas do osiągnięcia Coast FIRE o około 5-7 lat.
                    </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left group hover:border-blue-200 transition-all">
                    <Zap className="text-blue-500 mb-3" size={24}/>
                    <h6 className="font-bold text-slate-900 text-xs mb-1 uppercase">Prędkość przelotowa</h6>
                    <p className="text-[11px] text-slate-500 leading-relaxed text-left">
                        Osiągnięcie Coast FIRE pozwala Ci przejść na <strong className="text-slate-700">Barista FIRE</strong> (pół-emeryturę) znacznie szybciej.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>


{/* SEKCJA: RYZYKO SEKWENCJI - SZTORMOWA NAWIGACJA */}
<div id="ryzyko-sekwencji" className="mt-16 scroll-mt-24">
    <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-xl relative overflow-hidden text-left">
        
        {/* Dekoracyjne fale w tle */}
        <Waves size={400} className="absolute -bottom-20 -right-20 text-blue-50/50 rotate-12 pointer-events-none" />

        <div className="relative z-10 space-y-12">
            
            {/* NAGŁÓWEK */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8 text-left">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 shrink-0">
                        <AlertTriangle size={28} />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Ryzyko Sekwencji</h4>
                        <p className="text-orange-600 font-bold text-left text-xs uppercase tracking-[0.2em]">Największe zagrożenie dla Rentiera</p>
                    </div>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 text-orange-700 font-bold text-[10px] uppercase tracking-widest text-left">
                    Poziom: Ekspert (Risk Management)
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
                    <p>
                        Wyobraź sobie, że właśnie rzuciłeś pracę. Masz swój milion, wypłacasz 4% rocznie. Nagle... giełda spada o 30%. To jest właśnie <strong>Sequence of Returns Risk</strong>. 
                    </p>
                    <p className="text-sm">
                        Jeśli krach nastąpi na początku Twojej emerytury, a Ty będziesz musiał sprzedawać akcje w dołku, by mieć na życie, Twój kapitał może się nigdy nie odbudować. To znacznie groźniejsze niż bessa w trakcie fazy akumulacji.
                    </p>
                    
                    <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-orange-500 text-left">
                        <h5 className="font-bold text-slate-900 mb-2">Pojedynek: Pechowiec vs Szczęściarz</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Obaj mają średni zysk 7% rocznie. Ale <strong>Pechowiec</strong> zalicza spadki w 1. i 2. roku emerytury – jego portfel kończy się po 15 latach. <strong>Szczęściarz</strong> zalicza spadki na końcu – jego majątek rośnie w nieskończoność.
                        </p>
                    </div>
                </div>

                {/* WIZUALIZACJA: SYSTEM OBRONNY */}
                <div className="space-y-4">
                    <h5 className="text-xl font-black text-slate-900 mb-6 text-center lg:text-left">Twoja tarcza: Cash Cushion (Poduszka gotówkowa)</h5>
                    
                    <div className="grid gap-4">
                        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-4 hover:border-blue-300 transition-all">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl font-black">1</div>
                            <div>
                                <h6 className="font-bold text-slate-900 text-sm mb-1 text-left">2-3 lata wydatków w gotówce</h6>
                                <p className="text-[11px] text-slate-500 leading-relaxed text-left">Trzymaj równowartość 24-36 miesięcy życia na kontach oszczędnościowych lub obligacjach krótkoterminowych.</p>
                            </div>
                        </div>

                        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-4 hover:border-yellow-400 transition-all">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl font-black">2</div>
                            <div>
                                <h6 className="font-bold text-slate-900 text-sm mb-1 text-left">Złoto jako stabilizator</h6>
                                <p className="text-[11px] text-slate-500 leading-relaxed text-left">W czasie krachu na giełdzie <Link to="/zloto" className="text-yellow-600 font-bold hover:underline text-left">Złoto</Link> zazwyczaj zyskuje lub trzyma wartość, pozwalając Ci przeczekać sztorm bez wyprzedaży akcji.</p>
                            </div>
                        </div>

                        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-4 hover:border-rose-400 transition-all">
                            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl font-black">3</div>
                            <div>
                                <h6 className="font-bold text-slate-900 text-sm mb-1 text-left">Dynamiczna wypłata</h6>
                                <p className="text-[11px] text-slate-500 leading-relaxed text-left">Gdy rynek spada, ogranicz zbędne wydatki. Zmniejszenie wypłaty o 1% w trudnych latach drastycznie zwiększa szansę na przetrwanie portfela.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SYNERGIA I LINKOWANIE */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden text-left shadow-2xl">
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <h5 className="text-2xl font-black text-left">Pamiętaj o Podatku Belki!</h5>
                        <p className="text-slate-400 text-sm leading-relaxed text-left">
                            Podczas wypłat w fazie rentierskiej, Twoim "cichym złodziejem" jest podatek od zysków. Jeśli nie korzystasz z <Link to="/ike-ikze" className="text-orange-400 font-bold hover:text-orange-300">IKE / IKZE</Link>, musisz doliczyć 19% do swoich planowanych wypłat, co zwiększa Twoją <strong>Liczbę FIRE</strong> o niemal jedną piątą!
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer" onClick={() => navigate('/procent-skladany')}>
                            <span className="text-xs font-bold">Sprawdź wpływ podatków na kapitał</span>
                            <ArrowRight size={16} className="text-orange-400 group-hover:translate-x-2 transition-transform" />
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer" onClick={() => navigate('/zloto')}>
                            <span className="text-xs font-bold text-left">Rola złota w portfelu rentiera</span>
                            <ArrowRight size={16} className="text-orange-400 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </div>
                </div>
                <Hourglass size={300} className="absolute -bottom-24 -right-24 text-white/5 rotate-12" />
            </div>
        </div>
    </div>
</div>


{/* SEKCJA: BARISTA FIRE - HYBRYDOWA WOLNOŚĆ */}
<div id="barista-fire" className="mt-16 scroll-mt-24">
    <div className="bg-rose-50 rounded-[3rem] p-8 md:p-16 border border-rose-100 shadow-sm relative overflow-hidden text-left">
        
        {/* Dekoracyjne ziarna kawy w tle */}
        <Coffee size={400} className="absolute -bottom-20 -left-20 text-rose-200/20 rotate-12 pointer-events-none" />

        <div className="relative z-10 space-y-12">
            
            {/* NAGŁÓWEK */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-rose-200 pb-8 text-left">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 shrink-0">
                        <Coffee size={28} />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight text-left">Barista FIRE</h4>
                        <p className="text-rose-600 font-bold text-left text-xs uppercase tracking-[0.2em]">Model: Pół-emerytura z pasją</p>
                    </div>
                </div>
                <div className="bg-white px-6 py-2 rounded-full border border-rose-200 text-rose-700 font-black text-[10px] uppercase tracking-widest shadow-sm">
                    Poziom: Optymalny (Dla każdego)
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-8 text-slate-600 text-lg leading-relaxed text-left">
                    <p>
                        Nie musisz mieć milionów, by rzucić wyścig szczurów. <strong>Barista FIRE</strong> zakłada, że Twój kapitał pokrywa 60-70% Twoich wydatków, a resztę dorabiasz w lekkiej, przyjemnej pracy, która sprawia Ci frajdę.
                    </p>
                    
                    <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <h5 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                 <Stethoscope size={18} className="text-rose-600"/> Klucz: Ubezpieczenie i Ludzie
                            </h5>
                            <p className="text-sm text-slate-500 mb-4 text-left">
                                Wiele osób wybiera tę drogę, by utrzymać ubezpieczenie zdrowotne i kontakt z ludźmi. Pracujesz 15-20 godzin tygodniowo – bez stresu, bo wiesz, że Twój portfel i tak rośnie w tle dzięki <Link to="/procent-skladany" className="text-rose-600 font-bold hover:underline">kapitalizacji</Link>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* WIZUALIZACJA: KARTA BALANSU ŻYCIA */}
                <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-rose-100 relative group overflow-hidden">
                    <div className="relative z-10 space-y-10">
                        <div className="text-center">
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em]">Twoje nowe 100% życia</span>
                        </div>

                        {/* Pasek postępu - wizualizacja proporcji */}
                        <div className="flex items-center gap-2 h-12 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                            <div className="h-full bg-rose-500 w-[65%] flex items-center justify-center text-[10px] font-black text-white uppercase tracking-tighter">Portfel (65%)</div>
                            <div className="h-full bg-rose-300 w-[35%] flex items-center justify-center text-[10px] font-black text-slate-600 uppercase tracking-tighter">Praca (35%)</div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 text-left">
                            <div className="space-y-2">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block text-left">Majątek generuje:</span>
                                <div className="text-2xl font-black text-slate-900 text-left">4 000 zł</div>
                                <p className="text-[9px] text-slate-400 text-left">Pasywne pokrycie bazy</p>
                            </div>
                            <div className="space-y-2 border-l border-slate-100 pl-6 text-left">
                                <span className="text-[10px] text-rose-400 font-bold uppercase block text-left">Lekka praca daje:</span>
                                <div className="text-2xl font-black text-rose-600 text-left">2 200 zł</div>
                                <p className="text-[9px] text-rose-400 text-left">Bonus + Ubezpieczenie</p>
                            </div>
                        </div>

                        <div className="bg-rose-900 rounded-3xl p-6 text-white text-center">
                            <div className="text-xs font-bold text-rose-300 uppercase mb-1">Budżet na życie:</div>
                            <div className="text-3xl font-black tracking-tighter">6 200 PLN / msc</div>
                        </div>
                    </div>
                    <Sun size={150} className="absolute -bottom-10 -right-10 text-rose-50 opacity-40 rotate-12" />
                </div>
            </div>

            {/* TRZY FILARY BARISTA FIRE */}
            <div className="grid md:grid-cols-3 gap-8 pt-8">
                <div className="text-left space-y-3 p-6 bg-white/40 rounded-2xl border border-rose-100/50 hover:bg-white transition-all group">
                    <div className="text-rose-500 group-hover:scale-110 transition-transform"><Hourglass size={24}/></div>
                    <h6 className="font-bold text-slate-900 uppercase text-xs tracking-wider text-left">Odzyskany Czas</h6>
                    <p className="text-[11px] text-slate-500 leading-relaxed text-left">Pracujesz tylko wtedy, gdy chcesz. Masz czas na hobby, rodzinę i podróże, gdy inni siedzą w biurze.</p>
                </div>
                <div className="text-left space-y-3 p-6 bg-white/40 rounded-2xl border border-rose-100/50 hover:bg-white transition-all group">
                    <div className="text-rose-500 group-hover:scale-110 transition-transform"><ShieldCheck size={24}/></div>
                    <h6 className="font-bold text-slate-900 uppercase text-xs tracking-wider text-left">Bezpiecznik Portfela</h6>
                    <p className="text-[11px] text-slate-500 leading-relaxed text-left">Praca w gorszych latach na giełdzie pozwala nie naruszać kapitału, co drastycznie obniża <button onClick={() => scrollToSection('ryzyko-sekwencji')} className="text-rose-600 font-bold hover:underline">Ryzyko Sekwencji</button>.</p>
                </div>
                <div className="text-left space-y-3 p-6 bg-white/40 rounded-2xl border border-rose-100/50 hover:bg-white transition-all group">
                    <div className="text-rose-500 group-hover:scale-110 transition-transform"><Heart size={24}/></div>
                    <h6 className="font-bold text-slate-900 uppercase text-xs tracking-wider text-left">Zdrowie Psychiczne</h6>
                    <p className="text-[11px] text-slate-500 leading-relaxed text-left">Poczucie bycia potrzebnym bez presji zarobkowej to najlepszy sposób na uniknięcie "depresji rentiera".</p>
                </div>
            </div>
        </div>
    </div>
</div>

{/* SEKCJA: PORÓWNANIE STYLÓW FIRE */}
<div id="style-fire" className="mt-16 scroll-mt-24 text-left">
    <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-xl relative overflow-hidden">
        
        {/* Dekoracja */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl opacity-40 -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-12">
            
            {/* NAGŁÓWEK */}
            <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <PieChart size={14}/> Strategia dopasowana do Ciebie
                </div>
                <h4 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                    Wybierz swoją <span className="text-rose-600">prędkość</span> wolności
                </h4>
                <p className="text-slate-500 text-lg leading-relaxed">
                    FIRE to nie jest jeden rozmiar dla wszystkich. Twoja "Liczba FIRE" zmienia się drastycznie w zależności od tego, czy planujesz życie minimalisty, czy chcesz podróżować po świecie bez ograniczeń.
                </p>
            </div>

            {/* TRZY KARTY STYLÓW */}
            <div className="grid lg:grid-cols-3 gap-6">
                
                {/* LEAN FIRE */}
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between group hover:border-rose-200 transition-all">
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-rose-600 shadow-sm transition-colors">
                            <Leaf size={24} />
                        </div>
                        <div>
                            <h5 className="text-xl font-black text-slate-900 mb-2">Lean FIRE</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Dla minimalistów. Skupiasz się na pokryciu tylko podstawowych potrzeb: mieszkanie, jedzenie, zdrowie. 
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Szacowany kapitał:</div>
                            <div className="text-2xl font-black text-slate-900">750k – 1.2 mln PLN</div>
                        </div>
                    </div>
                    <ul className="mt-8 space-y-3 border-t border-slate-200 pt-6">
                        <li className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                            <CheckCircle size={14} className="text-green-500" /> Najszybsza droga do wolności
                        </li>
                        <li className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                            <CheckCircle size={14} className="text-green-500" /> Niska odporność na inflację
                        </li>
                    </ul>
                </div>

                {/* STANDARD FIRE */}
                <div className="p-8 bg-white rounded-[2.5rem] border-4 border-rose-100 flex flex-col justify-between shadow-lg relative z-20">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Najczęstszy wybór
                    </div>
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
                            <Target size={24} />
                        </div>
                        <div>
                            <h5 className="text-xl font-black text-slate-900 mb-2">Standard FIRE</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Zachowanie obecnego poziomu życia. Pozwala na hobby, okazjonalne podróże i bezpieczny bufor na niespodziewane wydatki.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Szacowany kapitał:</div>
                            <div className="text-2xl font-black text-rose-600">1.5 – 3 mln PLN</div>
                        </div>
                    </div>
                    <ul className="mt-8 space-y-3 border-t border-slate-100 pt-6">
                        <li className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                            <CheckCircle size={14} className="text-green-500" /> Balans między czasem a komfortem
                        </li>
                        <li className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                            <CheckCircle size={14} className="text-green-500" /> Możliwość stosowania <Link to="/procent-skladany" className="underline font-bold">reguły 4%</Link>
                        </li>
                    </ul>
                </div>

                {/* FAT FIRE */}
                <div className="p-8 bg-slate-900 rounded-[2.5rem] flex flex-col justify-between group text-white overflow-hidden relative">
                    <Sun size={150} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                    <div className="relative z-10 space-y-6">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-rose-400 shadow-sm">
                            <Palmtree size={24} />
                        </div>
                        <div>
                            <h5 className="text-xl font-black mb-2">Fat FIRE</h5>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Wolność bez kompromisów. Luksusowe podróże, najlepsza opieka medyczna i brak konieczności patrzenia na ceny.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Szacowany kapitał:</div>
                            <div className="text-2xl font-black text-white">5 mln PLN +</div>
                        </div>
                    </div>
                    <ul className="mt-8 space-y-3 border-t border-white/10 pt-6 relative z-10">
                        <li className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                            <CheckCircle size={14} className="text-rose-500" /> Pełna swoboda i luksus
                        </li>
                        <li className="flex items-center gap-2 text-[11px] text-slate-300 font-medium text-left">
                            <CheckCircle size={14} className="text-rose-500" /> Wymaga stabilizacji w <Link to="/zloto" className="text-rose-400 font-bold hover:underline">Złocie</Link>
                        </li>
                    </ul>
                </div>

            </div>

            {/* SYNERGIA I WNIOSKI */}
            <div className="grid md:grid-cols-2 gap-8 items-center pt-8">
                <div className="p-8 bg-rose-50 rounded-3xl border border-rose-100">
                    <h6 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                        <Info size={18}/> Pamiętaj o Inflacji 2026
                    </h6>
                    <p className="text-[11px] text-rose-800 leading-relaxed">
                        Twoja Liczba FIRE musi być liczona w sile nabywczej. Jeśli Twoje wydatki rosną, Twój cel również się przesuwa. Regularnie aktualizuj swoje obliczenia w kalkulatorze na górze strony, uwzględniając aktualny wskaźnik CPI.
                    </p>
                </div>
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 italic">
                        "Niezależnie od tego, którą ścieżkę wybierzesz, najtrudniejszy jest pierwszy milion. Później procent składany wykonuje 80% pracy za Ciebie."
                    </p>
                    <button onClick={() => scrollToSection('stopa-oszczednosci')} className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase hover:gap-4 transition-all">
                        Sprawdź jak przyspieszyć ten proces <ArrowRight size={14}/>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

{/* --- SEKCJA SEO: PYTANIA O FIRE 2026 --- */}
<div className="mt-24 border-t border-slate-100 pt-16">
    <div className="text-center mb-12">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Najczęściej szukane w 2026</h3>
        <p className="text-sm text-slate-500 italic">Dowiedz się więcej o strategii wolności finansowej</p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
            { kw: "Kiedy przejść na emeryturę kalkulator", id: "kalkulator-fire" },
            { kw: "Ile trzeba oszczędzać na FIRE", id: "stopa-oszczednosci" },
            { kw: "Zasada 4 proc na czym polega", id: "kompendium" },
            { kw: "Coast FIRE kalkulator polska", id: "coast-fire" },
            { kw: "Ryzyko sekwencji stóp zwrotu", id: "ryzyko-sekwencji" },
            { kw: "Barista FIRE ubezpieczenie zdrowotne", id: "barista-fire" },
            { kw: "Ile kapitału na Fat FIRE", id: "style-fire" },
            { kw: "Wydatki roczne razy 25 wzór", id: "kompendium" },
            { kw: "Podatek Belki a wolność finansowa", id: "kompendium" },
            { kw: "Lean FIRE minimalizm finansowy", id: "style-fire" }
        ].map((item, i) => (
            <button 
                key={i}
                onClick={() => scrollToSection(item.id)}
                className="p-6 bg-white border border-slate-200 rounded-3xl text-left hover:border-rose-400 hover:shadow-md transition-all group"
            >
                <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                    <Search size={14}/>
                </div>
                <span className="text-[11px] font-black text-slate-800 leading-tight block text-left">
                    {item.kw}
                </span>
            </button>
        ))}
    </div>
</div>


        </div>
        <Waves size={400} className="absolute -bottom-40 -left-40 text-white/5 rotate-12 pointer-events-none" />
    </div>
</div>

    </>
  );
};