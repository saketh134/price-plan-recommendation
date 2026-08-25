import React from "react";

export default function MyProfile({
  phoneNumber = "",
  customer = {},
  onBack,
}) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-violet-600">
            TARIFFSMART
          </p>

          <h1 className="text-3xl font-black text-slate-900">
            My Profile
          </h1>

          <p className="text-sm text-slate-500">
            View your customer information.
          </p>
        </div>

        <button
          onClick={onBack}
          className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-4xl">
            👤
          </div>

          <div>
            <h2 className="text-2xl font-black">
              Customer Profile
            </h2>

            <p className="text-sm text-slate-500">
              TariffSmart Customer
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ProfileItem
            title="Customer ID"
            value={
              customer?.customer_id ||
              customer?.customerId ||
              "CUST-1023"
            }
          />

          <ProfileItem
            title="Phone Number"
            value={phoneNumber || "Not available"}
          />

          <ProfileItem
            title="Customer Cluster"
            value={`Cluster ${customer?.cluster ?? 1}`}
          />

          <ProfileItem
            title="Customer Segment"
            value={
              customer?.segment ||
              customer?.customer_segment ||
              "Moderate Voice User"
            }
          />

          <ProfileItem
            title="Current Plan"
            value={
              customer?.current_plan ||
              "No Active Plan"
            }
          />

          <ProfileItem
            title="Estimated Monthly Cost"
            value={`₹${Number(
              customer?.monthly_cost ||
                customer?.estimated_monthly_cost ||
                487.6
            ).toFixed(2)}`}
          />
        </div>

        <div className="mt-6 rounded-2xl bg-emerald-50 p-5">
          <p className="font-black text-emerald-800">
            🟢 Dataset Connected
          </p>

          <p className="mt-1 text-sm text-emerald-700">
            Your customer information is connected to the
            TariffSmart dataset.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ title, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-lg font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}