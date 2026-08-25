import { useState } from "react";

import {
  BrainCircuit,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  User,
  Shield,
  BarChart3,
  Target,
  UserPlus,
} from "lucide-react";

import { getCustomer } from "../services/api";

// =========================================================
// PERMANENT ADMIN LOGIN
// =========================================================
// Change these two values if you want different credentials.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

function Login({ onLogin }) {
  const [role, setRole] = useState("customer");

  const [phone, setPhone] = useState("");

  const [adminUsername, setAdminUsername] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // LOGIN SUBMIT
  // =========================================================
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    // =========================================
    // CUSTOMER LOGIN
    // =========================================
    if (role === "customer") {
      const cleanPhone = phone.trim().replace(/\s+/g, "");

      if (!cleanPhone) {
        setError("Please enter your phone number.");
        return;
      }

      console.log("Searching customer:", cleanPhone);

      try {
        setLoading(true);

        const customer = await getCustomer(cleanPhone);

        console.log("CUSTOMER FOUND FROM BACKEND:", customer);

        /*
          Login success.
          Send actual backend customer
          data to App.jsx.
        */
        onLogin(customer);
      } catch (error) {
        console.error("LOGIN ERROR:", error);

        if (error.message === "PHONE_NOT_FOUND") {
          setError("Phone number not found in the dataset.");
        } else {
          setError(
            "Unable to connect to the backend. Check the browser console."
          );
        }
      } finally {
        setLoading(false);
      }

      return;
    }

    // =========================================
    // ADMIN LOGIN
    // =========================================
    if (!adminUsername.trim()) {
      setError("Please enter admin username.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter admin password.");
      return;
    }

    // =========================================================
    // PERMANENT ADMIN LOGIN
    // =========================================================
    if (
      adminUsername.trim() === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {
      console.log("ADMIN LOGIN SUCCESS");

      onLogin({
        role: "admin",
        username: ADMIN_USERNAME,
      });
    } else {
      setError("Invalid admin username or password.");
    }
  }

  // =========================================================
  // CREATE NEW ACCOUNT
  // =========================================================
  function handleCreateAccount() {
    // Navigate to the registration page.
    window.location.href = "/register";
  }

  return (
    <div className="login-background min-h-screen lg:grid lg:grid-cols-2">

      {/* =====================================================
          LEFT SIDE - BRANDING
      ====================================================== */}
      <section className="login-brand hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="icon-box">
            <BrainCircuit size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold">
              TariffSmart
            </h1>

            <p className="text-xs text-purple-200">
              Smart Plans • Maximum Savings
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-xl">

          {/* BADGE */}
          <div className="premium-badge">
            <BrainCircuit size={13} />
            AI POWERED TELECOM ANALYTICS
          </div>

          {/* TITLE */}
          <h2 className="mt-7 text-5xl font-extrabold leading-tight">
            Your usage.

            <span className="block text-purple-300">
              Your best plan.
            </span>
          </h2>

          <p className="mt-6 text-sm leading-7 text-purple-100/70">
            Analyze actual customer usage and discover the most suitable
            tariff plans.
          </p>

          {/* FEATURES */}
          <div className="mt-10 space-y-5">

            <Feature
              icon={<BarChart3 size={20} />}
              title="Usage Intelligence"
              text="Analyze actual customer usage."
            />

            <Feature
              icon={<Target size={20} />}
              title="Top 3 Recommendations"
              text="Find suitable tariff plans."
            />

            <Feature
              icon={<ShieldCheck size={20} />}
              title="Dataset Verification"
              text="Only existing customers are analyzed."
            />

          </div>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-purple-200/50">
          TariffSmart • Customer Intelligence Platform
        </p>

      </section>

      {/* =====================================================
          RIGHT SIDE - LOGIN
      ====================================================== */}
      <section className="flex min-h-screen items-center justify-center p-5 sm:p-10">

        <div className="login-panel w-full max-w-md p-8">

          {/* HEADER */}
          <div className="mb-7">

            <div className="icon-box mb-5">
              <ShieldCheck size={23} />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue to TariffSmart.
            </p>

          </div>

          {/* =================================================
              ROLE SELECTION
          ================================================== */}
          <div className="mb-7 grid grid-cols-2 gap-3">

            {/* CUSTOMER */}
            <button
              type="button"
              onClick={() => {
                setRole("customer");
                setError("");
              }}
              className={`role-button ${
                role === "customer" ? "role-active" : ""
              }`}
            >
              <User size={18} />

              <span>
                <strong>
                  Customer
                </strong>

                <small>
                  No password required
                </small>
              </span>
            </button>

            {/* ADMIN */}
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setError("");
              }}
              className={`role-button ${
                role === "admin" ? "role-active" : ""
              }`}
            >
              <Shield size={18} />

              <span>
                <strong>
                  Admin
                </strong>

                <small>
                  Password required
                </small>
              </span>
            </button>

          </div>

          {/* =================================================
              LOGIN FORM
          ================================================== */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================================
                CUSTOMER LOGIN
            ================================================== */}
            {role === "customer" && (
              <div>

                <label className="form-label">
                  Customer Phone Number
                </label>

                <div className="tariff-input flex h-13 items-center">

                  <Phone
                    size={18}
                    className="mr-3 text-slate-400"
                  />

                  <input
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      setError("");
                    }}
                    type="text"
                    placeholder="Enter phone number"
                    className="w-full bg-transparent text-sm outline-none"
                  />

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Enter a phone number available in the customer dataset.
                </p>

              </div>
            )}

            {/* =================================================
                ADMIN LOGIN
            ================================================== */}
            {role === "admin" && (
              <>
                {/* ADMIN USERNAME */}
                <div>

                  <label className="form-label">
                    Admin Username
                  </label>

                  <div className="tariff-input flex h-13 items-center">

                    <User
                      size={18}
                      className="mr-3 text-slate-400"
                    />

                    <input
                      value={adminUsername}
                      onChange={(event) =>
                        setAdminUsername(event.target.value)
                      }
                      type="text"
                      placeholder="Enter admin username"
                      className="w-full bg-transparent text-sm outline-none"
                    />

                  </div>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Permanent admin username configured for this application.
                  </p>

                </div>

                {/* ADMIN PASSWORD */}
                <div>

                  <label className="form-label">
                    Admin Password
                  </label>

                  <div className="tariff-input flex h-13 items-center">

                    <Lock
                      size={18}
                      className="mr-3 text-slate-400"
                    />

                    <input
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter password"
                      className="w-full bg-transparent text-sm outline-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Use the permanent admin password configured for this
                    application.
                  </p>

                </div>
              </>
            )}

            {/* =================================================
                ERROR MESSAGE
            ================================================== */}
            {error && (
              <div className="notification notification-error">
                ⚠️ {error}
              </div>
            )}

            {/* =================================================
                ANALYZE / ADMIN LOGIN BUTTON
            ================================================== */}
            <button
              type="submit"
              disabled={loading}
              className="tariff-button w-full"
            >
              {loading
                ? "Finding Customer..."
                : role === "customer"
                ? "Analyze My Usage"
                : "Admin Sign In"}

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>

          </form>

          {/* =================================================
              CREATE NEW ACCOUNT
              ONLY SHOWN FOR CUSTOMER
          ================================================== */}
          {role === "customer" && (
            <div className="create-account-box">

              <p className="create-account-text">
                Don't have an account?
              </p>

              <button
                type="button"
                onClick={handleCreateAccount}
                className="create-account-link"
              >
                <UserPlus size={16} />
                <span>
                  Create new account
                </span>
              </button>

            </div>
          )}

          {/* =================================================
              SECURE DATASET ACCESS
          ================================================== */}
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">

            <div className="flex gap-3">

              <ShieldCheck
                size={19}
                className="shrink-0 text-emerald-500"
              />

              <div>

                <p className="text-xs font-bold">
                  Secure Dataset Access
                </p>

                <p className="mt-1 text-[10px] leading-5 text-slate-400">
                  Customer information is retrieved directly from your
                  backend dataset.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

// =========================================================
// FEATURE COMPONENT
// =========================================================
function Feature({
  icon,
  title,
  text,
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </div>

      <div>

        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-xs text-purple-200/60">
          {text}
        </p>

      </div>

    </div>
  );
}

export default Login;