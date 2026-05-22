import { Star } from "lucide-react";

export default function TrustStrip() {
  return (
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
          <p className="font-semibold text-slate-900">Top-bewerteter Service</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Star className="w-6 h-6 text-amber-400" />
          <p className="font-semibold text-slate-900">Transparente Preise</p>
        </div>
      </div>
    </section>
  );
}
