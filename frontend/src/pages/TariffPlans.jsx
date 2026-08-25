import {
  Package,
  Search,
  IndianRupee,
  CheckCircle2,
  Smartphone,
  Wifi,
  Phone,
  MessageSquare,
  Star,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getTariffs } from "../services/api";


function TariffPlans() {

  const [plans, setPlans] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  /*
  ==========================================
  LOAD PLANS FROM FASTAPI
  ==========================================
  */

  useEffect(() => {

    loadPlans();

  }, []);


  async function loadPlans() {

    try {

      setLoading(true);

      setError("");

      const data =
        await getTariffs();

      /*
        Supports either:

        [
          {...},
          {...}
        ]

        OR

        {
          plans: [...]
        }
      */

      const result =
        Array.isArray(data)
          ? data
          : data.plans || [];

      setPlans(result);

    } catch (err) {

      setError(
        err.message ||
        "Unable to load tariff plans."
      );

    } finally {

      setLoading(false);

    }

  }


  /*
  ==========================================
  SEARCH
  ==========================================
  */

  const filteredPlans =
    plans.filter((plan) => {

      const text =
        `${plan.plan_name || ""}
         ${plan.plan || ""}
         ${plan.name || ""}
         ${plan.description || ""}`
          .toLowerCase();

      return text.includes(
        search.toLowerCase()
      );

    });


  return (

    <div className="page-enter space-y-6">


      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="hero-gradient relative overflow-hidden p-7 sm:p-9">

        <div className="relative z-10">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">


            <div>

              <div className="premium-badge border-white/20 bg-white/10 text-white">

                <Package size={13} />

                TARIFF CATALOGUE

              </div>


              <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">

                Available Tariff Plans

              </h1>


              <p className="mt-3 max-w-2xl text-sm leading-7 text-purple-100/70">

                View the tariff plans available to the
                recommendation engine. Customer
                recommendations are generated based
                on actual usage behavior.

              </p>

            </div>


            {/* TOTAL PLANS */}

            <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-5 text-center backdrop-blur-xl">

              <p className="text-[9px] font-bold uppercase tracking-widest text-purple-200">

                Available Plans

              </p>


              <p className="mt-1 text-3xl font-extrabold">

                {plans.length}

              </p>

            </div>

          </div>


          {/* SEARCH */}

          <div className="mt-8 flex h-14 items-center rounded-2xl bg-white px-5 text-slate-800 shadow-xl">

            <Search
              size={19}
              className="mr-3 text-slate-400"
            />


            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search tariff plans..."
              className="w-full bg-transparent text-sm outline-none"
            />

          </div>

        </div>

      </section>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (

        <div className="notification notification-error">

          ⚠️ {error}

        </div>

      )}


      {/* ==========================================
          LOADING
      ========================================== */}

      {loading ? (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {[1, 2, 3, 4, 5, 6].map(
            (item) => (

              <div
                key={item}
                className="tariff-card p-6"
              >

                <div className="skeleton h-12 w-12" />

                <div className="skeleton mt-6 h-5 w-3/4" />

                <div className="skeleton mt-3 h-4 w-full" />

                <div className="skeleton mt-2 h-4 w-2/3" />

                <div className="skeleton mt-8 h-10 w-full" />

              </div>

            )
          )}

        </div>

      ) : filteredPlans.length === 0 ? (

        <div className="empty-state">

          <Package
            size={42}
            className="text-purple-400"
          />

          <h2 className="mt-5 text-xl font-extrabold">

            No tariff plans found

          </h2>

          <p className="mt-2 text-sm text-slate-400">

            Try a different search term.

          </p>

        </div>

      ) : (

        /* ==========================================
           PLAN GRID
        ========================================== */

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredPlans.map(
            (plan, index) => (

              <PlanCard
                key={
                  plan.id ??
                  plan.plan_id ??
                  index
                }
                plan={plan}
                index={index}
              />

            )
          )}

        </div>

      )}

    </div>

  );

}


/*
====================================================
PLAN CARD
====================================================
*/

function PlanCard({
  plan,
  index,
}) {

  const name =
    plan.plan_name ??
    plan.plan ??
    plan.name ??
    `Tariff Plan ${index + 1}`;


  const price =
    plan.price ??
    plan.monthly_price ??
    plan.monthly_charge ??
    plan.cost ??
    0;


  const description =
    plan.description ??
    "Personalized telecom tariff plan.";


  const minutes =
    plan.voice_minutes ??
    plan.call_minutes ??
    plan.minutes ??
    plan.total_minutes;


  const data =
    plan.data_gb ??
    plan.data ??
    plan.internet_gb;


  const sms =
    plan.sms ??
    plan.sms_limit ??
    plan.messages;


  return (

    <div className="recommendation-card">


      {/* PLAN ICON */}

      <div className="flex items-start justify-between">

        <div className="icon-box">

          <Package size={21} />

        </div>


        <span className="premium-badge">

          PLAN {index + 1}

        </span>

      </div>


      {/* NAME */}

      <h2 className="mt-6 text-xl font-extrabold">

        {name}

      </h2>


      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-400">

        {description}

      </p>


      {/* PRICE */}

      <div className="mt-5 flex items-baseline gap-1">

        <IndianRupee
          size={19}
          className="text-purple-600"
        />

        <span className="text-3xl font-extrabold text-purple-700">

          {Number(price).toFixed(2)}

        </span>

        <span className="text-xs text-slate-400">

          / month

        </span>

      </div>


      {/* FEATURES */}

      <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">


        {minutes !== undefined && (

          <PlanFeature
            icon={
              <Phone size={16} />
            }
            label="Voice Minutes"
            value={minutes}
          />

        )}


        {data !== undefined && (

          <PlanFeature
            icon={
              <Wifi size={16} />
            }
            label="Internet Data"
            value={`${data} GB`}
          />

        )}


        {sms !== undefined && (

          <PlanFeature
            icon={
              <MessageSquare
                size={16}
              />
            }
            label="SMS"
            value={sms}
          />

        )}

      </div>


      {/* PLAN QUALITY */}

      <div className="mt-6 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">

            <Star size={17} />

          </div>


          <div>

            <p className="text-xs font-bold">

              Recommendation Ready

            </p>

            <p className="mt-0.5 text-[10px] text-slate-400">

              This plan can be evaluated
              for customer matching.

            </p>

          </div>

        </div>

      </div>


      {/* STATUS */}

      <div className="mt-5 flex items-center gap-2 text-[10px] font-bold text-emerald-600">

        <CheckCircle2 size={15} />

        Available in recommendation engine

      </div>

    </div>

  );

}


/*
====================================================
PLAN FEATURE
====================================================
*/

function PlanFeature({
  icon,
  label,
  value,
}) {

  return (

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="text-purple-500">

          {icon}

        </div>

        <span className="text-xs text-slate-500">

          {label}

        </span>

      </div>


      <span className="text-xs font-bold text-slate-800">

        {value}

      </span>

    </div>

  );

}


export default TariffPlans;