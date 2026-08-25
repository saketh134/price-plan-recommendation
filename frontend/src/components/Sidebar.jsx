import {
  BarChart3,
  LogOut,
  Package,
  UserRound,
  X,
  Menu,
  GitCompare,
  Settings,
} from "lucide-react";

import { useState } from "react";

function Sidebar({
  page,
  setPage,
  onLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const navigation = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },

    {
      id: "customer",
      label: "Customer Analysis",
      icon: UserRound,
    },

    {
      id: "tariffs",
      label: "Tariff Plans",
      icon: Package,
    },

    // =======================================================
    // NEW - PLAN COMPARISON
    // =======================================================

    {
      id: "comparison",
      label: "Plan Comparison",
      icon: GitCompare,
    },

    // =======================================================
    // NEW - MY PROFILE
    // =======================================================

    {
      id: "profile",
      label: "My Profile",
      icon: UserRound,
    },

    // =======================================================
    // NEW - SETTINGS
    // =======================================================

    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  // =========================================================
  // NAVIGATE
  // =========================================================

  function navigate(id) {
    console.log("SIDEBAR CLICKED:", id);

    setPage(id);

    setMobileOpen(false);
  }

  return (
    <>
      {/* =====================================================
          MOBILE MENU BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="
          fixed
          left-4
          top-4
          z-50
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-purple-600
          text-white
          shadow-xl
          transition
          hover:bg-purple-700
          hover:scale-105
          lg:hidden
        "
      >
        <Menu size={20} />
      </button>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-slate-950/50
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          overflow-hidden
          bg-gradient-to-b
          from-[#120d3d]
          via-[#21145d]
          to-[#302080]
          text-white
          shadow-2xl
          transition-transform
          duration-300

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/10
            px-6
            py-5
          "
        >
          <div className="flex items-center gap-3">
            {/* LOGO */}

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-white/10
                ring-1
                ring-white/10
                shadow-lg
              "
            >
              <Package size={22} />
            </div>

            {/* BRAND */}

            <div>
              <h1
                className="
                  text-lg
                  font-extrabold
                  tracking-tight
                "
              >
                TariffSmart
              </h1>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  font-medium
                  text-purple-200/60
                "
              >
                Smart Plans • Maximum Savings
              </p>
            </div>
          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="
              rounded-lg
              p-1.5
              text-white/60
              transition
              hover:bg-white/10
              hover:text-white
              lg:hidden
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav
          className="
            flex-1
            space-y-2
            overflow-y-auto
            p-4
          "
        >
          {/* WORKSPACE TITLE */}

          <p
            className="
              mb-3
              px-3
              text-[9px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-purple-200/40
            "
          >
            Workspace
          </p>

          {/* NAVIGATION ITEMS */}

          {navigation.map(
            ({
              id,
              label,
              icon: Icon,
            }) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(id)}
                className={`
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-semibold
                  transition-all
                  duration-200

                  ${
                    page === id
                      ? `
                        bg-white
                        text-purple-700
                        shadow-lg
                        shadow-purple-950/20
                      `
                      : `
                        text-purple-100/70
                        hover:bg-white/10
                        hover:text-white
                        hover:translate-x-1
                      `
                  }
                `}
              >
                {/* ICON */}

                <span
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    transition

                    ${
                      page === id
                        ? `
                          bg-purple-100
                          text-purple-600
                        `
                        : `
                          bg-white/5
                          text-purple-200
                          group-hover:bg-white/10
                        `
                    }
                  `}
                >
                  <Icon size={17} />
                </span>

                {/* LABEL */}

                <span>
                  {label}
                </span>
              </button>
            )
          )}
        </nav>

        {/* =================================================
            DATASET STATUS
        ================================================= */}

        <div
          className="
            mx-4
            mb-4
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-4
            backdrop-blur-sm
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-emerald-400
                shadow-lg
                shadow-emerald-400/50
              "
            />

            <span
              className="
                text-[10px]
                font-bold
                text-white
              "
            >
              Dataset Connected
            </span>
          </div>

          <p
            className="
              mt-2
              text-[9px]
              leading-4
              text-purple-200/50
            "
          >
            Customer recommendations are
            generated from actual usage data.
          </p>
        </div>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <div
          className="
            border-t
            border-white/10
            p-4
          "
        >
          <button
            type="button"
            onClick={onLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-semibold
              text-red-200
              transition-all
              duration-200
              hover:bg-red-500/10
              hover:text-red-100
              hover:translate-x-1
            "
          >
            <LogOut size={18} />

            <span>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;