import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp, AlertTriangle, Coins, Calculator, Lock, Calendar,
  ShieldCheck, Scale, Banknote, Atom, Globe, Pickaxe, History, Zap,
  Landmark, Layers, Hammer, Flame, Truck, ScrollText, Search,
  AlertOctagon, Microscope, Landmark as BankIcon, CandlestickChart,
  LineChart, PieChart, Rocket, Bitcoin, Anchor, RefreshCcw, ArrowDown, Info
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

        {/* KALKULATOR */}
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
                    <div className="grid md:grid-cols-2 gap-12">
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
                    <div className="grid md:grid-cols-3 gap-8">
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
                    <div className="grid md:grid-cols-12 gap-8">
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
                     <div className="grid md:grid-cols-2 gap-8">
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
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
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
                    <div className="grid md:grid-cols-3 gap-8">
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

            </div>
        </div>

      </div>
    </>
  );
};