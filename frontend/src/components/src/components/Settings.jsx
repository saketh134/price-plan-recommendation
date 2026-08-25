import React, { useState } from "react";

export default function Settings({
  darkMode = false,
  setDarkMode,
  onBack,
}) {
  const [recommendations, setRecommendations] = useState(true);
  const [usageAlerts, setUsageAlerts] = useState(true);
  const [savingTips, setSavingTips] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-violet-600">
            TARIFFSMART
          </p>

          <h1 className="text-3xl font-black text-slate-900">
            Settings
          </h1>

          <p className="text-sm text-slate-500">
            Manage your application preferences.
          </p>
        </div>

        <button
          onClick={onBack}
          className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">
            Appearance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose your preferred mode.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              onClick={() => setDarkMode?.(false)}
              className={`rounded-2xl border p-5 text-left ${
                !darkMode
                  ? "border-violet-500 bg-violet-50"
                  : "border-slate-200"
              }`}
            >
              <div className="text-3xl">☀️</div>

              <p className="mt-3 font-black">
                Bright Mode
              </p>

              <p className="text-xs text-slate-500">
                Use the light appearance.
              </p>
            </button>

            <button
              onClick={() => setDarkMode?.(true)}
              className={`rounded-2xl border p-5 text-left ${
                darkMode
                  ? "border-violet-500 bg-violet-50"
                  : "border-slate-200"
              }`}
            >
              <div className="text-3xl">🌙</div>

              <p className="mt-3 font-black">
                Dark Mode
              </p>

              <p className="text-xs text-slate-500">
                Use the dark appearance.
              </p>
            </button>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">
            Notifications
          </h2>

          <SettingToggle
            title="Plan Recommendations"
            description="Receive updates about recommended plans."
            checked={recommendations}
            setChecked={setRecommendations}
          />

          <SettingToggle
            title="Usage Alerts"
            description="Get alerts when your usage changes."
            checked={usageAlerts}
            setChecked={setUsageAlerts}
          />

          <SettingToggle
            title="Saving Tips"
            description="Show suggestions to reduce monthly cost."
            checked={savingTips}
            setChecked={setSavingTips}
          />
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">
            Account
          </h2>

          <div className="mt-5 space-y-3">
            <button className="w-full rounded-xl border px-5 py-3 text-left font-bold">
              🔐 Change Password
            </button>

            <button className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-left font-bold text-red-600">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  setChecked,
}) {
  return (
    <div className="flex items-center justify-between border-b py-5">
      <div>
        <p className="font-bold">{title}</p>

        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="h-5 w-5 accent-violet-600"
      />
    </div>
  );
}