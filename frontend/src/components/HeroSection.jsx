import {
  BadgeCheck,
  ArrowRight,
  ShieldCheck,
  Clock3,
  Star,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 bg-slate-900 text-white">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#fbbf24,_transparent_35%)]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-8 text-sm font-medium">
              <BadgeCheck className="w-4 h-4 text-amber-400" />
              Vertraut von über 500 Hausbesitzern in ganz Deutschland
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
              Professionelle Elektriker in Frankfurt – Schnell, sicher &
              zuverlässig
            </h1>

            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mb-10">
              Zertifizierte Elektriker für Notfallreparaturen, Installationen,
              Verkabelungen und Inspektionen – mit Terminen am selben Tag in
              Frankfurt und Umgebung.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-7 py-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                Sofortiges Angebot erhalten
                <ArrowRight className="w-5 h-5" />
              </button>

              <button className="border border-white/20 hover:border-white text-white px-7 py-4 rounded-xl transition-all duration-300 hover:bg-white hover:text-slate-900 font-semibold">
                Mehr erfahren
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium">
                  Zertifiziert & versichert
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                <Clock3 className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium">
                  Service am selben Tag
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium">
                  4,9★ Google-Bewertung
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              <div>
                <h3 className="text-3xl font-black text-amber-400">24/7</h3>
                <p className="text-gray-400 text-sm mt-1">Notfallservice</p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-amber-400">2,000+</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Abgeschlossene Aufträge
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-amber-400">15+</h3>
                <p className="text-gray-400 text-sm mt-1">Jahre Erfahrung</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=1200&auto=format&fit=crop"
              alt="Electrician"
              className="rounded-3xl shadow-2xl object-cover h-[650px] w-full transition-transform duration-700 group-hover:scale-[1.02] brightness-95"
            />

            <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 rounded-2xl p-6 shadow-2xl max-w-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                “Stromausfall innerhalb von 45 Minuten behoben. Sehr
                professioneller Elektriker und transparente Preise.”
              </p>

              <div>
                <p className="font-bold text-sm">Markus H.</p>

                <p className="text-xs text-gray-500">Frankfurt, Deutschland</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
