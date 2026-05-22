export default function BookingSection() {
  return (
    <section className="py-20 md:py-28 bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-400 mb-4">
          Intelligentes Buchungserlebnis
        </p>

        <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
          Beschreiben Sie Ihr Elektroproblem & erhalten Sie sofort eine
          Kostenschätzung
        </h2>

        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">
          Unser smarter Buchungsassistent hilft Ihnen dabei, Preise,
          Verfügbarkeit und Termine in weniger als 2 Minuten zu erhalten.
        </p>

        <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-amber-400/30">
          Sofortige Kostenschätzung erhalten
        </button>
      </div>
    </section>
  );
}