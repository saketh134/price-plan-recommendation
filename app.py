import streamlit as st
import requests
import pandas as pd


# ============================================================
# PAGE CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="Smart Tariff Recommendation",
    page_icon="📱",
    layout="wide",
    initial_sidebar_state="expanded"
)


# ============================================================
# FASTAPI CONFIGURATION
# ============================================================

API_URL = "http://127.0.0.1:8000"


# ============================================================
# CUSTOM CSS
# ============================================================

st.markdown(
    """
    <style>

    .main-title {
        font-size: 42px;
        font-weight: 700;
        margin-bottom: 5px;
    }

    .subtitle {
        font-size: 18px;
        color: #666;
        margin-bottom: 25px;
    }

    .best-card {
        padding: 25px;
        border-radius: 18px;
        border: 2px solid #4CAF50;
        margin-top: 10px;
        margin-bottom: 20px;
    }

    .plan-title {
        font-size: 30px;
        font-weight: 700;
    }

    .price {
        font-size: 32px;
        font-weight: 700;
    }

    .section-title {
        font-size: 25px;
        font-weight: 700;
        margin-top: 25px;
        margin-bottom: 15px;
    }

    </style>
    """,
    unsafe_allow_html=True
)


# ============================================================
# API HELPER
# ============================================================

def api_request(endpoint):

    try:

        response = requests.get(
            f"{API_URL}{endpoint}",
            timeout=10
        )

        if response.status_code == 200:

            return response.json()

        elif response.status_code == 404:

            return {
                "error": response.json().get(
                    "detail",
                    "Customer not found."
                )
            }

        else:

            return {
                "error":
                    f"API returned status "
                    f"{response.status_code}"
            }

    except requests.exceptions.ConnectionError:

        return {
            "error":
                "FastAPI backend is not running."
        }

    except requests.exceptions.Timeout:

        return {
            "error":
                "FastAPI request timed out."
        }

    except Exception as e:

        return {
            "error":
                str(e)
        }


# ============================================================
# CHECK BACKEND
# ============================================================

health = api_request(
    "/health"
)


backend_online = (
    "error" not in health
)


# ============================================================
# LOAD CUSTOMER LIST FROM FASTAPI
# ============================================================

@st.cache_data(ttl=300)
def load_customer_numbers():

    result = api_request(
        "/customers"
    )

    if "error" in result:

        return []

    return result.get(
        "customers",
        []
    )


phone_numbers = load_customer_numbers()


# ============================================================
# HEADER
# ============================================================

st.markdown(
    '<div class="main-title">'
    '📱 Smart Tariff Recommendation System'
    '</div>',
    unsafe_allow_html=True
)

st.markdown(
    '<div class="subtitle">'
    'Personalized telecom tariff recommendations '
    'using customer usage patterns and machine learning.'
    '</div>',
    unsafe_allow_html=True
)


# ============================================================
# BACKEND STATUS
# ============================================================

if backend_online:

    st.success(
        "🟢 FastAPI Backend Connected"
    )

else:

    st.error(
        "🔴 FastAPI Backend Offline"
    )

    st.info(
        "Start the backend using: "
        "`uvicorn backend.main:app --reload`"
    )


# ============================================================
# SIDEBAR
# ============================================================

st.sidebar.title(
    "👤 Customer Search"
)

st.sidebar.write(
    "Search and select a customer "
    "from the validated customer dataset."
)


# ============================================================
# CUSTOMER PHONE NUMBER
# ============================================================

if phone_numbers:

    selected_phone = st.sidebar.selectbox(
        "Customer Phone Number",
        phone_numbers,
        index=None,
        placeholder="🔎 Search customer phone number..."
    )

else:

    selected_phone = None

    st.sidebar.error(
        "Unable to load customer numbers "
        "from FastAPI."
    )


st.sidebar.caption(
    f"Available customers: "
    f"{len(phone_numbers):,}"
)


# ============================================================
# RECOMMEND BUTTON
# ============================================================

recommend_button = st.sidebar.button(
    "🔍 Recommend Plans",
    use_container_width=True
)


st.sidebar.divider()


st.sidebar.caption(
    "Customer usage is retrieved automatically "
    "through the FastAPI backend."
)


# ============================================================
# INITIAL SCREEN
# ============================================================

if not recommend_button:

    st.info(
        "👈 Search for a customer phone number "
        "and click **Recommend Plans**."
    )


    st.markdown(
        '<div class="section-title">'
        '🤖 Machine Learning System'
        '</div>',
        unsafe_allow_html=True
    )


    col1, col2, col3, col4 = st.columns(4)


    with col1:

        st.metric(
            "Customers",
            "7,467"
        )

        st.caption(
            "Validated customers"
        )


    with col2:

        st.metric(
            "Customer Segments",
            "2"
        )

        st.caption(
            "K-Means clustering"
        )


    with col3:

        st.metric(
            "Tariff Plans",
            "8"
        )

        st.caption(
            "Generated tariff candidates"
        )


    with col4:

        st.metric(
            "Best R²",
            "0.8623"
        )

        st.caption(
            "Random Forest"
        )


    st.divider()


    st.markdown(
        '<div class="section-title">'
        '🔄 System Architecture'
        '</div>',
        unsafe_allow_html=True
    )


    st.info(
        """
        **Customer Phone Number**
        →
        **Streamlit Frontend**
        →
        **FastAPI Backend**
        →
        **Customer Data + Tariff Data**
        →
        **Recommendation Engine**
        →
        **Top 3 Plans**
        """
    )


# ============================================================
# RECOMMENDATION
# ============================================================

if recommend_button:

    if not backend_online:

        st.error(
            "❌ FastAPI backend is not running."
        )

        st.code(
            "uvicorn backend.main:app --reload",
            language="powershell"
        )

        st.stop()


    if selected_phone is None:

        st.warning(
            "⚠️ Please search and select "
            "a customer first."
        )

        st.stop()


    # ========================================================
    # CALL FASTAPI
    # ========================================================

    result = api_request(
        f"/recommend/{selected_phone}"
    )


    # ========================================================
    # HANDLE API ERROR
    # ========================================================

    if "error" in result:

        st.error(
            f"❌ {result['error']}"
        )

        st.stop()


    # ========================================================
    # CUSTOMER DATA
    # ========================================================

    customer_usage = result[
        "customer_usage"
    ]

    recommendations = result[
        "recommendations"
    ]


    best = recommendations[0]


    # ========================================================
    # CUSTOMER PROFILE
    # ========================================================

    st.markdown(
        '<div class="section-title">'
        '👤 Customer Profile'
        '</div>',
        unsafe_allow_html=True
    )


    st.write(
        f"**Phone Number:** `{selected_phone}`"
    )


    col1, col2, col3, col4 = st.columns(4)


    with col1:

        st.metric(
            "☀️ Day",
            f'{customer_usage["day_mins"]:.1f} min'
        )


    with col2:

        st.metric(
            "🌆 Evening",
            f'{customer_usage["eve_mins"]:.1f} min'
        )


    with col3:

        st.metric(
            "🌙 Night",
            f'{customer_usage["night_mins"]:.1f} min'
        )


    with col4:

        st.metric(
            "🌍 International",
            f'{customer_usage["intl_mins"]:.1f} min'
        )


    st.divider()


    # ========================================================
    # BEST PLAN
    # ========================================================

    st.markdown(
        '<div class="section-title">'
        '🏆 Best Recommended Plan'
        '</div>',
        unsafe_allow_html=True
    )


    st.markdown(
        f"""
        <div class="best-card">

        <div class="plan-title">
        🥇 {best["plan"]}
        </div>

        <br>

        <div class="price">
        ₹{best["predicted_charge"]:.2f}
        </div>

        <p>Predicted monthly charge</p>

        </div>
        """,
        unsafe_allow_html=True
    )


    col1, col2, col3, col4 = st.columns(4)


    with col1:

        st.metric(
            "Coverage",
            f'{best["coverage"]:.0f}%'
        )


    with col2:

        st.metric(
            "Usage Fit",
            f'{best["usage_score"]:.2f}'
        )


    with col3:

        st.metric(
            "Affordability",
            f'{best["affordability_score"]:.2f}'
        )


    with col4:

        st.metric(
            "Final Score",
            f'{best["final_score"]:.2f}'
        )


    # ========================================================
    # RANKING EXPLANATION
    # ========================================================

    st.info(
        "🎯 **Recommendation priority:** "
        "Full usage coverage → Usage similarity → "
        "Affordability"
    )


    # ========================================================
    # WHY THIS PLAN?
    # ========================================================

    st.markdown(
        '<div class="section-title">'
        '💡 Why was this plan recommended?'
        '</div>',
        unsafe_allow_html=True
    )


    if best["coverage"] == 100:

        st.write(
            "✅ The plan fully covers the "
            "customer's observed usage."
        )

    else:

        st.write(
            f'⚠️ The plan covers '
            f'{best["coverage"]:.0f}% of the '
            "customer's observed usage."
        )


    if best["usage_score"] >= 80:

        st.write(
            "✅ Strong match with the "
            "customer's usage pattern."
        )

    elif best["usage_score"] >= 65:

        st.write(
            "✓ Good match with the "
            "customer's usage pattern."
        )

    else:

        st.write(
            "ℹ️ Moderate usage match."
        )


    if best["affordability_score"] >= 70:

        st.write(
            "✅ Relatively affordable compared "
            "with the available plans."
        )

    elif best["affordability_score"] >= 40:

        st.write(
            "✓ Moderate affordability."
        )

    else:

        st.write(
            "ℹ️ Higher predicted charge, but "
            "the plan provides a strong usage match."
        )


    # ========================================================
    # TOP 3 TABLE
    # ========================================================

    st.markdown(
        '<div class="section-title">'
        '🏆 Top 3 Recommended Plans'
        '</div>',
        unsafe_allow_html=True
    )


    table_data = []


    for plan in recommendations:

        table_data.append(
            {
                "Rank":
                    plan["rank"],

                "Plan":
                    plan["plan"],

                "Coverage":
                    f'{plan["coverage"]:.0f}%',

                "Usage Score":
                    plan["usage_score"],

                "Affordability":
                    plan[
                        "affordability_score"
                    ],

                "Final Score":
                    plan["final_score"],

                "Predicted Charge":
                    f'₹{plan["predicted_charge"]:.2f}'
            }
        )


    display_df = pd.DataFrame(
        table_data
    )


    st.dataframe(
        display_df,
        use_container_width=True,
        hide_index=True
    )


    # ========================================================
    # RECOMMENDATION CARDS
    # ========================================================

    st.markdown(
        '<div class="section-title">'
        '🥇🥈🥉 Recommendation Comparison'
        '</div>',
        unsafe_allow_html=True
    )


    columns = st.columns(
        len(recommendations)
    )


    for i, plan in enumerate(
        recommendations
    ):

        with columns[i]:

            if i == 0:

                st.success(
                    "🥇 BEST MATCH"
                )

            elif i == 1:

                st.info(
                    "🥈 ALTERNATIVE"
                )

            else:

                st.warning(
                    "🥉 ALTERNATIVE"
                )


            st.subheader(
                plan["plan"]
            )


            st.metric(
                "Predicted Charge",
                f'₹{plan["predicted_charge"]:.2f}'
            )


            st.write(
                f'**Coverage:** '
                f'{plan["coverage"]:.0f}%'
            )


            st.write(
                f'**Usage Fit:** '
                f'{plan["usage_score"]:.2f}'
            )


            st.write(
                f'**Affordability:** '
                f'{plan["affordability_score"]:.2f}'
            )


            st.write(
                f'**Final Score:** '
                f'{plan["final_score"]:.2f}'
            )


    # ========================================================
    # USAGE VS BEST PLAN
    # ========================================================

    st.markdown(
        '<div class="section-title">'
        '📊 Customer Usage vs Best Plan'
        '</div>',
        unsafe_allow_html=True
    )


    best_allowances = best[
        "allowances"
    ]


    chart_data = pd.DataFrame(
        {
            "Customer Usage": [
                customer_usage[
                    "day_mins"
                ],

                customer_usage[
                    "eve_mins"
                ],

                customer_usage[
                    "night_mins"
                ],

                customer_usage[
                    "intl_mins"
                ]
            ],

            "Plan Allowance": [
                best_allowances[
                    "day"
                ],

                best_allowances[
                    "evening"
                ],

                best_allowances[
                    "night"
                ],

                best_allowances[
                    "international"
                ]
            ]
        },

        index=[
            "Day",
            "Evening",
            "Night",
            "International"
        ]
    )


    st.bar_chart(
        chart_data
    )


    # ========================================================
    # PLAN ALLOWANCES
    # ========================================================

    st.markdown(
        '<div class="section-title">'
        '📦 Top 3 Plan Allowances'
        '</div>',
        unsafe_allow_html=True
    )


    allowance_data = []


    for plan in recommendations:

        allowance_data.append(
            {
                "Plan":
                    plan["plan"],

                "Day":
                    plan[
                        "allowances"
                    ]["day"],

                "Evening":
                    plan[
                        "allowances"
                    ]["evening"],

                "Night":
                    plan[
                        "allowances"
                    ]["night"],

                "International":
                    plan[
                        "allowances"
                    ]["international"]
            }
        )


    allowance_df = pd.DataFrame(
        allowance_data
    )


    st.dataframe(
        allowance_df,
        use_container_width=True,
        hide_index=True
    )


    # ========================================================
    # BACKEND INFORMATION
    # ========================================================

    st.divider()


    st.markdown(
        '<div class="section-title">'
        '⚙️ System Information'
        '</div>',
        unsafe_allow_html=True
    )


    col1, col2, col3 = st.columns(3)


    with col1:

        st.metric(
            "FastAPI Status",
            "🟢 Online"
        )


    with col2:

        st.metric(
            "Customers",
            "7,467"
        )


    with col3:

        st.metric(
            "Tariffs",
            "8"
        )


    st.caption(
        "Frontend: Streamlit | "
        "Backend: FastAPI | "
        "Pricing Model: Random Forest"
    )