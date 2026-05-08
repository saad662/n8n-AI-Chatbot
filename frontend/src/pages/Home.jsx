import ChatWidget from "../components/ChatWidget";

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-800">

      {/* NAVBAR */}
      <header className="sticky top-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-xl">⚡ ElektroFix</h1>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#">Services</a>
            <a href="#">Pricing</a>
            <a href="#">Reviews</a>
            <a href="#">Contact</a>
          </nav>
          <button className="bg-yellow-400 px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-300">
            Get Quote
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-28 px-6 text-center">
        <p className="mb-4 font-semibold bg-white/20 inline-block px-4 py-1 rounded-full text-sm">
          Trusted by 500+ customers
        </p>

        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Fast & Reliable <br /> Electrical Services ⚡
        </h1>

        <p className="text-lg max-w-2xl mx-auto mb-8">
          Get instant quotes, book services, and solve your electrical problems in minutes.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-black px-8 py-3 rounded-full font-semibold hover:bg-gray-900">
            Get Instant Quote
          </button>
          <button className="border border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black">
            Learn More
          </button>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white py-6 text-center text-sm text-gray-500">
        Trusted by homeowners & businesses across Germany 🇩🇪
      </section>

      {/* SERVICES */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Socket Installation", icon: "🔌" },
            { title: "Lighting Solutions", icon: "💡" },
            { title: "Full Wiring", icon: "⚡" },
            { title: "Electrical Inspection", icon: "🛠️" },
            { title: "Emergency Repairs", icon: "🚨" },
            { title: "Panel Upgrades", icon: "📊" },
          ].map((service, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-2xl transition hover:-translate-y-2 border"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">
                Professional service with certified electricians and guaranteed safety.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-white py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Us
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              title: "Certified Experts",
              desc: "Fully licensed electricians with years of experience.",
            },
            {
              title: "Fast Response",
              desc: "Same-day service and quick emergency support.",
            },
            {
              title: "Transparent Pricing",
              desc: "Know your cost upfront — no surprises.",
            },
          ].map((item, i) => (
            <div key={i}>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 px-6 text-center bg-gray-100">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            "Start Chat with AI Assistant",
            "Get Instant Price Estimate",
            "Book Your Appointment",
          ].map((step, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-12">Pricing Overview</h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: "Basic Fix", price: "€49+" },
            { title: "Standard Service", price: "€99+" },
            { title: "Full Installation", price: "€199+" },
          ].map((plan, i) => (
            <div key={i} className="border rounded-2xl p-8 shadow-sm">
              <h3 className="font-bold text-xl mb-4">{plan.title}</h3>
              <p className="text-3xl font-extrabold mb-6">{plan.price}</p>
              <button className="bg-yellow-400 px-6 py-2 rounded-full font-semibold hover:bg-yellow-300">
                Select
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gray-100 py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Customer Reviews
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            "Super fast and professional service. Highly recommend!",
            "Best electrician service I’ve used. Transparent pricing and great support.",
          ].map((review, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <p>“{review}”</p>
              <p className="mt-4 font-semibold">— Verified Customer</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>

        {[
          {
            q: "How fast can I get service?",
            a: "Most requests are handled within the same day.",
          },
          {
            q: "Are your electricians certified?",
            a: "Yes, all our electricians are fully licensed and insured.",
          },
          {
            q: "How do I get a price?",
            a: "Simply use our chat assistant to receive an instant estimate.",
          },
        ].map((faq, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold">{faq.q}</h3>
            <p className="text-gray-600 text-sm">{faq.a}</p>
          </div>
        ))}
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-black text-white text-center px-6">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Fix Your Electrical Issues?
        </h2>
        <p className="mb-8 text-gray-300">
          Get an instant quote and book your service in under 2 minutes.
        </p>
        <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-300">
          Start Chat Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-10 text-center text-sm text-gray-500">
        © 2026 ElektroFix — All rights reserved.
      </footer>

      {/* CHATBOT */}
      <ChatWidget />
    </div>
  );
}