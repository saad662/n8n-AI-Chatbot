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
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 flex items-center justify-center shadow-sm">
              <Zap className="w-6 h-6 text-slate-900" />
            </div>

            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-900">
                ElektroFix
              </h1>
              <p className="text-sm text-gray-500">
                Licensed Electricians
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#services" className="hover:text-slate-900 transition-colors">
              Services
            </a>
            <a href="#why-us" className="hover:text-slate-900 transition-colors">
              Why Us
            </a>
            <a href="#reviews" className="hover:text-slate-900 transition-colors">
              Reviews
            </a>
            <a href="#contact" className="hover:text-slate-900 transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Phone className="w-4 h-4 text-amber-400" />
              +49 69 123456
            </div>

            <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-5 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg">
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
                Licensed Electricians You Can Trust.
              </h1>

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mb-10">
                Fast response times, professional workmanship, and modern AI-powered booking for homes and businesses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-7 py-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 flex items-center justify-center gap-2">
                  Get Instant Quote
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button className="border border-white/20 hover:border-white text-white px-7 py-4 rounded-xl transition-all duration-300 hover:bg-white hover:text-slate-900 font-semibold">
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-3xl font-black text-amber-400">24/7</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Emergency Support
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-black text-amber-400">4.9★</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Customer Rating
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-black text-amber-400">2,000+</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Completed Jobs
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1200&auto=format&fit=crop"
                alt="Electrician"
                className="rounded-3xl shadow-2xl object-cover h-[650px] w-full"
              />

              <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 rounded-2xl p-5 shadow-2xl max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>

                  <div>
                    <p className="font-bold">Same-Day Service</p>
                    <p className="text-sm text-gray-500">
                      Fast response guaranteed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white border-y border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <ShieldCheck className="w-7 h-7 text-amber-400 mx-auto mb-3" />
            <p className="font-semibold">Certified & Insured</p>
          </div>

          <div>
            <Clock3 className="w-7 h-7 text-amber-400 mx-auto mb-3" />
            <p className="font-semibold">24/7 Emergency Support</p>
          </div>

          <div>
            <Star className="w-7 h-7 text-amber-400 mx-auto mb-3" />
            <p className="font-semibold">4.9★ Customer Rating</p>
          </div>

          <div>
            <BadgeCheck className="w-7 h-7 text-amber-400 mx-auto mb-3" />
            <p className="font-semibold">Transparent Pricing</p>
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
              Reliable electrical services for homes, apartments, offices, and commercial properties.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300"
              >
                <div className="mb-6">{service.icon}</div>

                <h3 className="text-2xl font-bold mb-4 text-slate-900">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop"
                alt="Electrician at work"
                className="rounded-3xl shadow-2xl"
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

          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Get Instant Estimates With Our AI Assistant
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">
            Describe your electrical issue, receive an instant estimate, and book your appointment in minutes.
          </p>

          <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105">
            Start AI Chat
          </button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" className="py-20 md:py-28 bg-slate-50">
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
                className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed mb-8">
                  “{testimonial.review}”
                </p>

                <div>
                  <h4 className="font-bold text-slate-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-slate-900 rounded-[32px] p-10 md:p-16 text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Need an Electrician Today?
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              Contact our professional team for fast, safe, and reliable electrical services.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:scale-105">
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
      <footer className="bg-slate-950 text-gray-400 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-2">
              ElektroFix
            </h3>

            <p className="text-sm">
              Professional Electrical Services Across Germany
            </p>
          </div>

          <div className="text-sm text-center md:text-right">
            <p>hello@elektrofix.de</p>
            <p>+49 69 123456</p>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}