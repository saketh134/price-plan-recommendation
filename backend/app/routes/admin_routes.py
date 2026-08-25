from fastapi import APIRouter

router = APIRouter()


@router.get("/dashboard")
def admin_dashboard():

    return {
        "summary": {
            "total_customers": 3000,
            "total_clusters": 4,
            "total_plans": 25,
            "total_recommendations": 2450,
            "average_monthly_cost": 46.28
        },

        "clusters": [
            {
                "cluster": 0,
                "count": 1050,
                "percentage": 35
            },
            {
                "cluster": 1,
                "count": 750,
                "percentage": 25
            },
            {
                "cluster": 2,
                "count": 540,
                "percentage": 18
            },
            {
                "cluster": 3,
                "count": 660,
                "percentage": 22
            }
        ],

        "usage": {
            "day": 220.4,
            "evening": 430.6,
            "night": 187.7,
            "international": 12.8,
            "voicemail": 2.7
        },

        "plans": [
            {
                "plan_name": "Saver Lite",
                "percentage": 38
            },
            {
                "plan_name": "Saver Plus",
                "percentage": 30
            },
            {
                "plan_name": "Standard Flex",
                "percentage": 20
            },
            {
                "plan_name": "Premium Pro",
                "percentage": 12
            }
        ],

        "recent_customers": [],

        "recent_activity": {
            "Dataset": "Connected",
            "Clustering": "Completed",
            "Recommendations": "Generated",
            "Tariff Plans": "25"
        },

        "metrics": {
            "silhouette_score": 0.62,
            "elbow_inertia": 1256.4,
            "total_savings": 12450,
            "average_saving": 9.12
        }
    }