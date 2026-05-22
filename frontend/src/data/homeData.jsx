import { Zap, Wrench, Building2 } from "lucide-react";

export const services = [
  {
    icon: <Zap className="w-8 h-8 text-amber-400" />,
    title: "Elektrische Notfallreparaturen",
    description:
      "Schnelle Hilfe am selben Tag bei Stromausfällen, Kurzschlüssen und dringenden Elektroproblemen.",
  },
  {
    icon: <Wrench className="w-8 h-8 text-amber-400" />,
    title: "Verkabelung & Installationen",
    description:
      "Professionelle Verkabelung, Lichtinstallationen, Steckdosen, Schalter und Renovierungen.",
  },
  {
    icon: <Building2 className="w-8 h-8 text-amber-400" />,
    title: "Gewerbliche Dienstleistungen",
    description:
      "Zuverlässige Wartung und Modernisierung elektrischer Anlagen für Büros, Geschäfte und Unternehmen.",
  },
];

export const features = [
  "Zertifizierte und versicherte Elektriker",
  "Termine am selben Tag verfügbar",
  "Transparente Preise",
  "Moderne KI-gestützte Buchung",
];

export const testimonials = [
  {
    name: "Markus H.",
    location: "Frankfurt",
    review:
      "Sehr professionelles Team. Unser Stromausfall wurde innerhalb von zwei Stunden behoben und alles wurde klar erklärt.",
  },
  {
    name: "Sarah L.",
    location: "Offenbach",
    review:
      "Einfacher Buchungsprozess und faire Preise. Der Elektriker kam pünktlich und hat hervorragende Arbeit geleistet.",
  },
  {
    name: "Daniel R.",
    location: "Darmstadt",
    review:
      "Saubere Installation, professionelle Kommunikation und insgesamt sehr zuverlässiger Service.",
  },
];
