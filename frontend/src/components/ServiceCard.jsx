import { ArrowRight } from "lucide-react";

export default function ServiceCard({ service }) {
  return (
    <div className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-amber-200 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
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
  );
}