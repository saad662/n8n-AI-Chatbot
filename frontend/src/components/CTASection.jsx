export default function CTASection() {
  return (
    <section id="contact" className="pt-8 pb-20 md:pt-12 md:pb-28 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="bg-slate-900 rounded-[32px] p-10 md:p-16 text-white shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 blur-3xl rounded-full"></div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
            Schneller, sicherer & professioneller Elektroservice, wenn Sie ihn
            am meisten brauchen
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
            Von Notfallreparaturen bis hin zu kompletten Installationen – unsere
            zertifizierten Elektriker helfen Haushalten und Unternehmen in ganz
            Frankfurt.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95">
              Sofortiges Angebot erhalten
            </button>

            <button className="border border-white/20 hover:border-white px-8 py-4 rounded-xl transition-all duration-300 hover:bg-white hover:text-slate-900 font-semibold">
              Jetzt anrufen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
