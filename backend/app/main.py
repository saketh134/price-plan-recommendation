from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional


# ============================================================
# EXISTING ROUTES
# ============================================================
from app.routes.customer_routes import (
    router as customer_router
)

from app.routes.recommendation_routes import (
    router as recommendation_router
)
# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Personalized Price Plan Recommendation API",
    description=(
        "API for customer usage analysis, "
        "tariff recommendations, admin dashboard "
        "and AI customer assistant"
    ),
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://price-plan-recommendation-frontend.onrender.com",
],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Price Plan Recommendation API is running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ============================================================
# CUSTOMER API
# ============================================================

app.include_router(
    customer_router,
    prefix="/api/customers",
    tags=["Customers"]
)


# ============================================================
# RECOMMENDATION API
# ============================================================

app.include_router(
    recommendation_router,
    prefix="/api/recommendations",
    tags=["Recommendations"]
)


# ============================================================
# ADMIN DASHBOARD API
# ============================================================

@app.get("/api/admin/dashboard")
def admin_dashboard():

    """
    Admin dashboard summary.

    This endpoint is used by:
        AdminDashboard.jsx

    URL:
        GET /api/admin/dashboard
    """

    return {

        # ====================================================
        # TOP SUMMARY CARDS
        # ====================================================

        "summary": {

            "total_customers": 3000,

            "total_clusters": 4,

            "total_plans": 25,

            "total_recommendations": 2450,

            "average_monthly_cost": 46.28,

            "active_plans": 25,

            "inactive_plans": 0
        },


        # ====================================================
        # CUSTOMER CLUSTER DISTRIBUTION
        # ====================================================

        "clusters": [

            {
                "cluster": 0,
                "name": "Light Users",
                "count": 1050,
                "percentage": 35
            },

            {
                "cluster": 1,
                "name": "Moderate Users",
                "count": 750,
                "percentage": 25
            },

            {
                "cluster": 2,
                "name": "International Users",
                "count": 540,
                "percentage": 18
            },

            {
                "cluster": 3,
                "name": "Heavy Users",
                "count": 660,
                "percentage": 22
            }

        ],


        # ====================================================
        # AVERAGE USAGE
        # ====================================================

        "usage": {

            "day": 220.4,

            "evening": 430.6,

            "night": 187.7,

            "international": 12.8,

            "voicemail": 2.7
        },


        # ====================================================
        # MOST RECOMMENDED PLANS
        # ====================================================

        "recommended_plans": [

            {
                "plan_name": "Saver Lite",
                "recommendations": 931,
                "percentage": 38
            },

            {
                "plan_name": "Saver Plus",
                "recommendations": 735,
                "percentage": 30
            },

            {
                "plan_name": "Standard Flex",
                "recommendations": 490,
                "percentage": 20
            },

            {
                "plan_name": "Premium Pro",
                "recommendations": 294,
                "percentage": 12
            }

        ],


        # ====================================================
        # RECENT CUSTOMERS
        # ====================================================

        "recent_customers": [

            {
                "customer_id": "327-1058",
                "phone_number": "9123456780",
                "day_minutes": 166.0,
                "evening_minutes": 322.5,
                "international_minutes": 6.3,
                "cluster": 1,
                "recommended_plan": "Saver Lite"
            },

            {
                "customer_id": "327-2210",
                "phone_number": "9123456781",
                "day_minutes": 280.0,
                "evening_minutes": 510.0,
                "international_minutes": 8.0,
                "cluster": 3,
                "recommended_plan": "Standard Flex"
            },

            {
                "customer_id": "327-3142",
                "phone_number": "9123456782",
                "day_minutes": 180.5,
                "evening_minutes": 318.0,
                "international_minutes": 25.0,
                "cluster": 2,
                "recommended_plan": "Saver Plus"
            },

            {
                "customer_id": "327-4120",
                "phone_number": "9123456783",
                "day_minutes": 320.0,
                "evening_minutes": 610.0,
                "international_minutes": 12.0,
                "cluster": 3,
                "recommended_plan": "Premium Pro"
            },

            {
                "customer_id": "327-5120",
                "phone_number": "9123456784",
                "day_minutes": 95.0,
                "evening_minutes": 150.0,
                "international_minutes": 2.0,
                "cluster": 0,
                "recommended_plan": "Saver Lite"
            }

        ],


        # ====================================================
        # RECENT ACTIVITY
        # ====================================================

        "recent_activity": [

            {
                "message": "Dataset uploaded",
                "status": "completed",
                "time": "10:30 AM"
            },

            {
                "message": "Dataset validation completed",
                "status": "completed",
                "time": "10:32 AM"
            },

            {
                "message": "K-Means clustering executed (k=4)",
                "status": "completed",
                "time": "10:35 AM"
            },

            {
                "message": "25 tariff plans generated",
                "status": "completed",
                "time": "10:38 AM"
            },

            {
                "message": "Tariff recommendations generated",
                "status": "completed",
                "time": "10:40 AM"
            }

        ],


        # ====================================================
        # MACHINE LEARNING METRICS
        # ====================================================

        "metrics": {

            "silhouette_score": 0.62,

            "elbow_inertia": 1256.4,

            "total_savings": 12450,

            "average_potential_saving": 9.12,

            "k_value": 4
        },


        # ====================================================
        # EXTRA INFORMATION
        # ====================================================

        "system": {

            "dataset_status": "Connected",

            "clustering_status": "Completed",

            "recommendation_status": "Completed",

            "total_tariff_plans": 25

        }

    }


# ============================================================
# CHATBOT REQUEST MODEL
# ============================================================

class ChatRequest(BaseModel):

    message: str

    customer: Optional[Dict[str, Any]] = None

    recommendations: List[Dict[str, Any]] = Field(
        default_factory=list
    )


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_number(
    data: Dict[str, Any],
    *keys,
    default=0
):

    """
    Safely get a numeric value from customer data.
    """

    if not isinstance(data, dict):
        return default

    for key in keys:

        value = data.get(key)

        if value is not None:

            try:

                return float(value)

            except (ValueError, TypeError):

                pass

    return default


# ============================================================
# FORMAT NUMBER
# ============================================================

def format_number(value):

    try:

        value = float(value)

        if value.is_integer():

            return str(int(value))

        return f"{value:.2f}"

    except Exception:

        return str(value)


# ============================================================
# GET CUSTOMER USAGE
# ============================================================

def get_customer_usage(customer):

    if not customer:

        return {}

    usage = customer.get("usage")

    if isinstance(usage, dict):

        return usage

    return customer


# ============================================================
# GET BEST PLAN
# ============================================================

def get_best_plan(recommendations):

    if not recommendations:

        return None

    return recommendations[0]


# ============================================================
# CHAT RESPONSE ENGINE
# ============================================================

def generate_chat_response(
    message,
    customer,
    recommendations
):

    """
    TariffSmart customer assistant.

    Answers using customer usage,
    charges and recommendation information.
    """

    message = (
        message
        .strip()
        .lower()
    )

    customer = customer or {}

    recommendations = recommendations or []

    usage = get_customer_usage(customer)


    # ========================================================
    # CUSTOMER INFORMATION
    # ========================================================

    phone = (

        customer.get("phone_number")

        or customer.get("phone")

        or "your account"

    )


    cluster = (

        customer.get("cluster")

        if customer.get("cluster") is not None

        else "N/A"

    )


    account_length = get_number(
        customer,
        "account_length",
        default=0
    )


    churn = str(
        customer.get(
            "churn",
            "0"
        )
    )


    # ========================================================
    # USAGE
    # ========================================================

    day_minutes = get_number(
        usage,
        "day_minutes",
        "day_mins",
        default=0
    )


    evening_minutes = get_number(
        usage,
        "evening_minutes",
        "evening_mins",
        default=0
    )


    night_minutes = get_number(
        usage,
        "night_minutes",
        "night_mins",
        default=0
    )


    international_minutes = get_number(
        usage,
        "international_minutes",
        "international_mins",
        default=0
    )


    total_minutes = get_number(
        usage,
        "total_minutes",
        default=(
            day_minutes
            + evening_minutes
            + night_minutes
            + international_minutes
        )
    )


    total_calls = get_number(
        usage,
        "total_calls",
        default=0
    )


    avg_minutes_per_call = get_number(
        usage,
        "avg_minutes_per_call",
        default=(
            total_minutes / total_calls
            if total_calls > 0
            else 0
        )
    )


    # ========================================================
    # CALLS
    # ========================================================

    calls = customer.get(
        "calls",
        {}
    )

    if not isinstance(calls, dict):

        calls = {}


    day_calls = get_number(
        calls,
        "day_calls",
        default=0
    )


    evening_calls = get_number(
        calls,
        "evening_calls",
        default=0
    )


    night_calls = get_number(
        calls,
        "night_calls",
        default=0
    )


    international_calls = get_number(
        calls,
        "international_calls",
        default=0
    )


    # ========================================================
    # SERVICES
    # ========================================================

    services = customer.get(
        "services",
        {}
    )

    if not isinstance(services, dict):

        services = {}


    voicemail_messages = get_number(
        services,
        "voicemail_messages",
        default=0
    )


    customer_service_calls = get_number(
        services,
        "customer_service_calls",
        default=0
    )


    # ========================================================
    # CHARGES
    # ========================================================

    charges = customer.get(
        "charges",
        {}
    )

    if not isinstance(charges, dict):

        charges = {}


    total_charge = get_number(
        charges,
        "total_charge",
        "total",
        default=0
    )


    day_charge = get_number(
        charges,
        "day_charge",
        default=0
    )


    evening_charge = get_number(
        charges,
        "evening_charge",
        default=0
    )


    night_charge = get_number(
        charges,
        "night_charge",
        default=0
    )


    international_charge = get_number(
        charges,
        "international_charge",
        default=0
    )


    # ========================================================
    # BEST PLAN
    # ========================================================

    best_plan = get_best_plan(
        recommendations
    )


    best_plan_name = (

        best_plan.get(
            "plan_level"
        )

        if best_plan

        else "No plan available"

    )


    best_plan_id = (

        best_plan.get(
            "plan_id"
        )

        if best_plan

        else "N/A"

    )


    best_plan_price = (

        get_number(
            best_plan,
            "monthly_price",
            "price",
            default=0
        )

        if best_plan

        else 0

    )


    best_score = (

        get_number(
            best_plan,
            "suitability_score",
            default=0
        )

        if best_plan

        else 0

    )


    # ========================================================
    # SAVINGS
    # ========================================================

    potential_savings = 0

    if best_plan:

        potential_savings = get_number(
            best_plan,
            "potential_savings",
            default=0
        )


    # ========================================================
    # QUESTION: USAGE
    # ========================================================

    if any(
        word in message
        for word in [
            "usage",
            "use",
            "minutes",
            "minute",
            "calling"
        ]
    ):

        return (

            f"Here is your actual usage "
            f"for customer {phone}:\n\n"

            f"☀️ Day minutes: "
            f"{format_number(day_minutes)} mins\n"

            f"🌅 Evening minutes: "
            f"{format_number(evening_minutes)} mins\n"

            f"🌙 Night minutes: "
            f"{format_number(night_minutes)} mins\n"

            f"🌐 International minutes: "
            f"{format_number(international_minutes)} mins\n\n"

            f"📊 Total usage: "
            f"{format_number(total_minutes)} mins\n"

            f"📞 Total calls: "
            f"{format_number(total_calls)}\n"

            f"⏱️ Average minutes per call: "
            f"{format_number(avg_minutes_per_call)} mins"
        )


    # ========================================================
    # QUESTION: PLAN RECOMMENDATION
    # ========================================================

    if any(
        word in message
        for word in [
            "recommend",
            "recommended",
            "best plan",
            "suitable plan",
            "which plan"
        ]
    ):

        if not best_plan:

            return (
                "I couldn't find a recommendation "
                "for this customer."
            )


        reason = best_plan.get(
            "reason",
            "This plan best matches your usage."
        )


        return (

            f"⭐ Your top recommended plan is "
            f"{best_plan_name} "
            f"({best_plan_id}).\n\n"

            f"💰 Monthly price: "
            f"₹{format_number(best_plan_price)}\n"

            f"📈 Suitability score: "
            f"{format_number(best_score)}%\n\n"

            f"Why it was recommended:\n"
            f"{reason}"
        )


    # ========================================================
    # QUESTION: SAVINGS
    # ========================================================

    if any(
        word in message
        for word in [
            "saving",
            "savings",
            "save",
            "cheaper",
            "cost"
        ]
    ):

        if best_plan:

            return (

                f"💰 Your recommended-plan "
                f"cost is ₹{format_number(best_plan_price)} "
                f"per month.\n\n"

                f"Potential savings: "
                f"₹{format_number(potential_savings)} "
                f"per month.\n\n"

                f"The recommended plan is "
                f"{best_plan_name} "
                f"({best_plan_id})."
            )


        return (
            "I don't have enough recommendation "
            "data to calculate your savings."
        )


    # ========================================================
    # QUESTION: CHARGES
    # ========================================================

    if any(
        word in message
        for word in [
            "charge",
            "charges",
            "bill",
            "billing",
            "spent"
        ]
    ):

        return (

            f"💳 Your current usage charges are:\n\n"

            f"☀️ Day charge: "
            f"₹{format_number(day_charge)}\n"

            f"🌅 Evening charge: "
            f"₹{format_number(evening_charge)}\n"

            f"🌙 Night charge: "
            f"₹{format_number(night_charge)}\n"

            f"🌐 International charge: "
            f"₹{format_number(international_charge)}\n\n"

            f"💰 Total charge: "
            f"₹{format_number(total_charge)}"
        )


    # ========================================================
    # QUESTION: CALLS
    # ========================================================

    if any(
        word in message
        for word in [
            "calls",
            "call activity"
        ]
    ):

        return (

            f"📞 Your call activity is:\n\n"

            f"☀️ Day calls: "
            f"{format_number(day_calls)}\n"

            f"🌅 Evening calls: "
            f"{format_number(evening_calls)}\n"

            f"🌙 Night calls: "
            f"{format_number(night_calls)}\n"

            f"🌐 International calls: "
            f"{format_number(international_calls)}"
        )


    # ========================================================
    # QUESTION: CUSTOMER PROFILE
    # ========================================================

    if any(
        word in message
        for word in [
            "customer",
            "profile",
            "account",
            "cluster"
        ]
    ):

        return (

            f"👤 Customer information:\n\n"

            f"Customer number: {phone}\n"

            f"Cluster: {cluster}\n"

            f"Account length: "
            f"{format_number(account_length)} days\n"

            f"Churn status: "
            f"{'Active' if churn in ['0', '0.0'] else 'At Risk'}"
        )


    # ========================================================
    # QUESTION: PLAN COMPARISON
    # ========================================================

    if any(
        word in message
        for word in [
            "compare",
            "comparison",
            "plans"
        ]
    ):

        if not recommendations:

            return (
                "There are no recommendation "
                "plans available for comparison."
            )


        response = (
            "📋 Here are your top recommended plans:\n\n"
        )


        for index, plan in enumerate(
            recommendations[:3],
            start=1
        ):

            plan_name = plan.get(
                "plan_level",
                "Plan"
            )


            plan_id = plan.get(
                "plan_id",
                "N/A"
            )


            price = get_number(
                plan,
                "monthly_price",
                "price",
                default=0
            )


            score = get_number(
                plan,
                "suitability_score",
                default=0
            )


            response += (

                f"{index}. {plan_name} "
                f"({plan_id})\n"

                f"   💰 ₹{format_number(price)}/month\n"

                f"   📈 Suitability: "
                f"{format_number(score)}%\n\n"
            )


        return response


    # ========================================================
    # GREETING
    # ========================================================

    if any(
        word in message
        for word in [
            "hi",
            "hello",
            "hey",
            "good morning",
            "good evening"
        ]
    ):

        return (

            "Hello! 👋\n\n"

            "I'm your TariffSmart Assistant. "
            "I can help you with:\n\n"

            "📊 Your usage\n"

            "📞 Call activity\n"

            "💳 Charges\n"

            "📋 Recommended plans\n"

            "💰 Savings\n"

            "👤 Customer information\n\n"

            "Ask me anything about your tariff plan."
        )


    # ========================================================
    # DEFAULT RESPONSE
    # ========================================================

    return (

        "I can help you with your "
        "TariffSmart account. 😊\n\n"

        "Try asking:\n\n"

        "• What is my current usage?\n"

        "• Why was this plan recommended?\n"

        "• How much can I save?\n"

        "• What are my charges?\n"

        "• Show my call activity\n"

        "• Compare my recommended plans\n"

        "• What is my customer cluster?"
    )


# ============================================================
# CHAT API
# ============================================================

@app.post("/api/chat")
def chat(request: ChatRequest):

    try:

        reply = generate_chat_response(

            request.message,

            request.customer,

            request.recommendations

        )


        return {

            "success": True,

            "reply": reply,

            "response": reply

        }


    except Exception as error:

        print(
            "CHAT ERROR:",
            error
        )


        return {

            "success": False,

            "reply":
                "Sorry, I couldn't process your request right now.",

            "response":
                "Sorry, I couldn't process your request right now."

        }