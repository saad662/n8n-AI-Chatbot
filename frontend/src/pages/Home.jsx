import {
  ShieldCheck,
  Clock3,
  Star,
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import ChatWidget from "../components/ChatWidget";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { services, features, testimonials } from "../data/homeData";

export default function Home() {
  return (
    <div className="bg-slate-50 text-gray-900 font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <Header />

      {/* HERO */}
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
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  “Stromausfall innerhalb von 45 Minuten behoben. Sehr
                  professioneller Elektriker und transparente Preise.”
                </p>

                <div>
                  <p className="font-bold text-sm">Markus H.</p>
                  <p className="text-xs text-gray-500">
                    Frankfurt, Deutschland
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-y border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-amber-400" />
            <p className="font-semibold text-slate-900">
              Zertifiziert & versichert
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-amber-400" />
            <p className="font-semibold text-slate-900">24/7 Notdienst</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-amber-400" />
            <p className="font-semibold text-slate-900">
              Top-bewerteter Service
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-amber-400" />
            <p className="font-semibold text-slate-900">Transparente Preise</p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-500 mb-4">
              Unsere Leistungen
            </p>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
              Professionelle Elektrolösungen
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Zuverlässige Elektroservices für Häuser, Wohnungen, Büros und
              Gewerbeimmobilien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-amber-200 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
              >
                <div className="mb-6 transition-transform duration-500 group-hover:scale-110">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold mb-4 text-slate-900">
                  {service.title}
                </h3>

                <div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <button className="flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-amber-500 transition-colors">
                    Mehr erfahren
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop"
                alt="Electrician at work"
                className="rounded-3xl shadow-2xl h-full object-cover min-h-[520px]"
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-500 mb-4">
                Warum Sie uns wählen sollten
              </p>

              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-8">
                Moderner Elektroservice mit echter Zuverlässigkeit
              </h2>

              <div className="space-y-5">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />

                    <p className="text-lg text-gray-700 leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI BOOKING */}
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

      {/* TESTIMONIALS */}
      <section id="reviews" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-500 mb-4">
              Kundenbewertungen
            </p>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
              Vertraut von Hausbesitzern in ganz Deutschland
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-3xl p-8 hover:-translate-y-2 hover:border-amber-200 hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed mb-8 text-lg italic">
                  “{testimonial.review}”
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      {testimonial.name}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>

                  <div className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    Verifiziert
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="pt-8 pb-20 md:pt-12 md:pb-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-slate-900 rounded-[32px] p-10 md:p-16 text-white shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 blur-3xl rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
              Schneller, sicherer & professioneller Elektroservice, wenn Sie ihn
              am meisten brauchen
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              Von Notfallreparaturen bis hin zu kompletten Installationen –
              unsere zertifizierten Elektriker helfen Haushalten und Unternehmen
              in ganz Frankfurt.
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

      {/* FOOTER */}
      <Footer />
      <ChatWidget />
    </div>
  );
}
