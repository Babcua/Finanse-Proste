import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, ShieldCheck, Banknote, Landmark, ArrowRight, 
  CheckCircle, Info, Search, Smartphone, UserCheck, 
  MousePointer2, Receipt, Zap, Globe, Wallet, HelpCircle, 
  AlertTriangle, GraduationCap, Users, AlertCircle, PiggyBank, 
  Sparkles, Scale, Laptop, Watch, Tablet, ShieldAlert, ListTree
} from 'lucide-react';

// Pomocnicza ikona Baby
const BabyIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5 1 1.5 1 2 1s1.5 0 2-1" />
    <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 5 6.3" />
    <path d="M12 21a9 9 0 0 1-7-14.7" /><path d="M19 6.3A9 9 0 0 1 12 21" />
  </svg>
);

export const BankAccountsView = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const SectionHeader = ({ num, title, desc }) => (
    <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
      <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl shadow-slate-200 shrink-0">{num}</div>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      const offset = 80; 
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

  const tableOfContents = [
    { title: "Fundamenty", icon: Landmark, id: "#fundamenty" },
    { title: "Analiza kosztów", icon: Receipt, id: "#koszty" },
    { title: "Karty i płatności", icon: CreditCard, id: "#platnosci" },
    { title: "Dopasowanie produktu", icon: Users, id: "#potrzeby" },
    { title: "Bonusy i promocje", icon: Sparkles, id: "#promocje" },
    { title: "Pytania i odpowiedzi", icon: HelpCircle, id: "#faq" },
  ];

  return (
    <>
      <Helmet>
        <title>Konto bankowe 2026 – kompleksowy poradnik i ranking | Finanse Proste</title>
        <meta name="description" content="Niezależne porównanie kont bankowych 2026. Dowiedz się, jak czytać tabelę opłat i prowizji oraz jak założyć konto przez aplikację mObywatel bez wychodzenia z domu." />
        <link rel="canonical" href="https://www.finanse-proste.pl/konta-bankowe" />
      </Helmet>

      <div className="animate-in slide-in-from-right duration-500 max-w-6xl mx-auto pb-16 px-4">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-12 mt-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
            <Landmark size={14}/> Analiza sektora bankowego 2026
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 text-slate-900 tracking-tight leading-[1.1]">
            Konta osobiste. <br/><span className="text-blue-600">Zrozumiane precyzyjnie.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Zastanawiasz się, <strong>jakie konto osobiste wybrać w 2026 roku</strong>, aby przestać tracić na ukrytych prowizjach? Zanim sprawdzisz dowolny <strong>ranking kont osobistych 2026</strong>, poznaj zasady, które pozwolą Ci wybrać produkt dopasowany do Twojego naturalnego trybu życia.
          </p>
        </div>

        {/* --- MINIMALISTYCZNY SPIS TREŚCI --- */}
        <div className="mb-24 bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm flex flex-wrap justify-center gap-2 md:gap-4">
          <div className="w-full flex items-center justify-center gap-2 mb-2 text-slate-400">
            <ListTree size={16}/>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Spis Treści</span>
          </div>
          {tableOfContents.map((item, i) => (
            <button
              key={i}
              onClick={(e) => scrollToSection(e, item.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all border border-transparent hover:border-slate-100"
            >
              <item.icon size={14} className="text-blue-500"/>
              {item.title}
            </button>
          ))}
        </div>

        {/* --- SEKCJA 1: FUNDAMENTY --- */}
        <section id="fundamenty" className="mb-24">
          <SectionHeader 
            num="1" 
            title="Fundamenty: co warto wiedzieć na start?" 
            desc="Zrozumienie mechanizmów prawnych i technicznych, które czynią rachunek bankowy bezpiecznym i funkcjonalnym narzędziem w 2026 roku."
          />

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Wallet size={24}/>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Rachunek oszczędnościowo-rozliczeniowy (ROR)</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Rachunek oszczędnościowo-rozliczeniowy, znany powszechnie jako <strong>konto osobiste</strong>, to fundament Twojej codziennej aktywności finansowej. To tutaj trafia Twoje wynagrodzenie i stąd wychodzą płatności za codzienne życie. Choć wielu użytkowników przeszukuje <strong>ranking kont osobistych 2026</strong> w poszukiwaniu darmowych rozwiązań, kluczowe jest postrzeganie rachunku jako bazy pod budowę portfela. To z tego miejsca wykonasz bezpieczne przelewy na <Link to="/obligacje" className="text-blue-600 font-medium hover:underline">obligacje skarbowe</Link> czy zainwestujesz nadwyżki w <Link to="/zloto" className="text-blue-600 font-medium hover:underline">fizyczne złoto</Link>.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl">
                <p className="text-[11px] text-blue-800 leading-relaxed italic">
                  Pamiętaj, że nowoczesne konto to nie tylko przechowywanie gotówki. To dostęp do technologii <strong>BLIK</strong>, systemów <strong>moneyback za płatności kartą</strong> oraz mechanizmów oszczędnościowych.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl flex flex-col justify-center h-full">
              <ShieldCheck className="absolute -right-4 -bottom-4 text-white opacity-5" size={160}/>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center border border-green-500/30">
                    <ShieldCheck size={24}/>
                  </div>
                  <h3 className="text-xl font-bold text-white">Bankowy Fundusz Gwarancyjny (BFG)</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Wiele osób przed założeniem rachunku zadaje sobie pytanie: <strong>„czy moje pieniądze w banku są bezpieczne?”</strong>. W polskim systemie prawnym gwarantem stabilności Twoich oszczędności jest <strong>Bankowy Fundusz Gwarancyjny (BFG)</strong>. Jest to instytucja powołana do ochrony depozytów, która w przypadku niewypłacalności banku zwraca Ci środki do pełnej równowartości <strong>100 000 EUR</strong> na osobę w każdej instytucji.
                </p>
                <div className="bg-white/5 border border-white/10 p-5 rounded-3xl text-xs text-blue-200 italic leading-relaxed">
                  Gwarancja ta jest automatyczna i bezpłatna. Obejmuje ona środki w złotych oraz walutach obcych zgromadzone na kontach osobistych, oszczędnościowych oraz lokatach terminowych.
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-10">
                <Users size={20} className="text-slate-400"/>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Ewolucja uprawnień i potrzeb (Limity wiekowe)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-slate-100 z-0"></div>
                {[
                  { l: "Konto dla dzieci", a: "0-13 lat", d: "Pełny nadzór rodzica. Środki traktowane prawnie jako własność opiekuna.", icon: Smartphone },
                  { l: "Konto dla młodzieży", a: "13-18 lat", d: "Ograniczona zdolność prawna. Nastolatek zarządza kieszonkowym przez aplikację.", icon: Smartphone },
                  { l: "Konto dla studenta", a: "18-26 lat", d: "Szukając **konto dla studenta 18-26 ranking**, znajdziesz oferty bez opłat za kartę.", icon: GraduationCap },
                  { l: "Konto dla dorosłych", a: "18+ lat", d: "Pełna zdolność do czynności prawnych i dostęp do pełnej gamy produktów kredytowych.", icon: UserCheck }
                ].map((item, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center md:items-start group">
                    <div className="w-12 h-12 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center text-blue-600 shadow-sm mb-4 transition-transform group-hover:scale-110">
                      <item.icon size={20}/>
                    </div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-2">{item.a}</span>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">{item.l}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed text-center md:text-left" dangerouslySetInnerHTML={{ __html: item.d.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Smartphone, title: "mObywatel", desc: "API rządowe. Otwarcie bez skanowania fizycznego plastiku." },
              { icon: UserCheck, title: "Biometria", desc: "AI porównuje nagranie twarzy ze zdjęciem w dowodzie." },
              { icon: MousePointer2, title: "Przelew", desc: "Potwierdzenie poprzez wysłanie 1 zł z innego banku." },
              { icon: Banknote, title: "Kurier", desc: "Tradycyjna metoda z papierową umową do podpisu." }
            ].map((m, i) => (
              <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-blue-200 transition-all flex flex-col shadow-sm">
                <m.icon className="text-blue-600 mb-4" size={20}/>
                <h4 className="font-bold text-xs text-slate-900 mb-2">{m.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- SEKCJA 2: ANALIZA KOSZTÓW --- */}
        <section id="koszty" className="mb-32">
          <SectionHeader 
            num="2" 
            title="Analiza kosztów: jak nie płacić za konto?" 
            desc="Szczegółowe zestawienie mechanizmów, które decydują o realnej darmowości rachunku w 2026 roku."
          />

          <p className="text-lg text-slate-600 leading-relaxed mb-16 max-w-4xl">
            Większość osób szukających informacji na temat tego, <strong>jakie konto osobiste wybrać w 2026 roku</strong>, skupia się na haśle „0 zł”. Tymczasem darmowe <strong>konto osobiste</strong> to efekt spełnienia konkretnych warunków. Aby uniknąć rozczarowań, musisz zrozumieć <strong>tabelę opłat i prowizji (TOiP)</strong> – najważniejszy dokument w relacji z bankiem.
          </p>

          <div className="grid lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Receipt className="text-blue-600" size={28}/> 
                  Konto za 0 zł – mit czy rzeczywistość?
                </h3>
                <div className="prose prose-slate text-sm text-slate-600 space-y-4">
                  <p>
                    Obecnie <strong>darmowe konto bankowe bez warunków</strong> staje się rzadkością. Banki ponoszą koszty utrzymania Twojego rachunku, dlatego dążą do tego, abyś był aktywnym klientem. Jeśli Twoim celem jest <strong>najtańsze konto osobiste</strong>, musisz poznać system warunkowy.
                  </p>
                  <p>
                    Zazwyczaj <strong>opłata za prowadzenie rachunku oszczędnościowo-rozliczeniowy (ROR)</strong> zostaje zniesiona, jeśli na Twoje konto trafiają <strong>regularne wpływy</strong> o określonej wartości. Drugim filarem jest aktywność kartowa – bank oczekuje wykonania kilku płatności bezgotówkowych w miesiącu.
                  </p>
                </div>
              </div>
              <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                <AlertCircle size={24} className="text-orange-500 shrink-0"/>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Zawsze sprawdzaj koszt wznowienia fizycznej karty oraz opłaty za wypłaty w okienku bankowym – to tam najczęściej kryją się wysokie prowizje.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center h-full">
              <Zap className="absolute -right-4 -bottom-4 text-white opacity-5" size={120}/>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-blue-400">
                <Smartphone size={24}/> Wypłaty i system BLIK
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                W 2026 roku standardem są <strong>darmowe wypłaty ze wszystkich bankomatów</strong> przy użyciu kodu <strong>BLIK</strong>. 
              </p>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <span className="block text-xs font-bold text-blue-400 uppercase mb-1 text-[10px]">Sieci własne vs obce</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Wypłata kartą w maszynie obcej sieci to koszt rzędu 5 zł. <strong>BLIK</strong> omija ten koszt niemal wszędzie.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <span className="block text-xs font-bold text-blue-400 uppercase mb-1 text-[10px]">Wpłatomaty</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Sprawdź, <strong>gdzie wpłaty BLIK są za darmo</strong> – banki promują tę metodę zamiast wpłat w placówce.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-6 text-slate-500"><ArrowRight size={20}/></div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-2">Przelew Elixir</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 italic text-[11px]">Standardowy przelew międzybankowy realizowany w sesjach.</p>
              <div className="mt-auto font-black text-green-600 text-3xl">0 zł</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col hover:border-orange-200 transition-colors">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-6 text-orange-600"><Zap size={20}/></div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-2">Express Elixir</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 italic text-[11px]">Przelew natychmiastowy działający 24/7. Pieniądze w kilka sekund.</p>
              <div className="mt-auto font-black text-slate-900 text-3xl">~ 5 zł</div>
            </div>
            <div className="bg-slate-900 text-white border border-slate-800 rounded-[2.5rem] p-8 shadow-xl flex flex-col">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-6 text-white"><Smartphone size={20}/></div>
              <h4 className="font-bold text-blue-400 text-xs uppercase tracking-widest mb-2">Na telefon BLIK</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 italic text-[11px]">Najszybsza metoda rozliczeń między osobami fizycznymi.</p>
              <div className="mt-auto font-black text-green-400 text-3xl">0 zł</div>
            </div>
          </div>
        </section>

        {/* --- SEKCJA 3: KARTY I PŁATNOŚCI --- */}
        <section id="platnosci" className="mb-32">          
          <SectionHeader 
            num="3" 
            title="Karty debetowe i nowoczesne systemy płatności" 
            desc="Kompleksowy przewodnik po narzędziach płatniczych – od fizycznego plastiku po zaawansowaną tokenizację cyfrową."
          />

          <p className="text-lg text-slate-600 leading-relaxed mb-16 max-w-4xl">
            Wybór odpowiedniej karty to nie tylko kwestia estetyki portfela. To decyzja o tym, czy korzystasz z własnego kapitału, czy z kapitału banku. Zrozumienie różnic między kartą debetową a kredytową oraz mechanizmów takich jak <strong>reklamacja transakcji kartą chargeback</strong> to absolutna podstawa bezpieczeństwa finansowego w 2026 roku.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-sm flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <CreditCard className="text-blue-600" size={28}/> 
                  Debetowa czy kredytowa?
                </h3>
                <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
                  <div>
                    <strong className="text-slate-900 block mb-1 font-bold italic">Karta debetowa:</strong>
                    Jest połączona z Twoim <strong>rachunkiem oszczędnościowo-rozliczeniowym (ROR)</strong>. Każda płatność natychmiast pomniejsza dostępne środki na koncie.
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-1 font-bold italic">Karta kredytowa:</strong>
                    Działa w oparciu o przyznany limit kredytowy (pieniądze banku). Kluczowy jest <strong>okres bezodsetkowy</strong> (grace period), który pozwala korzystać z pieniędzy banku za darmo przy spłacie w terminie.
                  </div>
                </div>
              </div>
              <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
                <ShieldCheck size={24} className="text-blue-600 shrink-0"/>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  <strong>Chargeback:</strong> Obie karty oferują tę procedurę. Jeśli towar kupiony w internecie nie dotrze, bank może odzyskać Twoje pieniądze bezpośrednio od operatora płatności sprzedawcy.
                </p>
              </div>
            </div>

            <div className="bg-blue-600 text-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-blue-100 relative overflow-hidden flex flex-col justify-center h-full">
              <Globe className="absolute -right-10 -bottom-10 opacity-10" size={200}/>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Globe size={28} className="text-blue-200"/> 
                  Karty wielowalutowe
                </h3>
                <p className="text-sm text-blue-100 leading-relaxed mb-6">
                  Płacenie zwykłą kartą złotową za granicą to błąd generujący wysokie koszty <strong>prowizji za przewalutowanie karty</strong>. Nowoczesne <strong>konto z kartą wielowalutową</strong> samo rozpoznaje walutę terminala i pobiera środki bezpośrednio z subkonta walutowego bez narzutów.
                </p>
                <div className="bg-red-500/20 border border-red-500/30 p-5 rounded-3xl">
                  <h4 className="font-bold text-xs text-red-200 uppercase mb-2 flex items-center gap-2">
                    <AlertTriangle size={14}/> Pułapka DCC
                  </h4>
                  <p className="text-[10px] text-red-100 leading-relaxed italic">
                    Mechanizm <strong>Dynamic Currency Conversion (DCC)</strong> proponuje kurs w złotówkach o kilka procent gorszy od kursu Twojego banku. Zawsze wybieraj płatność w lokalnej walucie.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-[3rem] flex flex-col h-full shadow-sm hover:border-blue-100 transition-all">
              <Smartphone className="text-blue-600 mb-4" size={24}/>
              <h4 className="font-bold text-slate-900 mb-2">Apple Pay i Google Pay</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Wykorzystują <strong>tokenizację</strong>. Bank przesyła cyfrowy token zamiast numeru karty, co czyni płatność niemal niemożliwą do zhakowania.
              </p>
            </div>
            <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col h-full group transition-all">
              <Zap className="text-blue-400 mb-4 transition-transform group-hover:scale-125" size={24}/>
              <h4 className="font-bold mb-2">System BLIK</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Polska technologia dominująca w handlu internetowym i wypłatach z bankomatów bez użycia karty fizycznej.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-[3rem] flex flex-col h-full shadow-sm hover:border-indigo-100 transition-all">
              <Laptop className="text-indigo-600 mb-4" size={24}/>
              <h4 className="font-bold text-slate-900 mb-2">Karty wirtualne</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Cyfrowe <strong>konto wirtualne bez karty fizycznej</strong>. Karta jednorazowa trwale znika po płatności, eliminując ryzyko subskrypcji-pułapek.
              </p>
            </div>
          </div>
        </section>

        {/* --- SEKCJA 4: WYBÓR POD KONKRETNE POTRZEBY --- */}
        <section id="potrzeby" className="mb-32">
          <SectionHeader 
            num="4" 
            title="Dopasowanie produktu do etapu życia" 
            desc="Ekspercka analiza potrzeb specyficznych grup użytkowników – od budowania historii kredytowej po zarządzanie majątkiem premium."
          />

          <p className="text-lg text-slate-600 leading-relaxed mb-16 max-w-4xl">
            Nie istnieje jeden, idealny <strong>rachunek oszczędnościowo-rozliczeniowy (ROR)</strong> dla każdego. Banki projektują oferty w oparciu o konkretne profile ryzyka. Aby wiedzieć, <strong>jakie konto osobiste wybrać w 2026 roku</strong>, musisz zrozumieć przywileje Twojej grupy docelowej.
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm flex flex-col group hover:border-blue-200 transition-all">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <GraduationCap size={28}/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Młodzi i studenci (18–26 lat)</h3>
              <div className="space-y-4 text-xs text-slate-600 leading-relaxed mb-8">
                <p>
                  Dla banków to klienci przyszłościowi. Przeglądając <strong>konto dla studenta 18-26 ranking</strong>, zauważysz, że koszty prowadzenia są zerowe bez dodatkowych warunków.
                </p>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                    <AlertCircle size={12}/> Pułapka 26. urodzin
                  </h4>
                  <p className="text-[10px] text-blue-800 leading-relaxed">
                    W dniu 26. urodzin Twoje preferencyjne <strong>konto osobiste</strong> automatycznie zmienia się w produkt dla dorosłych z wymogiem wpływów pensji.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute -right-4 -top-4 opacity-10"><Users size={120}/></div>
              <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Users size={28} className="text-white"/>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Konto wspólne</h3>
              <div className="space-y-4 text-[11px] text-slate-400 leading-relaxed mb-8 italic">
                <p>
                  Analizując <strong>konto wspólne dla małżeństw opinie</strong>, użytkownicy chwalą przejrzystość budżetu domowego i łatwość planowania oszczędności przez <Link to="/procent-skladany" className="text-blue-300 font-bold underline">procent składany</Link>.
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle size={14} className="text-green-400 shrink-0"/> Solidarność dłużników za ewentualny debet.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle size={14} className="text-green-400 shrink-0"/> Bezpieczeństwo spadkowe (dostęp do 50% środków).
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm flex flex-col group hover:border-indigo-200 transition-all">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck size={28}/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Segment Premium</h3>
              <div className="space-y-4 text-xs text-slate-600 leading-relaxed mb-8">
                <p>
                  <strong>Konto premium dla kogo?</strong> Dla osób z wpływami powyżej 10 tys. zł netto chronionymi przez <strong>Bankowy Fundusz Gwarancyjny (BFG)</strong>.
                </p>
                <div className="border-l-2 border-indigo-100 pl-4 space-y-3 italic">
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px]">Dedykowany doradca:</span>
                    Bezpośredni kontakt omijający infolinię.
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px]">Saloniki lotniskowe:</span>
                    Darmowe wejścia w ramach LoungeKey bez prowizji walutowych.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEKCJA 5: BONUSY I PROGRAMY PREMIOWE --- */}
        <section id="promocje" className="mb-32">
          <SectionHeader 
            num="5" 
            title="Bonusy, promocje i programy premiowe" 
            desc="Analiza strategii marketingowych banków oraz technicznych aspektów budowania oszczędności poprzez aktywne bankowanie."
          />

          <p className="text-lg text-slate-600 leading-relaxed mb-16 max-w-4xl">
            Banki traktują <strong>bonus za otwarcie konta bankowego</strong> jako koszt pozyskania nowego użytkownika, co pozwala Ci zyskać realny kapitał na start. Aby skutecznie korzystać z tych mechanizmów, musisz zrozumieć zasady warunkowości.
          </p>

          <div className="grid lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Sparkles className="text-blue-600" size={28}/> Premie i systemy poleceń
                </h3>
                <div className="prose prose-slate text-sm text-slate-600 space-y-4 leading-relaxed">
                  <p>
                    Analizując <strong>promocje bankowe 2026</strong>, zauważysz, że premie są wypłacane w transzach za aktywność. Kolejnym filarem są <strong>programy poleceń w bankach</strong>. Jeśli skutecznie zarekomendujesz <strong>rachunek oszczędnościowo-rozliczeniowy (ROR)</strong>, bank nagrodzi obie strony nagrodą pieniężną.
                  </p>
                </div>
              </div>
              <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-widest mb-4">Typowe wymagania:</h4>
                <div className="grid sm:grid-cols-2 gap-4 text-[11px] text-slate-500 italic">
                  <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0"/> Zapewnienie wpływu pensji (np. 1500 zł).</div>
                  <div className="flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0"/> Płatności kartą lub systemem **BLIK**.</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center h-full">
              <Sparkles className="absolute -right-4 -top-4 text-white opacity-5" size={150}/>
              <h3 className="text-xl font-bold mb-6 text-blue-400">Mechanizm moneyback</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                <strong>Moneyback za płatności kartą</strong> to zwrot części prowizji (interchange fee) od zakupów. W 2026 roku standardem jest zwrot 1-3% na wybrane kategorie.
              </p>
              <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                <h4 className="font-bold text-[10px] text-blue-300 uppercase mb-2 italic">Kody MCC terminali</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Zwroty rozliczane są na podstawie Merchant Category Code. Moneyback może nie zostać naliczony, jeśli lokal ma błędnie przypisany profil usług.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-sm">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><PiggyBank size={28}/></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">Automatyczne mikroszczędności</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Nowoczesny <strong>rachunek oszczędnościowo-rozliczeniowy</strong> pomaga budować <strong>poduszkę finansową</strong> poprzez zaokrąglanie płatności (np. do pełnych 5 zł) i przekazywanie końcówek na konto oszczędnościowe.
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                  <span className="text-slate-600 font-medium italic">Zakupy spożywcze (48,20 zł)</span>
                  <span className="font-black text-blue-600">+ 1,80 zł</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                  <span className="text-slate-600 font-medium italic">Paliwo (211,00 zł)</span>
                  <span className="font-black text-blue-600">+ 4,00 zł</span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">Dzisiejsza suma:</span>
                  <span className="text-lg font-black text-green-600">5,80 zł</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEKCJA 6: NAJCZĘSTSZE PYTANIA I ODPOWIEDZI (FAQ) --- */}
        <section id="faq" className="mb-32">
          <SectionHeader 
            num="6" 
            title="Najczęstsze pytania i odpowiedzi (FAQ)" 
            desc="Eksperckie wyjaśnienia kluczowych procesów i procedur bankowych, o które najczęściej pytają użytkownicy."
          />

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0"><ArrowRight size={20}/></div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Jak przenieść rachunek osobisty bez formalności?</h3>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed space-y-4 flex-grow">
                <p>
                  W 2026 roku proces zmiany banku jest w pełni zautomatyzowany. Wystarczy złożyć upoważnienie u nowego dostawcy. Nowy bank w Twoim imieniu zajmie się zamknięciem starego <strong>rachunku oszczędnościowo-rozliczeniowego (ROR)</strong> i poinformuje pracodawcę o zmianie numeru konta.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 text-blue-400 rounded-xl flex items-center justify-center shrink-0"><HelpCircle size={20}/></div>
                <h3 className="text-lg font-bold leading-tight">Czy warto posiadać kilka kont osobistych?</h3>
              </div>
              <div className="text-sm text-slate-400 leading-relaxed space-y-4 flex-grow italic">
                <p>
                  Dywersyfikacja kapitału zwiększa bezpieczeństwo. Każda instytucja oferuje osobny limit gwarancyjny, który zapewnia <strong>Bankowy Fundusz Gwarancyjny (BFG)</strong> do równowartości 100 000 EUR na osobę.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0"><UserCheck size={20}/></div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Czy nowe konto wpływa na zdolność kredytową?</h3>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed space-y-4 flex-grow">
                <p>
                  Samo otwarcie <strong>konta osobistego</strong> nie obniża oceny w <strong>Biurze Informacji Kredytowej (BIK)</strong>. Długa historia operacyjna i regularne wpływy budują Twój pozytywny wizerunek w oczach analityków przy staraniu się o kredyt.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0"><AlertTriangle size={20}/></div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Jak skutecznie zamknąć konto bez prowizji?</h3>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed space-y-4 flex-grow italic">
                <p>
                  Należy złożyć oficjalne wypowiedzenie (często dostępne w aplikacji). Pamiętaj o 30-dniowym okresie wypowiedzenia i sprawdzeniu <strong>tabeli opłat i prowizji (TOiP)</strong> pod kątem opłaty za kartę w ostatnim miesiącu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEKCJA 7: NAWIGATOR TEMATYCZNY --- */}
        <section id="nawigator" className="mt-32 pt-16 border-t border-slate-100">
          <SectionHeader 
            num="7" 
            title="Indeks pojęć i nawigacja" 
            desc="Szybki dostęp do kluczowych zagadnień opisanych w naszym kompendium wiedzy o bankowości."
          />

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Gwarancje Bankowego Funduszu Gwarancyjnego (BFG)", path: "#fundamenty" },
              { label: "Rachunek oszczędnościowo-rozliczeniowy (ROR) - definicja", path: "#fundamenty" },
              { label: "Jak czytać tabelę opłat i prowizji (TOiP)?", path: "#koszty" },
              { label: "Najtańsze konto osobiste 2026 - analiza", path: "#koszty" },
              { label: "Reklamacja transakcji kartą chargeback", path: "#platnosci" },
              { label: "Konto osobiste z kartą wielowalutową", path: "#platnosci" },
              { label: "Ranking kont osobistych 2026 dla studenta", path: "#potrzeby" },
              { label: "Bonus za otwarcie konta bankowego - zasady", path: "#promocje" }
            ].map((tag, i) => (
              <button 
                key={i} 
                onClick={(e) => scrollToSection(e, tag.path)}
                className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-white hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all italic text-left"
              >
                # {tag.label}
              </button>
            ))}
          </div>
          
        
        </section>

      </div>
    </>
  );
};