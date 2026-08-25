import { useState } from "react";

function RegistrationPage({ onRegister, onBack }) {
  const [formData, setFormData] = useState({
    phone_number: "",
    day_minutes: "",
    evening_minutes: "",
    night_minutes: "",
    international_minutes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.phone_number.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onRegister({
        phone_number: formData.phone_number.trim(),

        day_minutes:
          Number(formData.day_minutes) || 0,

        evening_minutes:
          Number(formData.evening_minutes) || 0,

        night_minutes:
          Number(formData.night_minutes) || 0,

        international_minutes:
          Number(formData.international_minutes) || 0,
      });
    } catch (err) {
      console.error(
        "REGISTRATION ERROR:",
        err
      );

      setError(
        err?.message ||
        "Unable to create customer."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        flex
        items-center
        justify-center
        px-4
        py-10
      "
    >
      <div
        className="
          w-full
          max-w-2xl
          rounded-3xl
          bg-white
          p-8
          shadow-xl
          border
          border-slate-200
        "
      >

        {/* HEADER */}

        <div className="mb-8 text-center">

          <div
            className="
              mx-auto
              mb-4
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-purple-600
              text-3xl
            "
          >
            📡
          </div>

          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Create New Customer
          </h1>

          <p
            className="
              mt-2
              text-slate-500
            "
          >
            Enter your telecom usage details
            to get personalized tariff recommendations.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div
            className="
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              font-medium
              text-red-700
            "
          >
            {error}
          </div>
        )}


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* PHONE */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Phone Number
            </label>

            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-purple-500
                focus:ring-2
                focus:ring-purple-100
              "
              required
            />

          </div>


          {/* DAY */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Day Minutes
            </label>

            <input
              type="number"
              min="0"
              step="0.1"
              name="day_minutes"
              value={formData.day_minutes}
              onChange={handleChange}
              placeholder="Example: 180.5"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-purple-500
                focus:ring-2
                focus:ring-purple-100
              "
            />

          </div>


          {/* EVENING */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Evening Minutes
            </label>

            <input
              type="number"
              min="0"
              step="0.1"
              name="evening_minutes"
              value={formData.evening_minutes}
              onChange={handleChange}
              placeholder="Example: 200.2"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-purple-500
                focus:ring-2
                focus:ring-purple-100
              "
            />

          </div>


          {/* NIGHT */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Night Minutes
            </label>

            <input
              type="number"
              min="0"
              step="0.1"
              name="night_minutes"
              value={formData.night_minutes}
              onChange={handleChange}
              placeholder="Example: 100.5"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-purple-500
                focus:ring-2
                focus:ring-purple-100
              "
            />

          </div>


          {/* INTERNATIONAL */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              International Minutes
            </label>

            <input
              type="number"
              min="0"
              step="0.1"
              name="international_minutes"
              value={
                formData.international_minutes
              }
              onChange={handleChange}
              placeholder="Example: 10.5"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-purple-500
                focus:ring-2
                focus:ring-purple-100
              "
            />

          </div>


          {/* BUTTONS */}

          <div
            className="
              flex
              flex-col
              gap-3
              pt-4
              sm:flex-row
            "
          >

            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-5
                py-3
                font-semibold
                text-slate-700
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              ← Back
            </button>


            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-purple-600
                px-5
                py-3
                font-semibold
                text-white
                shadow
                hover:bg-purple-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Creating Customer..."
                : "Create Customer"}
            </button>

          </div>

        </form>


        {/* INFO */}

        <div
          className="
            mt-6
            rounded-xl
            border
            border-purple-100
            bg-purple-50
            p-4
          "
        >
          <p
            className="
              text-sm
              leading-6
              text-purple-700
            "
          >
            💡 No password is required.
            Your phone number and usage information
            are used to create the customer profile
            and generate tariff recommendations.
          </p>
        </div>

      </div>
    </div>
  );
}

export default RegistrationPage;