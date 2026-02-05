import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom'; // Dodano useNavigate
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp, AlertTriangle, Coins, Calculator, Lock, Calendar,
  ShieldCheck, Scale, Banknote, Atom, Globe, Pickaxe, History, Zap,
  Landmark, Layers, Hammer, Flame, Truck, ScrollText, Search,
  AlertOctagon, Microscope, Landmark as BankIcon, CandlestickChart,
  LineChart, PieChart, Rocket, Bitcoin, Anchor, RefreshCcw, ArrowDown, Info,
  ListTree, Gavel, Receipt, CheckCircle, Briefcase, MousePointer2, Home, Activity, Heart, ShieldAlert, PiggyBank, ArrowRightLeft, Sparkles, ArrowRight, TrendingDown // Dodano brakujące
} from 'lucide-react';

// --- STAE I DANE POMOCNICZE ---

const DEALER_SPREADS = {
  '1g': { buy: 20, sell: 5 },
  '5g': { buy: 12, sell: 4 },
  '1oz': { buy: 4.5, sell: 2.5 },
  '100g': { buy: 3.5, sell: 2 }
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title, colorClass = "text-slate-800", bgClass = "bg-slate-100" }) => (
  <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-200">
    <div className={`p-3 rounded-2xl ${bgClass} ${colorClass}`}><Icon size={32} /></div>
    <h3 className={`text-2xl font-bold ${colorClass}`}>{title}</h3>
  </div>
);

const SubHeader = ({ title }) => (
  <h4 className="text-lg font-bold text-slate-800 mt-8 mb-4 flex items-center gap-2 before:content-[''] before:block before:w-2 before:h-6 before:bg-yellow-400 before:rounded-full">{title}</h4>
);

const formatMoney = (val) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

export const GoldView = () => {
  const navigate = useNavigate(); // KLUCZOWA LINIA - MUSI TU BYĆ

  // --- FUNKCJA PRZEWIJANIA (Aby przyciski w Spisie Treści działały) ---
  const scrollToSection = (id) => {
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
  // --- STATE ---
  const [goldPriceSpot, setGoldPriceSpot] = useState(15500);
  const [investmentAmount, setInvestmentAmount] = useState(20000);
  const [selectedWeight, setSelectedWeight] = useState('1oz');
  const [holdingPeriod, setHoldingPeriod] = useState(5);

  // --- OBLICZENIA ---
  const calculation = useMemo(() => {
    const spread = DEALER_SPREADS[selectedWeight];
    
    // Cena "papierowa" (giełdowa) za gram
    const pricePerGramSpot = goldPriceSpot / 31.1035;
    
    // Rzeczywista cena u dealera (z marżą)
    const priceBuy = goldPriceSpot * (1 + spread.buy / 100);
    
    // Ile złota kupimy za naszą kwotę (w uncjach)
    const ouncesBought = investmentAmount / priceBuy;
    const gramsBought = ouncesBought * 31.1035;

    // Wartość natychmiastowa w skupie (gdybyś sprzedał od razu po wyjściu ze sklepu)
    const priceSellImmediate = goldPriceSpot * (1 - spread.sell / 100);
    const valueImmediate = ouncesBought * priceSellImmediate;
    
    const initialLoss = investmentAmount - valueImmediate;
    const initialLossPercent = (initialLoss / investmentAmount) * 100;

    // Próg rentowności
    const breakEvenSpot = priceBuy / (1 - spread.sell / 100);
    const requiredGrowth = ((breakEvenSpot - goldPriceSpot) / goldPriceSpot) * 100;

    return {
      priceBuy, ouncesBought, gramsBought, valueImmediate, initialLoss, initialLossPercent, breakEvenSpot, requiredGrowth, spread
    };
  }, [goldPriceSpot, investmentAmount, selectedWeight]);

  // --- OBLICZENIA DO WYKRESU ---
  const forecastData = useMemo(() => {
    const data = [];
    let currentGoldValue = calculation.valueImmediate;
    let currentCashValue = investmentAmount;
    
    // ZAŁOŻENIA DO OBLICZEŃ
    const assumedGoldGrowth = 6.0; 
    const assumedInflation = 4.0;  

    for (let i = 0; i <= holdingPeriod + 2; i++) {
      data.push({
        year: `Rok ${i}`,
        gold: Math.round(currentGoldValue),
        cash: Math.round(currentCashValue),
        breakEvenLine: investmentAmount
      });

      currentGoldValue = currentGoldValue * (1 + assumedGoldGrowth / 100);
      currentCashValue = currentCashValue / (1 + assumedInflation / 100);
    }
    return data;
  }, [calculation, holdingPeriod, investmentAmount]);

  return (
    <>
      <Helmet>
<title>Kalkulator Złota 2026 - Opłacalność i Kompendium | Finanse Proste</title>
<meta name="description" content="Kompleksowy przewodnik po inwestowaniu w złoto w 2026 r. Sprawdź marże, oblicz próg rentowności i poznaj strategię 'Safe Haven'." />
        <link rel="canonical" href="https://www.finanse-proste.pl/zloto" />
        
        {/* UKRYTE SEO */}
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "FinancialProduct",
                "name": "Kalkulator Inwestycji w Złoto Fizyczne",
                "description": "Narzędzie do symulacji kosztów spreadu i progu rentowności złota.",
                "brand": { "@type": "Brand", "name": "Finanse Proste" }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Co to jest spread na złocie?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Różnica między ceną sprzedaży a skupu u dealera." }
                  }
                ]
              }
            ]
          }
        `}
        </script>
      </Helmet>

      <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">

        {/* HERO */}
        <div className="text-center mb-12 mt-8">
           <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-yellow-200">
              <ShieldCheck size={14}/> Safe Haven Asset
           </div>
           <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900">
              Inwestowanie w <span className="text-yellow-500">złoto</span>
           </h2>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Sprawdź, ile realnie kosztuje Cię "bezpieczna przystań", ile zabiera dealer i kiedy inwestycja zacznie na siebie zarabiać. Poniżej kalkulatora znajdziesz <strong>kompletne kompendium wiedzy</strong>.
           </p>
        </div>

{/* --- SPIS TREŚCI: KOMPENDIUM AURUM ABSOLUTUM --- */}
        <div className="mb-16 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex flex-wrap justify-center gap-2 md:gap-3">
          <div className="w-full text-center mb-4">
            <ListTree size={16} className="inline-block mr-2 text-slate-400"/>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Nawigacja po wiedzy eksperckiej</span>
          </div>
          
          <button onClick={() => scrollToSection('kalkulator-zlota')} className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black text-white bg-yellow-600 hover:bg-yellow-700 transition-all shadow-lg shadow-yellow-100">
            <Calculator size={14}/> KALKULATOR
          </button>

          {[
            { title: "Historia i Ekonomia", id: "sekcja-historia", icon: History },
            { title: "Złoto Fizyczne", id: "sekcja-praktyka", icon: Coins },
            { title: "Podatki i Prawo", id: "sekcja-prawo", icon: Gavel },
            { title: "Autentyczność LBMA", id: "sekcja-lbma", icon: ShieldCheck },
            { title: "Logistyka", id: "sekcja-logistyka", icon: Lock },
            { title: "Dziedziczenie", id: "sekcja-dziedziczenie", icon: Heart },
            { title: "Standardy ESG", id: "sekcja-esg", icon: ShieldAlert },
            { title: "Zastaw i Płynność", id: "sekcja-lombard", icon: Banknote },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(item.id)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-yellow-50 hover:text-yellow-700 transition-all border border-slate-50 bg-white"
            >
              <item.icon size={14} className="opacity-50"/>
              {item.title}
            </button>
          ))}
        </div>

        {/* KALKULATOR */}
        <div id="kalkulator-zlota" className="scroll-mt-24"></div>
        <div className="grid lg:grid-cols-12 gap-8 mb-24">
          
          {/* LEWA KOLUMNA */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-slate-50 border-slate-200 sticky top-24">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calculator className="text-yellow-600"/> Parametry inwestycji
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Ile chcesz zainwestować?</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={investmentAmount} 
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 text-slate-900 text-xl font-bold rounded-xl p-4 pr-12 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">PLN</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Co kupujesz? (Waga)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {id: '1g', label: 'Sztabka 1g', sub: 'Wysoka marża!'},
                      {id: '5g', label: 'Sztabka 5g', sub: 'Średnia marża'},
                      {id: '1oz', label: 'Uncja (31g)', sub: 'Standard'},
                      {id: '100g', label: '100g', sub: 'Niski spread'} // Zmieniono opis
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setSelectedWeight(opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${selectedWeight === opt.id ? 'bg-yellow-50 border-yellow-400 ring-1 ring-yellow-400' : 'bg-white border-slate-200 hover:border-yellow-300'}`}
                      >
                        <div className={`font-bold text-sm ${selectedWeight === opt.id ? 'text-yellow-900' : 'text-slate-700'}`}>{opt.label}</div>
                        <div className="text-[10px] text-slate-400">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Cena rynkowa (SPOT 1oz)</label>
                  <div className="flex gap-2 items-center">
                     <input 
                      type="number" 
                      value={goldPriceSpot} 
                      onChange={(e) => setGoldPriceSpot(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 text-slate-900 font-bold rounded-xl p-3 text-sm"
                    />
                   <button 
  onClick={() => setGoldPriceSpot(15500)}
  className="bg-slate-200 p-3 rounded-xl hover:bg-slate-300 transition-colors text-slate-600"
  title="Przywróć orientacyjną cenę ze stycznia 2026"
>
                      <RefreshCcw size={18}/>
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2 leading-tight">
                    To cena "papierowa" na giełdzie, bez marży. Nie wiesz ile wpisać? <a href="https://stooq.pl/q/?s=xaupln" target="_blank" rel="noreferrer" className="text-blue-600 underline">Sprawdź kurs XAU/PLN</a>.
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm mt-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-red-50 p-2 rounded-lg text-red-500 shrink-0"><AlertTriangle size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-xs mb-1">Ukryty koszt (Spread)</h4>
                            <p className="text-[10px] text-slate-600 leading-relaxed mb-2">
                               Dealer narzuca marżę ok. <strong>{calculation.spread.buy}%</strong> przy sprzedaży i potrąca <strong>{calculation.spread.sell}%</strong> przy skupie.
                            </p>
                            <div className="text-red-600 font-bold text-xs">
                               Tracisz na start: {formatMoney(calculation.initialLoss)}
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </Card>
          </div>

          {/* PRAWA KOLUMNA */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 text-white border-none">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-2">Posiadasz złota</div>
                    <div className="text-3xl font-black text-yellow-400 mb-1">
                        {calculation.gramsBought.toFixed(2)} g
                    </div>
                    <div className="text-xs text-slate-500">
                        {calculation.ouncesBought.toFixed(3)} oz
                    </div>
                </Card>
                
                <Card className="relative overflow-hidden bg-white">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-2">Próg rentowności</div>
                    <div className="text-2xl font-black text-slate-900 mb-1">
                        {formatMoney(calculation.breakEvenSpot)}
                    </div>
                    <div className="text-xs font-bold text-red-500 flex items-center gap-1">
                        <TrendingUp size={12}/> Cena musi wzrosnąć o {calculation.requiredGrowth.toFixed(1)}%
                    </div>
                    <div className="absolute -bottom-4 -right-4 text-slate-100"><Scale size={80}/></div>
                </Card>

                <Card className="bg-green-50 border-green-200">
                    <div className="text-green-800 text-xs font-bold uppercase mb-2">Podatek (PIT/Belki)</div>
                    <div className="text-3xl font-black text-green-700 mb-1">
                        0 zł
                    </div>
                    <div className="text-xs text-green-800 opacity-80">
                        Warunek: Sprzedaż po upływie 6 miesięcy od zakupu.
                    </div>
                </Card>
            </div>

            <Card className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="text-blue-500"/> Symulacja w czasie
                    </h4>
                    <div className="flex gap-4 text-xs font-bold">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Złoto</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-300"></div> Gotówka (inflacja)</div>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forecastData} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                            <defs>
                                <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" fontSize={12} tickMargin={10}/>
                            <YAxis fontSize={12} tickFormatter={(val) => `${val/1000}k`} tickMargin={10}/>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                            <RechartsTooltip 
                                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}}
                                formatter={(val, name) => [formatMoney(val), name === 'gold' ? 'Wartość złota' : (name === 'cash' ? 'Siła nabywcza gotówki' : 'Wpłata')]}
                            />
                            <ReferenceLine y={investmentAmount} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "Wpłata", position: 'insideTopLeft', fontSize: 10, fill: '#94a3b8' }}/>
                            <Area type="monotone" dataKey="gold" stroke="#ca8a04" strokeWidth={3} fill="url(#colorGold)" />
                            <Area type="monotone" dataKey="cash" stroke="#cbd5e1" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                {/* METODOLOGIA - SKĄD TE DANE? */}
                <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                    <div className="font-bold text-slate-700 mb-1 flex items-center gap-1"><Info size={12}/> Metodologia i założenia:</div>
                    <p>
    <strong>Wzrost złota (6% r/r):</strong> Oparto na średniej historycznej stopie zwrotu złota w USD, skorygowanej o ryzyko kursowe PLN. 
    <strong>Inflacja (4.0% r/r):</strong> Przyjęto prognozowaną wartość na 2026 r., odzwierciedlającą realia gospodarcze. 
    Wykres uwzględnia spread (marżę dealera) przy odsprzedaży.
</p>
                </div>
            </Card>
          </div>
        </div>

        {/* LINK DO KOMPENDIUM */}
        <div className="flex justify-center mb-16 animate-bounce">
            <a href="#kompendium" className="flex flex-col items-center gap-2 text-slate-400 hover:text-yellow-600 transition-colors">
                <span className="text-sm font-bold uppercase tracking-widest">Pełne kompendium wiedzy poniżej</span>
                <ArrowDown size={24}/>
            </a>
        </div>

        {/* ==========================================================================
            KOMPENDIUM WIEDZY (AURUM ABSOLUTUM)
            ==========================================================================
        */}
        <div id="kompendium" className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-slate-700 leading-relaxed">
            
            {/* Tło dekoracyjne */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] font-black text-9xl text-slate-900 pointer-events-none select-none">Au79</div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-100/50 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-24">

                {/* WSTĘP */}
                <div className="text-center space-y-8 pb-12 border-b border-slate-100">
                    <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                        Kompendium wiedzy
                    </div>
                    <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
                        Aurum Absolutum
                    </h3>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Od gwiezdnego pyłu do portfela inwestycyjnego. Kompleksowa analiza "króla metali".
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 text-left mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                        <div>
                            <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><History size={20} className="text-yellow-600"/>Fenomen 6000 lat</h5>
                            <p className="text-sm">Złoto fascynuje nieprzerwanie od starożytności. To nie tylko rzadkość, ale unikalna kombinacja cech fizycznych (niezniszczalność) i estetycznych (blask) uczyniła z niego uniwersalny symbol bogactwa.</p>
                        </div>
                        <div>
                            <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Anchor size={20} className="text-yellow-600"/>Rola w XXI wieku</h5>
                            <p className="text-sm">Dziś to hybryda: surowiec przemysłowy (elektronika), waluta rezerwowa banków centralnych i aktywo "Safe Haven" dla inwestorów szukających ochrony przed inflacją.</p>
                        </div>
                         <div>
                            <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><ScrollText size={20} className="text-yellow-600"/>Cel kompendium</h5>
                            <p className="text-sm">Celem tego opracowania jest transformacja czytelnika z pasywnego obserwatora rynku w świadomego eksperta, rozumiejącego geologię i rynki finansowe.</p>
                        </div>
                    </div>
                </div>

                {/* CZĘŚĆ I */}
                <section>
                    <SectionHeader icon={Atom} title="Część I: Fundament naukowy – fizyka i chemia" colorClass="text-blue-900" bgClass="bg-blue-50" />
                    <div id="sekcja-nauka" className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                             <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Flame className="text-orange-500" size={24}/> Rozdział 1: Narodziny w ogniu
                            </h4>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                <SubHeader title="1.1 Nukleosynteza" />
                                <p className="text-sm">Złoto nie powstaje na Ziemi. Każdy atom Au narodził się w kosmosie, w ekstremalnych warunkach zderzeń gwiazd neutronowych lub wybuchów supernowych. Jesteśmy dosłownie zrobieni z gwiezdnego pyłu.</p>
                                <SubHeader title="1.2 Wielkie bombardowanie" />
                                <p className="text-sm">Gdy Ziemia była młoda, ciężkie pierwiastki zatonęły w jej jądrze. Złoto, które dziś wydobywamy, pochodzi z późniejszego bombardowania meteorytami (ok. 3.9 mld lat temu), które "posypały" stygnącą powierzchnię.</p>
                                <SubHeader title="1.3 Złoto w wodzie morskiej" />
                                <p className="text-sm">Oceany zawierają miliony ton złota, ale stężenie jest mikroskopijne. Koszt wydobycia wielokrotnie przewyższa wartość kruszcu.</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Microscope className="text-purple-500" size={24}/> Rozdział 2: Liczba atomowa 79
                            </h4>
                             <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                <SubHeader title="2.1 Szlachetność" />
                                <p className="text-sm">Złoto nie rdzewieje i nie reaguje z tlenem. Moneta wyłowiona z dna oceanu po 300 latach lśni tak samo jak w dniu wybicia. To fundament jego funkcji jako nośnika wartości.</p>
                                <SubHeader title="2.2 Kowalność" />
                                <p className="text-sm">Z 1 grama złota można wyciągnąć drut o długości ponad 2 kilometrów lub rozklepać go na płatek o powierzchni 1 metra kwadratowego.</p>
                                <SubHeader title="2.4 Próba i karaty" />
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-20 font-bold text-yellow-600">999.9 (24K)</div>
                                        <div className="flex-grow bg-slate-200 rounded-full h-2 overflow-hidden"><div className="bg-yellow-500 h-full w-full"></div></div>
                                        <div className="text-slate-500">Sztabki, Liść Klonowy</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-20 font-bold text-yellow-600">916 (22K)</div>
                                        <div className="flex-grow bg-slate-200 rounded-full h-2 overflow-hidden"><div className="bg-yellow-500 h-full w-[91.6%]"></div></div>
                                        <div className="text-slate-500">Krugerrand, Orzeł</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-20 font-bold text-yellow-600">585 (14K)</div>
                                        <div className="flex-grow bg-slate-200 rounded-full h-2 overflow-hidden"><div className="bg-yellow-500 h-full w-[58.5%]"></div></div>
                                        <div className="text-slate-500">Biżuteria użytkowa</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CZĘŚĆ II */}
                <section>
                    <SectionHeader icon={Pickaxe} title="Część II: Geologia i wydobycie" colorClass="text-orange-800" bgClass="bg-orange-50"/>
                    <div id="sekcja-geologia" className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Search size={24} className="text-amber-600"/> Rozdział 3: Geologia złóż</h4>
                            <div className="space-y-4">
                                <div><SubHeader title="3.1 Złoża pierwotne" /><p className="text-xs">Żyły hydrotermalne głęboko pod ziemią.</p></div>
                                <div><SubHeader title="3.2 Złoto aluwialne" /><p className="text-xs">Okruchy w rzekach (samorodki) powstałe z erozji.</p></div>
                                <div><SubHeader title="3.3 Witwatersrand (RPA)" /><p className="text-xs">Największe zagłębie świata. Kopalnie o głębokości 4 km.</p></div>
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-8">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Truck size={24} className="text-amber-600"/> Rozdział 4: Od skały do sztabki</h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div><SubHeader title="4.1 Metody wydobycia" /><p className="text-xs">Kopalnie odkrywkowe (wielka skala, niska zawartość) vs głębinowe (droższe, bogatsze żyły).</p></div>
                                    <div><SubHeader title="4.2 Ekstrakcja" /><p className="text-xs">Ługowanie cyjankiem (CIL) - najtańsza metoda oddzielania złota od skały.</p></div>
                                </div>
                            </div>
                            <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                                <h4 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2"><AlertOctagon size={24} className="text-red-600"/> Rozdział 5: Ciemna strona (ESG)</h4>
                                <p className="text-sm mb-2">Nielegalne wydobycie często finansuje konflikty ("krwawe złoto") i zatruwa środowisko rtęcią.</p>
                                <div className="flex items-center gap-2 font-bold text-green-700 text-xs"><ShieldCheck size={16}/> Rozwiązanie: Kupuj tylko produkty z akredytacją LBMA Good Delivery.</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CZĘŚĆ III - TIMELINE FIX */}
                <section>
                    <SectionHeader icon={History} title="Część III: Historia i ekonomia" colorClass="text-green-800" bgClass="bg-green-50"/>
                    <div id="sekcja-historia" className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-5 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <h4 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2"><Landmark size={24} className="text-green-600"/> Rozdział 6: Złoto jako waluta</h4>
                            
                            {/* NAPRAWIONA OŚ CZASU (FLEXBOX) */}
                            <div className="flex flex-col gap-8">
                                {/* Item 1 */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-white border-4 border-yellow-400 flex items-center justify-center shrink-0 font-bold text-[10px] text-slate-600">Let</div>
                                        <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-900">ok. 560 p.n.e.</h5>
                                        <div className="text-xs font-bold text-yellow-600 mb-1">Król Krezus (Lidia)</div>
                                        <p className="text-xs text-slate-600">Pierwsze standaryzowane monety. Rewolucja w handlu.</p>
                                    </div>
                                </div>
                                {/* Item 2 */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-white border-4 border-green-600 flex items-center justify-center shrink-0 font-bold text-[10px] text-slate-600">XIX</div>
                                        <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-900">1871-1914</h5>
                                        <div className="text-xs font-bold text-green-600 mb-1">Standard Złota</div>
                                        <p className="text-xs text-slate-600">Era stabilności. Waluty miały pokrycie w kruszcu.</p>
                                    </div>
                                </div>
                                {/* Item 3 */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-red-500 border-4 border-red-200 flex items-center justify-center shrink-0 font-bold text-[10px] text-white">1971</div>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-red-700">1971 - Nixon Shock</h5>
                                        <div className="text-xs font-bold text-red-600 mb-1">Koniec Bretton Woods</div>
                                        <p className="text-xs text-slate-700 bg-red-50 p-2 rounded border border-red-100">Zerwanie wymienialności dolara na złoto. Początek ery pieniądza drukowanego (Fiat). Cena złota uwolniona.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-7 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                             <h4 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2"><CandlestickChart size={24} className="text-green-600"/> Rozdział 7: Co steruje ceną?</h4>
                             <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <SubHeader title="7.1 Dolar (USD)" />
                                    <p className="text-sm">Silna odwrotna korelacja. Gdy dolar słabnie, złoto drożeje. <Link to="/gielda" className="text-blue-600 hover:underline font-bold">Więcej o walutach.</Link></p>
                                </div>
                                <div>
                                    <SubHeader title="7.2 Realne stopy %" />
                                    <p className="text-sm">Najważniejszy wskaźnik. Gdy lokaty bankowe dają zarobić mniej niż wynosi inflacja (ujemne realne stopy), kapitał płynie do złota. <Link to="/obligacje" className="text-blue-600 hover:underline font-bold">Sprawdź obligacje.</Link></p>
                                </div>
                                <div>
                                    <SubHeader title="7.3 Inflacja" />
                                    <p className="text-sm">Złoto chroni siłę nabywczą w dekadach, niekoniecznie w miesiącach.</p>
                                </div>
                                <div>
                                    <SubHeader title="7.4 Banki centralne" />
                                    <p className="text-sm">Chiny i Polska kupują złoto, by uniezależnić się od dolara.</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </section>

                {/* CZĘŚĆ IV: PRAKTYKA */}
                <section>
                     <SectionHeader icon={Coins} title="Część IV: Złoto fizyczne (praktyka)" colorClass="text-yellow-800" bgClass="bg-yellow-50"/>
                     <div id="sekcja-praktyka" className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                             <h4 className="text-xl font-bold text-slate-900 mb-6">Rozdział 8: Co kupić?</h4>
                             <SubHeader title="8.1 Uncja trojańska (ozt)" />
                             <p className="text-sm mb-4">Ważne! Uncja złota waży <strong>31,1035 g</strong> (więcej niż zwykła uncja kuchenna).</p>
                             <SubHeader title="8.2 Monety bulionowe" />
                             <p className="text-sm mb-2">Najłatwiej zbywalne:</p>
                             <ul className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
                                <li className="bg-white p-2 rounded border">🇿🇦 Krugerrand</li>
                                <li className="bg-white p-2 rounded border">🇨🇦 Liść Klonowy</li>
                                <li className="bg-white p-2 rounded border">🇦🇹 Filharmonik</li>
                                <li className="bg-white p-2 rounded border">🇺🇸 Złoty Orzeł</li>
                             </ul>
                        </div>
                        <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
                            <h4 className="text-xl font-bold text-red-900 mb-6">Rozdział 10: Uwaga na fałszywki</h4>
                            <SubHeader title="10.1 Problem wolframu" />
                            <p className="text-sm mb-4">Wolfram ma gęstość taką samą jak złoto. Fałszerze nawiercają sztabki i wypełniają je wolframem.</p>
                            <SubHeader title="10.2 Jak badać?" />
                            <ul className="list-disc list-inside text-sm space-y-1">
                                <li>Waga magnetyczna (złoto odpycha magnes).</li>
                                <li>Linijka Fisha (wymiary).</li>
                                <li>Aplikacje dźwiękowe (rezonans monet).</li>
                            </ul>
                        </div>
                     </div>
                </section>

                {/* CZĘŚĆ V: PAPIER */}
                <section>
                    <SectionHeader icon={BankIcon} title="Część V: Papierowe złoto" colorClass="text-purple-900" bgClass="bg-purple-50"/>
                    <div id="sekcja-papierowe" className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                         <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-slate-900 mb-2">Rozdział 11: ETF</h4>
                                <p className="text-sm mb-2">Kupujesz "akcje" funduszu posiadającego złoto. <Link to="/gielda" className="text-blue-600 font-bold hover:underline">Więcej o ETF.</Link></p>
                                <ul className="text-xs space-y-1 text-slate-600">
                                    <li><strong>Fizyczne:</strong> Fundusz ma sztabki w skarbcu. (Bezpieczne)</li>
                                    <li><strong>Syntetyczne:</strong> Umowa z bankiem. (Ryzykowne)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-2">Rozdział 12: Futures</h4>
                                <p className="text-sm">Kontrakty z dźwignią finansową. Miecz obosieczny – można szybko zarobić lub stracić wszystko.</p>
                            </div>
                         </div>
                    </div>
                </section>

                {/* CZĘŚĆ VI: STRATEGIA */}
                 <section>
                    <SectionHeader icon={Rocket} title="Część VI: Strategia i przyszłość" colorClass="text-indigo-900" bgClass="bg-indigo-50"/>
                    <div id="sekcja-strategia" className="grid md:grid-cols-3 gap-8">
                         <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                             <h4 className="font-bold text-slate-900 mb-2">Rozdział 13: Kopalnie</h4>
                             <p className="text-xs">Akcje kopalń są bardziej zmienne niż złoto. Gdy złoto drożeje o 10%, zysk kopalni może wzrosnąć o 50% (dźwignia operacyjna).</p>
                        </div>
                         <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                             <h4 className="font-bold text-slate-900 mb-2">Rozdział 14: Portfel</h4>
                             <p className="text-xs">Złoto powinno stanowić 5-15% portfela. Podatek: zakup bez VAT, sprzedaż bez PIT po 6 miesiącach. <Link to="/ike-ikze" className="text-blue-600 font-bold hover:underline">Sprawdź ulgi podatkowe.</Link></p>
                        </div>
                         <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                             <h4 className="font-bold text-slate-900 mb-2">Rozdział 15: Bitcoin?</h4>
                             <p className="text-xs">Nazywany cyfrowym złotem, ale znacznie bardziej ryzykowny. <Link to="/kryptowaluty" className="text-blue-600 font-bold hover:underline">Porównaj z krypto.</Link></p>
                        </div>
                    </div>
                </section>

                {/* ZAKOŃCZENIE */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="text-3xl font-black text-yellow-400 mb-6">Złota zasada inwestora</h4>
                        <p className="text-xl italic text-slate-300 mb-8 font-serif">
                            "Złoto nie zrobi z Ciebie milionera z dnia na dzień. Złoto sprawi, że pozostaniesz zamożny, gdy pieniądz papierowy straci wartość."
                        </p>
                        <div className="inline-flex flex-wrap justify-center gap-4 text-sm font-bold text-slate-900">
                            <span className="bg-yellow-400 px-4 py-2 rounded-full flex items-center gap-2"><Anchor size={16}/> Dywersyfikacja</span>
                            <span className="bg-yellow-400 px-4 py-2 rounded-full flex items-center gap-2"><Calendar size={16}/> Długi termin (&gt;10 lat)</span>
                            <span className="bg-yellow-400 px-4 py-2 rounded-full flex items-center gap-2"><ShieldCheck size={16}/> Fizyczne posiadanie</span>
                        </div>
                    </div>
                </div>

{/* CZĘŚĆ VII: PODATKI I PRAWO */}
                <section id="sekcja-prawo" className="scroll-mt-24">
                    <SectionHeader icon={Gavel} title="Część VII: Podatki i Prawo (Złoto w świetle przepisów 2026)" colorClass="text-slate-900" bgClass="bg-slate-100" />
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Receipt className="text-indigo-600" size={24}/> Rozdział 16: Preferencje podatkowe
                            </h4>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                <SubHeader title="16.1 Zwolnienie z VAT" />
                                <p className="text-sm">Złoto inwestycyjne (sztabki o próbie min. 995 i monety o próbie min. 900) jest w całej Unii Europejskiej zwolnione z <strong>Podatku od Towarów i Usług (VAT)</strong>. To kluczowa przewaga nad srebrem czy platyną (23% VAT).</p>
                                <SubHeader title="16.2 Brak Podatku Belki" />
                                <p className="text-sm">Złoto traktowane jest jak towar, a nie instrument finansowy. Oznacza to brak 19% podatku od zysków kapitałowych. Jedynym wymogiem jest sprzedaż po upływie <strong>6 miesięcy</strong> od nabycia.</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Search size={24} className="text-indigo-600"/> Rozdział 17: Limity i anonimowość
                            </h4>
                             <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 space-y-4">
                                <SubHeader title="17.1 AML i limity gotówkowe" />
                                <p className="text-sm text-amber-900 leading-relaxed">
                                    W 2026 roku limity płatności gotówkowych są restrykcyjne. Dealerzy mają obowiązek legitymowania klientów przy transakcjach powyżej <strong>10 000 EUR</strong> (równowartość w PLN). Zakup "anonimowy" jest możliwy tylko poniżej tej kwoty.
                                </p>
                                <div className="flex items-start gap-2 text-xs text-amber-700 italic border-t border-amber-200 pt-4">
                                    <AlertTriangle size={14} className="shrink-0"/>
                                    Pamiętaj: Zakup inwestycyjny zawsze powinien być potwierdzony fakturą, co ułatwi odsprzedaż w przyszłości.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CZĘŚĆ VIII: AKREDYTACJA I AUTENTYCZNOŚĆ */}
                <section id="sekcja-lbma" className="scroll-mt-24">
                    <SectionHeader icon={ShieldCheck} title="Część VIII: Standard Good Delivery (LBMA)" colorClass="text-green-900" bgClass="bg-green-50" />
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h4 className="text-2xl font-black text-yellow-400">Dlaczego LBMA to "Złoty Standard"?</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    <strong>London Bullion Market Association (LBMA)</strong> prowadzi tzw. listę "Good Delivery". Mennice znajdujące się na tej liście gwarantują najwyższą jakość kruszcu i etyczny proces wydobycia.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex gap-3 text-xs text-slate-300">
                                        <CheckCircle size={18} className="text-green-400 shrink-0"/>
                                        <span>Złoto z akredytacją LBMA sprzedasz w dowolnym miejscu na świecie bez konieczności kosztownej ekspertyzy.</span>
                                    </li>
                                    <li className="flex gap-3 text-xs text-slate-300">
                                        <CheckCircle size={18} className="text-green-400 shrink-0"/>
                                        <span>Mennice takie jak Valcambi, PAMP, Heraeus czy Mennica Austriacka to gwarancja płynności.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                                <h5 className="font-bold text-yellow-400 mb-4 flex items-center gap-2"><Microscope size={20}/> Jak sprawdzić sztabkę?</h5>
                                <div className="space-y-3 text-xs text-slate-300">
                                    <p>1. <strong>CertiPack:</strong> Sztabka powinna być zamknięta w opakowaniu z numerem seryjnym.</p>
                                    <p>2. <strong>Aplikacja producenta:</strong> Wielu producentów (np. PAMP) oferuje weryfikację skanem telefonu.</p>
                                    <p>3. <strong>Waga magnetyczna:</strong> Złoto jest diamagnetykiem. Każda próba fałszerstwa wolframem zostanie wykryta testem magnetycznym.</p>
                                </div>
                            </div>
                        </div>
                        <Globe size={300} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
                    </div>
                </section>

                {/* CZĘŚĆ IX: LOGISTYKA I PRZECHOWYWANIE */}
                <section id="sekcja-logistyka" className="scroll-mt-24">
                    <SectionHeader icon={Lock} title="Część IX: Logistyka i Bezpieczeństwo" colorClass="text-blue-900" bgClass="bg-blue-50" />
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mx-auto mb-4"><Home size={24}/></div>
                            <h5 className="font-bold text-slate-900 mb-2">Domowy Sejf</h5>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Najwyższa dyskrecja i brak opłat miesięcznych. Ryzyko kradzieży fizycznej.</p>
                            <span className="text-[10px] font-black text-green-600 uppercase">Najtańsza opcja</span>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mx-auto mb-4"><BankIcon size={24}/></div>
                            <h5 className="font-bold text-slate-900 mb-2">Skrytka Bankowa</h5>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Najwyższe bezpieczeństwo fizyczne. Koszt ok. 500-1000 PLN rocznie.</p>
                            <span className="text-[10px] font-black text-amber-600 uppercase">Utrudniony dostęp</span>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mx-auto mb-4"><RefreshCcw size={24}/></div>
                            <h5 className="font-bold text-slate-900 mb-2">Odkup u Dealera</h5>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Dealerzy oferują darmowe przechowywanie w swoich skarbcach przy zakupie dużych ilości.</p>
                            <span className="text-[10px] font-black text-red-600 uppercase">Ryzyko kontrahenta</span>
                        </div>
                    </div>
                </section>

{/* SEKCJA 10: POJEDYNEK GIGANTÓW - ZŁOTO KONTRA SREBRO */}
<section id="sekcja-porownanie" className="scroll-mt-24">
    <SectionHeader icon={ArrowRightLeft} title="Część X: Złoto czy Srebro? Wielkie Porównanie Aktywów" colorClass="text-slate-900" bgClass="bg-slate-100" />
    
    <div className="space-y-12">
        {/* WIZUALNY POJEDYNEK (VERSUS) */}
        <div className="grid lg:grid-cols-11 gap-4 items-stretch">
            
            {/* KOLUMNA ZŁOTO */}
            <div className="lg:col-span-5 bg-gradient-to-b from-yellow-50 to-white p-8 rounded-[3rem] border border-yellow-200 shadow-sm relative overflow-hidden group">
                <div className="relative z-10 space-y-6 text-left">
                    <div className="flex justify-between items-center text-left">
                        <h5 className="text-2xl font-black text-yellow-700 uppercase tracking-tighter text-left">Złoto (Au)</h5>
                        <div className="w-12 h-12 bg-yellow-400 text-white rounded-2xl flex items-center justify-center shadow-lg"><Coins size={24}/></div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed text-left">
                        Fundament bezpieczeństwa finansowego. W 2026 roku złoto pełni rolę "ostatecznej waluty", chroniąc kapitał przed dewaluacją pieniądza papierowego.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-700 text-left"><ShieldCheck size={16} className="text-yellow-600"/> VAT: 0% (Złoto Inwestycyjne)</li>
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-700 text-left"><Zap size={16} className="text-yellow-600"/> Wysoka gęstość wartości</li>
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-700 text-left"><History size={16} className="text-yellow-600"/> Płynność globalna (LBMA)</li>
                    </ul>
                </div>
                <div className="absolute -bottom-10 -left-10 opacity-5 group-hover:scale-110 transition-transform"><Coins size={200}/></div>
            </div>

            {/* ŚRODKOWY ŁĄCZNIK (THE BRIDGE) */}
            <div className="lg:col-span-1 flex flex-col justify-center items-center py-8 lg:py-0">
                <div className="w-px h-full bg-slate-200 hidden lg:block relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center font-black text-slate-400 shadow-sm">VS</div>
                </div>
                <div className="lg:hidden w-full h-px bg-slate-200 relative my-4">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-slate-50 text-xs font-black text-slate-400">VERSUS</div>
                </div>
            </div>

            {/* KOLUMNA SREBRO */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="relative z-10 space-y-6 text-left">
                    <div className="flex justify-between items-center text-left">
                        <h5 className="text-2xl font-black text-slate-500 uppercase tracking-tighter text-left">Srebro (Ag)</h5>
                        <div className="w-12 h-12 bg-slate-400 text-white rounded-2xl flex items-center justify-center shadow-lg"><Pickaxe size={24}/></div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed text-left">
                        Hybryda inwestycyjna. W 2026 roku popyt na srebro napędza zielona transformacja (fotowoltaika, EV), czyniąc z niego surowiec strategiczny.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-700 text-left"><ShieldAlert size={16} className="text-slate-400"/> VAT: 23% (w Polsce)</li>
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-700 text-left"><TrendingUp size={16} className="text-slate-400"/> Wyższa zmienność (wolatywność)</li>
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-700 text-left"><Flame size={16} className="text-slate-400"/> Kluczowy surowiec przemysłowy</li>
                    </ul>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform"><Layers size={200}/></div>
            </div>
        </div>

        {/* ANALIZA RATIO - CENTRALNY MODUŁ MATEMATYCZNY */}
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-left">
                <div className="space-y-6 text-left">
                    <h5 className="text-2xl font-black text-left">Wskaźnik Gold-Silver Ratio</h5>
                    <p className="text-slate-400 text-sm leading-relaxed text-left">
                        To najważniejsze narzędzie decyzyjne inwestora w metale. Wskazuje, ile uncji srebra możesz kupić za jedną uncję złota. 
                    </p>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left">
                        <p className="text-[11px] text-slate-300 italic text-left">
                            <strong>Strategia:</strong> Historyczna średnia to ok. 60:1. W 2026 roku, gdy Ratio przekracza 80:1, srebro jest postrzegane jako niedowartościowane względem złota.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="text-3xl md:text-5xl font-mono text-yellow-400 bg-black/30 p-8 rounded-3xl border border-white/10 shadow-inner">
                        {"Ratio = \\frac{Cena_{Au}}{Cena_{Ag}}"}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Matematyka opłacalności zamiany kruszców</span>
                </div>
            </div>
            <Sparkles size={300} className="absolute -bottom-20 -left-20 text-white/5 rotate-12" />
        </div>

        {/* PORÓWNANIE LOGISTYCZNE - TRZECI WYMIAR */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-left">
                <h6 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-left"><Truck size={18} className="text-indigo-600"/> Objętość (Gęstość)</h6>
                <p className="text-[11px] text-slate-500 leading-relaxed text-left">
                    100 000 PLN w złocie to jedna mała sztabka mieszcząca się w dłoni. 100 000 PLN w srebrze to ciężki karton (ok. 30-40 kg). Pamiętaj o kosztach transportu i składowania!
                </p>
            </div>
            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-left">
                <h6 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-left"><Scale size={18} className="text-indigo-600"/> Psychologia "Biednego"</h6>
                <p className="text-[11px] text-slate-500 leading-relaxed text-left">
                    Srebro nazywane jest "złotem biednego człowieka". Pozwala na regularne zakupy małych jednostek (np. monety 1oz) przy znacznie niższym progu wejścia niż złoto.
                </p>
            </div>
            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-left">
                <h6 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-left"><Search size={18} className="text-indigo-600"/> Płynność (Exit Strategy)</h6>
                <p className="text-[11px] text-slate-500 leading-relaxed text-left">
                    Złoto sprzedasz w każdym zakątku globu. Srebro, ze względu na podatek VAT, najlepiej odsprzedawać osobom prywatnym, aby nie tracić marży przy skupie u dealera.
                </p>
            </div>
        </div>
    </div>
</section>

{/* SEKCJA 11: LOMBARDOWA PŁYNNOŚĆ - KREDYT POD ZASTAW KRUSZCU */}
<section id="sekcja-lombard" className="scroll-mt-24">
    <SectionHeader icon={Banknote} title="Część XI: Płynność bez sprzedaży – Kredyt pod zastaw złota" colorClass="text-indigo-900" bgClass="bg-indigo-50" />
    
    <div className="space-y-12">
        {/* NAGŁÓWEK MERYTORYCZNY */}
        <div className="max-w-3xl text-left space-y-4">
            <h4 className="text-2xl font-black text-slate-900">Złoto jako Twoja prywatna linia kredytowa</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
                Największą obawą inwestorów jest "zamrożenie" gotówki w kruszcu. W 2026 roku standardem stają się <strong>Pożyczki Lombardowe</strong>, które pozwalają uwolnić kapitał bez utraty ekspozycji na wzrost ceny złota. To strategiczne rozwiązanie dla osób potrzebujących płynności "na już".
            </p>
        </div>

        {/* PROCES: KROK PO KROKU (HORYZONTALNY) */}
        <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Linia łącząca (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
            
            {[
                { step: "01", title: "Weryfikacja", desc: "Twoje złoto (sztabki/monety LBMA) trafia do certyfikowanego skarbca, gdzie przechodzi testy autentyczności.", icon: Search },
                { step: "02", title: "Wycena LTV", desc: "Instytucja przyznaje limit kredytowy (zazwyczaj 50-75% wartości rynkowej kruszcu).", icon: Scale },
                { step: "03", title: "Wypłata", desc: "Środki trafiają na Twoje konto w 15 minut. Złoto pozostaje Twoją własnością i pracuje na Twój zysk.", icon: Zap }
            ].map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] relative z-10 shadow-sm hover:shadow-md transition-all text-left group">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-sm mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100">
                        {item.step}
                    </div>
                    <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <item.icon size={18} className="text-indigo-600"/> {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>

        {/* PORÓWNANIE SCENARIUSZY (MODUŁ KONTRASTOWY) */}
        <div className="grid lg:grid-cols-2 gap-8">
            {/* SCENARIUSZ A: SPRZEDAŻ */}
            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 text-left relative overflow-hidden group">
                <div className="relative z-10">
                    <h5 className="font-black text-slate-400 uppercase text-xs tracking-widest mb-4">Scenariusz A: Sprzedaż kruszcu</h5>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-red-500 font-bold text-sm">
                            <TrendingDown size={20}/> Tracisz marżę skupu (Spread)
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Sprzedając złoto w dołku cenowym, realizujesz stratę. Tracisz też szansę na zysk, gdyby cena nagle wzrosła w trakcie trwania Twojej potrzeby gotówkowej.
                        </p>
                    </div>
                </div>
                <AlertOctagon size={150} className="absolute -bottom-10 -right-10 text-slate-200/50 rotate-12" />
            </div>

            {/* SCENARIUSZ B: POŻYCZKA LOMBARDOWA */}
            <div className="bg-indigo-900 p-8 rounded-[3rem] text-white text-left relative overflow-hidden group shadow-xl">
                <div className="relative z-10">
                    <h5 className="font-black text-indigo-400 uppercase text-xs tracking-widest mb-4">Scenariusz B: Zastaw (LTV)</h5>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-green-400 font-bold text-sm">
                            <ShieldCheck size={20}/> Zachowujesz własność kruszcu
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Pożyczasz np. 50 000 PLN pod zastaw złota. Jeśli cena uncji wzrośnie o 20%, Twój zysk może w całości pokryć koszt odsetek kredytu, a Ty nadal masz swoje sztabki.
                        </p>
                    </div>
                </div>
                <TrendingUp size={150} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
            </div>
        </div>

        {/* WARUNEK KRYTYCZNY (MARGINE CALL) */}
        <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 text-left">
            <div className="bg-amber-100 p-4 rounded-full text-amber-600 shrink-0">
                <AlertTriangle size={32}/>
            </div>
            <div>
                <h5 className="font-bold text-amber-900 mb-1">Uwaga: Ryzyko Margin Call</h5>
                <p className="text-xs text-amber-800 leading-relaxed">
                    Jeśli cena złota gwałtownie spadnie, wartość Twojego zabezpieczenia może spaść poniżej wymaganego progu. W takim przypadku będziesz musiał dopłacić gotówkę lub dołożyć więcej kruszcu, aby uniknąć przymusowej sprzedaży Twojego złota przez instytucję pożyczkową.
                </p>
            </div>
        </div>
    </div>
</section>


{/* SEKCJA 12: DZIEDZICZENIE I PRZEKAZYWANIE MAJĄTKU */}
<section id="sekcja-dziedziczenie" className="scroll-mt-24">
    <SectionHeader icon={Heart} title="Część XII: Złoto jako kapitał pokoleniowy" colorClass="text-pink-900" bgClass="bg-pink-50" />
    
    <div className="grid lg:grid-cols-12 gap-12 items-stretch text-left">
        
        {/* LEWA KOLUMNA: MERYTORYKA I PODATKI */}
        <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-6">
                <h4 className="text-2xl font-black text-slate-900 text-left">Rozdział 18: Jak przekazać kruszec bliskim?</h4>
                <p className="text-sm text-slate-600 leading-relaxed text-left">
                    Złoto fizyczne to jedno z niewielu aktywów, które pozwala na niemal natychmiastowe przekazanie majątku bez skomplikowanych procedur bankowych. W 2026 roku, w dobie cyfryzacji pieniądza, fizyczna forma kruszcu staje się unikalnym narzędziem budowania funduszu pokoleniowego.
                </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-8 bg-yellow-400 rounded-full"></div>
                    <h5 className="font-bold text-slate-900 text-lg">18.1 Optymalizacja podatkowa darowizny</h5>
                </div>
                
                <div className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed">
                        W 2026 roku darowizny w ramach <strong>"zerowej grupy podatkowej"</strong> (małżonek, zstępni, wstępni, pasierbowie, rodzeństwo, ojczym i macocha) są całkowicie zwolnione z podatku, pod warunkiem zgłoszenia ich do Urzędu Skarbowego (druki SD-Z2) po przekroczeniu kwoty wolnej.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-white rounded-2xl border border-slate-200">
                            <span className="text-[10px] font-black text-indigo-600 uppercase block mb-1">Zasada 6 miesięcy</span>
                            <p className="text-[10px] text-slate-500">Otrzymane złoto możesz sprzedać bez 19% podatku PIT, jeśli odczekasz pół roku od daty nabycia przez darczyńcę.</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-200">
                            <span className="text-[10px] font-black text-indigo-600 uppercase block mb-1">Dyskrecja</span>
                            <p className="text-[10px] text-slate-500">Przekazanie fizyczne nie wymaga pośrednictwa systemów bankowych, co zapewnia najwyższy poziom prywatności wewnątrz rodziny.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <blockquote className="border-l-4 border-indigo-500 pl-6 py-2 italic text-sm text-slate-600">
                "Złoto nie wymaga testamentu, aby zachować swoją wartość, ale wymaga planu, aby bezpiecznie trafiło w ręce kolejnego pokolenia."
            </blockquote>
        </div>

        {/* PRAWA KOLUMNA: BŁĘKITNY BOKS (WYPEŁNIONY) */}
        <div className="lg:col-span-5">
            <div className="bg-indigo-900 text-white p-8 md:p-12 rounded-[3rem] h-full shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div>
                    <h5 className="text-xl font-black mb-8 border-b border-white/10 pb-4">Przewaga nad gotówką:</h5>
                    <ul className="space-y-6">
                        <li className="flex gap-4 items-start">
                            <CheckCircle size={20} className="text-indigo-400 shrink-0 mt-1"/>
                            <div>
                                <strong className="block text-sm">Ochrona przed inflacją</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">Złoto nie traci siły nabywczej w skali dziesięcioleci, w przeciwieństwie do walut fiducjarnych.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <CheckCircle size={20} className="text-indigo-400 shrink-0 mt-1"/>
                            <div>
                                <strong className="block text-sm">Brak ryzyka kontrahenta</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">Własność nie jest zapisem cyfrowym w banku. Masz pełną kontrolę nad aktywem.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <CheckCircle size={20} className="text-indigo-400 shrink-0 mt-1"/>
                            <div>
                                <strong className="block text-sm">Podzielność majątku</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">Dzięki sztabkom o różnych wagach (1g - 100g) możesz precyzyjnie dzielić kapitał między spadkobierców.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <CheckCircle size={20} className="text-indigo-400 shrink-0 mt-1"/>
                            <div>
                                <strong className="block text-sm">Uniwersalność</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">Twoi bliscy spieniężą złoto w dowolnym miejscu na świecie, bez względu na sytuację geopolityczną.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <CheckCircle size={20} className="text-indigo-400 shrink-0 mt-1"/>
                            <div>
                                <strong className="block text-sm">Brak kosztów utrzymania</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">W przeciwieństwie do nieruchomości, złoto nie generuje podatków od posiadania ani kosztów remontów.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                
                <div className="mt-12 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-400 italic">
                        Porada: Zawsze przechowuj faktury zakupu wraz z kruszcem — ułatwi to spadkobiercom udowodnienie okresu posiadania przy odsprzedaży.
                    </p>
                </div>
                
                <Activity size={200} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
            </div>
        </div>
    </div>
</section>

{/* SEKCJA 13: ESG I EKOLOGIA (ZIELONE ZŁOTO) */}
<section id="sekcja-esg" className="scroll-mt-24">
    <SectionHeader icon={ShieldAlert} title="Część XIII: Ekologia i Etyka (ESG 2026)" colorClass="text-green-900" bgClass="bg-green-50" />
    
    <div className="grid lg:grid-cols-12 gap-12 items-stretch text-left">
        
        {/* LEWA KOLUMNA: MERYTORYKA I TECHNOLOGIA */}
        <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-6">
                <h4 className="text-2xl font-black text-slate-900 text-left">Rozdział 19: Circular Gold i Świadomy Inwestor</h4>
                <p className="text-sm text-slate-600 leading-relaxed text-left">
                    W 2026 roku złoto przestało być oceniane wyłącznie przez pryzmat próby i wagi. Kluczowym parametrem stał się jego <strong>ślad środowiskowy</strong>. Inwestorzy instytucjonalni (fundusze emerytalne, banki) coraz częściej odrzucają kruszec, którego pochodzenie nie jest w pełni transparentne.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100 shadow-sm">
                    <h5 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <Zap size={18}/> Ślad Węglowy (CO₂)
                    </h5>
                    <p className="text-[11px] text-green-800 leading-relaxed">
                        Produkcja 1 kg złota metodą tradycyjną (kopalnianą) emituje średnio <strong>12,5 tony CO₂</strong>. Złoto z recyklingu (Circular Gold) redukuje tę emisję o ponad <strong>98%</strong>, co czyni je aktywem przyszłości w portfelach ESG.
                    </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h5 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Globe size={18} className="text-blue-600"/> Paszport Cyfrowy
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                        W 2026 r. czołowe mennice (PAMP, Valcambi) wdrażają <strong>Blockchain Traceability</strong>. Każda sztabka posiada cyfrowy zapis drogi od kopalni lub punktu recyklingu aż do Twojego portfela.
                    </p>
                </div>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] relative overflow-hidden text-left">
                <h5 className="font-bold text-slate-900 text-lg mb-4">19.1 Program Responsible Sourcing (LBMA)</h5>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Kupując złoto z akredytacją LBMA, masz pewność, że proces wydobycia nie finansował konfliktów zbrojnych ("Blood Gold") oraz przestrzegał restrykcyjnych norm ochrony wód gruntowych przed rtęcią i cyjankiem. To nie tylko etyka — to <strong>bezpieczeństwo płynności</strong>, bo złoto bez tych certyfikatów jest w 2026 roku skupowane z dużą bonifikatą (karą cenową).
                </p>
            </div>
        </div>

        {/* PRAWA KOLUMNA: CIEMNY BOKS "ZIELONA PREMIA" */}
        <div className="lg:col-span-5">
            <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] h-full shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-800">
                <div>
                    <h5 className="text-xl font-black mb-8 text-green-400 border-b border-white/10 pb-4 flex items-center gap-2">
                        <ShieldCheck size={24}/> Zielona Premia (Green Premium)
                    </h5>
                    <ul className="space-y-6">
                        <li className="flex gap-4 items-start">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400 shrink-0">
                                <TrendingUp size={18}/>
                            </div>
                            <div>
                                <strong className="block text-sm">Wyższa odsprzedawalność</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">Sztabki "Green Gold" z pełną historią pochodzenia znajdują nabywców o 30% szybciej na rynkach wtórnych.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400 shrink-0">
                                <Scale size={18}/>
                            </div>
                            <div>
                                <strong className="block text-sm">Zgodność z Taxonomią UE</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">Idealne dla inwestorów prowadzących działalność gospodarczą, raportujących swój ślad węglowy w ramach ESG.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400 shrink-0">
                                <Lock size={18}/>
                            </div>
                            <div>
                                <strong className="block text-sm">Odporność na regulacje</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">Chronisz swój kapitał przed potencjalnymi przyszłymi podatkami od "brudnego wydobycia".</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400 shrink-0">
                                <Search size={18}/>
                            </div>
                            <div>
                                <strong className="block text-sm">Transparentność audytowa</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">Każda sztabka posiada unikalny kod DNA naniesiony laserowo, niemożliwy do sfałszowania.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="mt-12 bg-green-500/10 p-6 rounded-2xl border border-green-500/20">
                    <p className="text-[10px] text-green-300 italic text-center leading-relaxed">
                        "W 2026 roku prawdziwy blask złota mierzy się czystością jego sumienia, a nie tylko jego próbą."
                    </p>
                </div>
                
                <Activity size={250} className="absolute -bottom-24 -right-24 text-white/5 rotate-45" />
            </div>
        </div>
    </div>
</section>

{/* SEKCJA 14: ZŁOTO W PORTFELU EMERYTALNYM (IKE / IKZE) */}
<section id="sekcja-ike" className="scroll-mt-24">
    <SectionHeader icon={PiggyBank} title="Część XIV: Złoto w Portfelu Emerytalnym (IKE / IKZE)" colorClass="text-amber-900" bgClass="bg-amber-50" />
    
    <div className="grid lg:grid-cols-12 gap-12 items-stretch text-left">
        
        {/* LEWA KOLUMNA: EDUKACJA I STRATEGIA PODATKOWA */}
        <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-6 text-left">
                <h4 className="text-2xl font-black text-slate-900 text-left">Rozdział 20: Złoto jako "bezpiecznik" Twojej emerytury</h4>
                <p className="text-sm text-slate-600 leading-relaxed text-left">
                    W 2026 roku świadome planowanie jesieni życia wymaga dywersyfikacji wykraczającej poza lokaty i obligacje. <strong>Indywidualne Konto Emerytalne (IKE)</strong> oraz <strong>Indywidualne Konto Zabezpieczenia Emerytalnego (IKZE)</strong> pozwalają na ekspozycję na rynek złota bez obciążenia 19-procentowym podatkiem od zysków kapitałowych.
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden text-left">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                    <h5 className="font-bold text-slate-900 text-lg">20.1 Fizyczne vs Instrumenty Giełdowe</h5>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed mb-6 text-left">
                    Polskie prawo uniemożliwia bezpośrednie trzymanie fizycznych sztabek w ramach kont emerytalnych. Rozwiązaniem dla inwestora w 2026 roku są instrumenty typu <strong>ETC (Exchange Traded Commodities)</strong>, które są w 100% zabezpieczone fizycznym złotem spoczywającym w skarbcach (np. w Londynie czy Zurychu).
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-amber-600 uppercase block mb-1">Zaleta IKE</span>
                        <p className="text-[10px] text-slate-600 font-medium">Cały zysk wypracowany na wzroście cen złota po 60. roku życia wypłacasz bez podatku (0% zamiast 19%).</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-indigo-600 uppercase block mb-1">Zaleta IKZE</span>
                        <p className="text-[10px] text-slate-600 font-medium">Wpłaty na konto odliczasz od podstawy opodatkowania w rocznym zeznaniu PIT, zyskując natychmiastowy zwrot podatku.</p>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                <h5 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
                    <Info size={16}/> Limity wpłat w 2026 roku:
                </h5>
                <div className="flex justify-between items-center text-xs font-bold text-amber-800 border-b border-amber-200 pb-2 mb-2">
                    <span>Limit IKE:</span>
                    <span>25 410 PLN</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-amber-800">
                    <span>Limit IKZE:</span>
                    <span>10 164 PLN (standard) / 15 246 PLN (dla B2B)</span>
                </div>
            </div>
        </div>

        {/* PRAWA KOLUMNA: BŁĘKITNY BOKS - ANALIZA PORÓWNAWCZA */}
        <div className="lg:col-span-5">
            <div className="bg-indigo-900 text-white p-8 md:p-12 rounded-[3rem] h-full shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-800 text-left">
                <div>
                    <h5 className="text-xl font-black mb-8 border-b border-white/10 pb-4 text-left">Dlaczego warto mieć złoto w IKE?</h5>
                    <ul className="space-y-6 text-left">
                        <li className="flex gap-4 items-start">
                            <div className="p-2 bg-indigo-500/30 rounded-lg text-indigo-300 shrink-0">
                                <Scale size={18}/>
                            </div>
                            <div>
                                <strong className="block text-sm">Brak spreadu dealera</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">Kupując "papierowe" złoto na giełdzie, Twój koszt transakcyjny to zazwyczaj ok. 0,3% - wielokrotnie mniej niż marża fizycznego punktu skupu.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="p-2 bg-indigo-500/30 rounded-lg text-indigo-300 shrink-0">
                                <Lock size={18}/>
                            </div>
                            <div>
                                <strong className="block text-sm">Bezpieczeństwo skarbca</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">Nie martwisz się o sejf domowy czy ubezpieczenie. Kruszec jest chroniony przez największe instytucje finansowe świata.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="p-2 bg-indigo-500/30 rounded-lg text-indigo-300 shrink-0">
                                <RefreshCcw size={18}/>
                            </div>
                            <div>
                                <strong className="block text-sm">Płynność 24/5</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">Swoją pozycję w złocie możesz spieniężyć jednym kliknięciem w aplikacji maklerskiej, nie wychodząc z domu.</p>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="p-2 bg-indigo-500/30 rounded-lg text-indigo-300 shrink-0">
                                <CandlestickChart size={18}/>
                            </div>
                            <div>
                                <strong className="block text-sm">Dostęp do kopalń</strong>
                                <p className="text-xs text-slate-400 leading-relaxed">W ramach IKE możesz kupować akcje spółek wydobywczych, które często rosną szybciej niż sama cena kruszcu.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="mt-12 text-left">
                    <button 
                        onClick={() => navigate('/ike-ikze')}
                        className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <Calculator size={14}/> OBLICZ ZYSK PODATKOWY W IKE
                    </button>
                    <p className="text-[10px] text-slate-400 italic mt-4 text-center">
                        *Złoto w portfelu emerytalnym powinno pełnić rolę stabilizatora (rekomendacja: 10-15% udziału).
                    </p>
                </div>
                
                <Activity size={250} className="absolute -bottom-24 -right-24 text-white/5 rotate-12" />
            </div>
        </div>
    </div>
</section>

{/* --- SEKCJA SEO: NAJCZĘSTSZE PYTANIA W GOOGLE (KAFLE) --- */}
<div className="mt-24 border-t border-slate-100 pt-16">
    <div className="text-center mb-12">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Czego szukasz w Google?</h3>
        <p className="text-sm text-slate-500 italic">Najpopularniejsze zapytania o rynek metali szlachetnych 2026</p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
            { kw: "Kalkulator marży dealera złota", id: "kalkulator-zlota" },
            { kw: "Złoto czy srebro co wybrać 2026", id: "sekcja-porownanie" },
            { kw: "Akredytacja LBMA co to oznacza", id: "sekcja-lbma" },
            { kw: "Podatek od sprzedaży złota 2026", id: "sekcja-prawo" },
            { kw: "Dziedziczenie złota darowizna", id: "sekcja-dziedziczenie" },
            { kw: "Złoto w IKE i IKZE opinie", id: "sekcja-ike" },
            { kw: "Pożyczka pod zastaw złota LTV", id: "sekcja-lombard" },
            { kw: "Złoto z recyklingu (ESG)", id: "sekcja-esg" },
            { kw: "Przechowywanie złota: sejf czy bank", id: "sekcja-logistyka" },
            { kw: "Zasada 6 miesięcy podatki", id: "sekcja-prawo" },
            { kw: "Limit płatności gotówką 2026", id: "sekcja-prawo" },
            { kw: "Monety bulionowe a sztabki różnice", id: "sekcja-praktyka" },
            { kw: "Złoto jako ochrona przed inflacją", id: "sekcja-historia" },
            { kw: "VAT na srebro i platynę w Polsce", id: "sekcja-porownanie" },
            { kw: "Złoto a stopy procentowe korelacja", id: "sekcja-historia" }
        ].map((item, i) => (
            <button 
                key={i}
                onClick={() => scrollToSection(item.id)}
                className="p-6 bg-white border border-slate-200 rounded-3xl text-left hover:border-yellow-400 hover:shadow-md transition-all group"
            >
                <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
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

      </div>
    </>
  );
};