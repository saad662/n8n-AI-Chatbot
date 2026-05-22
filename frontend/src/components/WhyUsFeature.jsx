import { CheckCircle2 } from "lucide-react";

export default function WhyUsFeature({ feature }) {
  return (
    <div className="flex items-start gap-4">
      <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />

      <p className="text-lg text-gray-700 leading-relaxed">
        {feature}
      </p>
    </div>
  );
}