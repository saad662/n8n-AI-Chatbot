import {
  Phone,
  ShieldCheck,
  Clock3,
  Star,
  Zap,
  Wrench,
  Building2,
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import ChatWidget from "../components/ChatWidget";

export default function Home() {
  const services = [
    {
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      title: "Emergency Electrical Repairs",
      description:
        "Fast same-day response for outages, short circuits, and urgent electrical problems.",
    },
    {
      icon: <Wrench className="w-8 h-8 text-amber-400" />,
      title: "Wiring & Installations",
      description:
        "Professional wiring, lighting installation, sockets, switches, and renovations.",
    },
    {
      icon: <Building2 className="w-8 h-8 text-amber-400" />,
      title: "Commercial Services",
      description:
        "Reliable electrical maintenance and upgrades for offices, shops, and businesses.",
    },
  ];

  const features = [
    "Certified & insured electricians",
    "Same-day appointments available",
    "Transparent pricing",
    "Modern AI-powered booking",
  ];

  const testimonials = [
    {
      name: "Markus H.",
      location: "Frankfurt",
      review:
        "Very professional team. They fixed our power outage within two hours and explained everything clearly.",
    },
    {
      name: "Sarah L.",
      location: "Offenbach",
      review:
        "Easy booking process and fair pricing. The electrician arrived on time and did excellent work.",
    },
    {
      name: "Daniel R.",
      location: "Darmstadt",
      review:
        "Clean installation, professional communication, and very reliable service overall.",
    },
  ];

  return (
    <div className="bg-slate-50 text-gray-900 font-sans overflow-x-hidden">
      {/* NAVBAR */}
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
              <p className="text-sm text-gray-500">Licensed Electricians</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a
              href="#services"
              className="hover:text-slate-900 transition-all duration-300"
            >
              Services
            </a>
            <a
              href="#why-us"
              className="hover:text-slate-900 transition-all duration-300"
            >
              Why Us
            </a>
            <a
              href="#reviews"
              className="hover:text-slate-900 transition-all duration-300"
            >
              Reviews
            </a>
            <a
              href="#contact"
              className="hover:text-slate-900 transition-all duration-300"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Phone className="w-4 h-4 text-amber-400" />
              +49 69 123456
            </div>

            <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-5 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
              Get Quote
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative py-20 md:py-28 bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#fbbf24,_transparent_35%)]"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-8 text-sm font-medium">
                <BadgeCheck className="w-4 h-4 text-amber-400" />
                Trusted by 500+ homeowners across Germany
              </div>

              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
                Professional Electricians in Frankfurt: Fast, Safe & Reliable
                Service
              </h1>

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mb-10">
                Certified electricians for emergency repairs, installations,
                wiring, and inspections with same-day appointments available
                across Frankfurt and nearby areas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-7 py-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                  Get Instant Quote
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button className="border border-white/20 hover:border-white text-white px-7 py-4 rounded-xl transition-all duration-300 hover:bg-white hover:text-slate-900 font-semibold">
                  Learn More
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium">
                    Certified & Insured
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                  <Clock3 className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium">Same-Day Service</span>
                </div>

                <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium">
                    4.9★ Google Rating
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                <div>
                  <h3 className="text-3xl font-black text-amber-400">24/7</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Emergency Support
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-black text-amber-400">2,000+</h3>
                  <p className="text-gray-400 text-sm mt-1">Completed Jobs</p>
                </div>

                <div>
                  <h3 className="text-3xl font-black text-amber-400">15+</h3>
                  <p className="text-gray-400 text-sm mt-1">Years Experience</p>
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
                  “Power outage fixed within 45 minutes. Very professional
                  electrician and transparent pricing.”
                </p>

                <div>
                  <p className="font-bold text-sm">Markus H.</p>
                  <p className="text-xs text-gray-500">Frankfurt, Germany</p>
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
            <p className="font-semibold text-slate-900">Certified & Insured</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-amber-400" />
            <p className="font-semibold text-slate-900">
              24/7 Emergency Support
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-amber-400" />
            <p className="font-semibold text-slate-900">Top Rated Service</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-amber-400" />
            <p className="font-semibold text-slate-900">Transparent Pricing</p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-500 mb-4">
              Our Services
            </p>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
              Professional Electrical Solutions
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Reliable electrical services for homes, apartments, offices, and
              commercial properties.
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
                    Learn More
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
                Why Choose Us
              </p>

              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-8">
                Modern Electrical Service With Real Reliability
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
            Smart Booking Experience
          </p>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
            Describe Your Electrical Problem & Get an Instant Estimate
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">
            Our smart booking assistant helps you get pricing, availability, and
            appointment scheduling in under 2 minutes.
          </p>

          <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-amber-400/30">
            Get Instant Estimate
          </button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-500 mb-4">
              Customer Reviews
            </p>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
              Trusted By Homeowners Across Germany
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
                    Verified
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
              Fast, Safe & Professional Electrical Service When You Need It Most
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              From emergency repairs to complete installations, our certified
              electricians are ready to help homes and businesses across
              Frankfurt.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95">
                Get Instant Quote
              </button>

              <button className="border border-white/20 hover:border-white px-8 py-4 rounded-xl transition-all duration-300 hover:bg-white hover:text-slate-900 font-semibold">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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

                  <p className="text-sm text-gray-500">Licensed Electricians</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
                Professional electrical services for homes and businesses across
                Frankfurt and nearby areas.
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
                    Emergency Repairs
                  </a>
                </li>

                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Wiring & Installations
                  </a>
                </li>

                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Electrical Inspections
                  </a>
                </li>

                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Commercial Services
                  </a>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>

              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#why-us"
                    className="hover:text-white transition-colors"
                  >
                    Why Choose Us
                  </a>
                </li>

                <li>
                  <a
                    href="#reviews"
                    className="hover:text-white transition-colors"
                  >
                    Customer Reviews
                  </a>
                </li>

                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>

                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Get Instant Quote
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
                  <span>24/7 Emergency Support</span>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5" />
                  <span>Certified & Insured Electricians</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-500">
              © 2026 ElektroFix. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-gray-500">
              <span>Frankfurt, Germany</span>

              <span>•</span>

              <span>Same-Day Service Available</span>
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
