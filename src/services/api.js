const API_BASE_URL = "http://127.0.0.1:8000";


export async function checkBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Backend connection failed:", error);
    return false;
  }
}


export async function getCustomer(phone) {

  const cleanPhone = String(phone).trim();

  if (!cleanPhone) {
    throw new Error("Please enter a phone number.");
  }

  console.log("Searching phone:", cleanPhone);


  const url =
    `${API_BASE_URL}/api/customers/${encodeURIComponent(cleanPhone)}`;

  console.log("Request:", url);


  const response = await fetch(url);


  if (response.status === 404) {

    throw new Error("PHONE_NOT_FOUND");

  }


  if (!response.ok) {

    let message = "Unable to get customer information.";

    try {

      const errorData = await response.json();

      message =
        errorData.detail ||
        message;

    } catch (error) {

      // Backend did not return JSON

    }

    throw new Error(message);
  }


  const data = await response.json();

  console.log("Customer data:", data);

  return data;
}


export async function getRecommendations(phone) {

  const cleanPhone = String(phone).trim();

  const url =
    `${API_BASE_URL}/api/recommendations/${encodeURIComponent(cleanPhone)}`;

  const response = await fetch(url);


  if (!response.ok) {

    let message = "Unable to get recommendations.";

    try {

      const errorData = await response.json();

      message =
        errorData.detail ||
        message;

    } catch (error) {}

    throw new Error(message);
  }


  return await response.json();
}