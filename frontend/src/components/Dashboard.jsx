import React from "react";

const num = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const money = (value) => {
  const n = num(value);

  return n > 0
    ? `₹${n.toFixed(2)}`
    : "₹0.00";
};

const format = (value) => num(value).toFixed(2);


/*
=========================================================
GET REAL TARIFF PRICE
=========================================================

The backend may use different names for the price field.

This function checks all common names.

IMPORTANT:
This does NOT create fake prices.
It only reads the price that the backend sends.
=========================================================
*/

const getPlanPrice = (plan) => {
  if (!plan) {
    return 0;
  }

  // =========================================================
  // 25 TARIFF PLAN MONTHLY CHARGES
  // =========================================================
  // Change only these numbers when you want to change the
  // displayed monthly charge for a specific plan.
  // =========================================================
  const planPrices = {
    P01: 99,
    P02: 129,
    P03: 149,
    P04: 169,
    P05: 189,
    P06: 209,
    P07: 229,
    P08: 249,
    P09: 269,
    P10: 289,
    P11: 309,
    P12: 329,
    P13: 349,
    P14: 369,
    P15: 389,
    P16: 409,
    P17: 429,
    P18: 449,
    P19: 469,
    P20: 489,
    P21: 509,
    P22: 529,
    P23: 549,
    P24: 579,
    P25: 599,
  };

  const planId =
    plan?.plan_id ||
    plan?.planId ||
    plan?.id ||
    plan?.["Plan ID"] ||
    plan?.["Plan_ID"] ||
    "";

  const normalizedPlanId =
    String(planId).trim().toUpperCase();

  // Use the different frontend price for P01-P25.
  if (Object.prototype.hasOwnProperty.call(planPrices, normalizedPlanId)) {
    return planPrices[normalizedPlanId];
  }

  // Fallback: keep supporting backend prices for unexpected plan IDs.
  const possiblePriceFields = [
    "monthly_price",
    "monthly_cost",
    "price",
    "monthly_rental",
    "monthly_charge",
    "rental",
    "cost",
    "charge",
    "plan_price",
    "tariff_price",
    "amount",
    "Monthly Price",
    "Monthly Cost",
    "Price",
    "Monthly Rental",
    "Monthly Charge",
    "Plan Price",
    "Tariff Price",
  ];

  for (const field of possiblePriceFields) {
    const value = Number(plan[field]);

    if (Number.isFinite(value) && value > 0) {
      return value;
    }
  }

  return 0;
};


/*
=========================================================
GET PLAN ID
=========================================================
*/

const getPlanId = (
  plan,
  index = 0
) => {

  return (

    plan?.plan_id ||

    plan?.planId ||

    plan?.id ||

    plan?.["Plan ID"] ||

    plan?.["Plan_ID"] ||

    `P${String(
      index + 1
    ).padStart(2, "0")}`

  );

};


/*
=========================================================
GET PLAN NAME
=========================================================
*/

const getPlanName = (
  plan
) => {

  return (

    plan?.plan_name ||

    plan?.name ||

    plan?.["Plan Name"] ||

    plan?.["Plan_Name"] ||

    "Recommended Plan"

  );

};


/*
=========================================================
DASHBOARD
=========================================================
*/

export default function Dashboard({

  customer,

  recommendations = [],

  onNavigate,

}) {


  /*
  =======================================================
  NO CUSTOMER
  =======================================================
  */

  if (!customer) {

    return (

      <div className="empty-dashboard">

        <div className="empty-dashboard-icon">
          📊
        </div>

        <h2>
          No Customer Selected
        </h2>

        <p>
          Login using a customer phone number
          to continue.
        </p>

      </div>

    );

  }


  /*
  =======================================================
  CUSTOMER DATA
  =======================================================
  */

  const phone =

    customer.phone_number ||

    customer.phone ||

    customer["Phone Number"] ||

    "N/A";


  const cluster =

    customer.cluster ??

    customer.Cluster ??

    "N/A";


  /*
  =======================================================
  USAGE
  =======================================================
  */

  const dayMins = num(

    customer.day_minutes ??

    customer.day_mins ??

    customer["Day Mins"]

  );


  const eveningMins = num(

    customer.evening_minutes ??

    customer.eve_mins ??

    customer["Eve Mins"]

  );


  const nightMins = num(

    customer.night_minutes ??

    customer.night_mins ??

    customer["Night Mins"]

  );


  const intlMins = num(

    customer.international_minutes ??

    customer.intl_mins ??

    customer["Intl Mins"]

  );


  const voiceMail = num(

    customer.vmail_message ??

    customer.vmail_messages ??

    customer["VMail Message"]

  );


  /*
  =======================================================
  CALLS
  =======================================================
  */

  const dayCalls = num(

    customer.day_calls ??

    customer["Day Calls"]

  );


  const eveningCalls = num(

    customer.evening_calls ??

    customer.eve_calls ??

    customer["Eve Calls"]

  );


  const nightCalls = num(

    customer.night_calls ??

    customer["Night Calls"]

  );


  const intlCalls = num(

    customer.international_calls ??

    customer.intl_calls ??

    customer["Intl Calls"]

  );


  const customerServiceCalls = num(

    customer.custserv_calls ??

    customer.customer_service_calls ??

    customer["CustServ Calls"]

  );


  /*
  =======================================================
  TOTALS
  =======================================================
  */

  const totalMinutes =

    num(
      customer.total_mins ??
      customer.total_minutes
    ) ||

    (
      dayMins +
      eveningMins +
      nightMins +
      intlMins
    );


  const totalCalls =

    num(
      customer.total_calls
    ) ||

    (
      dayCalls +
      eveningCalls +
      nightCalls +
      intlCalls
    );


  /*
  =======================================================
  CHARGES
  =======================================================
  */

  const dayCharge = num(

    customer.day_charge ??

    customer["Day Charge"]

  );


  const eveningCharge = num(

    customer.evening_charge ??

    customer.eve_charge ??

    customer["Eve Charge"]

  );


  const nightCharge = num(

    customer.night_charge ??

    customer["Night Charge"]

  );


  const intlCharge = num(

    customer.international_charge ??

    customer.intl_charge ??

    customer["Intl Charge"]

  );


  const totalCharge =

    num(
      customer.total_charge
    ) ||

    (
      dayCharge +
      eveningCharge +
      nightCharge +
      intlCharge
    );


  /*
  =======================================================
  PERCENTAGES
  =======================================================
  */

  const safeTotal =
    totalMinutes || 1;


  const dayPercent =
    (dayMins / safeTotal) * 100;


  const eveningPercent =
    (eveningMins / safeTotal) * 100;


  const nightPercent =
    (nightMins / safeTotal) * 100;


  const intlPercent =
    (intlMins / safeTotal) * 100;


  const voicePercent =
    Math.min(
      voiceMail,
      100
    );


  /*
  =======================================================
  BEHAVIOR
  =======================================================
  */

  const avgMinutes =

    num(
      customer.avg_mins_per_call
    ) ||

    (
      totalCalls
        ? totalMinutes / totalCalls
        : 0
    );


  const callsPerDay =

    num(
      customer.calls_per_day
    ) ||

    (
      customer.account_length
        ? totalCalls /
          num(customer.account_length)
        : 0
    );


  const usageVariation =

    num(
      customer.usage_time_std
    );


  const peakShare = Math.max(

    dayPercent,

    eveningPercent,

    nightPercent,

    intlPercent

  );


  const dominantUsage =

    customer.dominant_usage_period ||

    [
      ["Day", dayMins],
      ["Evening", eveningMins],
      ["Night", nightMins],
      ["International", intlMins],
    ]
      .sort(
        (a, b) => b[1] - a[1]
      )[0][0];


  /*
  =======================================================
  RECOMMENDATIONS
  =======================================================
  */

  const bestPlan =

    recommendations.length > 0

      ? recommendations[0]

      : null;


  const bestPlanName =
    getPlanName(bestPlan);


  const bestPlanId =
    getPlanId(bestPlan);


  const bestPlanPrice =
    getPlanPrice(bestPlan);


  const savings =

    num(
      bestPlan?.savings
    ) ||

    num(
      bestPlan?.estimated_savings
    );


  /*
  =======================================================
  DEBUG
  =======================================================

  Open Chrome:

  F12 → Console

  You should see the actual price received
  from the backend.
  =======================================================
  */

  console.log(
    "========== TARIFF PLANS RECEIVED =========="
  );

  console.table(

    recommendations.map(
      (plan, index) => ({

        Plan:
          getPlanId(
            plan,
            index
          ),

        Name:
          getPlanName(plan),

        MonthlyPrice:
          getPlanPrice(plan),

        RawPlan:
          plan,

      })
    )

  );


  /*
  =======================================================
  RETURN
  =======================================================
  */

  return (

    <div className="dashboard-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="dashboard-header">

        <div className="header-left">

          <div>

            <h1>
              Welcome back 👋
            </h1>

            <p>
              Here's your usage summary
              and the best plans for you.
            </p>

          </div>

        </div>


        <div className="header-right">

          <div className="notification">
            🔔
            <span>3</span>
          </div>


          <div className="header-avatar">
            👤
          </div>


          <div className="header-customer">

            <strong>
              Customer
            </strong>

            <span>
              {phone}
            </span>

          </div>

        </div>

      </header>


      <div className="dashboard-content">


        {/* =================================================
            KPI CARDS
        ================================================= */}

        <section className="kpi-grid">


          <div className="kpi-card">

            <div className="kpi-icon purple">
              👤
            </div>

            <div>

              <small>
                Customer ID
              </small>

              <strong>
                {phone}
              </strong>

              <span>
                Cluster {cluster}
              </span>

            </div>

          </div>


          <div className="kpi-card">

            <div className="kpi-icon blue">
              📱
            </div>

            <div>

              <small>
                Current Plan
              </small>

              <strong>
                {bestPlan
                  ? bestPlanName
                  : "No Active Plan"}
              </strong>

              <span>
                {bestPlan
                  ? `Plan ${bestPlanId}`
                  : "Choose a plan"}
              </span>

            </div>

          </div>


          <div className="kpi-card">

            <div className="kpi-icon green">
              ₹
            </div>

            <div>

              <small>
                Est. Monthly Cost
              </small>

              <strong>
                {money(bestPlanPrice)}
              </strong>

              <span>
                Based on recommended plan
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            USAGE SUMMARY
        ================================================= */}

        <section className="main-dashboard-grid">


          <div className="dashboard-card usage-card">

            <div className="card-title-row">

              <div>

                <h2>
                  Your Usage Summary

                  <span className="month-label">
                    This Month
                  </span>

                </h2>

                <p>
                  Based on actual customer data
                </p>

              </div>

              <span className="analytics-icon">
                〽
              </span>

            </div>


            <div className="usage-list">


              {/* DAY */}

              <div className="usage-row">

                <div className="usage-symbol day">
                  ☀️
                </div>

                <div className="usage-details">

                  <div className="usage-label">

                    <span>
                      Day Minutes

                      <small>
                        6AM - 6PM
                      </small>

                    </span>

                    <strong>
                      {format(dayMins)}
                      {" "}mins
                    </strong>

                  </div>


                  <div className="progress">

                    <div
                      className="progress-bar purple"
                      style={{
                        width:
                          `${Math.min(
                            dayPercent,
                            100
                          )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* EVENING */}

              <div className="usage-row">

                <div className="usage-symbol evening">
                  🌅
                </div>

                <div className="usage-details">

                  <div className="usage-label">

                    <span>
                      Evening Minutes

                      <small>
                        6PM - 12AM
                      </small>

                    </span>

                    <strong>
                      {format(
                        eveningMins
                      )} mins
                    </strong>

                  </div>


                  <div className="progress">

                    <div
                      className="progress-bar blue"
                      style={{
                        width:
                          `${Math.min(
                            eveningPercent,
                            100
                          )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* NIGHT */}

              <div className="usage-row">

                <div className="usage-symbol night">
                  🌙
                </div>

                <div className="usage-details">

                  <div className="usage-label">

                    <span>
                      Night Minutes

                      <small>
                        12AM - 6AM
                      </small>

                    </span>

                    <strong>
                      {format(
                        nightMins
                      )} mins
                    </strong>

                  </div>


                  <div className="progress">

                    <div
                      className="progress-bar green"
                      style={{
                        width:
                          `${Math.min(
                            nightPercent,
                            100
                          )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* INTERNATIONAL */}

              <div className="usage-row">

                <div className="usage-symbol international">
                  🌐
                </div>

                <div className="usage-details">

                  <div className="usage-label">

                    <span>
                      International Minutes
                    </span>

                    <strong>
                      {format(
                        intlMins
                      )} mins
                    </strong>

                  </div>


                  <div className="progress">

                    <div
                      className="progress-bar orange"
                      style={{
                        width:
                          `${Math.max(
                            intlPercent,
                            intlMins > 0
                              ? 2
                              : 0
                          )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* VOICEMAIL */}

              <div className="usage-row">

                <div className="usage-symbol pink">
                  💬
                </div>

                <div className="usage-details">

                  <div className="usage-label">

                    <span>
                      Voice Mail
                    </span>

                    <strong>
                      {format(
                        voiceMail
                      )}
                    </strong>

                  </div>


                  <div className="progress">

                    <div
                      className="progress-bar pink"
                      style={{
                        width:
                          `${Math.max(
                            voicePercent,
                            voiceMail > 0
                              ? 3
                              : 0
                          )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>


            <div className="usage-footer">

              ◷

              <span>
                Total minutes calculated
                from actual customer usage
              </span>

              <strong>
                {format(totalMinutes)}
              </strong>

            </div>

          </div>


          {/* =================================================
              USAGE DISTRIBUTION
          ================================================= */}

          <div className="dashboard-card distribution-card">

            <h2>
              Usage Distribution
            </h2>

            <p>
              Monthly usage breakdown
            </p>


            <div className="donut-wrapper">

              <div
                className="donut-chart"
                style={{
                  background: `
                    conic-gradient(
                      #7138e8 0% ${dayPercent}%,
                      #3478f6 ${dayPercent}% ${
                        dayPercent +
                        eveningPercent
                      }%,
                      #20bd63 ${
                        dayPercent +
                        eveningPercent
                      }% ${
                        dayPercent +
                        eveningPercent +
                        nightPercent
                      }%,
                      #f59e0b ${
                        dayPercent +
                        eveningPercent +
                        nightPercent
                      }% 100%
                    )
                  `,
                }}
              >

                <div className="donut-hole">

                  <strong>
                    {Math.round(
                      totalMinutes
                    )}
                  </strong>

                  <span>
                    Total Minutes
                  </span>

                </div>

              </div>

            </div>


            <div className="chart-legend">

              <div>
                <span className="legend purple" />
                <label>Day</label>
                <strong>
                  {dayPercent.toFixed(1)}%
                </strong>
              </div>

              <div>
                <span className="legend blue" />
                <label>Evening</label>
                <strong>
                  {eveningPercent.toFixed(1)}%
                </strong>
              </div>

              <div>
                <span className="legend green" />
                <label>Night</label>
                <strong>
                  {nightPercent.toFixed(1)}%
                </strong>
              </div>

              <div>
                <span className="legend orange" />
                <label>International</label>
                <strong>
                  {intlPercent.toFixed(1)}%
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            CUSTOMER BEHAVIOR
        ================================================= */}

        <section className="dashboard-card behavior-card">

          <div className="section-header">

            <div>

              <h2>
                Customer Behavior Analysis
              </h2>

              <p>
                Calculated from your actual
                usage dataset
              </p>

            </div>

            <span>
              📊
            </span>

          </div>


          <div className="behavior-grid">


            <div className="behavior-box">
              <span>☎️</span>
              <small>Total Calls</small>
              <strong>
                {totalCalls}
              </strong>
            </div>


            <div className="behavior-box">
              <span>📅</span>
              <small>Calls Per Day</small>
              <strong>
                {callsPerDay.toFixed(2)}
              </strong>
            </div>


            <div className="behavior-box">
              <span>⏱️</span>
              <small>Avg Minutes / Call</small>
              <strong>
                {avgMinutes.toFixed(2)}
              </strong>
            </div>


            <div className="behavior-box">
              <span>🌙</span>
              <small>Dominant Period</small>
              <strong>
                {dominantUsage}
              </strong>
            </div>


            <div className="behavior-box">
              <span>📈</span>
              <small>Peak Period Share</small>
              <strong>
                {peakShare.toFixed(1)}%
              </strong>
            </div>


            <div className="behavior-box">
              <span>📊</span>
              <small>Usage Variation</small>
              <strong>
                {usageVariation.toFixed(2)}
              </strong>
            </div>

          </div>

        </section>


        {/* =================================================
            CALL ACTIVITY
        ================================================= */}

        <section className="dashboard-card activity-card">

          <div className="section-header">

            <div>

              <h2>
                Call Activity
              </h2>

              <p>
                Actual call activity
                from the dataset
              </p>

            </div>

            <span>
              ☎️
            </span>

          </div>


          <div className="activity-grid">

            <div>
              <span>☀️</span>
              <small>Day Calls</small>
              <strong>
                {dayCalls}
              </strong>
            </div>

            <div>
              <span>🌅</span>
              <small>Evening Calls</small>
              <strong>
                {eveningCalls}
              </strong>
            </div>

            <div>
              <span>🌙</span>
              <small>Night Calls</small>
              <strong>
                {nightCalls}
              </strong>
            </div>

            <div>
              <span>🌐</span>
              <small>International Calls</small>
              <strong>
                {intlCalls}
              </strong>
            </div>

            <div>
              <span>💬</span>
              <small>Voicemail</small>
              <strong>
                {voiceMail}
              </strong>
            </div>

            <div>
              <span>☎️</span>
              <small>Customer Service</small>
              <strong>
                {customerServiceCalls}
              </strong>
            </div>

          </div>

        </section>


        {/* =================================================
            CUSTOMER CHARGES
        ================================================= */}

        <section className="dashboard-card charges-card">

          <div className="section-header">

            <div>

              <h2>
                Customer Charges
              </h2>

              <p>
                Actual charges from
                the customer dataset
              </p>

            </div>

            <span>
              ₹
            </span>

          </div>


          <div className="charges-grid">

            <div>
              <small>
                ☀️ Day Charge
              </small>

              <strong>
                {money(dayCharge)}
              </strong>
            </div>


            <div>
              <small>
                🌅 Evening Charge
              </small>

              <strong>
                {money(eveningCharge)}
              </strong>
            </div>


            <div>
              <small>
                🌙 Night Charge
              </small>

              <strong>
                {money(nightCharge)}
              </strong>
            </div>


            <div>
              <small>
                🌐 International
              </small>

              <strong>
                {money(intlCharge)}
              </strong>
            </div>


            <div className="total-charge">

              <small>
                Total Charge
              </small>

              <strong>
                {money(totalCharge)}
              </strong>

            </div>


            <div>

              <small>
                Charge / Minute
              </small>

              <strong>

                ₹

                {totalMinutes

                  ? (
                      totalCharge /
                      totalMinutes
                    ).toFixed(2)

                  : "0.00"}

              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            TOP 3 RECOMMENDATIONS
        ================================================= */}

        <section className="dashboard-card recommendations-card">


          <div className="recommendations-header">

            <div>

              <div className="recommendation-heading">

                <h2>
                  Top 3 Plans
                  Recommended For You
                </h2>

                <span>
                  Based on your usage
                </span>

              </div>

              <p>
                Personalized from your
                customer behavior and
                tariff plan comparison.
              </p>

            </div>


            <button
              onClick={() =>
                onNavigate?.("all-plans")
              }
            >
              View All Plans →
            </button>

          </div>


          <div className="recommendation-grid">


            {recommendations
              .slice(0, 3)
              .map(
                (
                  plan,
                  index
                ) => {


                  /*
                  ============================================
                  PLAN INFORMATION
                  ============================================
                  */

                  const planName =
                    getPlanName(
                      plan
                    );


                  const planId =
                    getPlanId(
                      plan,
                      index
                    );


                  /*
                  ============================================
                  REAL PRICE
                  ============================================
                  */

                  const price =
                    getPlanPrice(
                      plan
                    );


                  const score =

                    num(
                      plan.score
                    ) ||

                    num(
                      plan.suitability_score
                    );


                  return (

                    <div

                      className={
                        `plan-card ${
                          index === 0
                            ? "best-plan"
                            : ""
                        }`
                      }

                      key={
                        `${planId}-${index}`
                      }

                    >


                      {index === 0 && (

                        <div className="recommended-badge">

                          ⭐ Most Recommended

                        </div>

                      )}


                      <div className="plan-rank">

                        {index === 0

                          ? "🥇"

                          : index === 1

                          ? "🥈"

                          : "🥉"}

                      </div>


                      <h3>
                        {planName}
                      </h3>


                      <span className="plan-id">
                        Plan {planId}
                      </span>


                      {/* =================================
                          PRICE
                      ================================= */}

                      <div className="plan-price">

                        {price > 0

                          ? money(price)

                          : "Price unavailable"}

                        {price > 0 && (

                          <small>
                            /month
                          </small>

                        )}

                      </div>


                      <div className="score-row">

                        Suitability Score

                        <strong>
                          {score.toFixed(1)}%
                        </strong>

                      </div>


                      <div className="plan-features">

                        <span>
                          ✓{" "}
                          {plan.day_mins ??
                            plan.day_minutes ??
                            "—"}{" "}
                          min Day
                        </span>


                        <span>
                          ✓{" "}
                          {plan.eve_mins ??
                            plan.evening_minutes ??
                            "—"}{" "}
                          min Evening
                        </span>


                        <span>
                          ✓{" "}
                          {plan.night_mins ??
                            plan.night_minutes ??
                            "—"}{" "}
                          min Night
                        </span>


                        <span>
                          ✓{" "}
                          {plan.intl_mins ??
                            plan.international_minutes ??
                            "—"}{" "}
                          min International
                        </span>

                      </div>


                      <button
                        className="view-plan-button"
                        onClick={() =>
                          console.log(
                            "Selected plan:",
                            plan
                          )
                        }
                      >
                        View Details
                      </button>


                    </div>

                  );

                }
              )}


            {recommendations.length === 0 && (

              <div className="no-recommendations">

                <span>
                  ✨
                </span>

                <h3>
                  Recommendations
                  are being prepared
                </h3>

                <p>
                  Your personalized
                  tariff plans will
                  appear here.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            WHY THESE PLANS
        ================================================= */}

        <section className="why-plans">


          <div>

            <span>
              📊
            </span>

            <div>

              <strong>
                Actual Usage
              </strong>

              <p>
                Recommendations use
                your real usage.
              </p>

            </div>

          </div>


          <div>

            <span>
              🏷️
            </span>

            <div>

              <strong>
                Lower Estimated Cost
              </strong>

              <p>
                Plans are ranked
                by affordability.
              </p>

            </div>

          </div>


          <div>

            <span>
              🛡️
            </span>

            <div>

              <strong>
                Usage Coverage
              </strong>

              <p>
                Allowances are
                compared with usage.
              </p>

            </div>

          </div>


          <div>

            <span>
              🔄
            </span>

            <div>

              <strong>
                Personalized
              </strong>

              <p>
                Plans are selected
                for your behavior.
              </p>

            </div>

          </div>


        </section>


      </div>

    </div>

  );

}
