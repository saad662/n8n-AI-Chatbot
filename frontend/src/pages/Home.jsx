import ChatWidget from "../components/ChatWidget";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TestimonialCard from "../components/TestimonialCard";
import ServiceCard from "../components/ServiceCard";
import WhyUsFeature from "../components/WhyUsFeature";
import HeroSection from "../components/HeroSection";
import TrustStrip from "../components/TrustStrip";
import BookingSection from "../components/BookingSection";
import CTASection from "../components/CTASection";
import { services, features, testimonials } from "../data/homeData";

export default function Home() {
  return (
    <div className="bg-slate-50 text-gray-900 font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <Header />

      {/* HERO */}
      <HeroSection />

      {/* TRUST STRIP */}
      <TrustStrip />

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
              <ServiceCard key={index} service={service} />
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
                  <WhyUsFeature key={index} feature={feature} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI BOOKING */}
      <BookingSection />

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
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />

      {/* FOOTER */}
      <Footer />

      {/* ChatWidget */}
      <ChatWidget />
    </div>
  );
}
