import React from "react";

export default function PlanComparison({ plans = [], onBack }) {
  const comparisonPlans =
    plans.length > 0
      ? plans.slice(0, 3)
      : [
          {
            plan_id: "P01",
            plan_name: "Saver Plus",
            monthly_price: 399,
            day_allowance: 200,
            evening_allowance: 400,
            night_allowance: 999,
            international_allowance: 10,
            voicemail_allowance: 50,
          },
          {
            plan_id: "P02",
            plan_name: "Saver Lite",
            monthly_price: 299,
            day_allowance: 150,
            evening_allowance: 300,
            night_allowance: 999,
            international_allowance: 5,
            voicemail_allowance: 25,
          },
          {
            plan_id: "P03",
            plan_name: "Standard Flex",
            monthly_price: 549,
            day_allowance: 250,
            evening_allowance: 500,
            night_allowance: 999,
            international_allowance: 15,
            voicemail_allowance: 100,
          },
        ];

  const value = (plan, keys, fallback = 0) => {
    for (const key of keys) {
      if (plan?.[key] !== undefined && plan?.[key] !== null) {
        return plan[key];
      }
    }
    return fallback;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-violet-600">
            TARIFFSMART
          </p>

          <h1 className="text-3xl font-black text-slate-900">
            Plan Comparison
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Compare tariff plans and choose the best plan.
          </p>
        </div>

        <button
          onClick={onBack}
          className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white hover:bg-violet-700"
        >
          ← Back
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border bg-white shadow-sm">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b">
              <th className="p-5 text-left">Feature</th>

              {comparisonPlans.map((plan, index) => (
                <th key={index} className="p-5 text-center">
                  <div className="font-black text-slate-900">
                    {plan.plan_name || plan.name || `Plan ${index + 1}`}
                  </div>

                  <div className="text-xs text-slate-400">
                    {plan.plan_id || `P0${index + 1}`}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="p-5 font-bold">Monthly Cost</td>

              {comparisonPlans.map((plan, index) => (
                <td
                  key={index}
                  className="p-5 text-center text-xl font-black text-violet-700"
                >
                  ₹
                  {Number(
                    value(plan, [
                      "monthly_price",
                      "monthly_cost",
                      "price",
                    ])
                  ).toFixed(2)}
                </td>
              ))}
            </tr>

            <tr className="border-b">
              <td className="p-5 font-bold">☀️ Day Minutes</td>

              {comparisonPlans.map((plan, index) => (
                <td key={index} className="p-5 text-center">
                  {value(plan, [
                    "day_allowance",
                    "day_minutes",
                    "day_mins",
                  ])}{" "}
                  min
                </td>
              ))}
            </tr>

            <tr className="border-b">
              <td className="p-5 font-bold">🌅 Evening Minutes</td>

              {comparisonPlans.map((plan, index) => (
                <td key={index} className="p-5 text-center">
                  {value(plan, [
                    "evening_allowance",
                    "evening_minutes",
                    "eve_mins",
                  ])}{" "}
                  min
                </td>
              ))}
            </tr>

            <tr className="border-b">
              <td className="p-5 font-bold">🌙 Night Minutes</td>

              {comparisonPlans.map((plan, index) => (
                <td key={index} className="p-5 text-center">
                  {value(plan, [
                    "night_allowance",
                    "night_minutes",
                    "night_mins",
                  ])}{" "}
                  min
                </td>
              ))}
            </tr>

            <tr className="border-b">
              <td className="p-5 font-bold">🌐 International</td>

              {comparisonPlans.map((plan, index) => (
                <td key={index} className="p-5 text-center">
                  {value(plan, [
                    "international_allowance",
                    "international_minutes",
                    "intl_mins",
                  ])}{" "}
                  min
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-5 font-bold">💬 Voicemail</td>

              {comparisonPlans.map((plan, index) => (
                <td key={index} className="p-5 text-center">
                  {value(plan, [
                    "voicemail_allowance",
                    "voicemail_minutes",
                    "voice_mail",
                  ])}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl bg-violet-50 p-5">
        <h2 className="font-black text-violet-800">
          💡 Compare Before Choosing
        </h2>

        <p className="mt-1 text-sm text-violet-700">
          Compare monthly cost, day, evening, night and international
          allowances to select the suitable tariff plan.
        </p>
      </div>
    </div>
  );
}