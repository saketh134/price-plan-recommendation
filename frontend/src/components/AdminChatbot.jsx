import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  Minimize2,
  Users,
  Package,
  BarChart3,
  Sparkles,
} from "lucide-react";

function AdminChatbot({ dashboardData = {} }) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text:
        "Hello Admin! 👋 I'm your TariffSmart Admin Assistant. I can help you understand customers, clusters, tariff plans, recommendations and usage analytics.",
    },
  ]);

  const totalCustomers =
    dashboardData?.total_customers ??
    dashboardData?.totalCustomers ??
    3000;

  const totalClusters =
    dashboardData?.total_clusters ??
    dashboardData?.totalClusters ??
    4;

  const totalPlans =
    dashboardData?.tariff_plans ??
    dashboardData?.total_plans ??
    25;

  const totalRecommendations =
    dashboardData?.recommendations ??
    dashboardData?.total_recommendations ??
    2450;

  const averageCost =
    dashboardData?.average_monthly_cost ??
    dashboardData?.avg_monthly_cost ??
    46.28;

  const averageUsage =
    dashboardData?.average_usage ?? null;

  function addBotMessage(text) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        sender: "bot",
        text,
      },
    ]);
  }

  function handleQuestion(question) {
    const q = question.toLowerCase();

    if (
      q.includes("customer") ||
      q.includes("customers") ||
      q.includes("how many")
    ) {
      addBotMessage(
        `There are currently ${totalCustomers.toLocaleString()} customers in the dataset. 👥`
      );
      return;
    }

    if (q.includes("cluster")) {
      addBotMessage(
        `The system currently has ${totalClusters} K-Means customer clusters. Clusters are used to group customers based on similar usage behavior. 📊`
      );
      return;
    }

    if (
      q.includes("plan") ||
      q.includes("tariff")
    ) {
      addBotMessage(
        `There are ${totalPlans} tariff plans available in the system. These plans are evaluated against customer usage to generate recommendations. 📦`
      );
      return;
    }

    if (
      q.includes("recommendation") ||
      q.includes("recommended")
    ) {
      addBotMessage(
        `The dashboard currently shows ${totalRecommendations.toLocaleString()} generated recommendations. ⭐`
      );
      return;
    }

    if (
      q.includes("cost") ||
      q.includes("price") ||
      q.includes("monthly")
    ) {
      addBotMessage(
        `The current average estimated monthly customer cost is ₹${Number(
          averageCost
        ).toFixed(2)}. 💰`
      );
      return;
    }

    if (
      q.includes("usage") ||
      q.includes("analytics")
    ) {
      if (averageUsage) {
        addBotMessage(
          `Average usage information is available in your dashboard analytics. You can compare Day, Evening, Night, International and Voicemail usage. 📈`
        );
      } else {
        addBotMessage(
          "You can use the Usage Analytics section to analyze Day, Evening, Night, International and Voicemail usage across customers. 📈"
        );
      }
      return;
    }

    if (
      q.includes("help") ||
      q.includes("what can you do")
    ) {
      addBotMessage(
        "I can help with:\n\n• Customer statistics\n• Cluster analysis\n• Tariff plans\n• Recommendation statistics\n• Average monthly cost\n• Usage analytics\n• Dataset information"
      );
      return;
    }

    addBotMessage(
      "I can help you with customer statistics, clusters, tariff plans, recommendations, monthly costs and usage analytics. Try asking: \"How many customers are there?\""
    );
  }

  function sendMessage() {
    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: trimmed,
      },
    ]);

    setMessage("");

    setTimeout(() => {
      handleQuestion(trimmed);
    }, 400);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  const quickQuestions = [
    {
      icon: Users,
      text: "How many customers?",
    },
    {
      icon: BarChart3,
      text: "Show cluster information",
    },
    {
      icon: Package,
      text: "How many tariff plans?",
    },
    {
      icon: Sparkles,
      text: "How many recommendations?",
    },
  ];

  return (
    <>
      {/* =====================================================
          FLOATING CHAT BUTTON
      ===================================================== */}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            fixed
            bottom-6
            right-6
            z-[100]
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-purple-600
            to-indigo-700
            text-white
            shadow-2xl
            shadow-purple-500/40
            transition-all
            duration-200
            hover:scale-110
            hover:shadow-purple-500/60
          "
          aria-label="Open Admin Assistant"
        >
          <Bot size={30} />

          <span
            className="
              absolute
              right-0
              top-0
              h-4
              w-4
              rounded-full
              border-2
              border-white
              bg-emerald-400
            "
          />
        </button>
      )}

      {/* =====================================================
          CHAT WINDOW
      ===================================================== */}

      {open && (
        <div
          className={`
            fixed
            bottom-6
            right-6
            z-[100]
            flex
            w-[390px]
            max-w-[calc(100vw-32px)]
            flex-col
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            transition-all
            duration-300

            ${
              minimized
                ? "h-[76px]"
                : "h-[650px] max-h-[calc(100vh-48px)]"
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
              bg-gradient-to-r
              from-[#17133f]
              via-[#271b68]
              to-[#39229a]
              px-5
              py-4
              text-white
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/15
                "
              >
                <Bot size={24} />
              </div>

              <div>
                <h3 className="text-sm font-bold">
                  Tariff Assistant
                </h3>

                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-[11px] text-white/70">
                    Admin Assistant • Online
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setMinimized((prev) => !prev)
                }
                className="
                  rounded-lg
                  p-2
                  text-white/70
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <Minimize2 size={17} />
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="
                  rounded-lg
                  p-2
                  text-white/70
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* =================================================
                  MESSAGES
              ================================================= */}

              <div
                className="
                  flex-1
                  space-y-4
                  overflow-y-auto
                  bg-slate-50
                  p-4
                "
              >
                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`flex ${
                      item.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {item.sender === "bot" && (
                      <div
                        className="
                          mr-2
                          mt-1
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-purple-100
                          text-purple-600
                        "
                      >
                        <Bot size={17} />
                      </div>
                    )}

                    <div
                      className={`
                        max-w-[78%]
                        whitespace-pre-line
                        rounded-2xl
                        px-4
                        py-3
                        text-sm
                        leading-5

                        ${
                          item.sender === "user"
                            ? `
                              rounded-br-md
                              bg-purple-600
                              text-white
                            `
                            : `
                              rounded-bl-md
                              border
                              border-slate-200
                              bg-white
                              text-slate-700
                              shadow-sm
                            `
                        }
                      `}
                    >
                      {item.text}
                    </div>
                  </div>
                ))}

                {/* =================================================
                    QUICK QUESTIONS
                ================================================= */}

                <div className="pt-2">
                  <p
                    className="
                      mb-2
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Quick questions
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {quickQuestions.map(
                      ({
                        icon: Icon,
                        text,
                      }) => (
                        <button
                          key={text}
                          type="button"
                          onClick={() => {
                            setMessages((prev) => [
                              ...prev,
                              {
                                id:
                                  Date.now() +
                                  Math.random(),
                                sender: "user",
                                text,
                              },
                            ]);

                            setTimeout(() => {
                              handleQuestion(text);
                            }, 300);
                          }}
                          className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-purple-100
                            bg-white
                            px-3
                            py-2.5
                            text-left
                            text-[11px]
                            font-medium
                            text-slate-600
                            transition
                            hover:border-purple-300
                            hover:bg-purple-50
                            hover:text-purple-700
                          "
                        >
                          <Icon
                            size={15}
                            className="text-purple-600"
                          />

                          <span>
                            {text}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* =================================================
                  INPUT
              ================================================= */}

              <div className="border-t border-slate-200 bg-white p-4">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2
                    transition
                    focus-within:border-purple-400
                    focus-within:ring-2
                    focus-within:ring-purple-100
                  "
                >
                  <input
                    type="text"
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Ask the admin assistant..."
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-1
                      py-2
                      text-sm
                      text-slate-700
                      outline-none
                      placeholder:text-slate-400
                    "
                  />

                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-purple-600
                      text-white
                      transition
                      hover:bg-purple-700
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <Send size={17} />
                  </button>
                </div>

                <p
                  className="
                    mt-2
                    text-center
                    text-[10px]
                    text-slate-400
                  "
                >
                  TariffSmart Admin Assistant
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default AdminChatbot;