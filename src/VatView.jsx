import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Calculator, Percent, FileText, HelpCircle, ArrowRightLeft, Banknote, 
  ShoppingCart, TrendingUp, TrendingDown, Car, Briefcase, Calendar, 
  ShieldCheck, ArrowRight, ListTree, Globe, Scale, Lock, CheckCircle, 
  XCircle, AlertTriangle, FileSignature, Info, Search, Umbrella, Target,
  Cpu, Plane, HandCoins, Gift, ShieldAlert, FileDigit, Zap, Clock, CreditCard, 
  PackageSearch, QrCode, Database, FileCheck // <-- Te ikony domykają profesjonalny wygląd KSeF
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
  const navigate = useNavigate();
  const scrollToVAT = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Margines, aby nagłówek nie zasłaniał sekcji
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };
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

        {/* --- SPIS TREŚCI VAT --- */}
        <div className="mb-16 bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm flex flex-wrap justify-center gap-2 md:gap-3 text-left">
          <div className="w-full flex items-center justify-center gap-2 mb-2 text-slate-400">
            <ListTree size={16}/>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Nawigacja po kompendium</span>
          </div>
          
          <button
            onClick={() => scrollToVAT('kalkulator-vat-sekcja')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Calculator size={14}/> URUCHOM KALKULATOR
          </button>

          {[
            { title: "Fundamenty i neutralność", icon: FileText, id: "sekcja-1-vat" },
            { title: "Limit zwolnienia 200k", icon: ShieldCheck, id: "sekcja-2-vat" },
            { title: "Vat-ue i zagranica", icon: Globe, id: "sekcja-3-vat" },
            { title: "Samochód i paliwo", icon: Car, id: "sekcja-4-vat" },
            { title: "Obowiązkowy KSeF", icon: Cpu, id: "sekcja-5-vat" },
            { title: "Zwrot podatku Vat-ref", icon: Plane, id: "sekcja-6-vat" },
            { title: "Ulga na złe długi", icon: ShieldAlert, id: "sekcja-7-vat" },
            { title: "Marketing i prezenty", icon: Gift, id: "sekcja-8-vat" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => scrollToVAT(item.id)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-slate-100 bg-white"
            >
              <item.icon size={14} className="text-slate-400"/>
              {item.title}
            </button>
          ))}
        </div>

        {/* KALKULATOR */}
        <div id="kalkulator-vat-sekcja" className="grid lg:grid-cols-12 gap-8 mb-24">
          
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
            KOMPENDIUM WIEDZY: BIBLIA VAT 2026
            ========================================================================== */}
        <div className="mt-24 space-y-16">
            
            {/* NAGŁÓWEK KOMPENDIUM */}
            <div className="bg-slate-900 text-white rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/30">
                        <FileText size={16}/> Akademia Podatków Firmowych
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                        Wszystko, co musisz wiedzieć o <span className="text-blue-500">VAT</span>
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium">
                        Dla przedsiębiorcy <strong>kalkulator VAT 2026</strong> to fundament planowania cen i kosztów. Zrozumienie mechanizmu odliczeń to różnica między zyskiem a stratą.
                    </p>
                </div>
                <Percent className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 -rotate-12" />
            </div>

{/* SEKCJA 1: FUNDAMENTY VAT, NEUTRALNOŚĆ I ZASADA CASH FLOW */}
            <div id="sekcja-1-vat" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">1</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Fundamenty VAT: Mechanizm, neutralność i cash flow</h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <p className="text-slate-600 leading-relaxed text-sm">
                            VAT (Value Added Tax) to podatek pośredni, który docelowo obciąża tylko konsumenta końcowego. Dla firmy zarejestrowanej jako <strong>czynny podatnik vat</strong>, podatek ten powinien być z założenia neutralny. Oznacza to, że każda złotówka VAT-u, którą doliczasz do faktury (VAT należny), może zostać pomniejszona o VAT z Twoich zakupów firmowych (VAT naliczony).
                        </p>
                        
                        {/* PORÓWNANIE PERSPEKTYW */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">Perspektywa B2C</span>
                                <strong className="text-slate-900 text-sm block mb-1">Cena Brutto to koszt</strong>
                                <p className="text-[11px] text-slate-500 leading-relaxed">Dla klienta prywatnego liczy się tylko kwota z VAT. Nie może go odliczyć, więc podatek jest ostatecznym kosztem.</p>
                            </div>
                            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">Perspektywa B2B</span>
                                <strong className="text-slate-900 text-sm block mb-1">Cena Netto to przychód</strong>
                                <p className="text-[11px] text-slate-500 leading-relaxed">Dla firmy VAT to tylko "przelew techniczny". Realnym zarobkiem jest kwota <strong>netto</strong> z kalkulatora VAT.</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden">
                            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Złota zasada Cash Flow:</h4>
                            <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                                "Pieniądze z VAT na Twoim koncie nie należą do Ciebie. To nieoprocentowany kredyt od Państwa, który musisz oddać do 25. dnia miesiąca."
                            </p>
                            <Banknote className="absolute -bottom-6 -right-6 text-white/5 w-24 h-24 rotate-12" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* KARTA: MECHANIZM ODLICZANIA */}
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left">
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm"><ArrowRightLeft size={18} className="text-blue-600"/> Jak działa odliczanie VAT?</h4>
                            <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                <strong>Kalkulator VAT 2026</strong> pomaga wyliczyć nadwyżkę, którą przelejesz do Urzędu Skarbowego. Jeśli w danym miesiącu Twoje zakupy (np. leasing auta, sprzęt IT) wygenerują więcej VAT-u niż Twoja sprzedaż, powstaje <strong>nadpłata</strong>. Możesz ją przenieść na kolejny miesiąc lub wnioskować o zwrot na konto (zazwyczaj w ciągu 60 dni).
                            </p>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-white rounded-full border border-slate-200 text-[10px] font-bold text-slate-500">VAT Należny</span>
                                <span className="px-3 py-1 bg-white rounded-full border border-slate-200 text-[10px] font-bold text-slate-500">VAT Naliczony</span>
                            </div>
                        </div>

                        {/* KARTA: TERMINY */}
                        <div className="p-6 bg-blue-600 text-white rounded-3xl shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="font-bold mb-2 flex items-center gap-2 text-sm"><Calendar size={18}/> Magiczna data: 25. dzień miesiąca</h4>
                                <p className="text-xs text-blue-100 leading-relaxed">
                                    To ostateczny termin na złożenie deklaracji <strong>JPK_V7</strong> i opłacenie podatku za miesiąc poprzedni. Spóźnienie choćby o jeden dzień naraża Cię na odsetki karne i utratę dobrej reputacji w systemie skarbowym.
                                </p>
                            </div>
                            <ShieldCheck className="absolute -bottom-4 -right-4 text-white/10 w-20 h-20" />
                        </div>

                        <p className="text-[11px] text-slate-400 italic text-center">
                            Wskazówka: Stosuj <strong>metodę kasową</strong>, jeśli chcesz płacić VAT dopiero wtedy, gdy klient faktycznie opłaci Twoją fakturę.
                        </p>
                    </div>
                </div>
          {/* SEKCJA 2: LIMIT ZWOLNIENIA I STRATEGIA WYBORU */}
            <div id="sekcja-2-vat" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">2</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Limit zwolnienia z VAT: Komu opłaca się status podatnika?</h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <p className="text-slate-600 leading-relaxed text-sm">
                            W 2026 roku podstawowy <strong>limit zwolnienia z VAT</strong> wynosi nadal <strong>200 000 zł</strong> rocznego przychodu netto. Jeśli Twoja sprzedaż nie przekracza tej kwoty, możesz korzystać ze zwolnienia podmiotowego. To oznacza mniej biurokracji i brak konieczności doliczania 23% do cen dla klientów prywatnych.
                        </p>
                        
                        {/* ZASADA PROPORCJONALNOŚCI */}
                        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                            <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2 text-sm">
                                <AlertTriangle size={18} className="text-amber-600"/> Uwaga: Pułapka proporcji
                            </h4>
                            <p className="text-xs text-amber-800 leading-relaxed">
                                Jeśli zakładasz firmę w ciągu roku, limit 200 tys. zł liczy się <strong>proporcjonalnie</strong> do liczby dni prowadzenia działalności. Otwierając biznes 1 lipca, Twój limit na ten rok wynosi tylko 100 000 zł. Przekroczenie go o złotówkę automatycznie czyni Cię podatnikiem VAT.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-widest italic">Kiedy warto zrezygnować ze zwolnienia?</h4>
                            <ul className="space-y-3 text-xs text-slate-600">
                                <li className="flex gap-2 font-medium">
                                    <CheckCircle size={14} className="text-green-500 shrink-0"/> 
                                    Gdy Twoimi klientami są inne firmy (B2B) – oni odliczą Twój VAT.
                                </li>
                                <li className="flex gap-2 font-medium">
                                    <CheckCircle size={14} className="text-green-500 shrink-0"/> 
                                    Gdy planujesz duże zakupy (leasing auta, sprzęt IT, towar).
                                </li>
                                <li className="flex gap-2 font-medium">
                                    <CheckCircle size={14} className="text-green-500 shrink-0"/> 
                                    Gdy stawka VAT na Twoje usługi jest niska (np. 8%), a kupujesz produkty z 23% VAT.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* KARTA: OBOWIĄZKOWY VAT */}
                        <div className="p-8 bg-slate-900 text-white rounded-[2rem] relative overflow-hidden">
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
                                <ShieldCheck size={24}/> Kto musi płacić VAT od 1. dnia?
                            </h4>
                            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                Niektóre branże nie mogą korzystać z limitu 200 tys. zł. Muszą zarejestrować formularz <strong>VAT-R</strong> przed wystawieniem pierwszej faktury. Dotyczy to m.in.:
                            </p>
                            <ul className="grid grid-cols-1 gap-3 text-[11px] font-medium text-slate-300">
                                <li className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                                    <XCircle size={14} className="text-red-400"/> Prawnicy i doradcy podatkowi
                                </li>
                                <li className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                                    <XCircle size={14} className="text-red-400"/> Firmy jubilerskie i windykacyjne
                                </li>
                                <li className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                                    <XCircle size={14} className="text-red-400"/> Sprzedawcy kosmetyków i części RTV online
                                </li>
                                <li className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                                    <XCircle size={14} className="text-red-400"/> Firmy bez siedziby w Polsce
                                </li>
                            </ul>
                            <FileSignature className="absolute -bottom-10 -right-10 text-white/5 w-48 h-48 -rotate-12" />
                        </div>

                        {/* KARTA: REJESTRACJA VAT-R */}
                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-left">
                            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm">
                                <TrendingUp size={18} className="text-blue-600"/> Jak zostać "Vatowcem"?
                            </h4>
                            <p className="text-xs text-blue-800 leading-relaxed">
                                Rejestracja odbywa się poprzez złożenie <strong>deklaracji VAT-R</strong> w Twoim Urzędzie Skarbowym. Jest ona darmowa, chyba że potrzebujesz potwierdzenia rejestracji (koszt 170 zł). Pamiętaj, aby zrobić to min. 7 dni przed pierwszą sprzedażą z doliczonym VAT-em.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEKCJA 3: STAWKI VAT I HANDEL ZAGRANICZNY (VAT-UE) */}
            <div id="sekcja-3-vat" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">3</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Stawki VAT i współpraca zagraniczna: Jak nie płacić dwa razy?</h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <p className="text-slate-600 leading-relaxed text-sm">
                            W 2026 roku polski system opiera się na czterech głównych stawkach. Wybór odpowiedniej zależy od rodzaju towaru lub usługi, ale prawdziwa magia dzieje się przy <strong>eksporcie usług</strong>. Pamiętaj, że <strong>kalkulator VAT netto brutto</strong> zawsze musi bazować na stawce właściwej dla miejsca świadczenia usługi.
                        </p>
                        
                        {/* PRZEGLĄD STAWEK */}
                        <div className="bg-slate-50 rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Stawki VAT w pigułce</h4>
                                <ul className="space-y-3 text-xs font-medium text-slate-600">
                                    <li className="flex justify-between p-2 bg-white rounded-lg border border-slate-100">
                                        <span className="font-bold text-blue-600">23%</span>
                                        <span>Standard (Usługi IT, elektronika, paliwo)</span>
                                    </li>
                                    <li className="flex justify-between p-2 bg-white rounded-lg border border-slate-100">
                                        <span className="font-bold text-blue-600">8%</span>
                                        <span>Obniżona (Gastronomia, remonty, leki)</span>
                                    </li>
                                    <li className="flex justify-between p-2 bg-white rounded-lg border border-slate-100">
                                        <span className="font-bold text-blue-600">5%</span>
                                        <span>Podstawowa (Chleb, nabiał, mięso, książki)</span>
                                    </li>
                                    <li className="flex justify-between p-2 bg-white rounded-lg border border-slate-100">
                                        <span className="font-bold text-blue-600">0% / ZW</span>
                                        <span>Eksport i WDT (Wymaga statusu VAT-UE)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* KARTA: VAT-UE I REVERSE CHARGE */}
                        <div className="p-6 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
                            <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2 text-sm">
                                <Globe size={18}/> VAT-UE: Okno na świat
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Sprzedajesz kod dla klienta z Niemiec lub wykupujesz reklamy na Facebooku? Musisz posiadać numer <strong>VAT-UE</strong> (Twój NIP z przedrostkiem PL). W takim przypadku stosuje się mechanizm <strong>Reverse Charge</strong> (odwrotne obciążenie) – wystawiasz fakturę NETTO, a podatek rozlicza nabywca w swoim kraju.
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-300 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                                <ArrowRightLeft size={14}/> Obowiązek rejestracji VAT-UE przed 1. transakcją!
                            </div>
                        </div>

                        {/* KARTA: ZAGRANICZNE KOSZTY */}
                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-left">
                            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                                <ShieldCheck size={18} className="text-blue-600"/> Zakupy zagraniczne (Import)
                            </h4>
                            <p className="text-xs text-blue-800 leading-relaxed">
                                Kupując sprzęt od kontrahenta z UE (np. Amazon Business), otrzymasz fakturę bez podatku. Jako polski przedsiębiorca musisz jednak "naliczyć" ten VAT w swojej deklaracji i jednocześnie go "odliczyć". Wynik finansowy to zero, ale biurokracja jest obowiązkowa.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* TIP EKSPERCKI */}
                <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-white p-3 rounded-2xl shadow-sm">
                        <TrendingUp size={24} className="text-blue-600"/>
                    </div>
                    <p className="text-xs text-slate-500 italic leading-relaxed">
                        <strong>Ekspert radzi:</strong> Nawet jeśli korzystasz ze <strong>zwolnienia z VAT</strong> w Polsce (do 200k), przed zakupem reklamy od Google (Irlandia) musisz zarejestrować się do <strong>VAT-UE</strong>. Wiele osób o tym zapomina i naraża się na dotkliwe kary skarbowe już na starcie biznesu.
                    </p>
                </div>
            </div>
{/* SEKCJA 4: VAT OD SAMOCHODU I PALIWA – ZASADY ODLICZEŃ */}
            <div id="sekcja-4-vat" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">4</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">VAT od samochodu i paliwa: Wielki dylemat 50% czy 100%?</h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Kupując samochód na firmę lub biorąc go w leasing, musisz zadeklarować sposób jego użytkowania. To od tej decyzji zależy, jaką kwotę pokaże Twój <strong>kalkulator VAT netto brutto</strong> przy rozliczaniu paliwa czy raty. W 2026 roku zasady pozostają rygorystyczne, zwłaszcza przy pełnym odliczeniu.
                        </p>
                        
                        {/* PORÓWNANIE TRYBÓW ODLICZEŃ */}
                        <div className="bg-slate-50 rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                            <div className="grid grid-cols-2 divide-x divide-slate-200">
                                <div className="p-6">
                                    <div className="text-blue-600 font-black text-[10px] uppercase mb-3 flex items-center gap-2">
                                        <TrendingDown size={14}/> Użytek mieszany (50%)
                                    </div>
                                    <ul className="text-[11px] text-slate-500 space-y-3 font-medium">
                                        <li className="flex gap-2"><CheckCircle size={12} className="text-green-500 shrink-0"/> Bez kilometrówki</li>
                                        <li className="flex gap-2"><CheckCircle size={12} className="text-green-500 shrink-0"/> Cele prywatne OK</li>
                                        <li className="flex gap-2"><Info size={12} className="text-blue-400 shrink-0"/> 50% VAT w koszty PIT</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-blue-50/20">
                                    <div className="text-indigo-600 font-black text-[10px] uppercase mb-3 flex items-center gap-2">
                                        <ShieldCheck size={14}/> Tylko firma (100%)
                                    </div>
                                    <ul className="text-[11px] text-slate-600 space-y-3 font-medium">
                                        <li className="flex gap-2"><XCircle size={12} className="text-red-400 shrink-0"/> Pełna kilometrówka</li>
                                        <li className="flex gap-2"><XCircle size={12} className="text-red-400 shrink-0"/> Zgłoszenie VAT-26</li>
                                        <li className="flex gap-2"><AlertTriangle size={12} className="text-orange-500 shrink-0"/> Ryzyko kontroli</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* KARTA: CO Z NIEODLICZONYM VATEM? */}
                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-left">
                            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm">
                                <HelpCircle size={18} className="text-blue-600"/> Co się dzieje z drugą połową VAT?
                            </h4>
                            <p className="text-xs text-blue-800 leading-relaxed">
                                Wybierając <strong>odliczenie 50% VAT</strong>, pozostała połowa podatku z faktury (np. za paliwo czy serwis) nie przepada. Zwiększa ona kwotę netto wydatku, która w całości staje się Twoim kosztem uzyskania przychodu. Dzięki temu realnie odzyskujesz część tych pieniędzy w niższym podatku dochodowym (PIT/CIT).
                            </p>
                        </div>

                        {/* KARTA: UBEZPIECZENIE AC A VAT */}
                        <div className="p-6 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
                            <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2 text-sm">
                                <ShieldCheck size={18}/> Ubezpieczenie a podatek VAT
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed relative z-10">
                                Pamiętaj: Składka ubezpieczeniowa (OC/AC) jest <strong>zwolniona z VAT</strong>. Na polisie nie znajdziesz tego podatku, więc nie masz czego odliczać w rejestrach VAT. Ma to ogromne znaczenie przy rozliczaniu szkód – jeśli jesteś "Vatowcem", odszkodowanie netto może nie pokryć całości kosztów naprawy brutto.
                            </p>
                            <ShieldCheck className="absolute -bottom-6 -right-6 text-white/5 w-24 h-24" />
                        </div>
                    </div>
                </div>

                {/* PRZYCISK DO LEASINGU */}
                <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-left">
                        <h5 className="font-bold text-slate-900 mb-1">Planujesz auto w leasingu?</h5>
                        <p className="text-xs text-slate-500">Sprawdź, jak limit 150 tys. zł wpływa na Twoje podatki.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/leasing')}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
                    >
                        <Car size={16}/> Otwórz Kalkulator Leasingowy
                    </button>
                </div>
            </div>

            {/* SEKCJA 5: SPLIT PAYMENT I BIAŁA LISTA – TARCZA PRZEDSIĘBIORCY */}
            <div id="sekcja-5-vat" className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl text-left">
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">5</div>
                        <h3 className="text-2xl font-bold tracking-tight">Bezpieczeństwo finansowe: Split Payment i Biała Lista</h3>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div className="space-y-6">
                            <p className="text-slate-300 leading-relaxed text-sm">
                                W 2026 roku fiskus kładzie ogromny nacisk na to, komu przelewasz pieniądze. <strong>Split payment limit 2026</strong> wynosi 15 000 zł brutto. Jeśli faktura przekracza tę kwotę i dotyczy towarów wrażliwych, musisz zastosować mechanizm podzielonej płatności.
                            </p>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                                <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2 text-sm"><Search size={18}/> Czym jest Biała Lista?</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    To publiczny rejestr prowadzony przez KAS. Zanim zrobisz przelew powyżej 15 tys. zł, sprawdź, czy konto kontrahenta tam widnieje. Przelew na "dzikie" konto oznacza brak możliwości zaliczenia wydatku do kosztów i ryzyko kary!
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-6 bg-white/10 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-colors">
                                    <h5 className="font-bold text-white mb-2 text-sm flex items-center gap-2"><Lock size={16} className="text-blue-400"/> Konto VAT</h5>
                                    <p className="text-[11px] text-slate-400">Bank automatycznie otwiera dla Ciebie subkonto VAT. Środki tam zgromadzone są "zamrożone" – możesz nimi płacić tylko VAT do urzędu lub kontrahentom oraz inne podatki i ZUS.</p>
                                </div>
                                <div className="p-6 bg-white/10 rounded-3xl border border-white/10 hover:border-orange-500/50 transition-colors">
                                    <h5 className="font-bold text-white mb-2 text-sm flex items-center gap-2"><AlertTriangle size={16} className="text-orange-400"/> Sankcja 30%</h5>
                                    <p className="text-[11px] text-slate-400">Brak adnotacji "mechanizm podzielonej płatności" na fakturze, która tego wymaga, grozi dodatkową sankcją w wysokości 30% kwoty VAT wykazanego na tej fakturze.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ShieldCheck size={300} className="absolute -bottom-20 -right-20 text-white/5 -rotate-12" />
            </div>

            {/* SEKCJA 6: ZWOLNIENIA PRZEDMIOTOWE – KTO NIE PŁACI VAT? */}
            <div id="sekcja-6-vat" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">6</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Zwolnienie przedmiotowe: VAT-owcy z mocy prawa</h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Niezależnie od tego, czy Twój przychód przekracza 200 tys. zł, niektóre usługi są <strong>zwolnione z VAT przedmiotowo</strong>. To "strefa wolna od VAT", która dotyczy zawodów zaufania publicznego i edukacji.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { title: "Medycyna", desc: "Lekarze, dentyści, pielęgniarki.", icon: CheckCircle },
                                { title: "Edukacja", desc: "Nauczyciele języków obcych.", icon: CheckCircle },
                                { title: "Psychologia", desc: "Terapie i opieka psych.", icon: CheckCircle },
                                { title: "Finanse", desc: "Ubezpieczenia i pożyczki.", icon: CheckCircle },
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="text-blue-600 mb-2"><item.icon size={18}/></div>
                                    <h5 className="font-bold text-slate-900 text-xs mb-1">{item.title}</h5>
                                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100 relative">
                        <h4 className="text-lg font-black text-blue-900 mb-4 leading-tight text-left">
                            VAT się opłaca, czy tylko przeszkadza?
                        </h4>
                        <p className="text-sm text-blue-800 mb-6 leading-relaxed">
                            Prowadząc <strong>JDG na ryczałcie</strong> i pracując z domu, VAT zazwyczaj Cię nie dotyczy. Ale jeśli planujesz <strong>leasing maszyny</strong> lub biuro – status vatowca odda Ci 23% zainwestowanej kwoty.
                        </p>
                        <button 
                            onClick={() => navigate('/b2b')}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            <Target size={18}/> Sprawdź zysk na B2B
                        </button>
                        <Umbrella size={80} className="absolute -top-10 -right-5 text-blue-200 rotate-12" />
                    </div>
                </div>
            </div>
{/* SEKCJA 5: OBOWIĄZKOWY KSeF 2026 – REWOLUCJA I SANKCJE */}
            <div id="sekcja-5-vat" className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl text-left">
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shrink-0">5</div>
                        <div>
                            <h3 className="text-3xl font-black tracking-tight text-white">Obowiązkowy KSeF 2026: Wszystko o e-Fakturach</h3>
                            <p className="text-blue-400 font-bold text-sm uppercase tracking-wider">Krajowy System e-Faktur w praktyce</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-7 space-y-8">
                            <p className="text-slate-300 leading-relaxed text-lg">
                                Od 2026 roku <strong>faktura ustrukturyzowana (XML)</strong> wystawiona w systemie KSeF to jedyny dokument uprawniający do odliczenia VAT w relacjach B2B. Tradycyjne PDF-y odeszły do lamusa, a każda transakcja przechodzi przez rządowe serwery w czasie rzeczywistym.
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-blue-500/50 transition-all group">
                                    <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><QrCode size={20}/></div>
                                    <h4 className="font-bold text-white mb-2 text-sm">Kod QR na wydruku</h4>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">Każda faktura wizualizowana poza systemem (np. wydruk) musi posiadać specjalny kod QR pozwalający na jej weryfikację w bazie Ministerstwa Finansów.</p>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-red-500/50 transition-all group">
                                    <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><ShieldAlert size={20}/></div>
                                    <h4 className="font-bold text-white mb-2 text-sm">Kary pieniężne 2026</h4>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">Wystawienie faktury poza KSeF lub z błędami strukturalnymi naraża Cię na dotkliwe kary finansowe nakładane automatycznie przez system.</p>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
                                <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2 text-sm"><Database size={18}/> Archiwizacja przez 10 lat</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    KSeF gwarantuje przechowywanie Twoich dokumentów przez dekadę. To eliminuje potrzebę fizycznych archiwów, ale wymusza na firmach <strong>integrację oprogramowania księgowego z API KSeF</strong>. Jeśli Twój program tego nie potrafi – czas go zmienić.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-blue-600 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                                <h4 className="text-xl font-bold mb-6 text-white">Techniczne "Must-Know":</h4>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex gap-4 items-center p-3 bg-white/10 rounded-xl">
                                        <FileCheck className="text-blue-200" size={20}/>
                                        <span className="text-[11px] text-blue-50 font-medium">Uwierzytelnienie: Profil Zaufany lub podpis kwalifikowany</span>
                                    </div>
                                    <div className="flex gap-4 items-center p-3 bg-white/10 rounded-xl">
                                        <XCircle className="text-blue-200" size={20}/>
                                        <span className="text-[11px] text-blue-50 font-medium">Brak faktur dla konsumentów (B2C) w KSeF</span>
                                    </div>
                                    <div className="flex gap-4 items-center p-3 bg-white/10 rounded-xl">
                                        <Zap className="text-blue-200" size={20}/>
                                        <span className="text-[11px] text-blue-50 font-medium">Tryb offline: Możliwość wystawienia faktury przy awarii systemu</span>
                                    </div>
                                </div>
                                <Cpu size={150} className="absolute -bottom-10 -right-10 text-white/10" />
                            </div>
                            
                            {/* POPRAWIONY PRZYCISK - TERAZ DO B2B */}
                            <button 
                                onClick={() => navigate('/b2b')} 
                                className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
                            >
                                <Briefcase size={16}/> Dopasuj formę opodatkowania do KSeF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEKCJA 6: VAT-REF – ODZYSKIWANIE PODATKU Z EUROPY */}
            <div id="sekcja-6-vat" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">6</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">VAT-REF: Jak odzyskać VAT zapłacony w UE?</h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Podróże służbowe do Niemiec, Czech czy Francji generują koszty (paliwo, hotele, autostrady), na których widnieje zagraniczny VAT. Tego podatku nie rozliczysz w polskim JPK_V7, ale możesz go odzyskać przez procedurę <strong>VAT-REF</strong>.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <Plane className="text-blue-600 mb-3" size={28}/>
                                <h5 className="font-bold text-slate-900 text-xs mb-1">Koszty podróży</h5>
                                <p className="text-[10px] text-slate-500">Hotele i wstępy na targi branżowe.</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <ShoppingCart className="text-blue-600 mb-3" size={28}/>
                                <h5 className="font-bold text-slate-900 text-xs mb-1">Paliwo i autostrady</h5>
                                <p className="text-[10px] text-slate-500">Najwyższe kwoty zwrotów dla transportu.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 relative">
                            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-sm"><Globe size={18}/> Minimum kwotowe zwrotu:</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-blue-700">Wniosek kwartalny (min.)</span>
                                    <span className="font-black text-blue-900">400 EUR</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-blue-700">Wniosek roczny (min.)</span>
                                    <span className="font-black text-blue-900">50 EUR</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-blue-500 mt-6 leading-relaxed italic">
                                Wniosek składasz do 30 września roku następnego przez polski portal e-Deklaracje. Polski US sam prześle go do zagranicznego organu.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEKCJA 7: ULGA NA ZŁE DŁUGI – OCHRONA PRZED DŁUŻNIKAMI */}
            <div id="sekcja-7-vat" className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden text-left">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">7</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Ulga na złe długi: Ratuj swój Cash Flow</h3>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Wystawiłeś fakturę, zapłaciłeś VAT, a klient zalega z płatnością? <strong>Ulga na złe długi</strong> pozwala Ci skorygować podatek należny i odzyskać pieniądze, które już przelałeś do urzędu.
                        </p>
                        <div className="p-8 bg-red-50 rounded-[2rem] border border-red-100 relative overflow-hidden">
                            <div className="flex items-start gap-4 relative z-10">
                                <Clock className="text-red-500 shrink-0" size={32}/>
                                <div>
                                    <h4 className="font-black text-red-900 text-lg mb-2">Magiczne 90 dni</h4>
                                    <p className="text-xs text-red-800 leading-relaxed">
                                        Możesz skorygować VAT, gdy upłynęło <strong>90 dni</strong> od terminu płatności wskazanego na fakturze. Nie musisz informować dłużnika o tym zamiarze.
                                    </p>
                                </div>
                            </div>
                            <ShieldAlert size={120} className="absolute -bottom-10 -right-10 text-red-200/50" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-widest">Procedura odzyskiwania:</h4>
                            <ul className="space-y-3 text-xs text-slate-600 font-medium">
                                <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0"/> Korekta w deklaracji JPK_V7 (załącznik VAT-ZD)</li>
                                <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0"/> Dłużnik ma obowiązek zmniejszyć swój VAT naliczony</li>
                                <li className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0"/> Możliwe dla faktur do 3 lat wstecz</li>
                            </ul>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">
                             Uwaga: Jeśli dłużnik ureguluje płatność po Twojej korekcie, musisz ponownie doliczyć ten VAT w najbliższej deklaracji.
                        </p>
                    </div>
                </div>
            </div>

            {/* SEKCJA 8: PREZENTY I PRÓBKI – MARKETING W FIRMIE */}
            <div id="sekcja-8-vat" className="bg-blue-600 text-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl text-left">
                <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center font-black text-2xl border border-white/20 shadow-inner">8</div>
                            <h3 className="text-3xl font-black text-white tracking-tight">VAT w marketingu i prezentach</h3>
                        </div>
                        <p className="text-blue-100 mb-8 leading-relaxed text-lg">
                            Działania promocyjne to nie tylko koszty netto. Ustawa o VAT przewiduje specjalne zasady dla gadżetów i próbek, które pozwalają na <strong>pełne odliczenie VAT</strong> przy zachowaniu limitów.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl border border-white/10">
                                <PackageSearch className="text-blue-300" size={24}/>
                                <div>
                                    <h5 className="font-bold text-sm">Próbki bez limitu</h5>
                                    <p className="text-[11px] text-blue-100 opacity-80">Wydawanie próbek w celach promocji nie podlega opodatkowaniu.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-slate-900 relative overflow-hidden">
                            <h4 className="font-black text-blue-600 text-xs uppercase tracking-widest mb-6 italic">Progi dla prezentów:</h4>
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">A</div>
                                    <div>
                                        <strong className="block text-sm">Do 20 PLN (Netto)</strong>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">Prezenty o małej wartości. Możesz je dawać bez ewidencji i nazwisk obdarowanych. VAT odliczasz w 100%.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">B</div>
                                    <div>
                                        <strong className="block text-sm">20 - 100 PLN (Netto)</strong>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">Wymagana ewidencja osób obdarowanych. Jeśli jej nie prowadzisz, musisz zapłacić VAT od przekazania prezentu.</p>
                                    </div>
                                </div>
                            </div>
                            <Gift size={100} className="absolute -bottom-6 -right-6 text-slate-50" />
                        </div>
                    </div>
                </div>
            </div>


            </div>
        </div>

      </div>
    </>
  );
};