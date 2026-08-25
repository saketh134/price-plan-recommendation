const API_BASE_URL = "http://127.0.0.1:8000";

/*
=========================================================
COMMON REQUEST FUNCTION
=========================================================
*/
async function apiRequest(url) {
  console.log("API REQUEST:", url);

  const response = await fetch(url);

  console.log(
    "API STATUS:",
    response.status,
    response.statusText
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `API request failed with status ${response.status}`;

    console.error("API ERROR:", message);

    throw new Error(message);
  }

  console.log("API RESPONSE:", data);

  return data;
}


/*
=========================================================
GET CUSTOMER + RECOMMENDATIONS + ALL PLANS
=========================================================

Backend:
GET /api/recommendations/{phone_number}
*/
export async function getRecommendations(phoneNumber) {
  if (!phoneNumber) {
    throw new Error("Phone number is required.");
  }

  const cleanPhone = String(phoneNumber)
    .trim()
    .replace(/\s+/g, "");

  const url =
    `${API_BASE_URL}/api/recommendations/` +
    encodeURIComponent(cleanPhone);

  return await apiRequest(url);
}


/*
=========================================================
GET CUSTOMER FOR LOGIN
=========================================================

We use the same recommendation endpoint because
your backend endpoint already returns customer information.
*/
export async function getCustomer(phoneNumber) {
  if (!phoneNumber) {
    throw new Error("Phone number is required.");
  }

  const result =
    await getRecommendations(phoneNumber);

  if (!result?.customer) {
    throw new Error("Customer not found.");
  }

  return {
    ...result.customer,

    usage:
      result.usage || {},

    calls:
      result.calls || {},

    services:
      result.services || {},

    charges:
      result.charges || {},

    recommendations:
      Array.isArray(result.recommendations)
        ? result.recommendations
        : [],

    all_plans:
      Array.isArray(result.all_plans)
        ? result.all_plans
        : [],

    recommendation_summary:
      result.recommendation_summary || {},

    backendData:
      result,
  };
}


/*
=========================================================
REGISTER CUSTOMER
=========================================================

Keep this function available so your existing
RegistrationPage/App.jsx imports do not break.
*/
export async function registerCustomer(customerData) {
  const url =
    `${API_BASE_URL}/api/customers/register`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(customerData),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      `Registration failed with status ${response.status}`
    );
  }

  return data;
}


/*
=========================================================
HEALTH CHECK
=========================================================
*/
export async function checkBackend() {
  return await apiRequest(
    `${API_BASE_URL}/health`
  );
}


/*
=========================================================
EXPORT API BASE URL
=========================================================
*/
/*
=========================================================
CHATBOT
=========================================================
*/
export async function sendChatMessage({
  message,
  customer = null,
  recommendations = [],
}) {
  if (!message || !message.trim()) {
    throw new Error("Message is required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: message.trim(),
        customer,
        recommendations,
      }),
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      "Chatbot request failed."
    );
  }

  console.log(
    "CHATBOT RESPONSE:",
    data
  );

  return data;
}
export { API_BASE_URL };