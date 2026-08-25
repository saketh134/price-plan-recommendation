import { useState } from "react";


// ============================================================
// ADMIN CLUSTERING
// ============================================================

function AdminClustering({
  onBack,
  onNavigate,
  onLogout,
}) {

  // ============================================================
  // DEFAULT CLUSTERING DATA
  // ============================================================

  const defaultData = {
    totalCustomers: 3000,

    totalClusters: 4,

    silhouetteScore: 0.62,

    inertia: 1256.40,

    clusterDistribution: [
      {
        cluster: 0,
        customers: 1050,
        percentage: 35,
        type: "Light Users",
      },
      {
        cluster: 1,
        customers: 750,
        percentage: 25,
        type: "Moderate Users",
      },
      {
        cluster: 2,
        customers: 540,
        percentage: 18,
        type: "International Users",
      },
      {
        cluster: 3,
        customers: 660,
        percentage: 22,
        type: "Heavy Users",
      },
    ],

    averageUsage: {
      day: 220.4,
      evening: 430.6,
      night: 187.7,
      international: 12.8,
      voicemail: 2.7,
    },
  };


  // ============================================================
  // STATE
  // ============================================================

  const [clusteringData, setClusteringData] =
    useState(defaultData);


  const [loading, setLoading] =
    useState(false);


  const [apiStatus, setApiStatus] =
    useState("Ready");


  const [errorMessage, setErrorMessage] =
    useState("");


  // ============================================================
  // RUN K-MEANS
  // ============================================================

  async function runClustering() {

    setLoading(true);

    setErrorMessage("");

    setApiStatus("Running...");


    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/clustering",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (!response.ok) {

        throw new Error(
          `Backend returned ${response.status}`
        );

      }


      const data =
        await response.json();


      console.log(
        "K-MEANS API RESPONSE:",
        data
      );


      // ========================================================
      // NORMALIZE API RESPONSE
      // ========================================================

      const updatedData = {

        totalCustomers:
          data?.totalCustomers ??
          data?.total_customers ??
          defaultData.totalCustomers,


        totalClusters:
          data?.totalClusters ??
          data?.total_clusters ??
          defaultData.totalClusters,


        silhouetteScore:
          data?.silhouetteScore ??
          data?.silhouette_score ??
          defaultData.silhouetteScore,


        inertia:
          data?.inertia ??
          defaultData.inertia,


        clusterDistribution:
          data?.clusterDistribution ??
          data?.cluster_distribution ??
          defaultData.clusterDistribution,


        averageUsage:
          data?.averageUsage ??
          data?.average_usage ??
          defaultData.averageUsage,

      };


      setClusteringData(
        updatedData
      );


      setApiStatus(
        "Connected"
      );

    }

    catch (error) {

      console.error(
        "K-MEANS API ERROR:",
        error
      );


      /*
       * If backend API is not available,
       * keep showing the default values.
       */

      setClusteringData(
        defaultData
      );


      setApiStatus(
        "Demo Data"
      );


      setErrorMessage(
        "Backend clustering API is not available. Showing sample clustering results."
      );

    }

    finally {

      setLoading(false);

    }

  }


  // ============================================================
  // REFRESH
  // ============================================================

  function handleRefresh() {

    runClustering();

  }


  // ============================================================
  // SIDEBAR BUTTON
  // ============================================================

  function SidebarButton({
    icon,
    label,
    page,
    active = false,
  }) {

    return (

      <button
        type="button"

        onClick={() => {

          onNavigate(page);

        }}

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
              ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg"
              : "text-white hover:bg-white/10"
          }
        `}
      >

        <span
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            bg-white/10
            text-lg
          "
        >
          {icon}
        </span>


        <span
          className="
            font-semibold
          "
        >
          {label}
        </span>

      </button>

    );

  }


  // ============================================================
  // MAIN UI
  // ============================================================

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
      "
    >

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className="
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[290px]
          flex-col
          bg-[#101a35]
          text-white
        "
      >

        {/* ====================================================
            LOGO
        ==================================================== */}

        <div
          className="
            flex
            items-center
            gap-4
            border-b
            border-white/10
            px-5
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

            <h1
              className="
                text-xl
                font-bold
              "
            >
              TariffSmart
            </h1>


            <p
              className="
                text-sm
                text-blue-200
              "
            >
              Admin Dashboard
            </p>

          </div>

        </div>


        {/* ====================================================
            NAVIGATION
        ==================================================== */}

        <nav
          className="
            flex-1
            space-y-2
            overflow-y-auto
            px-3
            py-8
          "
        >

          <SidebarButton
            icon="⌂"
            label="Dashboard"
            page="dashboard"
          />


          <SidebarButton
            icon="♟"
            label="Customers"
            page="customers"
          />


          <SidebarButton
            icon="▤"
            label="Dataset Management"
            page="dataset"
          />


          <SidebarButton
            icon="⌘"
            label="Clustering (K-Means)"
            page="clustering"
            active
          />


          <SidebarButton
            icon="▥"
            label="Usage Analytics"
            page="usage"
          />


          <SidebarButton
            icon="▣"
            label="Tariff Plans"
            page="tariffs"
          />


          <SidebarButton
            icon="☆"
            label="Recommendations"
            page="recommendations"
          />

        </nav>


        {/* ====================================================
            ADMIN PROFILE
        ==================================================== */}

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
              bg-[#1d2948]
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

                <p
                  className="
                    font-bold
                  "
                >
                  Admin
                </p>


                <p
                  className="
                    text-sm
                    text-blue-200
                  "
                >
                  Super Administrator
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    text-green-400
                  "
                >
                  ● Online
                </p>

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
              transition
              hover:bg-red-500/10
            "
          >

            <span
              className="text-xl"
            >
              ↪
            </span>

            Logout

          </button>

        </div>

      </aside>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="
          ml-[290px]
          min-h-screen
          p-8
        "
      >

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <div
              className="
                mb-3
                text-4xl
              "
            >
              📊
            </div>


            <h1
              className="
                text-4xl
                font-bold
                text-slate-900
              "
            >
              Clustering (K-Means)
            </h1>


            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Customer segmentation using K-Means clustering
            </p>

          </div>


          <div
            className="
              flex
              flex-wrap
              gap-3
            "
          >

            {/* API STATUS */}

            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                shadow-sm
              "
            >

              <span
                className={`
                  h-2.5
                  w-2.5
                  rounded-full

                  ${
                    apiStatus === "Connected"
                      ? "bg-green-500"
                      : apiStatus === "Running..."
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }
                `}
              />

              <span
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                {apiStatus}
              </span>

            </div>


            {/* REFRESH */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
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
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {loading
                ? "Running..."
                : "↻ Refresh"}

            </button>


            {/* BACK */}

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
                shadow-sm
                transition
                hover:bg-purple-700
              "
            >
              ← Dashboard
            </button>

          </div>

        </div>


        {/* ====================================================
            ERROR / DEMO MESSAGE
        ==================================================== */}

        {errorMessage && (

          <div
            className="
              mb-6
              rounded-xl
              border
              border-yellow-200
              bg-yellow-50
              p-4
            "
          >

            <p
              className="
                font-semibold
                text-yellow-800
              "
            >
              ⚠ {errorMessage}
            </p>

          </div>

        )}


        {/* ====================================================
            TOP METRIC CARDS
        ==================================================== */}

        <div
          className="
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          <MetricCard
            icon="👥"
            title="Total Customers"
            value={Number(
              clusteringData.totalCustomers
            ).toLocaleString()}
            subtitle="Customers in dataset"
          />


          <MetricCard
            icon="⌘"
            title="Total Clusters"
            value={
              clusteringData.totalClusters
            }
            subtitle="K-Means clusters"
          />


          <MetricCard
            icon="◎"
            title="Silhouette Score"
            value={Number(
              clusteringData.silhouetteScore
            ).toFixed(2)}
            subtitle="Clustering quality"
          />


          <MetricCard
            icon="↗"
            title="Elbow / Inertia"
            value={Number(
              clusteringData.inertia
            ).toFixed(2)}
            subtitle="K-Means evaluation"
          />

        </div>


        {/* ====================================================
            CLUSTER DISTRIBUTION + MODEL INFORMATION
        ==================================================== */}

        <div
          className="
            mt-6
            grid
            gap-6
            xl:grid-cols-2
          "
        >

          {/* ==================================================
              CLUSTER DISTRIBUTION
          ================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-7
              shadow-sm
            "
          >

            <div
              className="
                mb-6
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
                  text-xl
                "
              >
                👥
              </div>


              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  Customer Distribution by Cluster
                </h2>


                <p
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  Customer segmentation
                </p>

              </div>

            </div>


            <div
              className="
                space-y-6
              "
            >

              {clusteringData.clusterDistribution.map(
                (item) => (

                  <div
                    key={item.cluster}
                  >

                    <div
                      className="
                        mb-2
                        flex
                        flex-col
                        gap-1
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      <div>

                        <span
                          className="
                            font-semibold
                            text-slate-800
                          "
                        >
                          Cluster {item.cluster}
                        </span>


                        <span
                          className="
                            ml-2
                            text-sm
                            text-slate-400
                          "
                        >
                          {item.type}
                        </span>

                      </div>


                      <span
                        className="
                          text-sm
                          font-semibold
                          text-slate-600
                        "
                      >
                        {Number(
                          item.customers
                        ).toLocaleString()}

                        {" "}customers

                        {" "}

                        ({item.percentage}%)

                      </span>

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
                            `${item.percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* ==================================================
              MODEL INFORMATION
          ================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-7
              shadow-sm
            "
          >

            <div
              className="
                mb-6
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
                  text-xl
                "
              >
                📊
              </div>


              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  K-Means Model
                </h2>


                <p
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  Clustering configuration
                </p>

              </div>

            </div>


            <div
              className="
                grid
                gap-4
                md:grid-cols-2
              "
            >

              <InfoBox
                label="Algorithm"
                value="K-Means"
              />


              <InfoBox
                label="Number of Clusters"
                value={`K = ${clusteringData.totalClusters}`}
              />


              <InfoBox
                label="Silhouette Score"
                value={Number(
                  clusteringData.silhouetteScore
                ).toFixed(2)}
              />


              <InfoBox
                label="Inertia"
                value={Number(
                  clusteringData.inertia
                ).toFixed(2)}
              />


              <InfoBox
                label="Scaling"
                value="StandardScaler"
              />


              <InfoBox
                label="Clustering Status"
                value={
                  apiStatus === "Connected"
                    ? "API Connected"
                    : "Completed"
                }
                success
              />

            </div>


            {/* STATUS */}

            <div
              className="
                mt-5
                rounded-xl
                border
                border-green-200
                bg-green-50
                p-4
              "
            >

              <p
                className="
                  font-semibold
                  text-green-700
                "
              >
                ● Clustering results available
              </p>


              <p
                className="
                  mt-1
                  text-sm
                  text-green-600
                "
              >

                {Number(
                  clusteringData.totalCustomers
                ).toLocaleString()}

                {" "}customers were assigned to{" "}

                {clusteringData.totalClusters}

                {" "}clusters.

              </p>

            </div>

          </section>

        </div>


        {/* ====================================================
            AVERAGE USAGE
        ==================================================== */}

        <section
          className="
            mt-6
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-sm
          "
        >

          <div
            className="
              mb-6
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
                text-xl
              "
            >
              📈
            </div>


            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                Average Usage
              </h2>


              <p
                className="
                  text-sm
                  text-slate-400
                "
              >
                All customers in minutes
              </p>

            </div>

          </div>


          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-5
            "
          >

            <UsageCard
              title="Day"
              value={
                clusteringData.averageUsage.day
              }
            />


            <UsageCard
              title="Evening"
              value={
                clusteringData.averageUsage.evening
              }
            />


            <UsageCard
              title="Night"
              value={
                clusteringData.averageUsage.night
              }
            />


            <UsageCard
              title="International"
              value={
                clusteringData.averageUsage.international
              }
            />


            <UsageCard
              title="Voicemail"
              value={
                clusteringData.averageUsage.voicemail
              }
            />

          </div>

        </section>


        {/* ====================================================
            CLUSTER DETAILS
        ==================================================== */}

        <section
          className="
            mt-6
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-7
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
            Cluster Details
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-400
            "
          >
            Customer segments generated by K-Means
          </p>


          <div
            className="
              mt-6
              overflow-x-auto
            "
          >

            <table
              className="
                w-full
                min-w-[700px]
                border-collapse
              "
            >

              <thead>

                <tr
                  className="
                    border-b
                    bg-slate-50
                  "
                >

                  <th
                    className="
                      p-4
                      text-left
                    "
                  >
                    Cluster
                  </th>


                  <th
                    className="
                      p-4
                      text-left
                    "
                  >
                    Customer Type
                  </th>


                  <th
                    className="
                      p-4
                      text-left
                    "
                  >
                    Customers
                  </th>


                  <th
                    className="
                      p-4
                      text-left
                    "
                  >
                    Percentage
                  </th>


                  <th
                    className="
                      p-4
                      text-left
                    "
                  >
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {clusteringData.clusterDistribution.map(
                  (item) => (

                    <tr
                      key={item.cluster}
                      className="
                        border-b
                        last:border-b-0
                        hover:bg-slate-50
                      "
                    >

                      <td className="p-4">

                        <span
                          className="
                            rounded-lg
                            bg-purple-100
                            px-3
                            py-1
                            font-semibold
                            text-purple-700
                          "
                        >
                          Cluster {item.cluster}
                        </span>

                      </td>


                      <td
                        className="
                          p-4
                          font-medium
                          text-slate-700
                        "
                      >
                        {item.type}
                      </td>


                      <td
                        className="
                          p-4
                          text-slate-700
                        "
                      >
                        {Number(
                          item.customers
                        ).toLocaleString()}
                      </td>


                      <td
                        className="
                          p-4
                          text-slate-700
                        "
                      >
                        {item.percentage}%
                      </td>


                      <td className="p-4">

                        <span
                          className="
                            rounded-full
                            bg-green-100
                            px-3
                            py-1
                            text-sm
                            font-semibold
                            text-green-700
                          "
                        >
                          Active
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* ====================================================
            RUN K-MEANS BUTTON
        ==================================================== */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:justify-end
          "
        >

          <button
            type="button"
            onClick={runClustering}
            disabled={loading}
            className="
              rounded-xl
              bg-gradient-to-r
              from-purple-600
              to-fuchsia-600
              px-7
              py-3
              font-semibold
              text-white
              shadow-lg
              transition
              hover:scale-[1.02]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {loading
              ? "Running K-Means..."
              : "▶ Run K-Means Clustering"}

          </button>

        </div>


        {/* ====================================================
            EXPLANATION
        ==================================================== */}

        <section
          className="
            mt-6
            rounded-2xl
            border
            border-purple-100
            bg-purple-50
            p-6
          "
        >

          <h2
            className="
              text-lg
              font-bold
              text-purple-900
            "
          >
            How this clustering works
          </h2>


          <div
            className="
              mt-4
              grid
              gap-4
              md:grid-cols-4
            "
          >

            <StepCard
              number="1"
              title="Load Data"
              text="Customer usage data is loaded from the dataset."
            />


            <StepCard
              number="2"
              title="Scale Data"
              text="Usage features are standardized using StandardScaler."
            />


            <StepCard
              number="3"
              title="K-Means"
              text="Customers are grouped into 4 usage-based clusters."
            />


            <StepCard
              number="4"
              title="Analyze"
              text="Clusters are used for tariff plan recommendation."
            />

          </div>

        </section>

      </main>

    </div>

  );

}


// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({
  icon,
  title,
  value,
  subtitle,
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

          <p
            className="
              text-sm
              font-medium
              text-slate-400
            "
          >
            {title}
          </p>


          <h2
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
            "
          >
            {value}
          </h2>


          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            {subtitle}
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
            text-xl
            text-purple-600
          "
        >
          {icon}
        </div>

      </div>

    </div>

  );

}


// ============================================================
// INFO BOX
// ============================================================

function InfoBox({
  label,
  value,
  success = false,
}) {

  return (

    <div
      className="
        rounded-xl
        bg-slate-50
        p-4
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
        className={`
          mt-2
          font-bold
          ${
            success
              ? "text-green-600"
              : "text-slate-900"
          }
        `}
      >
        {value}
      </p>

    </div>

  );

}


// ============================================================
// USAGE CARD
// ============================================================

function UsageCard({
  title,
  value,
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-slate-100
        bg-slate-50
        p-5
        text-center
      "
    >

      <p
        className="
          text-sm
          text-slate-400
        "
      >
        {title}
      </p>


      <p
        className="
          mt-2
          text-2xl
          font-bold
          text-slate-900
        "
      >
        {Number(value).toFixed(1)}
      </p>


      <p
        className="
          text-xs
          text-slate-400
        "
      >
        mins
      </p>

    </div>

  );

}


// ============================================================
// STEP CARD
// ============================================================

function StepCard({
  number,
  title,
  text,
}) {

  return (

    <div
      className="
        rounded-xl
        bg-white
        p-4
        shadow-sm
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
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-purple-600
            font-bold
            text-white
          "
        >
          {number}
        </div>


        <h3
          className="
            font-bold
            text-slate-900
          "
        >
          {title}
        </h3>

      </div>


      <p
        className="
          mt-3
          text-sm
          leading-6
          text-slate-500
        "
      >
        {text}
      </p>

    </div>

  );

}


export default AdminClustering;