import { Star } from "lucide-react";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="group bg-white border border-gray-200 rounded-3xl p-8 hover:-translate-y-2 hover:border-amber-200 hover:shadow-2xl transition-all duration-500">
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
  );
}