import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Building2, Key, Calculator, Scale, Info, Home, Banknote, CalendarClock, BookOpen, Percent, Landmark, ArrowRight, ShieldCheck, Activity, ArrowDown, PiggyBank
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

             {/* POPRAWKA 2: UZUPEŁNIENIE PUSTKI - Karta kierująca do wiedzy */}
             <div onClick={scrollToKnowledge} className="mt-4 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg cursor-pointer group flex items-center justify-between hover:shadow-xl transition-all border border-slate-700">
                <div>
                   <h4 className="text-white font-bold text-lg mb-1 group-hover:text-indigo-300 transition-colors">Brakuje Ci na wkład własny?</h4>
                   <p className="text-slate-400 text-sm">Sprawdź, jak legalnie wypłacić środki z PPK na zakup mieszkania 👇</p>
                </div>
                <div className="bg-white/10 p-3 rounded-full group-hover:bg-white/20 transition-colors">
                   <ArrowDown className="text-white animate-bounce" size={24}/>
                </div>
             </div>

          </div>
        </div>

        {/* ==========================================================================
            KOMPENDIUM WIEDZY
            ==========================================================================
        */}
        <div id="kompendium" className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-slate-700 leading-relaxed scroll-mt-24">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-16">
                
                <div className="text-center mb-12">
                    <div className="inline-block bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                        Baza wiedzy
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                        Nieruchomości i kredyty
                    </h3>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Zanim podejmiesz decyzję, zrozum mechanizmy rządzące rynkiem. Czym jest hipoteka? Jak działają podatki przy sprzedaży i skąd wziąć na wkład własny?
                    </p>
                </div>

                {/* POPRAWKA 3: NOWA SEKCJA O PPK */}
                <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8">
                     <h4 className="text-2xl font-bold text-orange-900 flex items-center gap-2 mb-4">
                        <PiggyBank className="text-orange-600"/> Skąd wziąć na wkład własny? (PPK)
                     </h4>
                     <p className="text-sm text-slate-700 mb-6">
                        Wiele osób nie wie, że środki zgromadzone w <strong>Pracowniczych Planach Kapitałowych (PPK)</strong> można wykorzystać na zakup mieszkania, nawet jeśli masz mniej niż 60 lat!
                     </p>
                     
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-2xl shadow-sm">
                            <strong className="text-slate-900 block mb-2">1. Wypłata na wkład własny (do 45 lat)</strong>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Możesz wypłacić do <strong>100% środków</strong> z PPK na pokrycie wkładu własnego przy kredycie hipotecznym. Jest to traktowane jak nieoprocentowana pożyczka. Masz 15 lat na jej zwrot z powrotem na swoje konto PPK.
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm">
                            <strong className="text-slate-900 block mb-2">2. Małżeństwo = Podwójna korzyść</strong>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Jeśli oboje z małżonkiem oszczędzacie w PPK, możecie zsumować swoje środki. To często pozwala uzbierać wymagane 10-20% wkładu bez sięgania do oszczędności bieżących.
                            </p>
                        </div>
                     </div>
                     <div className="mt-4 text-right">
                         <Link to="/ppk" className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center justify-end gap-1">
                             Dowiedz się więcej o PPK <ArrowRight size={12}/>
                         </Link>
                     </div>
                </div>

                {/* DEFINICJE KREDYTOWE */}
                <div className="grid md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Landmark className="text-indigo-600"/> Kredyt hipoteczny
                        </h4>
                        <p className="text-sm">
                            To długoterminowa pożyczka celowa, której zabezpieczeniem jest nieruchomość. Bank wpisuje się do <strong>Działu IV Księgi Wieczystej</strong>. Oznacza to, że jeśli przestaniesz spłacać, bank może przejąć nieruchomość.
                        </p>
                        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                             <h5 className="font-bold text-indigo-900 mb-2 text-sm">Co może być zastawem?</h5>
                             <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
                                <li>Mieszkanie, które właśnie kupujesz.</li>
                                <li>Inna nieruchomość, którą już posiadasz (np. rodziców - za ich zgodą).</li>
                                <li>Działka budowlana.</li>
                                <li>Dom w budowie (wypłata kredytu w transzach).</li>
                             </ul>
                             <p className="mt-3 text-xs text-indigo-600 font-medium">
                                Zastawem nie może być ruchomość (np. samochód) - to byłby kredyt pod zastaw, a nie hipoteczny.
                             </p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Percent className="text-indigo-600"/> Oprocentowanie: Zmienne czy stałe?
                        </h4>
                        <p className="text-sm">
                            Najważniejszy parametr wpływający na Twoją ratę. Wybór zależy od Twojej tolerancji na ryzyko i prognoz rynkowych.
                        </p>
                        
                        <div className="space-y-3">
                            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                <strong className="block text-slate-900 mb-1">Stopa zmienna (WIBOR + marża)</strong>
                                <p className="text-xs text-slate-500">
                                    Rata zmienia się co 3 lub 6 miesięcy. Gdy stopy procentowe w Polsce rosną, Twoja rata rośnie (ryzyko!). Gdy spadają, rata maleje. Marża banku jest stała, zmienia się tylko wskaźnik WIBOR.
                                </p>
                            </div>
                            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                <strong className="block text-slate-900 mb-1">Stopa stała (okresowo)</strong>
                                <p className="text-xs text-slate-500">
                                    Bank gwarantuje stałą ratę zazwyczaj przez <strong>5, 7 lub 10 lat</strong>. Po tym czasie oprocentowanie jest ustalane na nowo (zgodnie z rynkiem). Daje bezpieczeństwo i przewidywalność, ale często oferta jest nieco droższa na start.
                                </p>
                            </div>
                        </div>
                        <div className="text-xs text-center">
                            <Link to="/nadplata-kredytu" className="text-indigo-600 font-bold hover:underline">
                                Sprawdź nasz kalkulator nadpłaty kredytu &rarr;
                            </Link>
                        </div>
                     </div>
                </div>

                <hr className="border-slate-100" />

                {/* PODATKI PRZY ZAKUPIE */}
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Banknote className="text-green-600"/> Podatki przy zakupie (PCC)
                        </h4>
                        <p className="text-sm">
                            Kluczowym podatkiem jest PCC (Podatek od czynności cywilnoprawnych). Jego występowanie zależy od tego, <strong>od kogo</strong> kupujesz mieszkanie.
                        </p>
                        
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-sm">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                                <span>Rynek pierwotny (Deweloper)</span>
                                <span className="font-bold text-green-600">0% PCC</span>
                            </div>
                            <div className="text-xs text-slate-500">Płacisz cenę brutto (z VAT), ale unikasz podatku PCC.</div>

                            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                                <span>Rynek wtórny (Używane)</span>
                                <span className="font-bold text-indigo-600">2% PCC</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span>Pierwsze mieszkanie (Wtórny)</span>
                                <span className="font-bold text-green-600">0% PCC</span>
                            </div>
                            <div className="text-xs text-green-700 bg-green-50 p-3 rounded-lg mt-2 leading-relaxed">
                                <strong>Ważna ulga:</strong> Jeśli kupujesz swoje pierwsze w życiu mieszkanie (i nie masz udziałów &gt;50% w innym), od 31.08.2023 jesteś zwolniony z 2% podatku PCC! Przy mieszkaniu za 500 tys. zł oszczędzasz <strong>10 000 zł</strong>.
                            </div>
                        </div>
                    </div>

                    {/* PODATKI PRZY SPRZEDAŻY */}
                    <div className="space-y-6">
                         <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <CalendarClock className="text-green-600"/> Sprzedaż i PIT (Zasada 5 lat)
                        </h4>
                        <p className="text-sm">
                            Sprzedając nieruchomość z zyskiem, możesz być zobowiązany do zapłaty <strong>19% podatku dochodowego</strong>.
                        </p>
                        
                        <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                            <h5 className="font-bold text-green-900 mb-2 text-sm">Kiedy podatek znika?</h5>
                            <p className="text-sm text-green-800 mb-4">
                                Nie zapłacisz ani grosza podatku, jeśli sprzedasz nieruchomość po upływie <strong>5 lat podatkowych</strong>. Czas liczymy od końca roku kalendarzowego, w którym nastąpił zakup.
                            </p>
                            <div className="bg-white p-4 rounded-xl text-xs text-slate-600 border border-green-200">
                                <strong>Przykład:</strong> Kupiłeś mieszkanie w lipcu 2020.<br/>
                                Koniec roku zakupu: 31.12.2020.<br/>
                                5 lat mija: 31.12.2025.<br/>
                                Sprzedaż bez podatku możliwa od: <strong>01.01.2026</strong>.
                            </div>
                        </div>
                    </div>
                </div>

                {/* ULGA MIESZKANIOWA */}
                <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 md:p-12">
                    <h3 className="text-2xl font-bold text-center mb-6">Jak uniknąć podatku przed upływem 5 lat?</h3>
                    <p className="text-center text-slate-600 max-w-2xl mx-auto mb-8 text-sm">
                        Istnieje legalny sposób na uniknięcie 19% podatku, nawet jeśli sprzedajesz mieszkanie szybciej ("odpłatne zbycie"). Nazywa się to <strong>Ulgą Mieszkaniową</strong>.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="text-indigo-600 font-black text-4xl mb-2">1</div>
                            <h4 className="font-bold text-slate-900 mb-2 text-sm">Warunek celu</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Musisz przeznaczyć środki ze sprzedaży na <strong>własne cele mieszkaniowe</strong>. Może to być zakup nowego, większego mieszkania, budowa domu, a nawet spłatę kredytu hipotecznego zaciągniętego na inną nieruchomość (przed dniem sprzedaży).
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="text-indigo-600 font-black text-4xl mb-2">2</div>
                            <h4 className="font-bold text-slate-900 mb-2 text-sm">Warunek czasu</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Masz na to <strong>3 lata</strong>, licząc od końca roku podatkowego, w którym sprzedałeś starą nieruchomość.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="text-indigo-600 font-black text-4xl mb-2">3</div>
                            <h4 className="font-bold text-slate-900 mb-2 text-sm">Pułapka "Na własne"</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Uwaga! Cel musi być "własny". Zakup mieszkania z przeznaczeniem pod wynajem, garażu (bez mieszkania) czy samej działki rekreacyjnej (ROD) <strong>nie uprawnia</strong> do skorzystania z ulgi.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 text-sm text-slate-500 font-medium">
                    <Link to="/" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                        <Home size={16}/> Strona główna
                    </Link>
                    <span>•</span>
                    <Link to="/obligacje" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                        <ShieldCheck size={16}/> Obligacje
                    </Link>
                     <span>•</span>
                    <Link to="/gielda" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                        <Activity size={16}/> Giełda
                    </Link>
                </div>

                <div className="text-center text-[10px] text-slate-400">
                    *Powyższe informacje mają charakter edukacyjny. Przepisy podatkowe ulegają zmianom. Przed dużą transakcją skonsultuj się z doradcą podatkowym lub notariuszem.
                </div>

            </div>
        </div>

      </div>
    </>
  );
};