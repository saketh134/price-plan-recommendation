import {
  Search,
  Phone,
  BrainCircuit,
  Activity,
  Sun,
  Moon,
  Clock3,
  Globe2,
  Target,
} from "lucide-react";

function Dashboard({
  customer,
  onSearch,
  phone,
  setPhone,
  loading,
}) {
  const usage = customer?.customer_usage || {};

  const day = Number(usage.day_mins || 0);
  const evening = Number(usage.evening_mins || 0);
  const night = Number(usage.night_mins || 0);
  const international =
    Number(usage.international_mins || 0);

  const total =
    day +
    evening +
    night +
    international;

  const recommendations =
    customer?.recommendations || [];

  return (
    <div className="page-enter space-y-6">

      {/* HEADER */}
      <section className="hero-gradient p-7">

        <div className="premium-badge border-white/20 bg-white/10 text-white">
          <BrainCircuit size={13} />
          CUSTOMER INTELLIGENCE
        </div>

        <h1 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
          Customer Usage Analysis
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-purple-100/70">
          Enter a phone number to analyze actual
          customer behavior and generate the
          Top 3 recommended plans.
        </p>


        {/* SEARCH */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="mt-7 flex flex-col gap-3 sm:flex-row"
        >

          <div className="flex h-14 flex-1 items-center rounded-2xl bg-white px-5">

            <Search
              size={19}
              className="mr-3 text-slate-400"
            />

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter customer phone number"
              className="w-full bg-transparent text-sm outline-none"
            />

          </div>


          <button
            type="submit"
            disabled={loading}
            className="tariff-button"
          >
            {loading
              ? "Analyzing..."
              : "Analyze Customer"}
          </button>

        </form>

      </section>


      {!customer ? (

        <div className="empty-state">

          <Search
            size={45}
            className="text-purple-400"
          />

          <h2 className="mt-5 text-xl font-extrabold">
            Search for a Customer
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Enter a phone number that exists
            in your customer dataset.
          </p>

        </div>

      ) : (

        <>

          {/* CUSTOMER */}
          <section className="tariff-card p-6">

            <div className="flex items-center gap-4">

              <div className="icon-box">
                <Phone size={22} />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase text-purple-600">
                  Customer Found
                </p>

                <h2 className="text-xl font-extrabold">
                  {customer.phone_number || phone}
                </h2>

              </div>

            </div>

          </section>


          {/* USAGE */}
          <section>

            <div className="mb-4">

              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600">
                ACTUAL DATASET VALUES
              </p>

              <h2 className="text-xl font-extrabold">
                Usage Behavior
              </h2>

            </div>


            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <UsageCard
                title="Day"
                value={day}
                icon={<Sun size={20} />}
              />

              <UsageCard
                title="Evening"
                value={evening}
                icon={<Clock3 size={20} />}
              />

              <UsageCard
                title="Night"
                value={night}
                icon={<Moon size={20} />}
              />

              <UsageCard
                title="International"
                value={international}
                icon={<Globe2 size={20} />}
              />

            </div>

          </section>


          {/* CLUSTER */}
          <section className="tariff-card p-6">

            <div className="flex items-center gap-4">

              <div className="icon-box">
                <BrainCircuit size={22} />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase text-purple-600">
                  K-MEANS CLUSTER
                </p>

                <h2 className="text-2xl font-extrabold">
                  {customer.cluster ?? "Not Available"}
                </h2>

              </div>

            </div>


            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <Metric
                title="Total Usage"
                value={`${total.toFixed(1)} min`}
              />

              <Metric
                title="Persona"
                value={
                  customer.persona ||
                  "Not Available"
                }
              />

              <Metric
                title="Recommendations"
                value={recommendations.length}
              />

            </div>

          </section>


          {/* TOP 3 */}
          <section>

            <div className="mb-5 flex items-center gap-3">

              <Target
                size={22}
                className="text-purple-600"
              />

              <div>

                <p className="text-[10px] font-bold uppercase text-purple-600">
                  RECOMMENDATION ENGINE
                </p>

                <h2 className="text-xl font-extrabold">
                  Top 3 Recommended Plans
                </h2>

              </div>

            </div>


            {recommendations.length === 0 ? (

              <div className="empty-state">

                <Activity
                  size={40}
                  className="text-purple-400"
                />

                <p className="mt-4 text-sm text-slate-400">
                  No recommendations returned
                  by the backend.
                </p>

              </div>

            ) : (

              <div className="grid gap-5 lg:grid-cols-3">

                {recommendations
                  .slice(0, 3)
                  .map((plan, index) => (

                    <PlanCard
                      key={index}
                      plan={plan}
                      index={index}
                    />

                  ))}

              </div>

            )}

          </section>

        </>

      )}

    </div>
  );
}


/* USAGE CARD */

function UsageCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="stat-card">

      <div className="icon-box">
        {icon}
      </div>

      <p className="mt-5 text-xs text-slate-400">
        {title} Usage
      </p>

      <h3 className="mt-1 text-3xl font-extrabold">
        {Number(value).toFixed(1)}
      </h3>

      <p className="text-xs text-slate-400">
        minutes
      </p>

    </div>
  );
}


/* METRIC */

function Metric({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">

      <p className="text-[10px] font-bold uppercase text-slate-400">
        {title}
      </p>

      <p className="mt-2 truncate text-lg font-extrabold">
        {value}
      </p>

    </div>
  );
}


/* PLAN */

function PlanCard({
  plan,
  index,
}) {

  const name =
    plan.plan_name ||
    plan.plan ||
    plan.name ||
    `Plan ${index + 1}`;

  const price =
    plan.price ||
    plan.monthly_price ||
    plan.predicted_charge ||
    0;

  const score =
    plan.score ||
    plan.recommendation_score ||
    plan.final_score ||
    0;

  return (
    <div
      className={`recommendation-card ${
        index === 0 ? "best" : ""
      }`}
    >

      {index === 0 && (
        <div className="best-match">
          BEST MATCH
        </div>
      )}

      <p className="text-3xl">
        {index === 0
          ? "🥇"
          : index === 1
          ? "🥈"
          : "🥉"}
      </p>

      <h3 className="mt-4 text-xl font-extrabold">
        {name}
      </h3>

      <p className="mt-3 text-2xl font-extrabold text-purple-700">
        ₹{Number(price).toFixed(2)}
      </p>

      <div className="mt-5">

        <div className="flex justify-between text-xs">

          <span className="text-slate-400">
            Recommendation Score
          </span>

          <b>
            {Number(score).toFixed(2)}
          </b>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;