import { useEffect, useState } from "react";

// ============================================================
// ADMIN DASHBOARD
// ============================================================

function AdminDashboard({ onLogout }) {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activePage, setActivePage] =
    useState("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  // Admin assistant state
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Uploaded dataset state
  const [uploadedDataset, setUploadedDataset] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedColumns, setUploadedColumns] = useState([]);
  const [uploadedRows, setUploadedRows] = useState([]);
  const [uploadError, setUploadError] = useState("");


  // ==========================================================
  // CSV UPLOAD
  // ==========================================================

  function parseCSVLine(line) {

    const values = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {

      const char = line[i];
      const next = line[i + 1];

      if (char === '"' && insideQuotes && next === '"') {
        current += '"';
        i++;
        continue;
      }

      if (char === '"') {
        insideQuotes = !insideQuotes;
        continue;
      }

      if (char === "," && !insideQuotes) {
        values.push(current.trim());
        current = "";
        continue;
      }

      current += char;
    }

    values.push(current.trim());

    return values;
  }


  function handleDatasetUpload(event) {

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadError(
        "Please upload a CSV file (.csv)."
      );
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {

      try {

        const csvText =
          String(e.target?.result || "")
            .replace(/^\uFEFF/, "");

        const lines =
          csvText
            .split(/\r?\n/)
            .filter(
              (line) => line.trim().length > 0
            );

        if (lines.length === 0) {
          throw new Error(
            "The uploaded CSV file is empty."
          );
        }

        const columns =
          parseCSVLine(lines[0]).map(
            (column) => column.trim()
          );

        if (columns.length === 0) {
          throw new Error(
            "No columns were found in the CSV file."
          );
        }

        const rows = lines
          .slice(1)
          .map((line) => {

            const values = parseCSVLine(line);
            const row = {};

            columns.forEach(
              (column, index) => {
                row[column] =
                  values[index] ?? "";
              }
            );

            return row;
          });

        setUploadedDataset({
          name: file.name,
          size: file.size,
          lastModified: file.lastModified
        });

        setUploadedFileName(file.name);
        setUploadedColumns(columns);
        setUploadedRows(rows);

      } catch (err) {

        console.error(
          "DATASET UPLOAD ERROR:",
          err
        );

        setUploadError(
          err.message ||
          "Unable to read the CSV file."
        );

        setUploadedDataset(null);
        setUploadedFileName("");
        setUploadedColumns([]);
        setUploadedRows([]);
      }

    };

    reader.onerror = () => {

      setUploadError(
        "Unable to read the selected file."
      );

    };

    reader.readAsText(file);

    // Allow selecting the same file again
    event.target.value = "";
  }


  // ==========================================================
  // API URL
  // ==========================================================

  const API_URL =
    "http://127.0.0.1:8000/api/admin/dashboard";


  // ==========================================================
  // LOAD ADMIN DATA
  // ==========================================================

  async function loadDashboard() {

    try {

      setLoading(true);

      setError("");

      const response =
        await fetch(API_URL);

      if (!response.ok) {

        throw new Error(
          `Unable to load admin dashboard. Status: ${response.status}`
        );

      }

      const result =
        await response.json();

      console.log(
        "ADMIN DASHBOARD DATA:",
        result
      );

      setData(result);

    } catch (err) {

      console.error(
        "ADMIN DASHBOARD ERROR:",
        err
      );

      setError(
        err.message ||
        "Unable to load admin dashboard data."
      );

    } finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // LOAD WHEN PAGE OPENS
  // ==========================================================

  useEffect(() => {

    loadDashboard();

  }, []);


  // ==========================================================
  // LOGOUT
  // ==========================================================

  function handleLogout() {

    localStorage.removeItem(
      "adminLoggedIn"
    );

    localStorage.removeItem(
      "adminUser"
    );

    localStorage.removeItem(
      "userRole"
    );

    if (typeof onLogout === "function") {

      onLogout();

      return;

    }

    window.location.reload();

  }


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  function handleNavigation(page) {

    setActivePage(page);

  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-slate-50
        "
      >

        <div
          className="
            rounded-2xl
            bg-white
            px-10
            py-8
            text-center
            shadow-lg
          "
        >

          <div
            className="
              mx-auto
              mb-4
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-purple-200
              border-t-purple-600
            "
          />

          <h2
            className="
              text-lg
              font-bold
              text-slate-800
            "
          >
            Loading Admin Dashboard...
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Please wait
          </p>

        </div>

      </div>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-slate-50
          p-6
        "
      >

        <div
          className="
            w-full
            max-w-2xl
            rounded-2xl
            border
            border-red-200
            bg-white
            p-10
            shadow-lg
          "
        >

          <div
            className="
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-red-100
              text-3xl
            "
          >
            ⚠️
          </div>

          <h1
            className="
              text-3xl
              font-bold
              text-red-600
            "
          >
            Admin Dashboard Error
          </h1>

          <p
            className="
              mt-3
              text-lg
              text-slate-600
            "
          >
            {error}
          </p>

          <div
            className="
              mt-6
              rounded-xl
              bg-slate-50
              p-5
            "
          >

            <p
              className="
                text-sm
                font-bold
                uppercase
                text-slate-500
              "
            >
              API Endpoint
            </p>

            <p
              className="
                mt-2
                break-all
                font-mono
                text-sm
                text-purple-600
              "
            >
              {API_URL}
            </p>

          </div>

          <div
            className="
              mt-6
              flex
              gap-3
            "
          >

            <button
              onClick={loadDashboard}
              className="
                rounded-xl
                bg-purple-600
                px-6
                py-3
                font-semibold
                text-white
                shadow-md
                transition
                hover:bg-purple-700
              "
            >
              ↻ Try Again
            </button>

            <button
              onClick={handleLogout}
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-6
                py-3
                font-semibold
                text-slate-700
                hover:bg-slate-50
              "
            >
              Logout
            </button>

          </div>

        </div>

      </div>

    );

  }


  // ==========================================================
  // SAFE DATA
  // ==========================================================

  const summary =
    data?.summary || {};

  const clusters =
    Array.isArray(data?.clusters)
      ? data.clusters
      : [];

  const usage =
    data?.usage || {};

  const recommendedPlans =
    Array.isArray(data?.recommended_plans)
      ? data.recommended_plans
      : [];

  const recentCustomers =
    Array.isArray(data?.recent_customers)
      ? data.recent_customers
      : [];

  const recentActivity =
    Array.isArray(data?.recent_activity)
      ? data.recent_activity
      : [];

  const metrics =
    data?.metrics || {};


  // ==========================================================
  // MENU ITEM
  // ==========================================================

  function MenuItem({
    id,
    icon,
    label
  }) {

    const active =
      activePage === id;

    return (

      <button
        onClick={() =>
          handleNavigation(id)
        }
        className={`
          group
          flex
          w-full
          items-center
          gap-4
          rounded-xl
          px-4
          py-3
          text-left
          transition-all
          ${
            active
              ? "bg-purple-600 text-white shadow-lg"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }
        `}
      >

        <span
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-white/10
            text-lg
          "
        >
          {icon}
        </span>

        {sidebarOpen && (

          <span
            className="
              text-sm
              font-medium
            "
          >
            {label}
          </span>

        )}

      </button>

    );

  }


  // ==========================================================
  // CLUSTERING PAGE
  // ==========================================================

  function ClusteringPage() {

    const totalCustomers = Number(summary.total_customers || 0);
    const totalClusters = Number(summary.total_clusters || clusters.length || 0);
    const silhouette = Number(metrics.silhouette_score || 0);
    const inertia = Number(metrics.elbow_inertia || 0);

    const getPercentage = (cluster) => {
      if (cluster?.percentage != null) {
        return Math.min(Math.max(Number(cluster.percentage) || 0, 0), 100);
      }
      if (totalCustomers > 0) {
        return Math.min(Math.max((Number(cluster?.count || 0) / totalCustomers) * 100, 0), 100);
      }
      return 0;
    };

    return (
      <div className="p-6 lg:p-8">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">🔗</div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">Machine Learning</p>
                <h1 className="text-3xl font-bold text-slate-900">Clustering (K-Means)</h1>
              </div>
            </div>
            <p className="text-sm text-slate-500">Customer segmentation based on telecom usage behaviour.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={loadDashboard} className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50">↻ Refresh</button>
            <button onClick={() => setActivePage("dashboard")} className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700">← Dashboard</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Customers" value={formatNumber(totalCustomers)} subtitle="Customers clustered" icon="👥" />
          <StatCard title="Total Clusters" value={formatNumber(totalClusters)} subtitle="K-Means groups" icon="🔗" />
          <StatCard title="Silhouette Score" value={silhouette.toFixed(2)} subtitle="Clustering quality" icon="🎯" />
          <StatCard title="Inertia" value={inertia.toFixed(2)} subtitle="K-Means evaluation" icon="📈" />
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader icon="📊" title="Customer Distribution by Cluster" subtitle="Number and percentage of customers in each cluster" />
          {clusters.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <div className="text-4xl">📭</div>
              <p className="mt-3 font-semibold text-slate-700">No cluster data available</p>
              <p className="mt-1 text-sm text-slate-400">The admin API did not return K-Means results.</p>
              <button onClick={loadDashboard} className="mt-5 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700">Reload Cluster Data</button>
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {clusters.map((cluster, index) => {
                const id = cluster?.cluster ?? index;
                const count = Number(cluster?.count || 0);
                const percentage = getPercentage(cluster);
                return (
                  <div key={id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-700">{id}</div>
                        <div><p className="font-bold text-slate-800">{cluster?.name || cluster?.label || `Cluster ${id}`}</p><p className="mt-1 text-xs text-slate-400">K-Means customer segment</p></div>
                      </div>
                      <div className="text-right"><p className="text-2xl font-bold text-slate-900">{formatNumber(count)}</p><p className="text-xs text-slate-400">customers</p></div>
                    </div>
                    <div className="mt-5 flex justify-between text-xs font-semibold"><span className="text-slate-500">Customer share</span><span className="text-purple-600">{percentage.toFixed(1)}%</span></div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500" style={{ width: `${percentage}%` }} /></div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader icon="📱" title="Average Usage" subtitle="Average telecom usage in minutes" />
            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
              <UsageCard title="Day" value={usage.day} /><UsageCard title="Evening" value={usage.evening} /><UsageCard title="Night" value={usage.night} /><UsageCard title="International" value={usage.international} /><UsageCard title="Voicemail" value={usage.voicemail} />
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader icon="🎯" title="K-Means Model Evaluation" subtitle="Clustering quality metrics" />
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MetricCard title="Silhouette Score" value={silhouette.toFixed(2)} subtitle="Clustering quality" icon="🎯" />
              <MetricCard title="Elbow / Inertia" value={inertia.toFixed(2)} subtitle="K-Means evaluation" icon="📈" />
            </div>
          </section>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6"><SectionHeader icon="👥" title="Customer Cluster Assignments" subtitle="Recent customer records and assigned clusters" /></div>
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-y border-slate-100 bg-slate-50">
            <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Customer ID</th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Phone Number</th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Day</th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Evening</th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">International</th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Cluster</th>
          </tr></thead><tbody>
            {recentCustomers.length === 0 ? (<tr><td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-400">No customer records available.</td></tr>) : recentCustomers.map((customer, index) => (
              <tr key={customer.customer_id || customer.phone_number || index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-5 font-medium text-slate-800">{customer.customer_id || customer.customerId || customer.id || "N/A"}</td>
                <td className="px-6 py-5 text-slate-600">{customer.phone_number || customer.phone || "N/A"}</td>
                <td className="px-6 py-5 text-slate-600">{formatValue(customer.day_minutes ?? customer.day)}</td>
                <td className="px-6 py-5 text-slate-600">{formatValue(customer.evening_minutes ?? customer.evening)}</td>
                <td className="px-6 py-5 text-slate-600">{formatValue(customer.international_minutes ?? customer.international)}</td>
                <td className="px-6 py-5"><span className="rounded-full bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700">Cluster {customer.cluster ?? "N/A"}</span></td>
              </tr>
            ))}
          </tbody></table></div>
        </section>

        <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-5 text-sm text-purple-700">
          <p className="font-semibold">K-Means Clustering</p>
          <p className="mt-2">This page displays cluster distribution, average usage, model evaluation metrics, and customer cluster assignments using the same admin dashboard API.</p>
        </div>
      </div>
    );
  }


  // ==========================================================
  // USAGE ANALYTICS PAGE
  // ==========================================================

  function UsageAnalyticsPage() {

    const totalCustomers = Number(summary.total_customers || recentCustomers.length || 0);
    const values = {
      day: Number(usage.day || 0),
      evening: Number(usage.evening || 0),
      night: Number(usage.night || 0),
      international: Number(usage.international || 0),
      voicemail: Number(usage.voicemail || 0),
    };

    const totalUsage = Object.values(values).reduce((a, b) => a + b, 0);
    const peak = Object.entries(values).sort((a, b) => b[1] - a[1])[0];
    const maxUsage = Math.max(...Object.values(values), 1);
    const serviceCalls = Number(
      usage.customer_service_calls ??
      usage.service_calls ??
      summary.average_customer_service_calls ??
      0
    );

    const usageItems = [
      { key: "day", label: "Day Calls", value: values.day, icon: "☀️" },
      { key: "evening", label: "Evening Calls", value: values.evening, icon: "🌆" },
      { key: "night", label: "Night Calls", value: values.night, icon: "🌙" },
      { key: "international", label: "International", value: values.international, icon: "🌍" },
      { key: "voicemail", label: "Voicemail", value: values.voicemail, icon: "📩" },
    ];

    return (
      <div className="p-6 lg:p-8">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">📊</div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">Customer Behaviour</p>
                <h1 className="text-3xl font-bold text-slate-900">Usage Analytics</h1>
              </div>
            </div>
            <p className="text-sm text-slate-500">Analyse customer calling behaviour and identify the highest usage segments.</p>
          </div>
          <button onClick={loadDashboard} className="w-fit rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50">↻ Refresh Analytics</button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Customers" value={formatNumber(totalCustomers)} subtitle="Customers analysed" icon="👥" />
          <StatCard title="Total Usage" value={`${totalUsage.toFixed(1)} min`} subtitle="Combined average usage" icon="📱" />
          <StatCard title="Peak Usage" value={peak ? `${peak[1].toFixed(1)} min` : "0 min"} subtitle={peak ? `${peak[0]} usage is highest` : "No usage data"} icon="🔥" />
          <StatCard title="Service Calls" value={serviceCalls.toFixed(1)} subtitle="Average customer service calls" icon="☎️" />
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader icon="📈" title="Average Usage by Category" subtitle="Average usage returned by the admin API" />
          <div className="mt-7 space-y-5">
            {usageItems.map((item) => {
              const percentage = Math.min((item.value / maxUsage) * 100, 100);
              return (
                <div key={item.key}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-lg">{item.icon}</span>
                      <span className="font-semibold text-slate-800">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{item.value.toFixed(1)} min</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <SectionHeader icon="👥" title="Usage Profile" subtitle="How the customer base can be interpreted" />
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-purple-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-purple-600">Highest usage period</p>
                <p className="mt-2 text-2xl font-bold capitalize text-slate-900">{peak?.[0] || "N/A"}</p>
                <p className="mt-1 text-sm text-slate-500">{peak ? `${peak[1].toFixed(1)} average minutes` : "Usage information is unavailable."}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">International usage</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{values.international.toFixed(1)} min</p>
                <p className="mt-1 text-sm text-slate-500">Useful for international plan matching.</p>
              </div>
              <div className="rounded-xl bg-green-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-green-600">Voicemail usage</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{values.voicemail.toFixed(1)} min</p>
                <p className="mt-1 text-sm text-slate-500">Helps identify voicemail-oriented customers.</p>
              </div>
              <div className="rounded-xl bg-orange-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-orange-600">Customer service</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{serviceCalls.toFixed(1)}</p>
                <p className="mt-1 text-sm text-slate-500">Average service interactions.</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader icon="💡" title="Analytics Insights" subtitle="Quick interpretation" />
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="font-semibold text-slate-800">Usage segmentation</p><p className="mt-1 text-sm text-slate-500">Customers can be grouped using their calling patterns before tariff recommendation.</p></div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="font-semibold text-slate-800">Plan matching</p><p className="mt-1 text-sm text-slate-500">High day, evening, night or international usage can influence the recommended plan.</p></div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="font-semibold text-slate-800">Model input</p><p className="mt-1 text-sm text-slate-500">These usage features can be used by the clustering and recommendation pipeline.</p></div>
            </div>
          </section>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6"><SectionHeader icon="👤" title="Customer Usage Records" subtitle={`Showing ${recentCustomers.length} records returned by the API`} /></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-y border-slate-100 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Day</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Evening</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Night</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">International</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Cluster</th>
              </tr></thead>
              <tbody>
                {recentCustomers.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-400">No customer usage records available.</td></tr>
                ) : recentCustomers.map((customer, index) => (
                  <tr key={customer.customer_id || customer.phone_number || index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">{customer.customer_id || customer.customerId || customer.id || customer.phone_number || "N/A"}</td>
                    <td className="px-6 py-4 text-slate-600">{formatValue(customer.day_minutes ?? customer.day)}</td>
                    <td className="px-6 py-4 text-slate-600">{formatValue(customer.evening_minutes ?? customer.evening)}</td>
                    <td className="px-6 py-4 text-slate-600">{formatValue(customer.night_minutes ?? customer.night)}</td>
                    <td className="px-6 py-4 text-slate-600">{formatValue(customer.international_minutes ?? customer.international)}</td>
                    <td className="px-6 py-4"><span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">{customer.cluster != null ? `Cluster ${customer.cluster}` : "N/A"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }


  // ==========================================================
  // TARIFF PLANS PAGE
  // ==========================================================

  function TariffPlansPage() {

    const planCatalog = [
      { name: "Basic 199", price: 199, minutes: "500", data: "5 GB", intl: "20 min", type: "Basic" },
      { name: "Smart 299", price: 299, minutes: "800", data: "10 GB", intl: "40 min", type: "Popular" },
      { name: "Smart 399", price: 399, minutes: "1200", data: "15 GB", intl: "60 min", type: "Popular" },
      { name: "Value 499", price: 499, minutes: "1600", data: "20 GB", intl: "80 min", type: "Value" },
      { name: "Premium 599", price: 599, minutes: "2200", data: "30 GB", intl: "100 min", type: "Premium" },
      { name: "Premium 799", price: 799, minutes: "3000", data: "40 GB", intl: "150 min", type: "Premium" },
      { name: "Business 999", price: 999, minutes: "4500", data: "60 GB", intl: "250 min", type: "Business" },
      { name: "Business 1299", price: 1299, minutes: "6000", data: "80 GB", intl: "350 min", type: "Business" },
      { name: "Unlimited 1499", price: 1499, minutes: "Unlimited", data: "100 GB", intl: "500 min", type: "Unlimited" },
      { name: "Unlimited 1999", price: 1999, minutes: "Unlimited", data: "150 GB", intl: "750 min", type: "Unlimited" },
      { name: "Talk 249", price: 249, minutes: "700", data: "6 GB", intl: "20 min", type: "Talk" },
      { name: "Talk 349", price: 349, minutes: "1000", data: "10 GB", intl: "30 min", type: "Talk" },
      { name: "Data 449", price: 449, minutes: "1000", data: "25 GB", intl: "40 min", type: "Data" },
      { name: "Data 549", price: 549, minutes: "1500", data: "35 GB", intl: "60 min", type: "Data" },
      { name: "Family 699", price: 699, minutes: "2500", data: "45 GB", intl: "100 min", type: "Family" },
      { name: "Family 899", price: 899, minutes: "3500", data: "60 GB", intl: "150 min", type: "Family" },
      { name: "Saver 299", price: 299, minutes: "600", data: "8 GB", intl: "25 min", type: "Saver" },
      { name: "Saver 499", price: 499, minutes: "1400", data: "18 GB", intl: "60 min", type: "Saver" },
      { name: "Flex 599", price: 599, minutes: "1800", data: "25 GB", intl: "120 min", type: "Flexible" },
      { name: "Flex 899", price: 899, minutes: "3200", data: "50 GB", intl: "220 min", type: "Flexible" },
      { name: "Pro 1099", price: 1099, minutes: "5000", data: "70 GB", intl: "300 min", type: "Professional" },
      { name: "Pro 1499", price: 1499, minutes: "7000", data: "100 GB", intl: "500 min", type: "Professional" },
      { name: "Enterprise 1999", price: 1999, minutes: "10000", data: "150 GB", intl: "1000 min", type: "Enterprise" },
      { name: "Enterprise 2499", price: 2499, minutes: "Unlimited", data: "200 GB", intl: "1500 min", type: "Enterprise" },
    ];

    const totalPlans = Number(summary.total_plans || planCatalog.length);
    const averageCost = Number(summary.average_monthly_cost || 0);
    const topPlan = recommendedPlans[0];
    const displayPlans = planCatalog;

    return (
      <div className="p-6 lg:p-8">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">📦</div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">Pricing Catalogue</p>
                <h1 className="text-3xl font-bold text-slate-900">Tariff Plans</h1>
              </div>
            </div>
            <p className="text-sm text-slate-500">View the available telecom plans and compare their usage limits and pricing.</p>
          </div>
          <button onClick={loadDashboard} className="w-fit rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50">↻ Refresh Plans</button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Plans" value={formatNumber(totalPlans)} subtitle="Plans available" icon="📦" />
          <StatCard title="Recommendations" value={formatNumber(summary.total_recommendations)} subtitle="Plan recommendations" icon="⭐" />
          <StatCard title="Average Monthly Cost" value={`₹${averageCost.toFixed(2)}`} subtitle="Estimated customer cost" icon="₹" />
          <StatCard title="Top Recommended" value={topPlan?.plan_name || topPlan?.name || "N/A"} subtitle="Most recommended plan" icon="🏆" />
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader icon="📋" title="Available Tariff Plans" subtitle="Compare plan limits before recommendation" />
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {displayPlans.map((plan, index) => (
              <div key={plan.name} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md">
                {index < 2 && <span className="absolute right-4 top-4 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">{index === 0 ? "Entry" : "Popular"}</span>}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl">📦</div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{plan.type} tariff plan</p>
                <p className="mt-4 text-3xl font-bold text-purple-600">₹{plan.price}<span className="text-sm font-medium text-slate-400"> / month</span></p>
                <div className="mt-5 space-y-3">
                  <div className="flex justify-between border-b border-slate-100 pb-2 text-sm"><span className="text-slate-500">Voice</span><span className="font-semibold text-slate-800">{plan.minutes}</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-2 text-sm"><span className="text-slate-500">Data</span><span className="font-semibold text-slate-800">{plan.data}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">International</span><span className="font-semibold text-slate-800">{plan.intl}</span></div>
                </div>
                <button type="button" onClick={() => setActivePage("recommendations")} className="mt-5 w-full rounded-xl bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-100">View Recommendations →</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-2xl">🤖</div>
            <div><h2 className="font-bold text-purple-900">How plans are used</h2><p className="mt-2 text-sm leading-6 text-purple-700">The recommendation system compares customer usage behaviour with tariff plan characteristics and selects a suitable plan based on the available model output.</p></div>
          </div>
        </section>
      </div>
    );
  }


  // ==========================================================
  // RECOMMENDATIONS PAGE
  // ==========================================================

  function RecommendationsPage() {

    const totalRecommendations = Number(summary.total_recommendations || 0);
    const totalCustomers = Number(summary.total_customers || recentCustomers.length || 0);
    const totalSavings = Number(metrics.total_savings || 0);
    const averageSaving = Number(metrics.average_potential_saving || 0);
    const sortedPlans = [...recommendedPlans].sort((a, b) => Number(b.recommendations ?? b.count ?? 0) - Number(a.recommendations ?? a.count ?? 0));

    return (
      <div className="p-6 lg:p-8">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">⭐</div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">AI / ML Output</p>
                <h1 className="text-3xl font-bold text-slate-900">Recommendations</h1>
              </div>
            </div>
            <p className="text-sm text-slate-500">Review recommended tariff plans, recommendation volume and potential customer savings.</p>
          </div>
          <button onClick={loadDashboard} className="w-fit rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50">↻ Refresh Recommendations</button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Recommendations" value={formatNumber(totalRecommendations)} subtitle="Generated recommendations" icon="⭐" />
          <StatCard title="Customers" value={formatNumber(totalCustomers)} subtitle="Customers considered" icon="👥" />
          <StatCard title="Total Potential Savings" value={`₹${totalSavings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} subtitle="Estimated savings" icon="💰" />
          <StatCard title="Average Saving" value={`₹${averageSaving.toFixed(2)}`} subtitle="Potential saving per customer" icon="₹" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader icon="🏆" title="Most Recommended Plans" subtitle="Plan popularity from the recommendation output" />
            {sortedPlans.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-400">No recommendation plan data returned by the API.</div>
            ) : (
              <div className="mt-6 space-y-4">
                {sortedPlans.map((plan, index) => {
                  const count = Number(plan.recommendations ?? plan.count ?? 0);
                  const percentage = Number(plan.percentage ?? 0);
                  return (
                    <div key={`${plan.plan_name || plan.name || "plan"}-${index}`} className="rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-700">{index + 1}</span><div><p className="font-semibold text-slate-800">{plan.plan_name || plan.name || `Plan ${index + 1}`}</p><p className="text-xs text-slate-400">{formatNumber(count)} recommendations</p></div></div>
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-purple-600" style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader icon="🧠" title="Recommendation Process" subtitle="How the TariffSmart pipeline works" />
            <div className="mt-6 space-y-4">
              {[
                ["1", "Customer Usage", "Collect day, evening, night, international and other usage features."],
                ["2", "Customer Clustering", "Group similar customers using K-Means segmentation."],
                ["3", "Plan Matching", "Compare customer behaviour with available tariff plans."],
                ["4", "Recommendation", "Return the most suitable plan and potential saving."],
              ].map(([number, title, text]) => (
                <div key={number} className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white">{number}</span><div><p className="font-semibold text-slate-800">{title}</p><p className="mt-1 text-sm text-slate-500">{text}</p></div></div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6"><SectionHeader icon="👥" title="Customer Recommendations" subtitle="Customer-level recommendation output returned by the admin API" /></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-y border-slate-100 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Cluster</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Usage</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Recommended Plan</th>
              </tr></thead>
              <tbody>
                {recentCustomers.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-sm text-slate-400">No customer recommendation records available.</td></tr>
                ) : recentCustomers.map((customer, index) => {
                  const day = Number(customer.day_minutes ?? customer.day ?? 0);
                  const evening = Number(customer.evening_minutes ?? customer.evening ?? 0);
                  const night = Number(customer.night_minutes ?? customer.night ?? 0);
                  const intl = Number(customer.international_minutes ?? customer.international ?? 0);
                  return (
                    <tr key={customer.customer_id || customer.phone_number || index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-5 font-medium text-slate-800">{customer.customer_id || customer.customerId || customer.id || customer.phone_number || "N/A"}</td>
                      <td className="px-6 py-5"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{customer.cluster != null ? `Cluster ${customer.cluster}` : "N/A"}</span></td>
                      <td className="px-6 py-5 text-sm text-slate-600">{(day + evening + night + intl).toFixed(1)} min</td>
                      <td className="px-6 py-5"><span className="rounded-full bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700">{customer.recommended_plan || customer.recommendedPlan || "N/A"}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-5">
          <p className="font-semibold text-green-800">Recommendation Summary</p>
          <p className="mt-2 text-sm leading-6 text-green-700">The page uses recommendation counts, customer assignments and saving metrics returned by the admin dashboard API. Refresh the page after your backend model generates new recommendations.</p>
        </div>
      </div>
    );
  }


  // ==========================================================
  // COST SIMULATOR PAGE
  // ==========================================================

  function CostSimulatorPage() {

    const [day, setDay] = useState(220);
    const [evening, setEvening] = useState(430);
    const [night, setNight] = useState(188);
    const [international, setInternational] = useState(13);
    const [voicemail, setVoicemail] = useState(3);

    const [currentCost, setCurrentCost] = useState(60);

    const totalMinutes =
      Number(day) + Number(evening) + Number(night);

    const usageCost =
      Number(day) * 0.08 +
      Number(evening) * 0.06 +
      Number(night) * 0.04 +
      Number(international) * 0.45 +
      Number(voicemail) * 0.02;

    const estimatedCost = Math.max(usageCost, 10);
    const savings = Math.max(Number(currentCost) - estimatedCost, 0);

    const inputClass =
      "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

    return (
      <div className="p-6 lg:p-8">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">◉</div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">Planning Tool</p>
                <h1 className="text-3xl font-bold text-slate-900">Cost Simulator</h1>
              </div>
            </div>
            <p className="text-sm text-slate-500">Estimate a customer's monthly telecom cost from usage and compare it with the current cost.</p>
          </div>
          <button onClick={() => setActivePage("recommendations")} className="w-fit rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700">View Recommendations →</button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <StatCard title="Estimated Cost" value={`₹${estimatedCost.toFixed(2)}`} subtitle="Based on simulated usage" icon="₹" />
          <StatCard title="Current Cost" value={`₹${Number(currentCost).toFixed(2)}`} subtitle="Customer's current monthly cost" icon="💳" />
          <StatCard title="Potential Saving" value={`₹${savings.toFixed(2)}`} subtitle="Estimated monthly saving" icon="💰" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader icon="🎛️" title="Usage Inputs" subtitle="Change the values to simulate a customer" />
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">Day minutes<input className={inputClass} type="number" min="0" value={day} onChange={(e) => setDay(e.target.value)} /></label>
              <label className="text-sm font-semibold text-slate-700">Evening minutes<input className={inputClass} type="number" min="0" value={evening} onChange={(e) => setEvening(e.target.value)} /></label>
              <label className="text-sm font-semibold text-slate-700">Night minutes<input className={inputClass} type="number" min="0" value={night} onChange={(e) => setNight(e.target.value)} /></label>
              <label className="text-sm font-semibold text-slate-700">International minutes<input className={inputClass} type="number" min="0" value={international} onChange={(e) => setInternational(e.target.value)} /></label>
              <label className="text-sm font-semibold text-slate-700">Voicemail minutes<input className={inputClass} type="number" min="0" value={voicemail} onChange={(e) => setVoicemail(e.target.value)} /></label>
              <label className="text-sm font-semibold text-slate-700">Current monthly cost<input className={inputClass} type="number" min="0" value={currentCost} onChange={(e) => setCurrentCost(e.target.value)} /></label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader icon="📊" title="Simulation Summary" subtitle="Calculated from the entered values" />
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><span className="text-slate-500">Total voice minutes</span><strong>{totalMinutes.toFixed(1)} min</strong></div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><span className="text-slate-500">International minutes</span><strong>{Number(international).toFixed(1)} min</strong></div>
              <div className="flex items-center justify-between rounded-xl bg-purple-50 p-4"><span className="text-purple-700">Estimated monthly cost</span><strong className="text-purple-700">₹{estimatedCost.toFixed(2)}</strong></div>
              <div className="flex items-center justify-between rounded-xl bg-green-50 p-4"><span className="text-green-700">Potential saving</span><strong className="text-green-700">₹{savings.toFixed(2)}</strong></div>
            </div>
            <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm leading-6 text-purple-800">This simulator is an estimation tool for the admin dashboard. Your production recommendation API remains the source of truth for actual tariff recommendations.</div>
          </section>
        </div>
      </div>
    );
  }


  // ==========================================================
  // ACTIVITY LOGS PAGE
  // ==========================================================

  function ActivityLogsPage() {

    const fallbackActivities = [
      { action: "Admin dashboard loaded", time: "Now", type: "System" },
      { action: "Customer recommendation data checked", time: "Today", type: "Recommendation" },
      { action: "K-Means cluster information displayed", time: "Today", type: "ML" },
      { action: "Dataset information checked", time: "Today", type: "Dataset" },
      { action: "Tariff plan information displayed", time: "Today", type: "Plans" },
    ];

    const activities = recentActivity.length ? recentActivity : fallbackActivities;

    function activityText(item) {
      if (typeof item === "string") return item;
      return item?.message || item?.action || item?.activity || item?.description || item?.event || "System activity";
    }

    function activityTime(item) {
      if (typeof item === "string") return "Recent";
      return item?.time || item?.timestamp || item?.created_at || item?.date || "Recent";
    }

    return (
      <div className="p-6 lg:p-8">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">◌</div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">System Monitoring</p>
                <h1 className="text-3xl font-bold text-slate-900">Activity Logs</h1>
              </div>
            </div>
            <p className="text-sm text-slate-500">Review recent dataset, clustering, recommendation and dashboard activities.</p>
          </div>
          <button onClick={loadDashboard} className="w-fit rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50">↻ Refresh Logs</button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <StatCard title="Recent Events" value={formatNumber(activities.length)} subtitle="Events currently available" icon="◌" />
          <StatCard title="Customers" value={formatNumber(summary.total_customers || 0)} subtitle="Records in dashboard" icon="👥" />
          <StatCard title="Recommendations" value={formatNumber(summary.total_recommendations || 0)} subtitle="Recommendation events" icon="⭐" />
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader icon="📝" title="Recent Activity" subtitle="Latest system events returned by the admin API" />
          <div className="mt-6 space-y-3">
            {activities.map((item, index) => (
              <div key={index} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">✓</div>
                <div className="min-w-0 flex-1"><p className="font-semibold text-slate-800">{activityText(item)}</p><p className="mt-1 text-xs text-slate-400">{activityTime(item)}</p></div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">Activity</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-5"><p className="font-semibold text-green-800">Dataset Status</p><p className="mt-2 text-sm text-green-700">Your admin dashboard is connected to the backend API.</p></div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="font-semibold text-blue-800">ML Status</p><p className="mt-2 text-sm text-blue-700">Cluster and recommendation metrics are displayed from the API response.</p></div>
          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5"><p className="font-semibold text-purple-800">Admin Status</p><p className="mt-2 text-sm text-purple-700">Admin session is currently active.</p></div>
        </section>
      </div>
    );
  }


  // ==========================================================
  // SETTINGS PAGE
  // ==========================================================

  function SettingsPage() {

    const [autoRefresh, setAutoRefresh] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [compactMode, setCompactMode] = useState(false);

    const Toggle = ({ checked, onChange }) => (
      <button type="button" onClick={() => onChange(!checked)} className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-purple-600" : "bg-slate-300"}`} aria-label="Toggle setting">
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
      </button>
    );

    return (
      <div className="p-6 lg:p-8">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">⚙</div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">Administration</p>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
              </div>
            </div>
            <p className="text-sm text-slate-500">Manage dashboard behaviour, API information and admin preferences.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader icon="🎛️" title="Dashboard Preferences" subtitle="Control how the admin dashboard behaves" />
            <div className="mt-6 divide-y divide-slate-100">
              <div className="flex items-center justify-between gap-4 py-5"><div><p className="font-semibold text-slate-800">Auto Refresh</p><p className="mt-1 text-sm text-slate-500">Allow dashboard data to be refreshed when requested.</p></div><Toggle checked={autoRefresh} onChange={setAutoRefresh} /></div>
              <div className="flex items-center justify-between gap-4 py-5"><div><p className="font-semibold text-slate-800">Notifications</p><p className="mt-1 text-sm text-slate-500">Show important recommendation and dataset notifications.</p></div><Toggle checked={notifications} onChange={setNotifications} /></div>
              <div className="flex items-center justify-between gap-4 py-5"><div><p className="font-semibold text-slate-800">Compact Mode</p><p className="mt-1 text-sm text-slate-500">Use a denser layout for dashboard cards and tables.</p></div><Toggle checked={compactMode} onChange={setCompactMode} /></div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader icon="🔌" title="Backend Connection" subtitle="Current admin API configuration" />
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">API Endpoint</p><p className="mt-2 break-all font-mono text-sm text-purple-700">{API_URL}</p></div>
              <div className="flex items-center justify-between rounded-xl bg-green-50 p-4"><div><p className="font-semibold text-green-800">Connection Status</p><p className="mt-1 text-sm text-green-700">Backend response loaded successfully.</p></div><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Connected</span></div>
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Admin Role</p><p className="mt-2 font-semibold text-slate-800">Super Administrator</p></div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-6">
          <div className="flex items-start gap-4"><div className="text-3xl">🛡️</div><div><h2 className="font-bold text-purple-900">Administration Controls</h2><p className="mt-2 text-sm leading-6 text-purple-700">Use the sidebar to manage customers, datasets, K-Means clustering, usage analytics, tariff plans, recommendations, cost simulations and activity logs. Logout is available at the bottom of the sidebar.</p></div></div>
        </section>
      </div>
    );
  }


  // PLACEHOLDER PAGE
  // ==========================================================

  function PlaceholderPage({
    title
  }) {

    return (

      <div className="p-6 lg:p-8">

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

          <div
            className="
              mb-4
              text-4xl
            "
          >
            🚧
          </div>

          <h2
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-2
              text-slate-500
            "
          >
            This admin module is ready to be connected.
          </p>

          <button
            onClick={() =>
              setActivePage("dashboard")
            }
            className="
              mt-6
              rounded-xl
              bg-purple-600
              px-5
              py-3
              font-semibold
              text-white
              hover:bg-purple-700
            "
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>

    );

  }


  // ==========================================================
  // DASHBOARD CONTENT
  // ==========================================================

  function DashboardContent() {

    return (

      <div className="p-6 lg:p-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            mb-7
            flex
            flex-col
            justify-between
            gap-4
            lg:flex-row
            lg:items-center
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              Dashboard
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Overview of the telecom tariff
              recommendation system
            </p>

          </div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <span
              className="
                text-sm
                text-slate-400
              "
            >
              Updated {new Date().toLocaleTimeString()}
            </span>

            <button
              onClick={loadDashboard}
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
                font-medium
                text-slate-700
                shadow-sm
                hover:bg-slate-50
              "
            >
              ↻
              Refresh
            </button>

          </div>

        </div>


        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
            xl:grid-cols-5
          "
        >

          <StatCard
            title="Total Customers"
            value={
              formatNumber(
                summary.total_customers
              )
            }
            subtitle="Customers in dataset"
            icon="👥"
          />

          <StatCard
            title="Total Clusters"
            value={
              formatNumber(
                summary.total_clusters
              )
            }
            subtitle="K-Means clusters"
            icon="🔗"
          />

          <StatCard
            title="Tariff Plans"
            value={
              formatNumber(
                summary.total_plans
              )
            }
            subtitle="Available plans"
            icon="📦"
          />

          <StatCard
            title="Recommendations"
            value={
              formatNumber(
                summary.total_recommendations
              )
            }
            subtitle="Generated recommendations"
            icon="⭐"
          />

          <StatCard
            title="Avg. Monthly Cost"
            value={
              `₹${Number(
                summary.average_monthly_cost || 0
              ).toFixed(2)}`
            }
            subtitle="Estimated customer cost"
            icon="₹"
          />

        </div>


        {/* =====================================================
            CLUSTER + USAGE
        ===================================================== */}

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

            <SectionHeader
              icon="👥"
              title="Customer Distribution by Cluster"
              subtitle="Customer segmentation"
            />

            <div
              className="
                mt-7
                space-y-6
              "
            >

              {clusters.length === 0 ? (

                <EmptyBox
                  text="No cluster data available."
                />

              ) : (

                clusters.map(
                  (cluster, index) => (

                    <div
                      key={
                        cluster.cluster ??
                        index
                      }
                    >

                      <div
                        className="
                          mb-2
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <span
                          className="
                            font-medium
                            text-slate-800
                          "
                        >
                          Cluster{" "}
                          {cluster.cluster}
                        </span>

                        <span
                          className="
                            text-sm
                            text-slate-500
                          "
                        >
                          {formatNumber(
                            cluster.count
                          )}
                          {" "}customers
                          {" "}
                          (
                          {cluster.percentage ?? 0}
                          %
                          )
                        </span>

                      </div>

                      <div
                        className="
                          h-3
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
                              `${Math.min(
                                Number(
                                  cluster.percentage || 0
                                ),
                                100
                              )}%`
                          }}
                        />

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </section>


          {/* USAGE */}

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

            <SectionHeader
              icon="📊"
              title="Average Usage"
              subtitle="All customers in minutes"
            />

            <div
              className="
                mt-7
                grid
                grid-cols-2
                gap-4
                lg:grid-cols-5
              "
            >

              <UsageCard
                title="Day"
                value={usage.day}
              />

              <UsageCard
                title="Evening"
                value={usage.evening}
              />

              <UsageCard
                title="Night"
                value={usage.night}
              />

              <UsageCard
                title="International"
                value={usage.international}
              />

              <UsageCard
                title="Voicemail"
                value={usage.voicemail}
              />

            </div>

          </section>

        </div>


        {/* =====================================================
            RECOMMENDED PLANS + ACTIVITY
        ===================================================== */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-2
          "
        >

          {/* RECOMMENDED PLANS */}

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

            <SectionHeader
              icon="📦"
              title="Most Recommended Plans"
              subtitle="Based on actual recommendations"
            />

            <div
              className="
                mt-6
                space-y-4
              "
            >

              {recommendedPlans.length === 0 ? (

                <EmptyBox
                  text="No recommendation data available."
                />

              ) : (

                recommendedPlans.map(
                  (plan, index) => (

                    <div
                      key={index}
                      className="
                        rounded-xl
                        bg-slate-50
                        p-4
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
                              font-semibold
                              text-slate-800
                            "
                          >
                            {
                              plan.plan_name ||
                              plan.name ||
                              `Plan ${index + 1}`
                            }
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-500
                            "
                          >
                            {
                              plan.recommendations ??
                              plan.count ??
                              0
                            }
                            {" "}recommendations
                          </p>

                        </div>

                        <span
                          className="
                            rounded-full
                            bg-purple-100
                            px-3
                            py-1
                            text-sm
                            font-semibold
                            text-purple-700
                          "
                        >
                          {plan.percentage ?? 0}%
                        </span>

                      </div>

                      <div
                        className="
                          mt-3
                          h-2
                          overflow-hidden
                          rounded-full
                          bg-white
                        "
                      >

                        <div
                          className="
                            h-full
                            rounded-full
                            bg-purple-600
                          "
                          style={{
                            width:
                              `${Math.min(
                                Number(
                                  plan.percentage || 0
                                ),
                                100
                              )}%`
                          }}
                        />

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </section>


          {/* RECENT ACTIVITY */}

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

            <SectionHeader
              icon="〽️"
              title="Recent Activity"
              subtitle="System activity"
            />

            <div
              className="
                mt-6
                space-y-3
              "
            >

              {recentActivity.length === 0 ? (

                <EmptyBox
                  text="No recent activity."
                />

              ) : (

                recentActivity.map(
                  (activity, index) => {

                    const activityText =
                      typeof activity === "string"
                        ? activity
                        : activity?.message ||
                          activity?.activity ||
                          activity?.name ||
                          activity?.status ||
                          "System activity";

                    const activityTime =
                      typeof activity === "object"
                        ? activity?.time ||
                          activity?.timestamp ||
                          ""
                        : "";

                    return (

                      <div
                        key={index}
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-xl
                          bg-slate-50
                          px-4
                          py-4
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <span
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-full
                              bg-purple-100
                              text-purple-600
                            "
                          >
                            ✓
                          </span>

                          <span
                            className="
                              text-sm
                              font-medium
                              text-slate-700
                            "
                          >
                            {activityText}
                          </span>

                        </div>

                        {activityTime && (

                          <span
                            className="
                              text-xs
                              text-slate-400
                            "
                          >
                            {activityTime}
                          </span>

                        )}

                      </div>

                    );

                  }
                )

              )}

            </div>

          </section>

        </div>


        {/* =====================================================
            RECENT CUSTOMERS
        ===================================================== */}

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

          <div className="p-6">

            <SectionHeader
              icon="👥"
              title="Recent Customers"
              subtitle="Latest customer records"
            />

          </div>

          <div
            className="
              overflow-x-auto
            "
          >

            <table className="w-full">

              <thead>

                <tr
                  className="
                    border-y
                    border-slate-100
                    bg-slate-50
                  "
                >

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Customer ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Phone Number
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Day
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Evening
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    International
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Cluster
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Recommended Plan
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentCustomers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="
                        px-6
                        py-10
                        text-center
                        text-slate-400
                      "
                    >
                      No customer records available.
                    </td>

                  </tr>

                ) : (

                  recentCustomers.map(
                    (customer, index) => (

                      <tr
                        key={index}
                        className="
                          border-b
                          border-slate-100
                          hover:bg-slate-50
                        "
                      >

                        <td
                          className="
                            px-6
                            py-5
                            font-medium
                            text-slate-800
                          "
                        >
                          {
                            customer.customer_id ||
                            customer.customerId ||
                            customer.id ||
                            "N/A"
                          }
                        </td>

                        <td
                          className="
                            px-6
                            py-5
                            text-slate-600
                          "
                        >
                          {
                            customer.phone_number ||
                            customer.phone ||
                            "N/A"
                          }
                        </td>

                        <td
                          className="
                            px-6
                            py-5
                            text-slate-600
                          "
                        >
                          {formatValue(
                            customer.day_minutes ??
                            customer.day
                          )}
                        </td>

                        <td
                          className="
                            px-6
                            py-5
                            text-slate-600
                          "
                        >
                          {formatValue(
                            customer.evening_minutes ??
                            customer.evening
                          )}
                        </td>

                        <td
                          className="
                            px-6
                            py-5
                            text-slate-600
                          "
                        >
                          {formatValue(
                            customer.international_minutes ??
                            customer.international
                          )}
                        </td>

                        <td
                          className="
                            px-6
                            py-5
                            text-slate-600
                          "
                        >
                          Cluster{" "}
                          {
                            customer.cluster ??
                            "N/A"
                          }
                        </td>

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <span
                            className="
                              rounded-full
                              bg-purple-50
                              px-4
                              py-2
                              text-xs
                              font-semibold
                              text-purple-700
                            "
                          >
                            {
                              customer.recommended_plan ||
                              customer.recommendedPlan ||
                              "N/A"
                            }
                          </span>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* =====================================================
            ML METRICS
        ===================================================== */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          <MetricCard
            title="Silhouette Score"
            value={
              Number(
                metrics.silhouette_score || 0
              ).toFixed(2)
            }
            subtitle="Clustering quality"
            icon="🎯"
          />

          <MetricCard
            title="Elbow / Inertia"
            value={
              Number(
                metrics.elbow_inertia || 0
              ).toFixed(2)
            }
            subtitle="K-Means evaluation"
            icon="📈"
          />

          <MetricCard
            title="Total Savings"
            value={
              `₹${Number(
                metrics.total_savings || 0
              ).toLocaleString("en-IN", {
                minimumFractionDigits: 2
              })}`
            }
            subtitle="Estimated savings"
            icon="₹"
          />

          <MetricCard
            title="Average Saving"
            value={
              `₹${Number(
                metrics.average_potential_saving || 0
              ).toFixed(2)}`
            }
            subtitle="Per customer"
            icon="💰"
          />

        </div>

      </div>

    );

  }


  // ==========================================================
  // CUSTOMERS PAGE
  // ==========================================================

  function CustomersPage() {

    /*
      IMPORTANT:

      We use the SAME dashboard API data.

      summary.total_customers
      gives the total customer count.

      recentCustomers
      gives the customer records already returned
      by your backend.
    */

    const totalCustomers =
      Number(
        summary.total_customers || 0
      );


    return (

      <div className="p-6 lg:p-8">

        {/* HEADER */}

        <div
          className="
            mb-7
            flex
            flex-col
            justify-between
            gap-4
            lg:flex-row
            lg:items-center
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
              Customers
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              View customers from the CDR dataset
            </p>

          </div>

          <button
            onClick={loadDashboard}
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
              font-medium
              text-slate-700
              shadow-sm
              hover:bg-slate-50
            "
          >
            ↻
            Refresh Customers
          </button>

        </div>


        {/* TOTAL CUSTOMER CARD */}

        <div
          className="
            mb-6
            grid
            grid-cols-1
            gap-5
            md:grid-cols-3
          "
        >

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
                    text-slate-500
                  "
                >
                  Total Customers
                </p>

                <p
                  className="
                    mt-3
                    text-4xl
                    font-bold
                    text-slate-900
                  "
                >
                  {formatNumber(totalCustomers)}
                </p>

                <p
                  className="
                    mt-2
                    text-sm
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
                  text-2xl
                  text-purple-600
                "
              >
                👥
              </div>

            </div>

          </div>


          {/* CLUSTERS */}

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
              Total Clusters
            </p>

            <p
              className="
                mt-3
                text-4xl
                font-bold
                text-slate-900
              "
            >
              {formatNumber(
                summary.total_clusters
              )}
            </p>

            <p
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              K-Means customer groups
            </p>

          </div>


          {/* RECOMMENDATIONS */}

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
              Recommendations
            </p>

            <p
              className="
                mt-3
                text-4xl
                font-bold
                text-slate-900
              "
            >
              {formatNumber(
                summary.total_recommendations
              )}
            </p>

            <p
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              Generated recommendations
            </p>

          </div>

        </div>


        {/* CUSTOMER TABLE */}

        <section
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          <div className="p-6">

            <SectionHeader
              icon="👥"
              title="Customer Records"
              subtitle={
                `Showing ${recentCustomers.length} recent customer records`
              }
            />

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr
                  className="
                    border-y
                    border-slate-100
                    bg-slate-50
                  "
                >

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Customer ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Phone Number
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Day
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Evening
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    International
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Cluster
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Recommended Plan
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentCustomers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="
                        px-6
                        py-12
                        text-center
                        text-slate-400
                      "
                    >
                      No customer records available.
                    </td>

                  </tr>

                ) : (

                  recentCustomers.map(
                    (customer, index) => (

                      <tr
                        key={
                          customer.customer_id ||
                          customer.phone_number ||
                          index
                        }
                        className="
                          border-b
                          border-slate-100
                          hover:bg-slate-50
                        "
                      >

                        <td
                          className="
                            px-6
                            py-5
                            font-medium
                            text-slate-800
                          "
                        >
                          {
                            customer.customer_id ||
                            customer.customerId ||
                            customer.id ||
                            "N/A"
                          }
                        </td>


                        <td
                          className="
                            px-6
                            py-5
                            text-slate-600
                          "
                        >
                          {
                            customer.phone_number ||
                            customer.phone ||
                            "N/A"
                          }
                        </td>


                        <td
                          className="
                            px-6
                            py-5
                            text-slate-600
                          "
                        >
                          {formatValue(
                            customer.day_minutes ??
                            customer.day
                          )}
                        </td>


                        <td
                          className="
                            px-6
                            py-5
                            text-slate-600
                          "
                        >
                          {formatValue(
                            customer.evening_minutes ??
                            customer.evening
                          )}
                        </td>


                        <td
                          className="
                            px-6
                            py-5
                            text-slate-600
                          "
                        >
                          {formatValue(
                            customer.international_minutes ??
                            customer.international
                          )}
                        </td>


                        <td
                          className="
                            px-6
                            py-5
                            text-slate-600
                          "
                        >
                          <span
                            className="
                              rounded-full
                              bg-blue-50
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              text-blue-700
                            "
                          >
                            Cluster{" "}
                            {
                              customer.cluster ??
                              "N/A"
                            }
                          </span>
                        </td>


                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <span
                            className="
                              rounded-full
                              bg-purple-50
                              px-4
                              py-2
                              text-xs
                              font-semibold
                              text-purple-700
                            "
                          >
                            {
                              customer.recommended_plan ||
                              customer.recommendedPlan ||
                              "N/A"
                            }
                          </span>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* NOTE */}

        <div
          className="
            mt-5
            rounded-xl
            border
            border-blue-100
            bg-blue-50
            p-4
            text-sm
            text-blue-700
          "
        >
          <strong>Total Customers:</strong>{" "}
          {formatNumber(totalCustomers)}
          {" "}customers are available in the dataset.
          The table above displays the recent customer records
          returned by the admin dashboard API.
        </div>

      </div>

    );

  }


  // ==========================================================
  // DATASET MANAGEMENT PAGE
  // ==========================================================

  function DatasetManagementPage() {

    const activeFileName =
      uploadedFileName || "CDR-Call-Details.csv";

    const activeColumns =
      uploadedColumns.length > 0
        ? uploadedColumns
        : [
            "phone_number",
            "account_length",
            "international_plan",
            "voice_mail_plan",
            "number_vmail_messages",
            "total_day_minutes",
            "total_day_calls",
            "total_day_charge",
            "total_eve_minutes",
            "total_eve_calls",
            "total_eve_charge",
            "total_night_minutes",
            "total_night_calls",
            "total_night_charge",
            "total_intl_minutes",
            "total_intl_calls",
            "total_intl_charge",
            "customer_service_calls"
          ];

    const activeRows =
      uploadedRows.length > 0
        ? uploadedRows
        : recentCustomers;

    const activeRowCount =
      uploadedFileName
        ? uploadedRows.length
        : Number(
            summary.total_customers ||
            recentCustomers.length ||
            0
          );

    const previewRows =
      activeRows.slice(0, 10);

    const previewColumns =
      activeColumns.slice(0, 8);

    return (
      <div className="p-6 lg:p-8">

        {/* HEADER */}

        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dataset Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Upload and manage your telecom customer datasets
            </p>
          </div>

          <label
            htmlFor="dataset-upload-top"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-purple-700"
          >
            ⬆ Upload Dataset
          </label>

          <input
            id="dataset-upload-top"
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleDatasetUpload}
          />

        </div>


        {/* ERROR */}

        {uploadError && (

          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <strong>Upload failed:</strong>{" "}
            {uploadError}

          </div>

        )}


        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

          {/* DATASET SIDEBAR */}

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl text-purple-600">
                📁
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Datasets
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Available datasets
                </p>
              </div>

            </div>


            {/* CURRENT DATASET */}

            <div className="rounded-xl bg-purple-600 p-4 text-white shadow-md">

              <div className="flex items-start gap-3">

                <span className="text-2xl">
                  📄
                </span>

                <div className="min-w-0">

                  <p className="break-all text-sm font-semibold">
                    {activeFileName}
                  </p>

                  <p className="mt-1 text-xs text-purple-100">
                    {uploadedFileName
                      ? "Uploaded Dataset"
                      : "Default Telecom Customer Data"}
                  </p>

                </div>

              </div>

            </div>


            {/* STATUS */}

            <div className="mt-4 rounded-xl bg-green-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                Dataset Status
              </p>

              <p className="mt-2 text-sm font-semibold text-green-700">
                ● {uploadedFileName ? "Uploaded" : "Connected"}
              </p>

              <p className="mt-1 text-xs text-green-600">
                {uploadedFileName
                  ? "File loaded successfully"
                  : "Loaded from admin API"}
              </p>

            </div>


            {/* UPLOAD */}

            <label
              htmlFor="dataset-upload-sidebar"
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600 transition hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600"
            >
              ⬆ Upload New Dataset
            </label>

            <input
              id="dataset-upload-sidebar"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleDatasetUpload}
            />


            <p className="mt-3 text-center text-xs text-slate-400">
              CSV files only
            </p>

          </aside>


          {/* MAIN CONTENT */}

          <div className="lg:col-span-3">

            {/* DATASET OVERVIEW */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                    📊
                  </div>

                  <div>

                    <h2 className="break-all text-xl font-bold text-slate-900">
                      {activeFileName}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {uploadedFileName
                        ? "Uploaded customer dataset"
                        : "Customer Call Detail Records"}
                    </p>

                  </div>

                </div>

                <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  ● Available
                </span>

              </div>


              {/* STATS */}

              <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">

                <DatasetStatCard
                  title="Total Rows"
                  value={formatNumber(activeRowCount)}
                  subtitle="Records in selected dataset"
                  icon="👥"
                />

                <DatasetStatCard
                  title="Columns"
                  value={formatNumber(activeColumns.length)}
                  subtitle="Fields detected"
                  icon="▤"
                />

                <DatasetStatCard
                  title="File Type"
                  value="CSV"
                  subtitle="Comma-separated values"
                  icon="📄"
                />

              </div>

            </section>


            {/* UPLOAD SUCCESS */}

            {uploadedFileName && (

              <section className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl">
                    ✓
                  </div>

                  <div>

                    <h2 className="font-bold text-green-800">
                      Dataset uploaded successfully
                    </h2>

                    <p className="mt-1 text-sm text-green-700">
                      <strong>{uploadedFileName}</strong>{" "}
                      has been loaded into the admin dashboard.
                    </p>

                    <p className="mt-2 text-xs text-green-600">
                      {formatNumber(uploadedRows.length)} rows
                      {" • "}
                      {formatNumber(uploadedColumns.length)} columns
                    </p>

                  </div>

                </div>

              </section>

            )}


            {/* DATASET DETAILS */}

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <SectionHeader
                icon="📄"
                title="Dataset Details"
                subtitle="Information about the currently selected dataset"
              />

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                <DatasetDetail
                  label="File Name"
                  value={activeFileName}
                />

                <DatasetDetail
                  label="Dataset Type"
                  value="CSV Dataset"
                />

                <DatasetDetail
                  label="Rows"
                  value={formatNumber(activeRowCount)}
                />

                <DatasetDetail
                  label="Columns"
                  value={formatNumber(activeColumns.length)}
                />

                <DatasetDetail
                  label="Source"
                  value={
                    uploadedFileName
                      ? "Uploaded from this computer"
                      : "Admin Dashboard API"
                  }
                />

                <DatasetDetail
                  label="Status"
                  value={
                    uploadedFileName
                      ? "Uploaded Successfully"
                      : "Connected"
                  }
                />

              </div>

            </section>


            {/* DATASET COLUMNS */}

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <SectionHeader
                icon="▤"
                title="Dataset Columns"
                subtitle="Columns detected from the selected CSV file"
              />

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">

                {activeColumns.map((column, index) => (

                  <div
                    key={`${column}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                  >

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-600">
                      {index + 1}
                    </span>

                    <span className="break-all text-sm font-medium text-slate-700">
                      {column}
                    </span>

                  </div>

                ))}

              </div>

            </section>


            {/* PREVIEW */}

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="p-6">

                <SectionHeader
                  icon="👁️"
                  title="Dataset Preview"
                  subtitle={`Showing first ${previewRows.length} rows`}
                />

              </div>

              {previewRows.length === 0 ? (

                <div className="border-t border-slate-100 p-10 text-center text-sm text-slate-400">
                  No rows available for preview.
                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>

                      <tr className="border-y border-slate-100 bg-slate-50">

                        {previewColumns.map((column) => (

                          <th
                            key={column}
                            className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase text-slate-500"
                          >
                            {column}
                          </th>

                        ))}

                      </tr>

                    </thead>

                    <tbody>

                      {previewRows.map((row, rowIndex) => (

                        <tr
                          key={rowIndex}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >

                          {previewColumns.map((column) => (

                            <td
                              key={column}
                              className="max-w-xs truncate px-5 py-4 text-sm text-slate-600"
                              title={String(row[column] ?? "")}
                            >
                              {String(row[column] ?? "")}
                            </td>

                          ))}

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>


            {/* ACTIONS */}

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <SectionHeader
                icon="⚡"
                title="Dataset Actions"
                subtitle="Quick actions for your selected dataset"
              />

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                <button
                  type="button"
                  onClick={() => setActivePage("customers")}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-purple-300 hover:bg-purple-50"
                >
                  <div className="text-2xl">👁️</div>

                  <p className="mt-3 font-semibold text-slate-800">
                    View Customers
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Open customer records
                  </p>
                </button>


                <button
                  type="button"
                  onClick={loadDashboard}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-purple-300 hover:bg-purple-50"
                >
                  <div className="text-2xl">🔄</div>

                  <p className="mt-3 font-semibold text-slate-800">
                    Reload API Data
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Refresh dashboard information
                  </p>
                </button>


                <label
                  htmlFor="dataset-upload-action"
                  className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-purple-300 hover:bg-purple-50"
                >
                  <div className="text-2xl">
                    📥
                  </div>

                  <p className="mt-3 font-semibold text-slate-800">
                    Choose Another CSV
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Replace the current preview
                  </p>
                </label>

                <input
                  id="dataset-upload-action"
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleDatasetUpload}
                />

              </div>

            </section>


            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">

              <strong>Note:</strong>{" "}
              You can upload any valid CSV dataset from your computer.
              The dashboard will automatically detect the column names,
              count the rows, display the columns, and show a preview
              of the first 10 rows.

            </div>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================================
  // DATASET STAT CARD
  // ==========================================================

  function DatasetStatCard({
    title,
    value,
    subtitle,
    icon
  }) {

    return (
      <div className="rounded-xl bg-slate-50 p-5">

        <div className="flex items-start justify-between gap-3">

          <div>

            <p className="text-sm text-slate-500">
              {title}
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {subtitle}
            </p>

          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl">
            {icon}
          </div>

        </div>
      </div>
    );
  }


  // ==========================================================
  // DATASET DETAIL
  // ==========================================================

  function DatasetDetail({
    label,
    value
  }) {

    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-2 break-words text-sm font-semibold text-slate-800">
          {value}
        </p>

      </div>
    );
  }


  // ==========================================================
  // MAIN RETURN
  // ==========================================================

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
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          flex-col
          bg-[#101b35]
          text-white
          transition-all
          duration-300
          ${
            sidebarOpen
              ? "w-64"
              : "w-20"
          }
        `}
      >

        {/* LOGO */}

        <div
          className="
            flex
            h-20
            items-center
            gap-3
            border-b
            border-white/10
            px-5
          "
        >

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-purple-600
              text-2xl
            "
          >
            📡
          </div>

          {sidebarOpen && (

            <div>

              <h1
                className="
                  text-lg
                  font-bold
                "
              >
                TariffSmart
              </h1>

              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                Admin Dashboard
              </p>

            </div>

          )}

        </div>


        {/* TOGGLE */}

        <button
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
          className="
            absolute
            -right-3
            top-7
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            border-slate-200
            bg-white
            text-sm
            text-slate-700
            shadow
          "
        >
          {sidebarOpen ? "‹" : "›"}
        </button>


        {/* MENU */}

        <nav
          className="
            flex-1
            space-y-1
            overflow-y-auto
            px-3
            py-6
          "
        >

          <MenuItem
            id="dashboard"
            icon="⌂"
            label="Dashboard"
          />

          <MenuItem
            id="customers"
            icon="♙"
            label="Customers"
          />

          <MenuItem
            id="dataset"
            icon="▤"
            label="Dataset Management"
          />

          <MenuItem
            id="clustering"
            icon="⌘"
            label="Clustering (K-Means)"
          />

          <MenuItem
            id="usage"
            icon="▥"
            label="Usage Analytics"
          />

          <MenuItem
            id="plans"
            icon="▣"
            label="Tariff Plans"
          />

          <MenuItem
            id="recommendations"
            icon="☆"
            label="Recommendations"
          />

          <MenuItem
            id="simulator"
            icon="◉"
            label="Cost Simulator"
          />

          <MenuItem
            id="activity"
            icon="◌"
            label="Activity Logs"
          />

          <MenuItem
            id="settings"
            icon="⚙"
            label="Settings"
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

          {sidebarOpen && (

            <div
              className="
                mb-4
                rounded-xl
                bg-white/5
                p-3
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
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-purple-200
                    text-xl
                  "
                >
                  👤
                </div>

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                    "
                  >
                    Admin
                  </p>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Super Administrator
                  </p>

                  <div
                    className="
                      mt-1
                      flex
                      items-center
                      gap-1
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

                    <span
                      className="
                        text-[10px]
                        text-slate-400
                      "
                    >
                      Online
                    </span>

                  </div>

                </div>

              </div>

            </div>

          )}


          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-4
              rounded-xl
              px-4
              py-3
              text-left
              text-red-300
              transition
              hover:bg-red-500/10
              hover:text-red-200
            "
          >

            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-red-500/10
                text-lg
              "
            >
              ⇥
            </span>

            {sidebarOpen && (

              <span
                className="
                  text-sm
                  font-semibold
                "
              >
                Logout
              </span>

            )}

          </button>

        </div>

      </aside>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className={`
          min-h-screen
          transition-all
          duration-300
          ${
            sidebarOpen
              ? "ml-64"
              : "ml-20"
          }
        `}
      >

        {/* MOBILE TOP BAR */}

        <div
          className="
            sticky
            top-0
            z-30
            flex
            h-16
            items-center
            gap-4
            border-b
            border-slate-200
            bg-white
            px-5
            lg:hidden
          "
        >

          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="
              text-xl
              text-slate-700
            "
          >
            ☰
          </button>

          <span
            className="
              font-bold
              text-slate-900
            "
          >
            TariffSmart
          </span>

        </div>


        {/* ====================================================
            DASHBOARD
        ==================================================== */}

        {activePage === "dashboard" && (

          <DashboardContent />

        )}


        {/* ====================================================
            CUSTOMERS
        ==================================================== */}

        {activePage === "customers" && (

          <CustomersPage />

        )}


        {/* ====================================================
            OTHER PAGES
        ==================================================== */}

        {activePage === "dataset" && (

          <DatasetManagementPage />

        )}

        {activePage === "clustering" && (

          <ClusteringPage />

        )}

        {activePage === "usage" && (

          <UsageAnalyticsPage />

        )}

        {activePage === "plans" && (

          <TariffPlansPage />

        )}

        {activePage === "recommendations" && (

          <RecommendationsPage />

        )}

        {activePage === "simulator" && (

          <CostSimulatorPage />

        )}

        {activePage === "activity" && (

          <ActivityLogsPage />

        )}

        {activePage === "settings" && (

          <SettingsPage />

        )}

        {/* ====================================================
            TARIFFSMART ADMIN ASSISTANT
        ==================================================== */}
        <AdminAssistant
          data={data}
          summary={summary}
          clusters={clusters}
          usage={usage}
          recommendedPlans={recommendedPlans}
          metrics={metrics}
          recentCustomers={recentCustomers}
          open={assistantOpen}
          setOpen={setAssistantOpen}
          onRefresh={loadDashboard}
        />

      </main>

    </div>

  );

}


// ============================================================
// TARIFFSMART ADMIN ASSISTANT
// ============================================================

function AdminAssistant({
  data,
  summary,
  clusters,
  usage,
  recommendedPlans,
  metrics,
  recentCustomers,
  open,
  setOpen,
  onRefresh
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hi! I’m TariffSmart Assistant. I can explain the admin dashboard, customer usage, K-Means clusters, tariff plans and recommendation statistics."
    }
  ]);

  const [input, setInput] = useState("");

  const totalCustomers = Number(
    summary?.total_customers ||
    recentCustomers?.length ||
    0
  );

  const totalClusters = Number(
    summary?.total_clusters ||
    clusters?.length ||
    0
  );

  const totalRecommendations = Number(
    summary?.total_recommendations ||
    0
  );

  const totalPlans = Number(
    summary?.total_plans ||
    25
  );

  const averageCost = Number(
    summary?.average_monthly_cost ||
    0
  );

  const totalSavings = Number(
    metrics?.total_savings ||
    0
  );

  const averageSaving = Number(
    metrics?.average_potential_saving ||
    0
  );

  const silhouette = Number(
    metrics?.silhouette_score ||
    0
  );

  const inertia = Number(
    metrics?.elbow_inertia ||
    0
  );

  const usageValues = {
    day: Number(usage?.day || 0),
    evening: Number(usage?.evening || 0),
    night: Number(usage?.night || 0),
    international: Number(usage?.international || 0),
    voicemail: Number(usage?.voicemail || 0)
  };

  const peakUsage = Object.entries(usageValues)
    .sort((a, b) => b[1] - a[1])[0];

  const topPlan =
    recommendedPlans?.[0]?.plan_name ||
    recommendedPlans?.[0]?.name ||
    "N/A";

  function addMessage(role, text) {
    setMessages((current) => [
      ...current,
      {
        role,
        text
      }
    ]);
  }

  function answerQuestion(question) {
    const q = question.toLowerCase().trim();

    if (!q) {
      return "Please enter a question about the admin dashboard.";
    }

    if (
      q.includes("customer") &&
      (q.includes("how many") ||
        q.includes("total") ||
        q.includes("count"))
    ) {
      return `There are ${formatNumber(totalCustomers)} customers currently available in the admin dashboard data.`;
    }

    if (
      q.includes("cluster") &&
      (q.includes("how many") ||
        q.includes("total") ||
        q.includes("count"))
    ) {
      return `The dashboard currently reports ${formatNumber(totalClusters)} K-Means clusters.`;
    }

    if (
      q.includes("silhouette") ||
      q.includes("clustering quality")
    ) {
      return `The current Silhouette Score is ${silhouette.toFixed(
        2
      )}. A higher score generally indicates better-separated clusters.`;
    }

    if (
      q.includes("inertia") ||
      q.includes("elbow")
    ) {
      return `The current K-Means inertia / elbow metric is ${inertia.toFixed(
        2
      )}.`;
    }

    if (
      q.includes("recommendation") &&
      (q.includes("how many") ||
        q.includes("total") ||
        q.includes("count"))
    ) {
      return `The dashboard reports ${formatNumber(
        totalRecommendations
      )} total recommendations.`;
    }

    if (
      q.includes("saving") ||
      q.includes("savings")
    ) {
      return `The estimated total potential saving is ₹${totalSavings.toLocaleString(
        "en-IN",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      )}. The average potential saving is ₹${averageSaving.toFixed(
        2
      )} per customer.`;
    }

    if (
      q.includes("plan") &&
      (q.includes("how many") ||
        q.includes("total") ||
        q.includes("count"))
    ) {
      return `There are ${formatNumber(
        totalPlans
      )} tariff plans available in the dashboard catalogue.`;
    }

    if (
      q.includes("top plan") ||
      q.includes("most recommended") ||
      q.includes("popular plan")
    ) {
      return `The current top recommended plan returned by the API is "${topPlan}".`;
    }

    if (
      q.includes("average cost") ||
      q.includes("monthly cost") ||
      q.includes("average monthly")
    ) {
      return `The average monthly customer cost returned by the dashboard API is ₹${averageCost.toFixed(
        2
      )}.`;
    }

    if (
      q.includes("peak") ||
      q.includes("highest usage")
    ) {
      if (!peakUsage) {
        return "Usage data is not currently available.";
      }

      return `The highest average usage category is ${
        peakUsage[0]
      } at ${peakUsage[1].toFixed(1)} minutes.`;
    }

    if (q.includes("day usage") || q.includes("day minutes")) {
      return `Average day usage is ${usageValues.day.toFixed(
        1
      )} minutes.`;
    }

    if (
      q.includes("evening usage") ||
      q.includes("evening minutes")
    ) {
      return `Average evening usage is ${usageValues.evening.toFixed(
        1
      )} minutes.`;
    }

    if (
      q.includes("night usage") ||
      q.includes("night minutes")
    ) {
      return `Average night usage is ${usageValues.night.toFixed(
        1
      )} minutes.`;
    }

    if (
      q.includes("international") &&
      q.includes("usage")
    ) {
      return `Average international usage is ${usageValues.international.toFixed(
        1
      )} minutes.`;
    }

    if (
      q.includes("voicemail") ||
      q.includes("voice mail")
    ) {
      return `Average voicemail usage is ${usageValues.voicemail.toFixed(
        1
      )} minutes.`;
    }

    if (
      q.includes("refresh") ||
      q.includes("reload") ||
      q.includes("update data")
    ) {
      onRefresh();
      return "I started a dashboard refresh. The latest data will be loaded from the admin API.";
    }

    if (
      q.includes("what can you do") ||
      q.includes("help") ||
      q.includes("what do you do")
    ) {
      return "I can answer questions about customers, K-Means clusters, Silhouette Score, inertia, usage analytics, tariff plans, recommendations, monthly cost and potential savings.";
    }

    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey")
    ) {
      return "Hello! Ask me anything about your TariffSmart admin dashboard.";
    }

    if (
      q.includes("data") ||
      q.includes("dashboard")
    ) {
      return `The dashboard is connected to the admin API and currently has ${formatNumber(
        totalCustomers
      )} customers, ${formatNumber(
        totalClusters
      )} clusters, ${formatNumber(
        totalRecommendations
      )} recommendations and ${formatNumber(
        totalPlans
      )} tariff plans.`;
    }

    return "I can answer dashboard questions about customers, clusters, usage, tariff plans, recommendations, costs and savings. Try asking: \"How many customers?\"";
  }

  function handleSend(customQuestion) {
    const question =
      customQuestion !== undefined
        ? customQuestion
        : input;

    if (!question.trim()) {
      return;
    }

    addMessage("user", question.trim());

    const answer = answerQuestion(question);

    window.setTimeout(() => {
      addMessage("assistant", answer);
    }, 150);

    setInput("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  const quickQuestions = [
    "How many customers?",
    "How many clusters?",
    "What is the peak usage?",
    "How many recommendations?",
    "What are the savings?",
    "What is the top plan?"
  ];

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-[70] w-[calc(100vw-2.5rem)] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#101b35] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-xl">
                🤖
              </div>

              <div>
                <p className="font-bold">
                  TariffSmart Assistant
                </p>

                <p className="text-xs text-slate-300">
                  Admin dashboard assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-xl text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label="Close assistant"
            >
              ×
            </button>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-purple-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSend(question)}
                  className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-100"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Ask about your dashboard..."
                className="min-h-[48px] flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-xl text-white shadow-sm transition hover:bg-purple-700"
                aria-label="Send message"
              >
                ➤
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-slate-400">
              Answers are based on data currently loaded in the admin dashboard.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-5 right-5 z-[71] flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl text-white shadow-xl transition hover:scale-105 hover:bg-purple-700"
        aria-label="Open TariffSmart Assistant"
        title="TariffSmart Assistant"
      >
        {open ? "×" : "🤖"}
      </button>
    </>
  );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  title,
  value,
  subtitle,
  icon
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
        transition
        hover:-translate-y-1
        hover:shadow-md
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >

        <div>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            {title}
          </p>

          <p
            className="
              mt-3
              text-3xl
              font-bold
              text-slate-900
            "
          >
            {value}
          </p>

          <p
            className="
              mt-2
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
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-purple-100
            text-2xl
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
// SECTION HEADER
// ============================================================

function SectionHeader({
  icon,
  title,
  subtitle
}) {

  return (

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
          shrink-0
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

      <div>

        <h2
          className="
            text-lg
            font-bold
            text-slate-900
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-400
          "
        >
          {subtitle}
        </p>

      </div>

    </div>

  );

}


// ============================================================
// USAGE CARD
// ============================================================

function UsageCard({
  title,
  value
}) {

  return (

    <div
      className="
        rounded-xl
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
          mt-3
          text-2xl
          font-bold
          text-slate-900
        "
      >
        {Number(value || 0).toFixed(1)}
      </p>

      <p
        className="
          mt-1
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
// METRIC CARD
// ============================================================

function MetricCard({
  title,
  value,
  subtitle,
  icon
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-4
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
          h-14
          w-14
          shrink-0
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

      <div>

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
            mt-1
            text-2xl
            font-bold
            text-slate-900
          "
        >
          {value}
        </p>

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

    </div>

  );

}


// ============================================================
// EMPTY BOX
// ============================================================

function EmptyBox({
  text
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-dashed
        border-slate-200
        bg-slate-50
        p-8
        text-center
        text-sm
        text-slate-400
      "
    >
      {text}
    </div>

  );

}


// ============================================================
// FORMAT NUMBER
// ============================================================

function formatNumber(value) {

  const number =
    Number(value || 0);

  return number.toLocaleString(
    "en-IN"
  );

}


// ============================================================
// FORMAT VALUE
// ============================================================

function formatValue(value) {

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
// EXPORT
// ============================================================

export default AdminDashboard;