import {
  Bell,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  LogOut,
  Activity,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";

import CustomerSummary from "./CustomerSummary";
import UsageAnalysis from "./UsageAnalysis";
import RecommendationCard from "./RecommendationCard";
import Chatbot from "./Chatbot";

function CustomerDashboard({ phoneNumber, onLogout }) {
  return (
    <div className="customer-dashboard">

      {/* =========================================================
          TOP NAVBAR
      ========================================================= */}
      <header className="customer-top-navbar">

        {/* BRAND */}
        <div className="customer-navbar-brand">

          <div className="customer-brand-icon">
            <BrainCircuit size={24} />
          </div>

          <div>
            <h2>TariffSmart</h2>
            <span>Smart Plans • Maximum Savings</span>
          </div>

        </div>


        {/* =====================================================
            RIGHT SIDE OF HEADER
        ===================================================== */}
        <div className="customer-navbar-actions">

          {/* NOTIFICATION */}
          <button
            type="button"
            className="customer-icon-button"
            aria-label="Notifications"
          >
            <Bell size={19} />

            <span className="notification-dot">
              3
            </span>
          </button>


          {/* CUSTOMER PROFILE */}
          <div className="customer-profile">

            <div className="customer-avatar">
              <User size={19} />
            </div>

            <div className="customer-profile-text">
              <strong>Customer</strong>
              <span>{phoneNumber}</span>
            </div>

          </div>


          {/* LOGOUT */}
          <button
            type="button"
            className="customer-logout-button"
            onClick={onLogout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>

        </div>

      </header>


      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <main className="customer-dashboard-main">


        {/* =====================================================
            WELCOME HEADER
        ===================================================== */}
        <section className="customer-welcome">

          <div className="welcome-content">

            <div className="welcome-title-row">

              <h1>
                Welcome back <span>👋</span>
              </h1>


              {/* CUSTOMER ID BESIDE WELCOME */}
              <div className="welcome-customer-id">

                <div className="welcome-customer-icon">
                  <User size={17} />
                </div>

                <div>
                  <small>Customer ID</small>
                  <strong>{phoneNumber}</strong>
                </div>

              </div>

            </div>


            <p>
              Here's your usage summary and the best tariff
              plans recommended specifically for you.
            </p>

          </div>


          {/* AI ANALYSIS STATUS */}
          <div className="ai-status-card">

            <div className="ai-status-icon">
              <Sparkles size={17} />
            </div>

            <div>
              <strong>AI Analysis Complete</strong>

              <span>
                Personalized using your actual usage
              </span>
            </div>

            <div className="ai-status-check">
              <ShieldCheck size={18} />
            </div>

          </div>

        </section>


        {/* =====================================================
            QUICK KPI CARDS
        ===================================================== */}
        <section className="customer-kpi-grid">


          {/* CUSTOMER */}
          <div className="customer-kpi-card">

            <div className="kpi-icon purple">
              <User size={21} />
            </div>

            <div>
              <span>Customer ID</span>

              <strong>
                {phoneNumber}
              </strong>

              <small>
                Verified customer
              </small>
            </div>

          </div>


          {/* USAGE */}
          <div className="customer-kpi-card">

            <div className="kpi-icon blue">
              <Activity size={21} />
            </div>

            <div>
              <span>Usage Analysis</span>

              <strong>
                Active
              </strong>

              <small>
                Based on actual usage
              </small>
            </div>

          </div>


          {/* RECOMMENDATION */}
          <div className="customer-kpi-card">

            <div className="kpi-icon green">
              <TrendingUp size={21} />
            </div>

            <div>
              <span>Recommendation</span>

              <strong>
                Personalized
              </strong>

              <small>
                AI-powered recommendation
              </small>
            </div>

          </div>


          {/* DATASET */}
          <div className="customer-kpi-card">

            <div className="kpi-icon orange">
              <ShieldCheck size={21} />
            </div>

            <div>
              <span>Dataset Status</span>

              <strong>
                Connected
              </strong>

              <small>
                Verified backend data
              </small>
            </div>

          </div>

        </section>


        {/* =====================================================
            USAGE INTELLIGENCE
        ===================================================== */}
        <section className="dashboard-section">

          <div className="section-heading">

            <div className="section-heading-icon">
              <Activity size={21} />
            </div>

            <div>

              <h2>
                Usage Intelligence
              </h2>

              <p>
                Your telecom usage analyzed from actual
                customer data.
              </p>

            </div>

          </div>


          <div className="dashboard-component-wrapper">

            <UsageAnalysis
              phoneNumber={phoneNumber}
            />

          </div>

        </section>


        {/* =====================================================
            PERSONALIZED RECOMMENDATION
        ===================================================== */}
        <section className="recommendation-highlight">

          <div className="recommendation-header">


            {/* TITLE */}
            <div className="recommendation-title">

              <div className="recommendation-icon">
                <Sparkles size={22} />
              </div>


              <div>

                <div className="recommendation-label">
                  AI POWERED
                </div>

                <h2>
                  Your Personalized Recommendations
                </h2>

                <p>
                  Plans ranked according to your
                  communication behavior, usage pattern
                  and estimated value.
                </p>

              </div>

            </div>


            {/* CONFIDENCE */}
            <div className="recommendation-confidence">

              <ShieldCheck size={17} />

              <span>
                Data-driven recommendation
              </span>

            </div>

          </div>


          <div className="recommendation-content">

            <RecommendationCard
              phoneNumber={phoneNumber}
            />

          </div>

        </section>


        {/* =====================================================
            CUSTOMER INTELLIGENCE
        ===================================================== */}
        <section className="dashboard-section">

          <div className="section-heading">

            <div className="section-heading-icon">
              <BrainCircuit size={21} />
            </div>


            <div>

              <h2>
                Customer Intelligence
              </h2>

              <p>
                Key information calculated from your
                telecom usage.
              </p>

            </div>

          </div>


          <div className="dashboard-component-wrapper">

            <CustomerSummary
              phoneNumber={phoneNumber}
            />

          </div>

        </section>


        {/* =====================================================
            SMART RECOMMENDATION ACTION
        ===================================================== */}
        <section className="next-action-card">

          <div className="next-action-left">

            <div className="next-action-icon">
              <Sparkles size={22} />
            </div>


            <div>

              <span className="next-action-label">
                SMART RECOMMENDATION
              </span>

              <h2>
                Find the plan that fits your usage
              </h2>

              <p>
                Compare your recommended plans and choose
                the option that provides the best balance
                of cost and coverage.
              </p>

            </div>

          </div>


          <button
            type="button"
            className="next-action-button"
            onClick={() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              });
            }}
          >
            View Recommendations

            <ArrowRight size={17} />

          </button>

        </section>


        {/* =====================================================
            FOOTER
        ===================================================== */}
        <footer className="customer-dashboard-footer">

          <div>

            <strong>
              TariffSmart
            </strong>

            <span>
              AI-powered telecom intelligence platform
            </span>

          </div>


          <div className="footer-security">

            <ShieldCheck size={16} />

            <span>
              Your recommendations are generated from
              verified usage data
            </span>

          </div>

        </footer>


        {/* =====================================================
            CHATBOT
        ===================================================== */}
        <Chatbot />

      </main>

    </div>
  );
}

export default CustomerDashboard