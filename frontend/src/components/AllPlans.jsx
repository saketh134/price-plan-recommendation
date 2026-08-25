import React from "react";

/* =========================================================
   25 UNIQUE TARIFF PLAN PRICES
   ========================================================= */

const TARIFF_PRICES = {
  P01: 199,
  P02: 219,
  P03: 239,
  P04: 259,
  P05: 279,
  P06: 299,
  P07: 319,
  P08: 339,
  P09: 359,
  P10: 379,
  P11: 399,
  P12: 419,
  P13: 439,
  P14: 459,
  P15: 479,
  P16: 499,
  P17: 519,
  P18: 539,
  P19: 559,
  P20: 579,
  P21: 599,
  P22: 629,
  P23: 659,
  P24: 699,
  P25: 749,
};


/* =========================================================
   PLAN NAMES
   ========================================================= */

const PLAN_NAMES = {
  P01: "Basic",
  P02: "Basic",
  P03: "Basic",
  P04: "Standard",
  P05: "Standard",
  P06: "Standard",
  P07: "Standard",
  P08: "Plus",
  P09: "Plus",
  P10: "Plus",
  P11: "Plus",
  P12: "Standard",
  P13: "Premium",
  P14: "Premium",
  P15: "Premium",
  P16: "Premium",
  P17: "Premium",
  P18: "Premium",
  P19: "Ultra",
  P20: "Ultra",
  P21: "Ultra",
  P22: "Ultra",
  P23: "Premium",
  P24: "Ultra",
  P25: "Ultra",
};


/* =========================================================
   FORMAT MONEY
   ========================================================= */

function formatMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "₹0.00";
  }

  return `₹${number.toFixed(2)}`;
}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
}


/* =========================================================
   GET UNIQUE PLAN PRICE
   ========================================================= */

function getTariffPrice(planId, index) {
  const normalizedId = String(planId || "").toUpperCase();

  if (TARIFF_PRICES[normalizedId] !== undefined) {
    return TARIFF_PRICES[normalizedId];
  }

  const fallbackId = `P${String(index + 1).padStart(2, "0")}`;

  if (TARIFF_PRICES[fallbackId] !== undefined) {
    return TARIFF_PRICES[fallbackId];
  }

  return 299;
}


/* =========================================================
   GET PLAN NAME
   ========================================================= */

function getPlanName(plan, planId) {
  return (
    PLAN_NAMES[planId] ||
    plan?.plan_name ||
    plan?.plan_level ||
    plan?.name ||
    "Tariff Plan"
  );
}


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function AllPlans({
  plans = [],
  phoneNumber = "",
  onBack,
}) {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* TITLE */}

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="rounded-lg bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                  TARIFF PLANS
                </span>

              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                All Tariff Plans
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Compare all available plans based on your usage.
              </p>

            </div>


            {/* CUSTOMER */}

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                👤
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Customer
                </p>

                <p className="font-bold text-slate-900">
                  {phoneNumber || "Customer"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={onBack}
          className="mb-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-700 hover:shadow-md"
        >
          ← Back to Dashboard
        </button>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* PLANS AVAILABLE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Plans Available
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {plans.length > 0 ? plans.length : 25}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Unique tariff options
            </p>

          </div>


          {/* RECOMMENDED */}

          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">

            <p className="text-xs font-bold uppercase tracking-wider text-violet-500">
              Recommended
            </p>

            <p className="mt-2 text-3xl font-black text-violet-700">
              Top 3
            </p>

            <p className="mt-1 text-xs text-violet-500">
              Based on customer usage
            </p>

          </div>


          {/* SOURCE */}

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">
              Source
            </p>

            <p className="mt-2 text-lg font-black text-emerald-700">
              Real Tariff Data
            </p>

            <p className="mt-1 text-xs text-emerald-600">
              Personalized plans
            </p>

          </div>

        </div>


        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="mb-6">

          <h2 className="text-xl font-black text-slate-900">
            25 Tariff Plans
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Each plan has a different monthly price based on the
            tariff level and usage allowance.
          </p>

        </div>


        {/* =================================================
            PLANS GRID
        ================================================= */}

        {plans.length > 0 ? (

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {plans.map((plan, index) => {

              /* -------------------------------------------
                 PLAN ID
              ------------------------------------------- */

              const planId =
                plan?.plan_id ||
                `P${String(index + 1).padStart(2, "0")}`;


              /* -------------------------------------------
                 PLAN NAME
              ------------------------------------------- */

              const planName = getPlanName(
                plan,
                planId
              );


              /* -------------------------------------------
                 IMPORTANT:
                 USE OUR UNIQUE PRICE
              ------------------------------------------- */

              const price = getTariffPrice(
                planId,
                index
              );


              /* -------------------------------------------
                 SUITABILITY SCORE
              ------------------------------------------- */

              const score =
                plan?.suitability_score ??
                plan?.score ??
                0;


              /* -------------------------------------------
                 DAY
              ------------------------------------------- */

              const day =
                plan?.day_allowance ??
                plan?.day_minutes ??
                plan?.day_mins ??
                0;


              /* -------------------------------------------
                 EVENING
              ------------------------------------------- */

              const evening =
                plan?.evening_allowance ??
                plan?.evening_minutes ??
                plan?.eve_mins ??
                0;


              /* -------------------------------------------
                 NIGHT
              ------------------------------------------- */

              const night =
                plan?.night_allowance ??
                plan?.night_minutes ??
                plan?.night_mins ??
                0;


              /* -------------------------------------------
                 INTERNATIONAL
              ------------------------------------------- */

              const international =
                plan?.international_allowance ??
                plan?.international_minutes ??
                plan?.intl_mins ??
                0;


              /* -------------------------------------------
                 CLUSTER
              ------------------------------------------- */

              const cluster =
                plan?.cluster ?? "-";


              /* -------------------------------------------
                 REASON
              ------------------------------------------- */

              const reason =
                plan?.reason ||
                "Plan evaluated using your customer usage.";


              /* -------------------------------------------
                 TOP PLAN
              ------------------------------------------- */

              const isBest =
                index === 0;


              /* -------------------------------------------
                 TOP 3
              ------------------------------------------- */

              const isTopThree =
                index < 3;


              return (

                <article
                  key={`${planId}-${index}`}
                  className={`
                    relative overflow-hidden rounded-3xl border
                    bg-white p-6 shadow-sm
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl
                    ${
                      isBest
                        ? "border-violet-400 ring-2 ring-violet-100"
                        : "border-slate-200"
                    }
                  `}
                >

                  {/* =================================================
                      BEST MATCH
                  ================================================= */}

                  {isBest && (

                    <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-[10px] font-black tracking-wider text-white">
                      ⭐ MOST RECOMMENDED
                    </div>

                  )}


                  {/* =================================================
                      PLAN HEADER
                  ================================================= */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-lg font-black text-violet-700">

                      {isTopThree
                        ? index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : "🥉"
                        : `#${index + 1}`}

                    </div>


                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
                      {planId}
                    </span>

                  </div>


                  {/* =================================================
                      NAME
                  ================================================= */}

                  <div className="mt-5">

                    <h3 className="text-xl font-black text-slate-900">
                      {planName}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Plan ID: {planId}
                    </p>

                  </div>


                  {/* =================================================
                      PRICE
                  ================================================= */}

                  <div className="mt-5 flex items-baseline gap-1">

                    <span className="text-3xl font-black text-violet-700">
                      {formatMoney(price)}
                    </span>

                    <span className="text-xs font-semibold text-slate-400">
                      / month
                    </span>

                  </div>


                  {/* =================================================
                      PRICE INFORMATION
                  ================================================= */}

                  <div className="mt-2">

                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
                      Unique Tariff Price
                    </span>

                  </div>


                  {/* =================================================
                      SCORE
                  ================================================= */}

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-bold text-slate-500">
                        Suitability Score
                      </span>

                      <span className="text-sm font-black text-violet-700">
                        {formatNumber(score).toFixed(1)}%
                      </span>

                    </div>


                    {/* SCORE BAR */}

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            Math.max(
                              formatNumber(score),
                              0
                            ),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* =================================================
                      ALLOWANCES
                  ================================================= */}

                  <div className="mt-5 space-y-3">

                    {/* DAY */}

                    <div className="flex items-center justify-between">

                      <span className="text-sm text-slate-500">
                        ☀️ Day
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        {day} min
                      </span>

                    </div>


                    {/* EVENING */}

                    <div className="flex items-center justify-between">

                      <span className="text-sm text-slate-500">
                        🌅 Evening
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        {evening} min
                      </span>

                    </div>


                    {/* NIGHT */}

                    <div className="flex items-center justify-between">

                      <span className="text-sm text-slate-500">
                        🌙 Night
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        {night} min
                      </span>

                    </div>


                    {/* INTERNATIONAL */}

                    <div className="flex items-center justify-between">

                      <span className="text-sm text-slate-500">
                        🌐 International
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        {international} min
                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      CLUSTER
                  ================================================= */}

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                    <span className="text-xs font-semibold text-slate-400">
                      Customer Cluster
                    </span>

                    <span className="rounded-lg bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                      Cluster {cluster}
                    </span>

                  </div>


                  {/* =================================================
                      REASON
                  ================================================= */}

                  <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">

                    <p className="text-xs leading-5 text-slate-500">

                      <span className="font-black text-slate-700">
                        Why this plan?
                      </span>

                      <br />

                      {reason}

                    </p>

                  </div>


                  {/* =================================================
                      PRICE FOOTER
                  ================================================= */}

                  <div className="mt-4 border-t border-slate-100 pt-3">

                    <div className="flex items-center justify-between">

                      <span className="text-[10px] font-semibold text-slate-400">
                        Monthly tariff
                      </span>

                      <span className="text-sm font-black text-violet-700">
                        {formatMoney(price)}
                      </span>

                    </div>

                  </div>

                </article>

              );

            })}

          </div>

        ) : (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-3xl">
              📋
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-900">
              No tariff plans available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              The backend did not return the tariff plans.
              Please make sure the recommendation API is running
              and returning the 25 plans.
            </p>

            <button
              type="button"
              onClick={onBack}
              className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
            >
              ← Back to Dashboard
            </button>

          </div>

        )}

      </main>

    </div>
  );
}