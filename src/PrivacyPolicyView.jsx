import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Lock, Server, Mail, Eye } from 'lucide-react';

export const PrivacyPolicyView = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Polityka Prywatności | Finanse Proste</title>
        <meta name="description" content="Zasady ochrony danych osobowych i polityka cookies serwisu Finanse Proste." />
        {/* Pamiętaj o canonical! */}
        <link rel="canonical" href="https://www.finanse-proste.pl/polityka-prywatnosci" /> 
      </Helmet>

      <div className="animate-in slide-in-from-bottom duration-500 max-w-4xl mx-auto pb-16 pt-8 px-6">
        
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-200 shadow-sm">
          
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 text-center">
            Polityka Prywatności
          </h1>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-8">
            
            <section>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <ShieldCheck className="text-blue-600"/> § 1. Postanowienia ogólne
              </h3>
              <p>1. Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazywanych przez Użytkowników w związku z korzystaniem z serwisu internetowego dostępnego pod adresem <strong>https://www.finanse-proste.pl/</strong> (dalej: „Serwis”).</p>
              <p>2. Administratorem danych osobowych w rozumieniu Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO) jest Właściciel Serwisu.</p>
              <p>3. Kontakt z Administratorem odbywa się wyłącznie drogą elektroniczną pod adresem e-mail: <strong className="text-blue-600">finanse-proste@gmail.com</strong>.</p>
              <p>4. Serwis ma charakter wyłącznie edukacyjny i hobbystyczny. Administrator dokłada wszelkich starań, aby chronić prywatność Użytkowników.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Lock className="text-green-600"/> § 2. Kalkulatory i Twoje dane
              </h3>
              <p>Stawiamy na prywatność absolutną. Wszystkie dane liczbowe (kwoty, zarobki, oszczędności), które wpisujesz do naszych kalkulatorów, są przetwarzane <strong>lokalnie w Twojej przeglądarce</strong> (technologia Client-Side).</p>
              <p>Oznacza to, że <strong>nie wysyłamy</strong> tych informacji na nasze serwery, nie zapisujemy ich w żadnej bazie danych ani ich nie podglądamy. Po zamknięciu strony znikają one bezpowrotnie z pamięci Twojego urządzenia.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Server className="text-indigo-600"/> § 3. Hosting i Logi serwera
              </h3>
              <p>1. Serwis jest hostowany (utrzymywany technicznie) na infrastrukturze firmy <strong>Vercel Inc.</strong></p>
              <p>2. Podczas korzystania ze strony, serwery Vercel automatycznie zapisują tzw. logi systemowe (m.in. adres IP, czas wizyty). Jest to standardowa procedura techniczna niezbędna do zapewnienia stabilności i bezpieczeństwa strony (np. obrona przed atakami hakerskimi).</p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Eye className="text-purple-600"/> § 4. Analityka i Cookies
              </h3>
              <p>Serwis wykorzystuje pliki cookies do celów analitycznych (Google Analytics), abyśmy wiedzieli, które narzędzia są najpopularniejsze i mogli je rozwijać. Dane te są zanonimizowane. Możesz wyłączyć cookies w ustawieniach swojej przeglądarki.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Mail className="text-orange-600"/> § 5. Kontakt i Prawa Użytkownika
              </h3>
              <p>W każdej sprawie dotyczącej Twoich danych osobowych możesz napisać na adres: <strong>finanse-proste@gmail.com</strong>.</p>
              <p>Masz prawo do żądania dostępu do swoich danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, a także wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};