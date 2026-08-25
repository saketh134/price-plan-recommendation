import { useState } from "react";

import {
  BrainCircuit,
  Phone,
  ArrowRight,
  ShieldCheck,
  User,
  ArrowLeft,
} from "lucide-react";

import { getCustomer } from "../services/api";

import "./Register.css";

function Register({ onLogin }) {
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  function handleChange(event) {
    setPhone(event.target.value);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const cleanPhone = phone
      .trim()
      .replace(/\s+/g, "");

    if (!cleanPhone) {
      setError("Please enter your phone number.");
      return;
    }

    if (cleanPhone.length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Use the same customer API used by Login.jsx.
       *
       * This retrieves the customer's existing usage
       * information from the backend dataset.
       */
      const customer = await getCustomer(cleanPhone);

      console.log(
        "CUSTOMER FOUND:",
        customer
      );

      /*
       * Send the customer to the existing
       * App.jsx login/dashboard flow.
       *
       * This means the normal customer dashboard
       * will open after submitting the phone number.
       */
      onLogin(customer);

    } catch (error) {
      console.error(
        "CUSTOMER LOOKUP ERROR:",
        error
      );

      if (
        error.message === "PHONE_NOT_FOUND"
      ) {
        setError(
          "Phone number not found in the customer dataset. Please enter a registered customer number."
        );
      } else {
        setError(
          "Unable to connect to the backend. Please make sure the backend is running."
        );
      }

    } finally {
      setLoading(false);
    }
  }

  function goBackToLogin() {
    window.location.href = "/";
  }

  return (
    <div className="register-background">

      {/* =====================================================
          LEFT BRANDING
      ====================================================== */}

      <section className="register-brand">

        <div className="register-brand-content">

          {/* LOGO */}

          <div className="register-logo">

            <div className="register-logo-icon">
              <BrainCircuit size={25} />
            </div>

            <div>
              <h1>
                TariffSmart
              </h1>

              <p>
                Smart Plans • Maximum Savings
              </p>
            </div>

          </div>

          {/* HERO */}

          <div className="register-hero">

            <div className="register-badge">

              <BrainCircuit size={14} />

              AI POWERED TELECOM ANALYTICS

            </div>

            <h2>
              Enter your phone.
              <span>
                Discover your best plan.
              </span>
            </h2>

            <p>
              Enter your customer phone number
              to analyze your telecom usage and
              discover suitable tariff plans.
            </p>

            {/* FEATURES */}

            <div className="register-features">

              <Feature
                icon={<Phone size={20} />}
                title="Phone-Based Access"
                text="No password is required for customer access."
              />

              <Feature
                icon={<User size={20} />}
                title="Usage Intelligence"
                text="Analyze your actual telecom usage."
              />

              <Feature
                icon={<ShieldCheck size={20} />}
                title="Personalized Plans"
                text="Get your Top 3 suitable tariff plans."
              />

            </div>

          </div>

          {/* FOOTER */}

          <p className="register-footer">
            TariffSmart • Customer Intelligence Platform
          </p>

        </div>

      </section>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

      <section className="register-form-section">

        <div className="register-card">

          {/* BACK TO LOGIN */}

          <button
            type="button"
            className="back-login-button"
            onClick={goBackToLogin}
          >
            <ArrowLeft size={16} />

            Back to Login
          </button>

          {/* HEADER */}

          <div className="register-card-header">

            <div className="register-card-icon">
              <Phone size={24} />
            </div>

            <h2>
              Customer Access
            </h2>

            <p>
              Enter your phone number to continue
              to your personalized dashboard.
            </p>

          </div>

          {/* FORM */}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* PHONE NUMBER ONLY */}

            <div className="register-field">

              <label htmlFor="phone">
                Customer Phone Number
              </label>

              <div className="register-input-wrapper">

                <Phone
                  size={18}
                  className="register-input-icon"
                />

                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  disabled={loading}
                />

              </div>

              <small>
                Enter a phone number available in
                the customer dataset.
              </small>

            </div>

            {/* ERROR */}

            {error && (
              <div className="register-message register-error">
                ⚠️ {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit-button"
              disabled={loading}
            >

              {loading
                ? "Analyzing Usage..."
                : "Continue to My Dashboard"}

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>

          {/* INFORMATION */}

          <div className="register-info-box">

            <ShieldCheck size={20} />

            <div>

              <strong>
                Secure Customer Access
              </strong>

              <p>
                Your customer information is
                retrieved directly from the backend
                dataset.
              </p>

            </div>

          </div>

          {/* LOGIN */}

          <div className="login-existing-account">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={goBackToLogin}
            >
              Sign in
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   FEATURE COMPONENT
========================================================= */

function Feature({
  icon,
  title,
  text,
}) {
  return (
    <div className="register-feature">

      <div className="register-feature-icon">
        {icon}
      </div>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}

export default Register;