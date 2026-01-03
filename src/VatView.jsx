import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Calculator, Percent, FileText, HelpCircle, ArrowRightLeft, Banknote, ShoppingCart, TrendingUp, Car, Briefcase, Calendar, ShieldCheck, ArrowRight
} from 'lucide-react';

const VAT_RATES = [
  { value: 0.23, label: '23% (Standardowa)' },
  { value: 0.08, label: '8% (Obniżona)' },
  { value: 0.05, label: '5% (Żywność/Książki)' },
  { value: 0.00, label: '0% / ZW (Eksport)' },
];

const formatMoney = (val) => 
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 2 }).format(val);

export const VatView = () => {
  const [amount, setAmount] = useState(1000);
  const [mode, setMode] = useState('netto'); // 'netto' (mam netto) lub 'brutto' (mam brutto)
  const [rate, setRate] = useState(0.23);

  const result = useMemo(() => {
    const val = parseFloat(amount) || 0;
    let netto = 0;
    let vat = 0;
    let brutto = 0;

    if (mode === 'netto') {
      // Mam Netto -> Liczę Brutto
      netto = val;
      vat = val * rate;
      brutto = val + vat;
    } else {
      // Mam Brutto -> Liczę Netto (Odwrócony VAT)
      brutto = val;
      netto = val / (1 + rate);
      vat = brutto - netto;
    }

    return { netto, vat, brutto };
  }, [amount, mode, rate]);

  const chartData = [
    { name: 'Netto', value: result.netto, color: '#3b82f6' }, // blue-500
    { name: 'VAT', value: result.vat, color: '#ef4444' }      // red-500
  ];

  return (
    <>
      <Helmet>
        <title>Kalkulator VAT 2026 - Netto na Brutto i Odwrócony | Finanse Proste</title>
        <meta name="description" content="Szybki kalkulator VAT. Przelicz kwotę netto na brutto lub oblicz podatek VAT z kwoty brutto (metoda w stu). Aktualne stawki 23%, 8%, 5%. Poradnik dla firm." />
        <link rel="canonical" href="https://www.finanse-proste.pl/kalkulator-vat" />
      </Helmet>

      <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16">
        
        {/* HERO */}
        <div className="text-center mb-12 mt-8">
           <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
              <Percent size={14}/> Narzędzie przedsiębiorcy
           </div>
           <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900">
              Kalkulator <span className="text-blue-600">VAT</span>
           </h2>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Przelicz netto na brutto lub wyciągnij VAT z kwoty brutto ("metoda w stu"). Niezbędnik przy wystawianiu faktur, JPK_V7 i rozliczeniach podatkowych.
           </p>
        </div>

        {/* KALKULATOR */}
        <div className="grid lg:grid-cols-12 gap-8 mb-24">
          
          {/* LEWA KOLUMNA - INPUTY */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calculator className="text-blue-600"/> Dane do obliczeń
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Co chcesz obliczyć?</label>
                  <div className="bg-slate-100 p-1 rounded-xl flex">
                    <button 
                      onClick={() => setMode('netto')}
                      className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'netto' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Mam netto &rarr;
                    </button>
                    <button 
                      onClick={() => setMode('brutto')}
                      className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'brutto' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      &larr; Mam brutto
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    {mode === 'netto' ? 'Podaj kwotę netto' : 'Podaj kwotę brutto'}
                  </label>
                  <div className="relative">
                    {/* Dodano klasę [appearance:textfield] aby ukryć strzałki */}
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-2xl font-bold rounded-xl p-4 pr-12 focus:ring-2 focus:ring-blue-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold select-none">PLN</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Stawka VAT</label>
                  <div className="grid grid-cols-2 gap-2">
                    {VAT_RATES.map((r) => (
                      <button 
                        key={r.value}
                        onClick={() => setRate(r.value)}
                        className={`p-3 rounded-xl border text-left transition-all ${rate === r.value ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400 text-blue-900' : 'bg-white border-slate-200 hover:border-blue-300 text-slate-600'}`}
                      >
                        <div className="font-bold text-sm">{r.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRAWA KOLUMNA - WYNIKI */}
          <div className="lg:col-span-7 space-y-6">
             {/* KARTY WYNIKÓW */}
             <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <span className="text-xs font-bold text-slate-400 uppercase mb-1">Kwota Netto</span>
                    <span className="text-3xl font-black text-blue-600">{formatMoney(result.netto)}</span>
                </div>
                <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg flex flex-col justify-center">
                    <span className="text-xs font-bold text-slate-400 uppercase mb-1">Kwota Brutto</span>
                    <span className="text-3xl font-black">{formatMoney(result.brutto)}</span>
                </div>
             </div>
             
             {/* DETALE + WYKRES */}
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-1/2 space-y-6">
                         <div>
                            <span className="text-sm font-bold text-slate-500 block mb-1">Wartość Podatku VAT</span>
                            <span className="text-4xl font-black text-red-500">{formatMoney(result.vat)}</span>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-600 leading-relaxed border border-slate-100">
                            Przy stawce <strong>{(rate * 100).toFixed(0)}%</strong>, podatek stanowi 
                            <strong> {((result.vat / result.brutto) * 100).toFixed(1)}%</strong> kwoty brutto, którą płaci klient końcowy.
                         </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{top: 0, right: 30, left: 20, bottom: 0}} barSize={30}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 12, fontWeight: 'bold'}} axisLine={false} tickLine={false}/>
                                <RechartsTooltip cursor={{fill: 'transparent'}} formatter={(val) => formatMoney(val)} contentStyle={{borderRadius: '12px'}}/>
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* ==========================================================================
            KOMPENDIUM WIEDZY VAT
            ==========================================================================
        */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden text-slate-700 leading-relaxed">
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-16">
                
                <div className="text-center mb-12">
                    <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                        Strefa Wiedzy
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                        Vademecum podatnika VAT
                    </h3>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Czym jest podatek od towarów i usług? Kto musi go płacić, kiedy warto być "vatowcem" i jak obliczyć VAT od samochodu?
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* PODSTAWY */}
                    <div className="space-y-6">
                        <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="text-blue-600"/> Czym jest VAT?
                        </h4>
                        <p className="text-sm">
                            VAT (Value Added Tax) to podatek od wartości dodanej. Płacimy go przy każdym zakupie w sklepie (jest wliczony w cenę brutto). Dla przedsiębiorcy VAT jest <strong>neutralny</strong> - firma jest tylko "poborcą" podatku dla państwa.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-blue-500 text-sm">
                            <strong>Mechanizm:</strong> Doliczasz VAT do swojej sprzedaży (VAT Należny) i odejmujesz VAT od zakupów firmowych (VAT Naliczony). Różnicę wpłacasz do Urzędu Skarbowego.
                        </div>
                    </div>

                    {/* STAWKI */}
                    <div className="space-y-6">
                        <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Percent className="text-blue-600"/> Stawki w Polsce (2026)
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="font-black text-blue-600 w-12 shrink-0">23%</span>
                                <span><strong>Stawka podstawowa.</strong> Dotyczy większości towarów (elektronika, paliwo, samochody, usługi, prąd).</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-black text-blue-600 w-12 shrink-0">8%</span>
                                <span>Remonty mieszkaniowe, leki, niektóre artykuły spożywcze, prasa.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-black text-blue-600 w-12 shrink-0">5%</span>
                                <span>Podstawowe produkty żywnościowe (chleb, mięso), książki.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-black text-blue-600 w-12 shrink-0">0%</span>
                                <span>Eksport towarów i wewnątrzwspólnotowa dostawa towarów (WDT).</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* BRUTTO VS NETTO & B2B */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                    <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Briefcase className="text-blue-600"/> Brutto czy netto? Co się liczy w B2B?
                    </h4>
                    <div className="grid md:grid-cols-2 gap-8 text-sm">
                        <div>
                            <strong className="block text-slate-900 mb-2 font-bold">Dla Konsumenta (Kowalskiego):</strong>
                            <p className="mb-4">Liczy się kwota <strong>BRUTTO</strong>. To tyle realnie znika z Twojego portfela. VAT jest dla Ciebie kosztem ostatecznym, którego nie odzyskasz.</p>
                        </div>
                        <div>
                            <strong className="block text-slate-900 mb-2 font-bold">Dla Przedsiębiorcy (B2B):</strong>
                            <p className="mb-4">Liczy się kwota <strong>NETTO</strong>. To jest realny przychód firmy. VAT przepływa przez konto, ale "nie należy" do firmy.</p>
                            
                            <Link to="/b2b" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                                Sprawdź nasz Kalkulator B2B, aby obliczyć zysk na czysto <ArrowRight size={14}/>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* SAMOCHÓD W FIRMIE */}
                <div className="grid md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Car className="text-blue-600"/> VAT od samochodu i paliwa
                        </h4>
                        <p className="text-sm">
                            Kupując samochód na firmę, nie zawsze możesz odliczyć cały podatek. Przepisy rozróżniają dwa przypadki:
                        </p>
                        <ul className="space-y-3 text-sm">
                            <li className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <strong>50% VAT</strong> – Użytek mieszany (prywatny i służbowy). Standard dla większości firm jednoosobowych. Odliczasz połowę VAT z faktury za paliwo, naprawy i leasing.
                            </li>
                            <li className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <strong>100% VAT</strong> – Wyłącznie użytek służbowy. Wymaga prowadzenia szczegółowej "kilometrówki" i zgłoszenia pojazdu do Urzędu Skarbowego (VAT-26).
                            </li>
                        </ul>
                        <div className="mt-2">
                            <Link to="/leasing" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                                Oblicz ratę w Kalkulatorze Leasingowym <ArrowRight size={14}/>
                            </Link>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="text-blue-600"/> Terminy i Biała lista
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <strong className="block text-slate-900">JPK_V7 (Jednolity Plik Kontrolny)</strong>
                                Przedsiębiorcy muszą wysyłać plik JPK_V7M (miesięcznie) lub JPK_V7K (kwartalnie) do <strong>25. dnia miesiąca</strong>.
                            </li>
                            <li>
                                <strong className="block text-slate-900">Biała lista podatników VAT</strong>
                                Zanim przelejesz kontrahentowi kwotę powyżej 15 000 zł, musisz sprawdzić, czy jego numer konta widnieje na Białej liście. Jeśli przelejesz na inne konto – nie zaliczysz wydatku do kosztów i ryzykujesz solidarną odpowiedzialnością za jego VAT!
                            </li>
                        </ul>
                     </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 items-start">
                     <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={24}/>
                     <div className="text-sm text-blue-900">
                         {/* NAPRAWIONE ZNAKI STRZAŁEK PONIŻEJ */}
                         <strong>Metoda "w stu" vs "od stu":</strong> Nasz kalkulator obsługuje oba kierunki. <br/>
                         1. <strong>Od stu (Netto &rarr; Brutto):</strong> Masz 100 zł netto + 23% VAT = 123 zł brutto. <br/>
                         2. <strong>W stu (Brutto &rarr; Netto):</strong> Masz 123 zł brutto. Aby wyciągnąć VAT, nie odejmujesz 23%, lecz dzielisz przez 1.23. Wtedy otrzymujesz 100 zł netto. To tzw. rachunek "w stu", często mylony przez początkujących.
                     </div>
                </div>

            </div>
        </div>

      </div>
    </>
  );
};