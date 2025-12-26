import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  Flame, TrendingUp, Target, Calculator, Info, Wallet, PieChart, ShieldCheck, ArrowRight, Hourglass, Landmark, Sun, BookOpen
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
  // --- STAN ---
  const [currentAge, setCurrentAge] = useState(30);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(5000); // Ile potrzebujesz na życie
  const [monthlySavings, setMonthlySavings] = useState(2000); // Ile odkładasz
  
  const [roi, setRoi] = useState(7.0); // Zysk roczny z inwestycji (nominalny)
  const [inflation, setInflation] = useState(2.5); // Inflacja
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
        <title>Kalkulator FIRE - Kiedy przejdziesz na emeryturę? | Finanse Proste</title>
        <meta name="description" content="Oblicz swoją drogę do wolności finansowej (FIRE). Sprawdź, ile musisz zgromadzić kapitału, aby żyć z odsetek i rzucić pracę na etacie. Reguła 4% w praktyce." />
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
                    <InputGroup label="Inflacja" value={inflation} onChange={setInflation} suffix="%" step={0.1} description="Średni wzrost cen. Obniża realną wartość zysków."/>
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
                        Tyle kapitału potrzebujesz (w dzisiejszych pieniądzach), aby przy wypłacie {withdrawalRate}% rocznie pokryć wydatki {formatMoney(monthlyExpenses)}/msc bez uszczuplania majątku ("w nieskończoność").
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

            </div>
        </div>

      </div>
    </>
  );
};