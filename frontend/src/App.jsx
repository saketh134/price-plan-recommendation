import Login from "./components/Login";
import { useEffect, useState } from "react";

import Dashboard from "./components/Dashboard";
import CustomerAnalysis from "./components/CustomerAnalysis";
import Sidebar from "./components/Sidebar";
import AllPlans from "./components/AllPlans";
import Chatbot from "./components/Chatbot";

import AdminDashboard from "./components/AdminDashboard";
import AdminCustomers from "./components/AdminCustomers";

import RegistrationPage from "./components/RegistrationPage";

import {
  getRecommendations,
  registerCustomer,
} from "./services/api";

import "./App.css";
/* ============================================================
   APP
============================================================ */

function App() {

  /* ============================================================
     DARK / BRIGHT MODE
  ============================================================ */

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("tariffsmart-theme") === "dark";
  });


  useEffect(() => {

    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    document.body.classList.toggle(
      "tariffsmart-dark",
      darkMode
    );

    localStorage.setItem(
      "tariffsmart-theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);


  /* ============================================================
     LOGIN STATE
  ============================================================ */

  const [loggedIn, setLoggedIn] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [customer, setCustomer] = useState(null);

  const [recommendations, setRecommendations] = useState([]);

  const [allPlans, setAllPlans] = useState([]);


  /* ============================================================
     CUSTOMER PAGE
  ============================================================ */

  const [page, setPage] = useState("dashboard");


  /* ============================================================
     ADMIN PAGE
  ============================================================ */

  const [adminPage, setAdminPage] = useState("dashboard");


  /* ============================================================
     LOGIN
  ============================================================ */

  async function handleLogin(loginData) {

    console.log("================================");
    console.log("LOGIN DATA");
    console.log(loginData);
    console.log("================================");


    /* ==========================================================
       CHECK ADMIN
    ========================================================== */

    const adminLogin =
      loginData?.role === "admin" ||
      loginData?.user_type === "admin" ||
      loginData?.userType === "admin" ||
      loginData?.isAdmin === true ||
      loginData?.admin === true;


    /* ==========================================================
       ADMIN LOGIN
    ========================================================== */

    if (adminLogin) {

      console.log("ADMIN LOGIN SUCCESS");

      setIsAdmin(true);

      setCustomer(loginData);

      setRecommendations([]);

      setAllPlans([]);

      setLoggedIn(true);

      setAdminPage("dashboard");


      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      localStorage.setItem(
        "userRole",
        "admin"
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(loginData)
      );

      return;
    }
    /* ============================================================
   NEW CUSTOMER REGISTRATION
============================================================ */


    /* ==========================================================
       CUSTOMER LOGIN
    ========================================================== */

    console.log("CUSTOMER LOGIN");

    setIsAdmin(false);


    const phoneNumber =
      loginData?.phone_number ||
      loginData?.phone ||
      loginData?.["Phone Number"] ||
      loginData?.customer?.phone_number ||
      loginData?.customer?.phone ||
      "";


    console.log(
      "CUSTOMER PHONE:",
      phoneNumber
    );


    /* ==========================================================
       NO PHONE NUMBER
    ========================================================== */

    if (!phoneNumber) {

      setCustomer(loginData);

      setRecommendations([]);

      setAllPlans([]);

      setLoggedIn(true);

      setPage("dashboard");

      return;
    }


    /* ==========================================================
       LOAD CUSTOMER DATA
    ========================================================== */

    try {

      console.log(
        "Loading customer data:",
        phoneNumber
      );


      const result =
        await getRecommendations(phoneNumber);


      console.log(
        "BACKEND RESPONSE:",
        result
      );


      /* ========================================================
         CUSTOMER INFORMATION
      ======================================================== */

      const customerInfo =
        result?.customer || {};


      /* ========================================================
         USAGE
      ======================================================== */

      const usageInfo =
        result?.usage ||
        customerInfo?.usage ||
        {};


      /* ========================================================
         CALLS
      ======================================================== */

      const callsInfo =
        result?.calls ||
        customerInfo?.calls ||
        {};


      /* ========================================================
         SERVICES
      ======================================================== */

      const servicesInfo =
        result?.services ||
        customerInfo?.services ||
        {};


      /* ========================================================
         CHARGES
      ======================================================== */

      const chargesInfo =
        result?.charges ||
        customerInfo?.charges ||
        {};


      /* ========================================================
         NORMALIZED CUSTOMER
      ======================================================== */

      const normalizedCustomer = {

        ...customerInfo,

        ...usageInfo,

        ...callsInfo,

        ...servicesInfo,

        ...chargesInfo,

        usage: usageInfo,

        calls: callsInfo,

        services: servicesInfo,

        charges: chargesInfo,

        phone_number:
          customerInfo?.phone_number ||
          customerInfo?.phone ||
          phoneNumber,

        cluster:
          customerInfo?.cluster ??
          result?.cluster ??
          "N/A",

        account_length:
          customerInfo?.account_length ??
          result?.account_length ??
          0,

        churn:
          customerInfo?.churn ??
          result?.churn ??
          "0",

        backendData: result,

      };


      setCustomer(normalizedCustomer);


      /* ========================================================
         TOP 3 RECOMMENDATIONS
      ======================================================== */

      const backendRecommendations =
        Array.isArray(result?.recommendations)
          ? result.recommendations
          : [];


      setRecommendations(
        backendRecommendations.slice(0, 3)
      );


      /* ========================================================
         ALL PLANS
      ======================================================== */

      const backendPlans =
        Array.isArray(result?.all_plans)
          ? result.all_plans
          : [];


      setAllPlans(backendPlans);


      /* ========================================================
         CUSTOMER LOGIN SUCCESS
      ======================================================== */

      setLoggedIn(true);

      setPage("dashboard");

    }

    catch (error) {

  console.error(
    "CUSTOMER DATA ERROR:",
    error
  );

  alert(
    "Unable to load customer data.\n\n" +
    (
      error?.message ||
      "Please make sure the FastAPI backend is running."
    )
  );

  setLoggedIn(false);

  setCustomer(null);

  setRecommendations([]);

  setAllPlans([]);

  setPage("dashboard");
}
  }
/* ============================================================
   NEW CUSTOMER REGISTRATION
============================================================ */

async function handleRegistration(customerData) {
  console.log("NEW CUSTOMER:", customerData);

  try {
    const registration = await registerCustomer({
      phone_number: customerData.phone_number,
      day_minutes: Number(customerData.day_minutes || 0),
      evening_minutes: Number(customerData.evening_minutes || 0),
      night_minutes: Number(customerData.night_minutes || 0),
      international_minutes: Number(
        customerData.international_minutes || 0
      ),
    });

    console.log(
      "REGISTRATION RESPONSE:",
      registration
    );

    const result = await getRecommendations(
      customerData.phone_number
    );

    console.log(
      "RECOMMENDATION RESPONSE:",
      result
    );

    const customerInfo =
      result?.customer ||
      registration?.customer ||
      {};

    const usageInfo = result?.usage || {};
    const callsInfo = result?.calls || {};
    const servicesInfo = result?.services || {};
    const chargesInfo = result?.charges || {};

    const registeredCustomer = {
      ...customerInfo,
      ...usageInfo,
      ...callsInfo,
      ...servicesInfo,
      ...chargesInfo,

      usage: usageInfo,
      calls: callsInfo,
      services: servicesInfo,
      charges: chargesInfo,

      phone_number:
        customerInfo?.phone_number ||
        customerData.phone_number,

      cluster:
        customerInfo?.cluster ??
        result?.cluster ??
        registration?.customer?.cluster ??
        0,

      account_length:
        customerInfo?.account_length ?? 0,

      churn:
        customerInfo?.churn ?? "0",

      registered_customer: true,
      registration_type: "backend",
    };

    setIsAdmin(false);

    setCustomer(
      registeredCustomer
    );

    setRecommendations(
      Array.isArray(result?.recommendations)
        ? result.recommendations.slice(0, 3)
        : []
    );

    setAllPlans(
      Array.isArray(result?.all_plans)
        ? result.all_plans
        : []
    );

    localStorage.setItem(
      "tariffsmart-customer",
      JSON.stringify(registeredCustomer)
    );

    localStorage.setItem(
      "customerLoggedIn",
      "true"
    );

    localStorage.setItem(
      "userRole",
      "customer"
    );

    setLoggedIn(true);

    setPage("dashboard");

    console.log(
      "NEW CUSTOMER DASHBOARD READY"
    );

  } catch (error) {
    console.error(
      "NEW CUSTOMER ERROR:",
      error
    );

    throw new Error(
      error?.message ||
      "Unable to create new customer."
    );
  }
}

  /* ============================================================
     LOGOUT
  ============================================================ */

  function handleLogout() {

    console.log("LOGGING OUT");


    setLoggedIn(false);

    setIsAdmin(false);

    setCustomer(null);

    setRecommendations([]);

    setAllPlans([]);

    setPage("dashboard");

    setAdminPage("dashboard");


    localStorage.removeItem(
      "adminLoggedIn"
    );

    localStorage.removeItem(
      "adminUser"
    );

    localStorage.removeItem(
      "userRole"
    );
  }


  /* ============================================================
     ADMIN NAVIGATION
  ============================================================ */

  function handleAdminNavigation(selectedPage) {

    console.log(
      "ADMIN NAVIGATION:",
      selectedPage
    );

    setAdminPage(selectedPage);
  }


  /* ============================================================
     ADMIN BACK
  ============================================================ */

  function handleAdminBack() {

    setAdminPage("dashboard");
  }
/* ============================================================
   REGISTER PAGE
============================================================ */

/* ============================================================
   NEW CUSTOMER REGISTRATION PAGE
============================================================ */

if (
  !loggedIn &&
  window.location.pathname === "/register"
) {
  return (
    <div className="tariffsmart-app">

      <ThemeToggle
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <RegistrationPage
        onRegister={handleRegistration}
        onBack={() => {
          window.history.back();
        }}
      />

    </div>
  );
}


/* ============================================================
   LOGIN PAGE
============================================================ */

if (!loggedIn) {
  return (
    <div className="tariffsmart-app">

      <ThemeToggle
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Login
        onLogin={handleLogin}
      />

    </div>
  );
}
/* ============================================================
   REGISTER PAGE
============================================================ */

if (!loggedIn && window.location.pathname === "/register") {
  return (
    <div className="tariffsmart-app">
      <Register onLogin={handleLogin} />
    </div>
  );
}


/* ============================================================
   LOGIN PAGE
============================================================ */

if (!loggedIn) {
  return (
    <div className="tariffsmart-app">

      <ThemeToggle
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Login
        onLogin={handleLogin}
      />

    </div>
  );
}

  /* ============================================================
     LOGIN PAGE
  ============================================================ */

  if (!loggedIn) {

    return (

      <div className="tariffsmart-app">

        <ThemeToggle
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <Login
          onLogin={handleLogin}
        />

      </div>
    );
  }


  /* ============================================================
     ADMIN APPLICATION
  ============================================================ */

  if (isAdmin) {

    return (

      <div className="min-h-screen bg-slate-50 tariffsmart-app">

        <SidebarThemeToggle
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />


        {/* ======================================================
            ADMIN DASHBOARD
        ====================================================== */}

        {adminPage === "dashboard" && (

          <AdminDashboard
            onLogout={handleLogout}
            onNavigate={handleAdminNavigation}
          />

        )}


        {/* ======================================================
            ADMIN CUSTOMERS
        ====================================================== */}

        {adminPage === "customers" && (

          <AdminCustomers
            onBack={handleAdminBack}
            onNavigate={handleAdminNavigation}
            onLogout={handleLogout}
          />

        )}


        {/* ======================================================
            ADMIN CLUSTERING
        ====================================================== */}

        {adminPage === "clustering" && (

          <AdminClusteringPage
            onBack={handleAdminBack}
            onNavigate={handleAdminNavigation}
            onLogout={handleLogout}
          />

        )}


        {/* ======================================================
            DATASET MANAGEMENT
        ====================================================== */}

        {adminPage === "dataset" && (

          <AdminPlaceholder
            title="Dataset Management"
            icon="📂"
            description="Manage and upload telecom customer datasets."
            activePage="dataset"
            onBack={handleAdminBack}
            onNavigate={handleAdminNavigation}
            onLogout={handleLogout}
          />

        )}


        {/* ======================================================
            USAGE ANALYTICS
        ====================================================== */}

        {adminPage === "usage" && (

          <AdminPlaceholder
            title="Usage Analytics"
            icon="📊"
            description="Analyze customer telecom usage and calling patterns."
            activePage="usage"
            onBack={handleAdminBack}
            onNavigate={handleAdminNavigation}
            onLogout={handleLogout}
          />

        )}


        {/* ======================================================
            TARIFF PLANS
        ====================================================== */}

        {adminPage === "tariffs" && (

          <AdminPlaceholder
            title="Tariff Plans"
            icon="💳"
            description="Manage telecom tariff plans."
            activePage="tariffs"
            onBack={handleAdminBack}
            onNavigate={handleAdminNavigation}
            onLogout={handleLogout}
          />

        )}


        {/* ======================================================
            RECOMMENDATIONS
        ====================================================== */}

        {adminPage === "recommendations" && (

          <AdminPlaceholder
            title="Recommendations"
            icon="⭐"
            description="Manage customer tariff recommendations."
            activePage="recommendations"
            onBack={handleAdminBack}
            onNavigate={handleAdminNavigation}
            onLogout={handleLogout}
          />

        )}

      </div>
    );
  }


  /* ============================================================
     CUSTOMER PHONE
  ============================================================ */

  const phoneNumber =
    customer?.phone_number ||
    customer?.phone ||
    customer?.["Phone Number"] ||
    "";


  /* ============================================================
     CUSTOMER APPLICATION
  ============================================================ */

  return (

    <div className="min-h-screen bg-slate-50 tariffsmart-app">


      {/* ======================================================
          CUSTOMER THEME BUTTON
      ====================================================== */}

      <SidebarThemeToggle
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />


      {/* ======================================================
          CUSTOMER SIDEBAR
      ====================================================== */}

      <Sidebar
        page={page}
        setPage={setPage}
        onLogout={handleLogout}
      />


      {/* ======================================================
          CUSTOMER CONTENT
      ====================================================== */}

      <main
        className="
          min-h-screen
          lg:ml-64
        "
      >


        {/* ====================================================
            DASHBOARD
        ==================================================== */}

        {page === "dashboard" && (

          <Dashboard
            phoneNumber={phoneNumber}
            customer={customer}
            recommendations={recommendations}
            page="dashboard"
            onNavigate={setPage}
          />

        )}


        {/* ====================================================
            CUSTOMER ANALYSIS
        ==================================================== */}

        {page === "customer" && (

          <CustomerAnalysis
            phoneNumber={phoneNumber}
            customer={customer}
            recommendations={recommendations}
          />

        )}


        {/* ====================================================
            TARIFF PLANS
        ==================================================== */}

        {page === "tariffs" && (

          <AllPlans
            plans={allPlans}
            phoneNumber={phoneNumber}
            customer={customer}
            onBack={() =>
              setPage("dashboard")
            }
          />

        )}


        {/* ====================================================
            PLAN COMPARISON
        ==================================================== */}

        {page === "comparison" && (

          <PlanComparisonPage
            plans={allPlans}
            customer={customer}
            phoneNumber={phoneNumber}
            onBack={() =>
              setPage("dashboard")
            }
          />

        )}


        {/* ====================================================
            MY PROFILE
        ==================================================== */}

        {page === "profile" && (

          <MyProfilePage
            customer={customer}
            phoneNumber={phoneNumber}
            onBack={() =>
              setPage("dashboard")
            }
          />

        )}


        {/* ====================================================
            SETTINGS
        ==================================================== */}

        {page === "settings" && (

          <SettingsPage
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onBack={() =>
              setPage("dashboard")
            }
          />

        )}


        {/* ====================================================
            OLD ALL PLANS ROUTE
        ==================================================== */}

        {page === "all-plans" && (

          <AllPlans
            plans={allPlans}
            phoneNumber={phoneNumber}
            customer={customer}
            onBack={() =>
              setPage("dashboard")
            }
          />

        )}


        {/* ====================================================
            OLD PLANS ROUTE
        ==================================================== */}

        {page === "plans" && (

          <AllPlans
            plans={allPlans}
            phoneNumber={phoneNumber}
            customer={customer}
            onBack={() =>
              setPage("dashboard")
            }
          />

        )}

      </main>


      {/* ======================================================
          CHATBOT
      ====================================================== */}

      <Chatbot
        customer={customer}
        recommendations={recommendations}
      />

    </div>
  );
}


/* =================================================================
   DARK / BRIGHT MODE SIDEBAR BUTTON
================================================================= */

function SidebarThemeToggle({
  darkMode,
  setDarkMode,
}) {

  return (

    <button
      type="button"
      className="sidebar-theme-toggle"
      onClick={() =>
        setDarkMode(
          (current) => !current
        )
      }
      aria-label={
        darkMode
          ? "Switch to bright mode"
          : "Switch to dark mode"
      }
      title={
        darkMode
          ? "Switch to bright mode"
          : "Switch to dark mode"
      }
    >

      <span className="sidebar-theme-icon">

        {darkMode
          ? "☀️"
          : "🌙"}

      </span>

      <span>

        {darkMode
          ? "Bright Mode"
          : "Dark Mode"}

      </span>

    </button>
  );
}


/* =================================================================
   LOGIN THEME BUTTON
================================================================= */

function ThemeToggle({
  darkMode,
  setDarkMode,
}) {

  return (

    <button
      type="button"
      className="theme-toggle-button"
      onClick={() =>
        setDarkMode(
          (current) => !current
        )
      }
      aria-label={
        darkMode
          ? "Switch to bright mode"
          : "Switch to dark mode"
      }
    >

      {darkMode
        ? "☀️ Bright Mode"
        : "🌙 Dark Mode"}

    </button>
  );
}


/* =================================================================
   PLAN COMPARISON PAGE
================================================================= */

function PlanComparisonPage({
  plans,
  customer,
  phoneNumber,
  onBack,
}) {

  const safePlans =
    Array.isArray(plans)
      ? plans
      : [];


  return (

    <div
      className="
        min-h-screen
        bg-slate-50
        p-6
        lg:p-8
      "
    >

      <div className="mx-auto max-w-7xl">


        {/* HEADER */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <p
              className="
                text-sm
                font-semibold
                text-purple-600
              "
            >
              TariffSmart
            </p>

            <h1
              className="
                mt-1
                text-3xl
                font-bold
                text-slate-900
              "
            >
              Plan Comparison
            </h1>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Compare available tariff plans and choose the best option.
            </p>

          </div>


          <button
            type="button"
            onClick={onBack}
            className="
              rounded-xl
              bg-purple-600
              px-5
              py-3
              font-semibold
              text-white
              shadow
              hover:bg-purple-700
            "
          >
            ← Back
          </button>

        </div>


        {/* CUSTOMER */}

        <div
          className="
            mb-6
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <p className="text-sm text-slate-500">
            Customer
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {phoneNumber || "Customer"}
          </p>

        </div>


        {/* NO PLANS */}

        {safePlans.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-white
              p-12
              text-center
            "
          >

            <div className="text-5xl">
              📋
            </div>

            <h2
              className="
                mt-4
                text-xl
                font-bold
                text-slate-900
              "
            >
              No Plans Available
            </h2>

            <p className="mt-2 text-slate-500">
              No tariff plans were returned by the backend.
            </p>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {safePlans.map(
              (plan, index) => {

                const name =
                  plan?.plan_name ||
                  plan?.name ||
                  plan?.plan ||
                  `Plan ${index + 1}`;

                const price =
                  plan?.monthly_cost ??
                  plan?.price ??
                  plan?.monthly_price ??
                  0;

                return (

                  <div
                    key={
                      plan?.plan_id ||
                      plan?.id ||
                      index
                    }
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-6
                      shadow-sm
                      transition
                      hover:-translate-y-1
                      hover:shadow-lg
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <span
                        className="
                          rounded-full
                          bg-purple-100
                          px-3
                          py-1
                          text-xs
                          font-bold
                          text-purple-700
                        "
                      >
                        Plan {index + 1}
                      </span>

                      <span className="text-xl">
                        📱
                      </span>

                    </div>


                    <h2
                      className="
                        mt-5
                        text-xl
                        font-bold
                        text-slate-900
                      "
                    >
                      {name}
                    </h2>


                    <p
                      className="
                        mt-3
                        text-3xl
                        font-bold
                        text-purple-600
                      "
                    >
                      ₹{Number(price).toFixed(2)}
                      <span
                        className="
                          ml-1
                          text-xs
                          font-medium
                          text-slate-400
                        "
                      >
                        /month
                      </span>
                    </p>


                    <div
                      className="
                        mt-6
                        space-y-3
                        text-sm
                        text-slate-600
                      "
                    >

                      <PlanValue
                        label="Day Minutes"
                        value={
                          plan?.day_minutes ??
                          plan?.day ??
                          "-"
                        }
                      />

                      <PlanValue
                        label="Evening Minutes"
                        value={
                          plan?.evening_minutes ??
                          plan?.evening ??
                          "-"
                        }
                      />

                      <PlanValue
                        label="Night Minutes"
                        value={
                          plan?.night_minutes ??
                          plan?.night ??
                          "-"
                        }
                      />

                      <PlanValue
                        label="International Minutes"
                        value={
                          plan?.international_minutes ??
                          plan?.international ??
                          "-"
                        }
                      />

                      <PlanValue
                        label="Voice Mail"
                        value={
                          plan?.voicemail ??
                          plan?.voice_mail ??
                          "-"
                        }
                      />

                    </div>


                    <button
                      type="button"
                      className="
                        mt-6
                        w-full
                        rounded-xl
                        bg-purple-600
                        px-4
                        py-3
                        font-semibold
                        text-white
                        hover:bg-purple-700
                      "
                    >
                      Select Plan
                    </button>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

    </div>
  );
}


/* =================================================================
   PLAN VALUE
================================================================= */

function PlanValue({
  label,
  value,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-slate-100
        pb-2
      "
    >

      <span>
        {label}
      </span>

      <strong className="text-slate-900">
        {value}
      </strong>

    </div>
  );
}


/* =================================================================
   MY PROFILE PAGE
================================================================= */

function MyProfilePage({
  customer,
  phoneNumber,
  onBack,
}) {

  const data =
    customer || {};


  return (

    <div
      className="
        min-h-screen
        bg-slate-50
        p-6
        lg:p-8
      "
    >

      <div className="mx-auto max-w-5xl">


        <div
          className="
            mb-6
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              My Profile
            </h1>

            <p className="mt-2 text-slate-500">
              View your TariffSmart customer information.
            </p>

          </div>


          <button
            type="button"
            onClick={onBack}
            className="
              rounded-xl
              bg-purple-600
              px-5
              py-3
              font-semibold
              text-white
              hover:bg-purple-700
            "
          >
            ← Back
          </button>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-8
            shadow-sm
          "
        >

          <div
            className="
              flex
              flex-col
              items-center
              gap-5
              border-b
              border-slate-100
              pb-8
              md:flex-row
            "
          >

            <div
              className="
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-purple-100
                text-4xl
              "
            >
              👤
            </div>

            <div>

              <h2
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                TariffSmart Customer
              </h2>

              <p className="mt-1 text-slate-500">
                {phoneNumber || "Phone number not available"}
              </p>

            </div>

          </div>


          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >

            <ProfileItem
              label="Phone Number"
              value={
                data?.phone_number ||
                data?.phone ||
                phoneNumber ||
                "N/A"
              }
            />

            <ProfileItem
              label="Customer ID"
              value={
                data?.customer_id ||
                data?.Customer_ID ||
                data?.id ||
                "N/A"
              }
            />

            <ProfileItem
              label="Account Length"
              value={
                data?.account_length ??
                "N/A"
              }
            />

            <ProfileItem
              label="Cluster"
              value={
                data?.cluster ??
                "N/A"
              }
            />

            <ProfileItem
              label="Current Plan"
              value={
                data?.current_plan ||
                data?.plan ||
                "No Active Plan"
              }
            />

            <ProfileItem
              label="Customer Status"
              value={
                data?.churn === 1 ||
                data?.churn === "1"
                  ? "At Risk"
                  : "Active"
              }
            />

          </div>

        </div>

      </div>

    </div>
  );
}


/* =================================================================
   PROFILE ITEM
================================================================= */

function ProfileItem({
  label,
  value,
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        p-5
      "
    >

      <p
        className="
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-lg
          font-bold
          text-slate-900
        "
      >
        {String(value)}
      </p>

    </div>
  );
}


/* =================================================================
   SETTINGS PAGE
================================================================= */

function SettingsPage({
  darkMode,
  setDarkMode,
  onBack,
}) {

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
        p-6
        lg:p-8
      "
    >

      <div className="mx-auto max-w-4xl">


        <div
          className="
            mb-6
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              Settings
            </h1>

            <p className="mt-2 text-slate-500">
              Customize your TariffSmart experience.
            </p>

          </div>


          <button
            type="button"
            onClick={onBack}
            className="
              rounded-xl
              bg-purple-600
              px-5
              py-3
              font-semibold
              text-white
              hover:bg-purple-700
            "
          >
            ← Back
          </button>

        </div>


        <div className="space-y-5">


          {/* APPEARANCE */}

          <section
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
                gap-4
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-purple-100
                  text-2xl
                "
              >
                🎨
              </div>

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  Appearance
                </h2>

                <p className="text-sm text-slate-500">
                  Change the application theme.
                </p>

              </div>

            </div>


            <div
              className="
                mt-6
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-5
              "
            >

              <div>

                <p className="font-semibold text-slate-900">
                  {darkMode
                    ? "Dark Mode"
                    : "Bright Mode"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Switch between dark and bright appearance.
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setDarkMode(
                    (current) => !current
                  )
                }
                className="
                  rounded-xl
                  bg-purple-600
                  px-5
                  py-3
                  font-bold
                  text-white
                  shadow
                  hover:bg-purple-700
                "
              >

                {darkMode
                  ? "☀️ Bright Mode"
                  : "🌙 Dark Mode"}

              </button>

            </div>

          </section>


          {/* ACCOUNT */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Account Settings
            </h2>


            <div className="mt-5 space-y-3">

              <SettingRow
                icon="🔔"
                title="Notifications"
                description="Receive important tariff and recommendation updates."
              />

              <SettingRow
                icon="🔒"
                title="Privacy"
                description="Your customer usage data is used for recommendations."
              />

              <SettingRow
                icon="🛡️"
                title="Security"
                description="Keep your TariffSmart account secure."
              />

            </div>

          </section>


          {/* INFORMATION */}

          <section
            className="
              rounded-2xl
              border
              border-purple-200
              bg-purple-50
              p-6
            "
          >

            <h2
              className="
                font-bold
                text-purple-900
              "
            >
              TariffSmart
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-purple-700
              "
            >
              TariffSmart analyzes customer usage and recommends
              suitable tariff plans to help customers maximize savings.
            </p>

          </section>

        </div>

      </div>

    </div>
  );
}


/* =================================================================
   SETTINGS ROW
================================================================= */

function SettingRow({
  icon,
  title,
  description,
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-4
        rounded-xl
        border
        border-slate-200
        p-4
      "
    >

      <div className="text-2xl">
        {icon}
      </div>

      <div>

        <p className="font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}


/* =================================================================
   ADMIN CLUSTERING PAGE
================================================================= */

function AdminClusteringPage({
  onBack,
  onNavigate,
  onLogout,
}) {

  const clusters = [

    {
      id: 0,
      customers: 1050,
      percentage: 35,
      type: "Light Users",
    },

    {
      id: 1,
      customers: 750,
      percentage: 25,
      type: "Moderate Users",
    },

    {
      id: 2,
      customers: 540,
      percentage: 18,
      type: "International Users",
    },

    {
      id: 3,
      customers: 660,
      percentage: 22,
      type: "Heavy Users",
    },

  ];


  const usage = [

    {
      name: "Day",
      value: 220.4,
    },

    {
      name: "Evening",
      value: 430.6,
    },

    {
      name: "Night",
      value: 187.7,
    },

    {
      name: "International",
      value: 12.8,
    },

    {
      name: "Voicemail",
      value: 2.7,
    },

  ];


  return (

    <div className="flex min-h-screen">


      <AdminSidebar
        activePage="clustering"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />


      <main
        className="
          ml-[294px]
          min-h-screen
          flex-1
          bg-slate-50
          p-6
          md:p-8
        "
      >


        {/* HEADER */}

        <div
          className="
            mb-7
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              Clustering (K-Means)
            </h1>

            <p className="mt-2 text-slate-500">
              Customer segmentation and K-Means clustering analysis
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              font-semibold
              text-slate-700
              shadow-sm
              hover:bg-slate-50
            "
          >
            ↻ Refresh
          </button>

        </div>


        {/* STATISTICS */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          <ClusteringStat
            icon="👥"
            title="Total Customers"
            value="3,000"
            description="Customers analyzed"
          />

          <ClusteringStat
            icon="⌘"
            title="Total Clusters"
            value="4"
            description="K-Means clusters"
          />

          <ClusteringStat
            icon="◎"
            title="Silhouette Score"
            value="0.62"
            description="Good clustering quality"
          />

          <ClusteringStat
            icon="↗"
            title="Elbow / Inertia"
            value="1,256.40"
            description="K-Means evaluation"
          />

        </div>


        {/* DISTRIBUTION */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-2
          "
        >


          {/* CLUSTERS */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Customer Distribution by Cluster
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Customer segmentation
            </p>


            <div className="mt-6 space-y-6">

              {clusters.map(
                (cluster) => (

                  <div key={cluster.id}>

                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div>

                        <span
                          className="
                            font-semibold
                            text-slate-800
                          "
                        >
                          Cluster {cluster.id}
                        </span>

                        <span
                          className="
                            ml-2
                            text-sm
                            text-slate-400
                          "
                        >
                          {cluster.type}
                        </span>

                      </div>


                      <div
                        className="
                          text-sm
                          text-slate-600
                        "
                      >
                        {cluster.customers.toLocaleString()}
                        {" "}
                        ({cluster.percentage}%)
                      </div>

                    </div>


                    <div
                      className="
                        h-4
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                      "
                    >

                      <div
                        className="
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-purple-600
                          to-fuchsia-500
                        "
                        style={{
                          width:
                            `${cluster.percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                )
              )}

            </div>

          </section>


          {/* MODEL */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Average Usage
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              All customers in minutes
            </p>


            <div
              className="
                mt-6
                grid
                grid-cols-2
                gap-4
                md:grid-cols-3
              "
            >

              {usage.map(
                (item) => (

                  <div
                    key={item.name}
                    className="
                      rounded-xl
                      bg-slate-50
                      p-5
                      text-center
                    "
                  >

                    <p className="text-sm text-slate-500">
                      {item.name}
                    </p>

                    <p
                      className="
                        mt-3
                        text-2xl
                        font-bold
                        text-slate-900
                      "
                    >
                      {item.value}
                    </p>

                    <p className="text-xs text-slate-400">
                      mins
                    </p>

                  </div>
                )
              )}

            </div>


            <div
              className="
                mt-6
                rounded-xl
                border
                border-purple-100
                bg-purple-50
                p-5
              "
            >

              <h3 className="font-bold text-purple-900">
                K-Means Configuration
              </h3>


              <div
                className="
                  mt-4
                  grid
                  grid-cols-2
                  gap-4
                "
              >

                <div>

                  <p className="text-xs text-purple-600">
                    Algorithm
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    K-Means
                  </p>

                </div>


                <div>

                  <p className="text-xs text-purple-600">
                    K Value
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    4
                  </p>

                </div>


                <div>

                  <p className="text-xs text-purple-600">
                    Silhouette Score
                  </p>

                  <p className="mt-1 font-semibold text-green-600">
                    0.62 — Good
                  </p>

                </div>


                <div>

                  <p className="text-xs text-purple-600">
                    Inertia
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    1256.40
                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>


        {/* TABLE */}

        <section
          className="
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          <div
            className="
              border-b
              border-slate-100
              p-6
            "
          >

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Cluster Analysis
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Summary of customer segments generated by K-Means
            </p>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>

                <tr
                  className="
                    bg-slate-50
                    text-left
                    text-sm
                    text-slate-500
                  "
                >

                  <th className="px-6 py-4">
                    Cluster
                  </th>

                  <th className="px-6 py-4">
                    Segment
                  </th>

                  <th className="px-6 py-4">
                    Customers
                  </th>

                  <th className="px-6 py-4">
                    Percentage
                  </th>

                  <th className="px-6 py-4">
                    Usage Type
                  </th>

                </tr>

              </thead>


              <tbody>

                {clusters.map(
                  (cluster) => (

                    <tr
                      key={cluster.id}
                      className="
                        border-t
                        border-slate-100
                      "
                    >

                      <td
                        className="
                          px-6
                          py-5
                          font-semibold
                          text-slate-900
                        "
                      >
                        Cluster {cluster.id}
                      </td>

                      <td
                        className="
                          px-6
                          py-5
                          text-slate-700
                        "
                      >
                        {cluster.type}
                      </td>

                      <td
                        className="
                          px-6
                          py-5
                          font-semibold
                          text-slate-900
                        "
                      >
                        {cluster.customers.toLocaleString()}
                      </td>

                      <td
                        className="
                          px-6
                          py-5
                          text-slate-700
                        "
                      >
                        {cluster.percentage}%
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className="
                            rounded-full
                            bg-purple-50
                            px-3
                            py-2
                            text-sm
                            font-semibold
                            text-purple-700
                          "
                        >
                          {cluster.type}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* BACK */}

        <button
          type="button"
          onClick={onBack}
          className="
            mt-6
            rounded-xl
            bg-purple-600
            px-6
            py-3
            font-semibold
            text-white
            shadow-md
            hover:bg-purple-700
          "
        >
          ← Back to Dashboard
        </button>

      </main>

    </div>
  );
}


/* =================================================================
   CLUSTERING STAT
================================================================= */

function ClusteringStat({
  icon,
  title,
  value,
  description,
}) {

  return (

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
          items-start
          justify-between
        "
      >

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2
            className="
              mt-3
              text-3xl
              font-bold
              text-slate-900
            "
          >
            {value}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            {description}
          </p>

        </div>


        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-purple-100
            text-2xl
          "
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


/* =================================================================
   ADMIN SIDEBAR
================================================================= */

function AdminSidebar({
  activePage,
  onNavigate,
  onLogout,
}) {

  return (

    <aside
      className="
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        w-[294px]
        flex-col
        bg-[#111b38]
        text-white
      "
    >


      {/* LOGO */}

      <div
        className="
          flex
          items-center
          gap-4
          border-b
          border-white/10
          px-6
          py-5
        "
      >

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-purple-600
            text-2xl
          "
        >
          📡
        </div>


        <div>

          <h1 className="text-xl font-bold">
            TariffSmart
          </h1>

          <p className="text-sm text-blue-200">
            Admin Dashboard
          </p>

        </div>

      </div>


      {/* NAVIGATION */}

      <nav
        className="
          flex-1
          space-y-2
          overflow-y-auto
          px-3
          py-8
        "
      >

        <AdminNavButton
          icon="🏠"
          label="Dashboard"
          active={
            activePage === "dashboard"
          }
          onClick={() =>
            onNavigate("dashboard")
          }
        />


        <AdminNavButton
          icon="👥"
          label="Customers"
          active={
            activePage === "customers"
          }
          onClick={() =>
            onNavigate("customers")
          }
        />


        <AdminNavButton
          icon="📄"
          label="Dataset Management"
          active={
            activePage === "dataset"
          }
          onClick={() =>
            onNavigate("dataset")
          }
        />


        <AdminNavButton
          icon="⌘"
          label="Clustering (K-Means)"
          active={
            activePage === "clustering"
          }
          onClick={() =>
            onNavigate("clustering")
          }
        />


        <AdminNavButton
          icon="📊"
          label="Usage Analytics"
          active={
            activePage === "usage"
          }
          onClick={() =>
            onNavigate("usage")
          }
        />


        <AdminNavButton
          icon="💳"
          label="Tariff Plans"
          active={
            activePage === "tariffs"
          }
          onClick={() =>
            onNavigate("tariffs")
          }
        />


        <AdminNavButton
          icon="⭐"
          label="Recommendations"
          active={
            activePage === "recommendations"
          }
          onClick={() =>
            onNavigate("recommendations")
          }
        />

      </nav>


      {/* ADMIN PROFILE */}

      <div
        className="
          border-t
          border-white/10
          p-4
        "
      >

        <div
          className="
            rounded-xl
            bg-[#1e2947]
            p-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-purple-100
                text-2xl
              "
            >
              👤
            </div>


            <div>

              <p className="font-semibold">
                Admin
              </p>

              <p className="text-sm text-blue-200">
                Super Administrator
              </p>

              <div
                className="
                  mt-1
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-green-400
                "
              >

                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-green-400
                  "
                />

                Online

              </div>

            </div>

          </div>

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          onClick={onLogout}
          className="
            mt-4
            flex
            w-full
            items-center
            gap-4
            rounded-xl
            px-4
            py-3
            text-left
            font-semibold
            text-red-300
            hover:bg-red-500/10
          "
        >

          <span className="text-xl">
            ↪
          </span>

          Logout

        </button>

      </div>

    </aside>
  );
}


/* =================================================================
   ADMIN NAV BUTTON
================================================================= */

function AdminNavButton({
  icon,
  label,
  active,
  onClick,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-4
        rounded-xl
        px-4
        py-3
        text-left
        transition

        ${
          active
            ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 font-semibold shadow-lg"
            : "hover:bg-white/10"
        }
      `}
    >

      <span className="text-xl">
        {icon}
      </span>

      <span>
        {label}
      </span>

    </button>
  );
}


/* =================================================================
   ADMIN PLACEHOLDER
================================================================= */

function AdminPlaceholder({
  title,
  icon,
  description,
  activePage,
  onBack,
  onNavigate,
  onLogout,
}) {

  return (

    <div className="flex min-h-screen">


      <AdminSidebar
        activePage={activePage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />


      <main
        className="
          ml-[294px]
          min-h-screen
          flex-1
          bg-slate-50
          p-8
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-10
            shadow-sm
          "
        >

          <div className="mb-5 text-5xl">
            {icon}
          </div>


          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            {title}
          </h1>


          <p
            className="
              mt-3
              text-lg
              text-slate-500
            "
          >
            {description}
          </p>


          <button
            type="button"
            onClick={onBack}
            className="
              mt-8
              rounded-xl
              bg-purple-600
              px-7
              py-3
              font-semibold
              text-white
              shadow-md
              hover:bg-purple-700
            "
          >
            ← Back to Dashboard
          </button>

        </div>

      </main>

    </div>
  );
}


export default App;