import { useEffect, useState } from "react";

import {
  Users,
  Search,
  RefreshCw,
  ArrowLeft,
  Phone,
  Layers,
  Package,
} from "lucide-react";


function AdminCustomers({ onBack }) {

  // ============================================================
  // STATE
  // ============================================================

  const [customers, setCustomers] = useState([]);

  const [totalCustomers, setTotalCustomers] =
    useState(0);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ============================================================
  // BACKEND URL
  // ============================================================

  const API_URL =
    "http://127.0.0.1:8000/api/admin/customers";


  // ============================================================
  // LOAD CUSTOMER DATA
  // ============================================================

  async function loadCustomers() {

    try {

      setLoading(true);

      setError("");

      console.log(
        "Loading customers from:",
        API_URL
      );


      const response =
        await fetch(API_URL);


      console.log(
        "Backend status:",
        response.status
      );


      if (!response.ok) {

        let errorText =
          `Backend returned ${response.status}`;

        try {

          const errorData =
            await response.json();

          if (errorData?.detail) {
            errorText =
              errorData.detail;
          }

        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(errorText);
      }


      const data =
        await response.json();


      console.log(
        "ADMIN CUSTOMER RESPONSE:",
        data
      );


      // ========================================================
      // CUSTOMER LIST
      // ========================================================

      const customerList =
        Array.isArray(data?.customers)
          ? data.customers
          : [];


      setCustomers(
        customerList
      );


      // ========================================================
      // TOTAL CUSTOMERS
      // ========================================================

      const total =
        Number(
          data?.total_customers ??
          customerList.length
        );


      setTotalCustomers(
        Number.isNaN(total)
          ? customerList.length
          : total
      );


    } catch (err) {

      console.error(
        "ADMIN CUSTOMER ERROR:",
        err
      );


      setCustomers([]);

      setTotalCustomers(0);


      setError(
        err?.message ||
        "Unable to load customer data."
      );


    } finally {

      setLoading(false);

    }

  }


  // ============================================================
  // LOAD WHEN PAGE OPENS
  // ============================================================

  useEffect(() => {

    loadCustomers();

  }, []);


  // ============================================================
  // SEARCH
  // ============================================================

  const filteredCustomers =
    customers.filter(
      (customer) => {

        const searchText =
          search
            .toLowerCase()
            .trim();


        if (!searchText) {
          return true;
        }


        const customerId =
          String(
            customer?.customer_id || ""
          ).toLowerCase();


        const phone =
          String(
            customer?.phone_number || ""
          ).toLowerCase();


        const cluster =
          String(
            customer?.cluster ?? ""
          ).toLowerCase();


        const plan =
          String(
            customer?.recommended_plan || ""
          ).toLowerCase();


        return (
          customerId.includes(searchText) ||
          phone.includes(searchText) ||
          cluster.includes(searchText) ||
          plan.includes(searchText)
        );

      }
    );


  // ============================================================
  // NUMBER FORMAT
  // ============================================================

  function formatNumber(value) {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return "0";

    }


    const number =
      Number(value);


    if (Number.isNaN(number)) {

      return String(value);

    }


    return number.toFixed(0);

  }


  // ============================================================
  // PAGE
  // ============================================================

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
        p-6
        lg:p-8
      "
    >


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          mb-7
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-extrabold
              tracking-tight
              text-slate-900
            "
          >
            Customers
          </h1>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            View all customers from the
            telecom dataset.
          </p>

        </div>


        <div className="flex gap-3">

          {/* BACK */}

          <button
            type="button"
            onClick={onBack}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              text-sm
              font-semibold
              text-slate-700
              shadow-sm
              transition
              hover:bg-slate-50
            "
          >

            <ArrowLeft size={18} />

            Back

          </button>


          {/* REFRESH */}

          <button
            type="button"
            onClick={loadCustomers}
            disabled={loading}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-purple-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition
              hover:bg-purple-700
              disabled:opacity-50
            "
          >

            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>

      </div>


      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-5
          md:grid-cols-3
        "
      >


        {/* TOTAL CUSTOMERS */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-medium
                  text-slate-500
                "
              >
                Total Customers
              </p>


              <h2
                className="
                  mt-2
                  text-4xl
                  font-extrabold
                  text-slate-900
                "
              >
                {loading
                  ? "..."
                  : totalCustomers.toLocaleString()
                }
              </h2>


              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                Customers in dataset
              </p>

            </div>


            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-purple-100
                text-purple-600
              "
            >

              <Users size={28} />

            </div>

          </div>

        </div>


        {/* SHOWING RECORDS */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            Showing
          </p>


          <h2
            className="
              mt-2
              text-4xl
              font-extrabold
              text-slate-900
            "
          >
            {loading
              ? "..."
              : filteredCustomers.length.toLocaleString()
            }
          </h2>


          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            Matching customer records
          </p>

        </div>


        {/* BACKEND STATUS */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            Dataset Status
          </p>


          <h2
            className="
              mt-2
              text-2xl
              font-extrabold
              text-emerald-600
            "
          >
            {error
              ? "Disconnected"
              : loading
                ? "Loading..."
                : "Connected"
            }
          </h2>


          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            FastAPI customer service
          </p>

        </div>

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div
          className="
            mb-6
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-6
          "
        >

          <h3
            className="
              font-bold
              text-red-700
            "
          >
            Unable to load customers
          </h3>


          <p
            className="
              mt-2
              text-sm
              text-red-600
            "
          >
            {error}
          </p>


          <p
            className="
              mt-3
              text-xs
              text-red-500
            "
          >
            Check that FastAPI is running and
            that the endpoint exists:
          </p>


          <code
            className="
              mt-2
              block
              rounded-lg
              bg-red-100
              p-3
              text-xs
              text-red-700
            "
          >
            {API_URL}
          </code>


          <button
            type="button"
            onClick={loadCustomers}
            className="
              mt-4
              rounded-lg
              bg-red-600
              px-5
              py-2
              text-sm
              font-semibold
              text-white
              hover:bg-red-700
            "
          >
            Try Again
          </button>

        </div>

      )}


      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div
        className="
          mb-6
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
        "
      >

        <div
          className="
            relative
          "
        >

          <Search
            size={19}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />


          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="
              Search by customer ID,
              phone number, cluster or plan...
            "
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              py-3
              pl-11
              pr-4
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-purple-500
              focus:bg-white
              focus:ring-2
              focus:ring-purple-100
            "
          />

        </div>

      </div>


      {/* ======================================================
          CUSTOMER TABLE
      ====================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >

        {/* TABLE HEADER */}

        <div
          className="
            flex
            flex-col
            gap-2
            border-b
            border-slate-100
            p-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Customer Records
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Customer usage and recommendation
              details.
            </p>

          </div>


          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >

            <Users size={17} />

            {filteredCustomers.length}

            {" "}records

          </div>

        </div>


        {/* LOADING */}

        {loading && (

          <div
            className="
              p-14
              text-center
            "
          >

            <RefreshCw
              size={34}
              className="
                mx-auto
                animate-spin
                text-purple-600
              "
            />


            <p
              className="
                mt-4
                text-sm
                text-slate-500
              "
            >
              Loading customer data...
            </p>

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredCustomers.length === 0 && (

            <div
              className="
                p-14
                text-center
              "
            >

              <Users
                size={45}
                className="
                  mx-auto
                  text-slate-300
                "
              />


              <h3
                className="
                  mt-4
                  font-bold
                  text-slate-700
                "
              >
                No customers found
              </h3>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-400
                "
              >
                Try changing your search.
              </p>

            </div>

          )}


        {/* TABLE */}

        {!loading &&
          filteredCustomers.length > 0 && (

            <div
              className="
                overflow-x-auto
              "
            >

              <table
                className="
                  min-w-[1100px]
                  w-full
                "
              >

                <thead
                  className="
                    bg-slate-50
                  "
                >

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Customer ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Phone Number
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Day
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Evening
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Night
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      International
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Cluster
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Recommended Plan
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredCustomers.map(
                    (customer, index) => (

                      <tr
                        key={
                          customer?.customer_id ||
                          customer?.phone_number ||
                          index
                        }
                        className="
                          border-t
                          border-slate-100
                          transition
                          hover:bg-purple-50/40
                        "
                      >

                        {/* CUSTOMER ID */}

                        <td
                          className="
                            px-6
                            py-5
                            text-sm
                            font-semibold
                            text-slate-800
                          "
                        >

                          {customer?.customer_id ||
                            "N/A"}

                        </td>


                        {/* PHONE */}

                        <td
                          className="
                            px-6
                            py-5
                            text-sm
                            text-slate-600
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <Phone
                              size={15}
                              className="
                                text-purple-500
                              "
                            />

                            {customer?.phone_number ||
                              "N/A"}

                          </div>

                        </td>


                        {/* DAY */}

                        <td
                          className="
                            px-6
                            py-5
                            text-sm
                            text-slate-600
                          "
                        >
                          {formatNumber(
                            customer?.day_minutes
                          )}
                        </td>


                        {/* EVENING */}

                        <td
                          className="
                            px-6
                            py-5
                            text-sm
                            text-slate-600
                          "
                        >
                          {formatNumber(
                            customer?.evening_minutes
                          )}
                        </td>


                        {/* NIGHT */}

                        <td
                          className="
                            px-6
                            py-5
                            text-sm
                            text-slate-600
                          "
                        >
                          {formatNumber(
                            customer?.night_minutes
                          )}
                        </td>


                        {/* INTERNATIONAL */}

                        <td
                          className="
                            px-6
                            py-5
                            text-sm
                            text-slate-600
                          "
                        >
                          {formatNumber(
                            customer?.international_minutes
                          )}
                        </td>


                        {/* CLUSTER */}

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              bg-blue-50
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              text-blue-700
                            "
                          >

                            <Layers size={13} />

                            Cluster{" "}

                            {customer?.cluster ??
                              "N/A"}

                          </span>

                        </td>


                        {/* PLAN */}

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              bg-purple-50
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              text-purple-700
                            "
                          >

                            <Package size={13} />

                            {customer?.recommended_plan ||
                              "N/A"}

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

      </div>


      {/* ======================================================
          BACK TO DASHBOARD
      ====================================================== */}

      <button
        type="button"
        onClick={onBack}
        className="
          mt-6
          flex
          items-center
          gap-2
          rounded-xl
          bg-purple-600
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          shadow-lg
          transition
          hover:bg-purple-700
        "
      >

        <ArrowLeft size={18} />

        Back to Dashboard

      </button>

    </div>

  );
}


export default AdminCustomers;