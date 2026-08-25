import { useState } from "react";

import { sendChatMessage } from "../services/api";


function ChatAssistant({
  customer,
  recommendations = [],
}) {

  const [open, setOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =========================================================
  // INITIAL MESSAGE
  // =========================================================

  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        text:
          "Hi! I'm TariffSmart Assistant 👋\n\n" +
          "I can help you understand your usage, " +
          "charges, recommended plans and savings.",
      },
    ]);


  // =========================================================
  // SEND MESSAGE
  // =========================================================

  async function sendMessage(
    text = message
  ) {

    const userMessage =
      String(text || "").trim();


    // Do not send empty messages
    if (!userMessage || loading) {
      return;
    }


    // Clear input
    setMessage("");


    // Add user message
    setMessages((prev) => [

      ...prev,

      {
        role: "user",
        text: userMessage,
      },

    ]);


    // Start loading
    setLoading(true);


    try {

      // =====================================================
      // SEND TO BACKEND
      // =====================================================

      const data =
  await sendChatMessage({
    message: userMessage,
    customer: customer || null,
    recommendations: Array.isArray(recommendations)
      ? recommendations
      : [],
  });
        


      console.log(
        "CHATBOT DATA:",
        data
      );


      // =====================================================
      // GET AI RESPONSE
      // =====================================================

      const assistantReply =

        data?.response ||

        data?.reply ||

        data?.message ||

        data?.answer ||

        data?.text ||

        "Sorry, I couldn't generate an answer.";


      // =====================================================
      // ADD AI MESSAGE
      // =====================================================

      setMessages((prev) => [

        ...prev,

        {
          role: "assistant",
          text: assistantReply,
        },

      ]);


    } catch (error) {

      console.error(
        "CHAT ERROR:",
        error
      );


      // =====================================================
      // ERROR MESSAGE
      // =====================================================

      setMessages((prev) => [

        ...prev,

        {
          role: "assistant",

          text:
            error?.message ||
            "I'm unable to connect to the AI assistant right now. Please make sure the backend is running.",
        },

      ]);

    } finally {

      setLoading(false);

    }

  }


  // =========================================================
  // ENTER KEY
  // =========================================================

  function handleKeyDown(e) {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      sendMessage();

    }

  }


  // =========================================================
  // CLEAR CHAT
  // =========================================================

  function clearChat() {

    setMessages([

      {
        role: "assistant",

        text:
          "Hi! I'm TariffSmart Assistant 👋\n\n" +
          "I can help you understand your usage, " +
          "charges, recommended plans and savings.",
      },

    ]);

  }


  // =========================================================
  // OPEN / CLOSE CHAT
  // =========================================================

  function toggleChat() {

    setOpen((previous) =>
      !previous
    );

  }


  // =========================================================
  // UI
  // =========================================================

  return (

    <>

      {/* =====================================================
          FLOATING CHAT BUTTON
      ===================================================== */}

      <button

        type="button"

        onClick={toggleChat}

        aria-label={
          open
            ? "Close assistant"
            : "Open assistant"
        }

        className="
          fixed
          bottom-6
          right-6
          z-[100]
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-gradient-to-r
          from-purple-600
          to-violet-700
          text-2xl
          text-white
          shadow-2xl
          transition-all
          duration-200
          hover:scale-105
          hover:shadow-purple-500/30
        "

      >

        {open ? "×" : "🤖"}

      </button>


      {/* =====================================================
          CHAT WINDOW
      ===================================================== */}

      {open && (

        <div

          className="
            fixed
            bottom-24
            right-6
            z-[100]
            flex
            h-[550px]
            w-[380px]
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-purple-100
            bg-white
            shadow-2xl
          "

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
              from-[#171044]
              to-[#5126b8]
              p-5
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
                  text-xl
                "

              >

                🤖

              </div>


              <div>

                <h3 className="font-bold">

                  TariffSmart Assistant

                </h3>


                <p className="text-xs text-purple-200">

                  AI-powered customer support

                </p>

              </div>

            </div>


            {/* CLEAR CHAT */}

            <button

              type="button"

              onClick={clearChat}

              className="
                rounded-lg
                px-2
                py-1
                text-xs
                text-purple-100
                transition
                hover:bg-white/10
                hover:text-white
              "

            >

              Clear

            </button>

          </div>


          {/* =================================================
              CUSTOMER STATUS
          ================================================= */}

          <div

            className="
              border-b
              bg-purple-50
              px-4
              py-2
              text-xs
              text-purple-700
            "

          >

            {customer?.phone_number ||
             customer?.phone ? (

              <>

                Customer:{" "}

                <strong>

                  {
                    customer?.phone_number ||
                    customer?.phone
                  }

                </strong>

              </>

            ) : (

              "Customer information unavailable"

            )}

          </div>


          {/* =================================================
              MESSAGES
          ================================================= */}

          <div

            className="
              flex-1
              space-y-3
              overflow-y-auto
              bg-slate-50
              p-4
            "

          >

            {messages.map(
              (msg, index) => (

                <div

                  key={index}

                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}

                >

                  <div

                    className={`max-w-[82%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"

                        ? "bg-purple-600 text-white shadow-sm"

                        : "border border-slate-200 bg-white text-slate-700 shadow-sm"
                    }`}

                  >

                    {msg.text}

                  </div>

                </div>

              )
            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

              <div

                className="
                  flex
                  justify-start
                "

              >

                <div

                  className="
                    rounded-2xl
                    border
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-slate-500
                    shadow-sm
                  "

                >

                  <span>

                    Thinking

                  </span>

                  <span className="animate-pulse">

                    ...

                  </span>

                </div>

              </div>

            )}

          </div>


          {/* =================================================
              QUICK QUESTIONS
          ================================================= */}

          <div

            className="
              flex
              gap-2
              overflow-x-auto
              border-t
              bg-white
              p-3
            "

          >

            <button

              type="button"

              disabled={loading}

              onClick={() =>
                sendMessage(
                  "What is my current usage?"
                )
              }

              className="
                whitespace-nowrap
                rounded-full
                bg-purple-50
                px-3
                py-2
                text-xs
                text-purple-700
                transition
                hover:bg-purple-100
                disabled:opacity-50
              "

            >

              My usage

            </button>


            <button

              type="button"

              disabled={loading}

              onClick={() =>
                sendMessage(
                  "Why was this plan recommended?"
                )
              }

              className="
                whitespace-nowrap
                rounded-full
                bg-purple-50
                px-3
                py-2
                text-xs
                text-purple-700
                transition
                hover:bg-purple-100
                disabled:opacity-50
              "

            >

              Why this plan?

            </button>


            <button

              type="button"

              disabled={loading}

              onClick={() =>
                sendMessage(
                  "How much can I save?"
                )
              }

              className="
                whitespace-nowrap
                rounded-full
                bg-purple-50
                px-3
                py-2
                text-xs
                text-purple-700
                transition
                hover:bg-purple-100
                disabled:opacity-50
              "

            >

              My savings

            </button>

          </div>


          {/* =================================================
              INPUT
          ================================================= */}

          <div

            className="
              flex
              gap-2
              border-t
              bg-white
              p-3
            "

          >

            <input

              type="text"

              value={message}

              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }

              onKeyDown={handleKeyDown}

              disabled={loading}

              placeholder="Ask about your tariff..."

              className="
                min-w-0
                flex-1
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
                text-sm
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-purple-500
                focus:ring-2
                focus:ring-purple-100
                disabled:bg-slate-50
              "

            />


            <button

              type="button"

              onClick={() =>
                sendMessage()
              }

              disabled={
                loading ||
                !message.trim()
              }

              aria-label="Send message"

              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-purple-600
                text-lg
                text-white
                transition
                hover:bg-purple-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "

            >

              ➤

            </button>

          </div>

        </div>

      )}

    </>

  );

}


export default ChatAssistant;