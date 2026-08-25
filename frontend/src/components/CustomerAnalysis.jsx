import {
  UserRound,
  Layers,
  CalendarDays,
  CheckCircle2,
  Sun,
  Sunset,
  Moon,
  Globe2,
  Phone,
  PhoneCall,
  Voicemail,
  Headphones,
  Activity,
  TrendingUp,
  Clock3,
  BarChart3,
  CircleDollarSign,
} from "lucide-react";


function CustomerAnalysis({
  phoneNumber,
  customer,
  recommendations = [],
}) {

  // =========================================================
  // NORMALIZE DATA
  // =========================================================

  /*
    Your backend recommendation API returns:

    customer: {
      usage: {...},
      calls: {...},
      services: {...},
      charges: {...}
    }

    This code also supports the older flat structure.
  */

  const usage =
    customer?.usage || {};

  const calls =
    customer?.calls || {};

  const services =
    customer?.services || {};

  const charges =
    customer?.charges || {};


  // =========================================================
  // CUSTOMER INFORMATION
  // =========================================================

  const customerPhone =
    customer?.phone_number ||
    customer?.phone ||
    customer?.["Phone Number"] ||
    phoneNumber ||
    "N/A";


  const cluster =
    customer?.cluster ??
    customer?.Cluster ??
    "N/A";


  const accountLength =
    Number(
      customer?.account_length ??
      customer?.["Account Length"] ??
      0
    );


  const churn =
    String(
      customer?.churn ??
      customer?.Churn ??
      "0"
    );


  const churnLabel =
    churn === "1" ||
    churn.toLowerCase() === "yes"
      ? "Churn Risk"
      : "Active";


  // =========================================================
  // USAGE
  // =========================================================

  const dayMinutes = Number(
    usage?.day_minutes ??
    customer?.usage.day_minutes ??
    customer?.["Day Mins"] ??
    0
  );


  const eveningMinutes = Number(
    usage?.evening_minutes ??
    customer?.usage.evening_minutes ??
    customer?.["Eve Mins"] ??
    0
  );


  const nightMinutes = Number(
    usage?.night_minutes ??
    customer?.usage.night_minutes ??
    customer?.["Night Mins"] ??
    0
  );


  const internationalMinutes = Number(
    usage?.international_minutes ??
    customer?.usage.international_minutes ??
    customer?.["Intl Mins"] ??
    0
  );


  const totalMinutes = Number(
    usage?.total_minutes ??
    customer?.usage.total_minutes ??
    0
  );


  const totalCalls = Number(
    usage?.total_calls ??
    customer?.usage.total_calls ??
    0
  );


  const avgMinutesPerCall = Number(
    usage?.avg_minutes_per_call ??
    customer?.usage.avg_minutes_per_call ??
    0
  );


  const callsPerDay = Number(
    usage?.calls_per_day ??
    customer?.usage.calls_per_day ??
    0
  );


  const peakPeriodShare = Number(
    usage?.peak_period_share ??
    customer?.peak_period_share ??
    0
  );


  const usageVariation = Number(
    usage?.usage_time_std ??
    customer?.usage_time_std ??
    0
  );


  const dominantPeriod =
    usage?.dominant_usage_period ??
    customer?.dominant_usage_period ??
    "N/A";


  // =========================================================
  // CALLS
  // =========================================================

  const dayCalls = Number(
    calls?.day_calls ??
    customer?.day_calls ??
    customer?.["Day Calls"] ??
    0
  );


  const eveningCalls = Number(
    calls?.evening_calls ??
    customer?.evening_calls ??
    customer?.["Eve Calls"] ??
    0
  );


  const nightCalls = Number(
    calls?.night_calls ??
    customer?.night_calls ??
    customer?.["Night Calls"] ??
    0
  );


  const internationalCalls = Number(
    calls?.international_calls ??
    customer?.international_calls ??
    customer?.["Intl Calls"] ??
    0
  );


  // =========================================================
  // SERVICES
  // =========================================================

  const voicemailMessages = Number(
    services?.voicemail_messages ??
    customer?.voicemail_messages ??
    customer?.["VMail Message"] ??
    0
  );


  const customerServiceCalls = Number(
    services?.customer_service_calls ??
    customer?.customer_service_calls ??
    customer?.["CustServ Calls"] ??
    0
  );


  // =========================================================
  // CHARGES
  // =========================================================

  const dayCharge = Number(
    charges?.day_charge ??
    customer?.day_charge ??
    customer?.["Day Charge"] ??
    0
  );


  const eveningCharge = Number(
    charges?.evening_charge ??
    customer?.evening_charge ??
    customer?.["Eve Charge"] ??
    0
  );


  const nightCharge = Number(
    charges?.night_charge ??
    customer?.night_charge ??
    customer?.["Night Charge"] ??
    0
  );


  const internationalCharge = Number(
    charges?.international_charge ??
    customer?.international_charge ??
    customer?.["Intl Charge"] ??
    0
  );


  const totalCharge = Number(
    charges?.total_charge ??
    customer?.total_charge ??
    0
  );


  const chargePerMinute = Number(
    charges?.charge_per_min ??
    customer?.charge_per_min ??
    0
  );


  // =========================================================
  // PERCENTAGES
  // =========================================================

  const calculatedTotal =
    dayMinutes +
    eveningMinutes +
    nightMinutes +
    internationalMinutes;


  const safeTotal =
    totalMinutes > 0
      ? totalMinutes
      : calculatedTotal;


  const dayPercent =
    Number(
      usage?.day_minutes_share ??
      (safeTotal
        ? (dayMinutes / safeTotal) * 100
        : 0)
    );


  const eveningPercent =
    Number(
      usage?.evening_minutes_share ??
      (safeTotal
        ? (eveningMinutes / safeTotal) * 100
        : 0)
    );


  const nightPercent =
    Number(
      usage?.night_minutes_share ??
      (safeTotal
        ? (nightMinutes / safeTotal) * 100
        : 0)
    );


  const internationalPercent =
    Number(
      usage?.international_minutes_share ??
      (safeTotal
        ? (internationalMinutes / safeTotal) * 100
        : 0)
    );


  // =========================================================
  // HELPERS
  // =========================================================

  function number(value, decimals = 2) {

    if (!Number.isFinite(Number(value))) {
      return "0.00";
    }

    return Number(value).toFixed(decimals);

  }


  function money(value) {

    return `₹${number(value)}`;

  }


  // =========================================================
  // MAX VALUE FOR PROGRESS BARS
  // =========================================================

  const maxMinutes =
    Math.max(
      dayMinutes,
      eveningMinutes,
      nightMinutes,
      internationalMinutes,
      1
    );


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          sticky
          top-0
          z-30
          border-b
          border-slate-200
          bg-white/95
          px-6
          py-5
          backdrop-blur-xl
          lg:px-8
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <h1
              className="
                text-2xl
                font-black
                tracking-tight
                text-slate-900
              "
            >
              Customer Analysis
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Detailed analysis of your actual telecom usage behavior.
            </p>

          </div>


          <div
            className="
              hidden
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-4
              py-2
              shadow-sm
              sm:flex
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-violet-100
                text-violet-700
              "
            >
              <UserRound size={18} />
            </div>

            <div>

              <p className="text-[10px] font-semibold text-slate-400">
                Customer
              </p>

              <p className="text-sm font-black text-slate-900">
                {customerPhone}
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-[1500px] space-y-6 p-5 lg:p-8">


        {/* =================================================
            TOP STAT CARDS
        ================================================= */}

        <section
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >

          {/* CUSTOMER */}

          <StatCard
            title="Customer ID"
            value={customerPhone}
            icon={<UserRound size={20} />}
            iconClass="bg-violet-100 text-violet-700"
          />


          {/* CLUSTER */}

          <StatCard
            title="Customer Cluster"
            value={`Cluster ${cluster}`}
            icon={<Layers size={20} />}
            iconClass="bg-purple-100 text-purple-700"
            valueClass="text-violet-700"
          />


          {/* ACCOUNT LENGTH */}

          <StatCard
            title="Account Length"
            value={`${number(accountLength, 0)} days`}
            icon={<CalendarDays size={20} />}
            iconClass="bg-blue-100 text-blue-600"
          />


          {/* CHURN */}

          <StatCard
            title="Churn Status"
            value={churnLabel}
            icon={<CheckCircle2 size={20} />}
            iconClass={
              churnLabel === "Active"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-600"
            }
            valueClass={
              churnLabel === "Active"
                ? "text-emerald-600"
                : "text-red-600"
            }
          />

        </section>


        {/* =================================================
            USAGE + DONUT
        ================================================= */}

        <section
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-2
          "
        >

          {/* =================================================
              USAGE BY TIME PERIOD
          ================================================= */}

          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >

            <div className="mb-7">

              <h2
                className="
                  text-xl
                  font-black
                  text-slate-900
                "
              >
                Usage by Time Period
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-400
                "
              >
                Actual minutes from your customer dataset.
              </p>

            </div>


            <UsageBar
              icon={<Sun size={18} />}
              iconClass="bg-amber-100 text-amber-500"
              label="Day Minutes"
              value={dayMinutes}
              max={maxMinutes}
              progressClass="bg-violet-600"
            />


            <UsageBar
              icon={<Sunset size={18} />}
              iconClass="bg-blue-100 text-blue-500"
              label="Evening Minutes"
              value={eveningMinutes}
              max={maxMinutes}
              progressClass="bg-blue-500"
            />


            <UsageBar
              icon={<Moon size={18} />}
              iconClass="bg-emerald-100 text-emerald-500"
              label="Night Minutes"
              value={nightMinutes}
              max={maxMinutes}
              progressClass="bg-emerald-500"
            />


            <UsageBar
              icon={<Globe2 size={18} />}
              iconClass="bg-orange-100 text-orange-500"
              label="International Minutes"
              value={internationalMinutes}
              max={maxMinutes}
              progressClass="bg-orange-500"
            />


            <div
              className="
                mt-7
                flex
                items-center
                justify-between
                rounded-2xl
                bg-slate-50
                px-5
                py-4
              "
            >

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-500
                "
              >
                Total Analyzed Minutes
              </span>

              <span
                className="
                  text-lg
                  font-black
                  text-slate-900
                "
              >
                {number(safeTotal)}
              </span>

            </div>

          </div>


          {/* =================================================
              DONUT CHART
          ================================================= */}

          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >

            <div className="mb-5">

              <h2
                className="
                  text-xl
                  font-black
                  text-slate-900
                "
              >
                Usage Distribution
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-400
                "
              >
                Percentage of total customer usage.
              </p>

            </div>


            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-8
                md:flex-row
              "
            >

              {/* DONUT */}

              <div
                className="relative h-64 w-64 shrink-0 rounded-full"
                style={{
                  background:
                    safeTotal > 0
                      ? `
                        conic-gradient(
                          #7138e8 0% ${dayPercent}%,
                          #3478f6 ${dayPercent}% ${dayPercent + eveningPercent}%,
                          #20bd63 ${dayPercent + eveningPercent}% ${dayPercent + eveningPercent + nightPercent}%,
                          #f59e0b ${dayPercent + eveningPercent + nightPercent}% 100%
                        )
                      `
                      : "#e2e8f0",
                }}
              >

                <div
                  className="
                    absolute
                    inset-12
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    shadow-inner
                  "
                >

                  <span
                    className="
                      text-3xl
                      font-black
                      text-slate-900
                    "
                  >
                    {number(safeTotal, 0)}
                  </span>

                  <span
                    className="
                      text-xs
                      font-medium
                      text-slate-400
                    "
                  >
                    Total Minutes
                  </span>

                </div>

              </div>


              {/* LEGEND */}

              <div className="w-full max-w-xs space-y-5">

                <DistributionRow
                  color="bg-violet-600"
                  label="Day"
                  value={dayPercent}
                />

                <DistributionRow
                  color="bg-blue-500"
                  label="Evening"
                  value={eveningPercent}
                />

                <DistributionRow
                  color="bg-emerald-500"
                  label="Night"
                  value={nightPercent}
                />

                <DistributionRow
                  color="bg-orange-500"
                  label="International"
                  value={internationalPercent}
                />

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            BEHAVIOR ANALYSIS
        ================================================= */}

        <section
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <SectionTitle
            icon={<Activity size={20} />}
            title="Customer Behavior Analysis"
            subtitle="Calculated from your actual usage dataset."
          />


          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-6
            "
          >

            <MetricCard
              icon={<PhoneCall size={18} />}
              title="Total Calls"
              value={number(totalCalls, 0)}
            />

            <MetricCard
              icon={<TrendingUp size={18} />}
              title="Calls Per Day"
              value={number(callsPerDay)}
            />

            <MetricCard
              icon={<Clock3 size={18} />}
              title="Avg Minutes / Call"
              value={`${number(avgMinutesPerCall)} min`}
            />

            <MetricCard
              icon={<Activity size={18} />}
              title="Dominant Period"
              value={dominantPeriod}
            />

            <MetricCard
              icon={<BarChart3 size={18} />}
              title="Peak Period Share"
              value={`${number(peakPeriodShare * 100)}%`}
            />

            <MetricCard
              icon={<TrendingUp size={18} />}
              title="Usage Variation"
              value={number(usageVariation)}
            />

          </div>

        </section>


        {/* =================================================
            CALL ACTIVITY
        ================================================= */}

        <section
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <SectionTitle
            icon={<Phone size={20} />}
            title="Call Activity"
            subtitle="Actual call activity from the dataset."
          />


          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-6
            "
          >

            <MetricCard
              icon={<Sun size={18} />}
              title="Day Calls"
              value={number(dayCalls, 0)}
            />

            <MetricCard
              icon={<Sunset size={18} />}
              title="Evening Calls"
              value={number(eveningCalls, 0)}
            />

            <MetricCard
              icon={<Moon size={18} />}
              title="Night Calls"
              value={number(nightCalls, 0)}
            />

            <MetricCard
              icon={<Globe2 size={18} />}
              title="International Calls"
              value={number(internationalCalls, 0)}
            />

            <MetricCard
              icon={<Voicemail size={18} />}
              title="Voicemail"
              value={number(voicemailMessages, 0)}
            />

            <MetricCard
              icon={<Headphones size={18} />}
              title="Customer Service"
              value={number(customerServiceCalls, 0)}
            />

          </div>

        </section>


        {/* =================================================
            CUSTOMER CHARGES
        ================================================= */}

        <section
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <SectionTitle
            icon={<CircleDollarSign size={20} />}
            title="Customer Charges"
            subtitle="Actual charges from the customer dataset."
          />


          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-6
            "
          >

            <MetricCard
              icon={<Sun size={18} />}
              title="Day Charge"
              value={money(dayCharge)}
            />

            <MetricCard
              icon={<Sunset size={18} />}
              title="Evening Charge"
              value={money(eveningCharge)}
            />

            <MetricCard
              icon={<Moon size={18} />}
              title="Night Charge"
              value={money(nightCharge)}
            />

            <MetricCard
              icon={<Globe2 size={18} />}
              title="International Charge"
              value={money(internationalCharge)}
            />

            <MetricCard
              icon={<CircleDollarSign size={18} />}
              title="Total Charge"
              value={money(totalCharge)}
              highlight
            />

            <MetricCard
              icon={<TrendingUp size={18} />}
              title="Charge / Minute"
              value={money(chargePerMinute)}
            />

          </div>

        </section>


        {/* =================================================
            RECOMMENDATION SUMMARY
        ================================================= */}

        {recommendations.length > 0 && (

          <section
            className="
              rounded-3xl
              border
              border-violet-200
              bg-gradient-to-br
              from-violet-50
              via-white
              to-purple-50
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-violet-100
                  text-violet-600
                "
              >
                <BarChart3 size={20} />
              </div>

              <div>

                <h2
                  className="
                    font-black
                    text-slate-900
                  "
                >
                  Recommendation Insight
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Your plans are ranked using your actual usage behavior.
                </p>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>

  );

}


// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
  valueClass = "text-slate-900",
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-lg
      "
    >

      <div>

        <p
          className="
            text-xs
            font-semibold
            text-slate-400
          "
        >
          {title}
        </p>

        <p
          className={`
            mt-3
            text-2xl
            font-black
            ${valueClass}
          `}
        >
          {value}
        </p>

      </div>


      <div
        className={`
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          ${iconClass}
        `}
      >

        {icon}

      </div>

    </div>

  );

}


// =========================================================
// USAGE BAR
// =========================================================

function UsageBar({
  icon,
  iconClass,
  label,
  value,
  max,
  progressClass,
}) {

  const width =
    max > 0
      ? Math.min((value / max) * 100, 100)
      : 0;


  return (

    <div className="mb-6">

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
        "
      >

        <div className="flex items-center gap-3">

          <div
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              ${iconClass}
            `}
          >

            {icon}

          </div>

          <span
            className="
              text-sm
              font-semibold
              text-slate-600
            "
          >
            {label}
          </span>

        </div>


        <span
          className="
            text-sm
            font-black
            text-slate-900
          "
        >
          {Number(value).toFixed(2)} mins
        </span>

      </div>


      <div
        className="
          h-3
          overflow-hidden
          rounded-full
          bg-slate-100
        "
      >

        <div
          className={`
            h-full
            rounded-full
            transition-all
            duration-700
            ${progressClass}
          `}
          style={{
            width: `${width}%`,
          }}
        />

      </div>

    </div>

  );

}


// =========================================================
// DISTRIBUTION ROW
// =========================================================

function DistributionRow({
  color,
  label,
  value,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
      "
    >

      <div className="flex items-center gap-3">

        <span
          className={`
            h-3
            w-3
            rounded-full
            ${color}
          `}
        />

        <span
          className="
            text-sm
            font-medium
            text-slate-600
          "
        >
          {label}
        </span>

      </div>


      <span
        className="
          text-sm
          font-black
          text-slate-900
        "
      >
        {Number(value).toFixed(1)}%
      </span>

    </div>

  );

}


// =========================================================
// SECTION TITLE
// =========================================================

function SectionTitle({
  icon,
  title,
  subtitle,
}) {

  return (

    <div className="flex items-start gap-3">

      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-violet-100
          text-violet-600
        "
      >

        {icon}

      </div>


      <div>

        <h2
          className="
            text-xl
            font-black
            text-slate-900
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-400
          "
        >
          {subtitle}
        </p>

      </div>

    </div>

  );

}


// =========================================================
// METRIC CARD
// =========================================================

function MetricCard({
  icon,
  title,
  value,
  highlight = false,
}) {

  return (

    <div
      className={`
        rounded-2xl
        border
        p-4
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-md

        ${
          highlight
            ? "border-violet-200 bg-violet-50"
            : "border-slate-200 bg-slate-50/70"
        }
      `}
    >

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-white
            text-violet-600
            shadow-sm
          "
        >

          {icon}

        </div>

        <span
          className="
            text-[11px]
            font-semibold
            text-slate-400
          "
        >
          {title}
        </span>

      </div>


      <p
        className={`
          mt-4
          text-lg
          font-black

          ${
            highlight
              ? "text-violet-700"
              : "text-slate-900"
          }
        `}
      >
        {value}
      </p>

    </div>

  );

}


export default CustomerAnalysis;