import { Zap, Phone } from "lucide-react";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Zap className="w-6 h-6 text-slate-900" />
            </div>

            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-900">
                ElektroFix
              </h1>
              <p className="text-sm text-gray-500">Zertifizierte Elektriker</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a
              href="#services"
              className="hover:text-slate-900 transition-all duration-300"
            >
              Leistungen
            </a>
            <a
              href="#why-us"
              className="hover:text-slate-900 transition-all duration-300"
            >
              Warum wir
            </a>
            <a
              href="#reviews"
              className="hover:text-slate-900 transition-all duration-300"
            >
              Bewertungen
            </a>
            <a
              href="#contact"
              className="hover:text-slate-900 transition-all duration-300"
            >
              Kontakt
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Phone className="w-4 h-4 text-amber-400" />
              +49 69 123456
            </div>

            <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-5 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
              Angebot erhalten
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
