import { Zap, Phone, Clock3, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="bg-slate-950 text-gray-400 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* BRAND */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
                  <Zap className="w-6 h-6 text-slate-900" />
                </div>

                <div>
                  <h3 className="text-white font-black text-xl tracking-tight">
                    ElektroFix
                  </h3>

                  <p className="text-sm text-gray-500">
                    Zertifizierte Elektriker
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
                Professionelle Elektroservices für Haushalte und Unternehmen in
                Frankfurt und Umgebung.
              </p>
            </div>

            {/* SERVICES */}
            <div>
              <h4 className="text-white font-bold mb-6">Services</h4>

              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Notfallreparaturen
                  </a>
                </li>

                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Verkabelung & Installationen
                  </a>
                </li>

                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Elektrische Inspektionen
                  </a>
                </li>

                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Gewerbliche Dienstleistungen
                  </a>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-white font-bold mb-6">Unternehmen</h4>

              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#why-us"
                    className="hover:text-white transition-colors"
                  >
                    Warum wir
                  </a>
                </li>

                <li>
                  <a
                    href="#reviews"
                    className="hover:text-white transition-colors"
                  >
                    Kundenbewertungen
                  </a>
                </li>

                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Kontaktieren Sie uns
                  </a>
                </li>

                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Sofortiges Angebot erhalten
                  </a>
                </li>
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h4 className="text-white font-bold mb-6">Contact</h4>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-400 mt-0.5" />
                  <span>+49 69 123456</span>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 className="w-4 h-4 text-amber-400 mt-0.5" />
                  <span>24/7 Notdienst</span>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5" />
                  <span>Zertifizierte und versicherte Elektriker</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-500">
              © 2026 ElektroFix. Alle Rechte vorbehalten.
            </p>

            <div className="flex items-center gap-6 text-gray-500">
              <span>Frankfurt, Deutschland</span>

              <span>•</span>

              <span>Service am selben Tag verfügbar</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
