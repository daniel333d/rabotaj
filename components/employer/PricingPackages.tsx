import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    price: "0 zł",
    period: "/ pierwsze ogłoszenie",
    description: "Na start — jedno ogłoszenie, pełny profil firmy.",
    features: ["1 aktywne ogłoszenie", "Podstawowy profil firmy", "Panel kandydatów", "Rabotaj Score na żywo"],
    highlighted: false
  },
  {
    name: "Growth",
    price: "od 299 zł",
    period: "/ mies.",
    description: "Dla firm rekrutujących regularnie na kilka stanowisk.",
    features: [
      "Do 10 aktywnych ogłoszeń",
      "Odznaka Verified Employer po weryfikacji",
      "Statusy rekrutacji dla kandydatów",
      "Podstawowe statystyki wyświetleń"
    ],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Indywidualnie",
    period: "",
    description: "Dla dużych zespołów HR i agencji zatrudnienia.",
    features: ["Nielimitowane ogłoszenia", "Wiele kont w zespole", "Priorytetowa weryfikacja", "Dedykowane wsparcie"],
    highlighted: false
  }
];

export function PricingPackages() {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-brand">Cennik</p>
        <h2 className="mt-3 font-heading text-2xl font-extrabold text-ink sm:text-3xl">Pakiety ogłoszeń</h2>
        <p className="mt-3 text-sm text-muted">
          Przykładowe pakiety wersji demonstracyjnej — bez podpiętej płatności.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-2xl border p-7",
              plan.highlighted ? "border-brand bg-brand-light shadow-elevated" : "border-border bg-white shadow-soft"
            )}
          >
            {plan.highlighted && (
              <span className="mb-3 w-fit rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                Najpopularniejszy
              </span>
            )}
            <h3 className="font-heading text-lg font-bold text-ink">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted">{plan.description}</p>
            <p className="mt-5">
              <span className="font-heading text-2xl font-extrabold text-ink">{plan.price}</span>
              <span className="ml-1 text-xs text-muted">{plan.period}</span>
            </p>
            <ul className="mt-5 flex flex-1 flex-col gap-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-ink/80">
                  <Check size={15} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="#post-job"
              className={cn(
                "mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition-colors duration-200",
                plan.highlighted ? "bg-brand text-white hover:bg-blue-700" : "border border-border text-ink hover:border-brand hover:text-brand"
              )}
            >
              Dodaj ogłoszenie
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
