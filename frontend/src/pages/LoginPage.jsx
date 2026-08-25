import { useState } from "react";
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  BarChart3,
  Target,
} from "lucide-react";

function LoginPage({ onLogin, loading, error }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phone.trim()) return;

    // Password is UI authentication.
    // Customer phone is checked by the backend.
    onLogin(phone.trim());
  };

  return (
    <div className="login-background min-h-screen lg:grid lg:grid-cols-2">

      {/* LEFT SIDE */}
      <section className="login-brand relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <BrainCircuit size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold">
              TariffSmart
            </h1>

            <p className="text-xs text-purple-200">
              Intelligent Telecom Analytics
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">

          <div className="premium-badge border-white/20 bg-white/10 text-purple-100">
            <BrainCircuit size={13} />
            AI POWERED ANALYTICS
          </div>

          <h2 className="mt-7 text-5xl font-extrabold leading-tight">
            Understand usage.
            <span className="block text-purple-300">
              Recommend smarter.
            </span>
          </h2>

          <p className="mt-6 text-sm leading-7 text-purple-100/70">
            Analyze customer usage behavior, identify
            behavioral segments and recommend the
            three most suitable tariff plans.
          </p>

          <div className="mt-10 space-y-5">

            <Feature
              icon={<BarChart3 size={20} />}
              title="Usage Intelligence"
              text="Analyze actual customer communication behavior."
            />

            <Feature
              icon={<BrainCircuit size={20} />}
              title="K-Means Segmentation"
              text="Identify customer behavior patterns."
            />

            <Feature
              icon={<Target size={20} />}
              title="Top 3 Recommendations"
              text="Rank suitable tariff plans."
            />

          </div>
        </div>

        <div className="relative z-10 text-xs text-purple-200/60">
          ● ML Recommendation Engine
        </div>
      </section>


      {/* RIGHT SIDE */}
      <section className="flex min-h-screen items-center justify-center p-5 sm:p-8">

        <div className="w-full max-w-md">

          {/* MOBILE LOGO */}
          <div className="mb-7 flex items-center justify-center gap-3 lg:hidden">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-white">
              <BrainCircuit size={22} />
            </div>

            <h1 className="text-2xl font-bold text-purple-700">
              TariffSmart
            </h1>

          </div>


          <div className="login-panel p-7 sm:p-9">

            <div className="mb-8">

              <div className="icon-box mb-5">
                <ShieldCheck size={24} />
              </div>

              <h2 className="text-3xl font-extrabold">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Enter a customer number to analyze
                actual usage.
              </p>

            </div>


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* PHONE */}
              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Customer Phone Number
                </label>

                <div className="tariff-input flex items-center">

                  <Phone
                    size={18}
                    className="mr-3 text-slate-400"
                  />

                  <input
                    type="text"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="w-full bg-transparent text-sm outline-none"
                  />

                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  The number will be checked against
                  your customer dataset.
                </p>

              </div>


              {/* PASSWORD */}
              <div>

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Password
                </label>

                <div className="tariff-input flex items-center">

                  <Lock
                    size={18}
                    className="mr-3 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter password"
                    className="w-full bg-transparent text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="text-slate-400 hover:text-purple-600"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* ERROR */}
              {error && (
                <div className="notification notification-error">
                  ⚠️ {error}
                </div>
              )}


              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading || !phone.trim()}
                className="tariff-button w-full"
              >

                {loading
                  ? "Analyzing Customer..."
                  : "Analyze Customer"}

                {!loading && (
                  <ArrowRight size={18} />
                )}

              </button>

            </form>


            {/* INFORMATION */}
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">

              <div className="flex gap-3">

                <ShieldCheck
                  size={19}
                  className="shrink-0 text-emerald-500"
                />

                <div>

                  <p className="text-xs font-bold">
                    Dataset Verification
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-slate-400">
                    Customer information is retrieved
                    from the FastAPI backend and your
                    actual dataset.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}


/* FEATURE COMPONENT */

function Feature({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold">
          {title}
        </h3>

        <p className="mt-1 text-xs text-purple-100/60">
          {text}
        </p>
      </div>

    </div>
  );
}

export default LoginPage;