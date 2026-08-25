function RecommendationCard() {

  const plans = [
    {
      rank: 1,
      name: "Unlimited Max",
      price: "$79.99",
      minutes: "Unlimited",
      data: "100 GB",
      score: "96%",
      saving: "$24.50",
      reason: "Best match for your high usage"
    },
    {
      rank: 2,
      name: "Power Plus",
      price: "$59.99",
      minutes: "3000 min",
      data: "60 GB",
      score: "91%",
      saving: "$18.20",
      reason: "Excellent balance of price and usage"
    },
    {
      rank: 3,
      name: "Smart Premium",
      price: "$49.99",
      minutes: "2000 min",
      data: "40 GB",
      score: "86%",
      saving: "$12.70",
      reason: "Good option for moderate usage"
    }
  ];

  return (
    <section className="panel">

      <div className="panel-header">

        <div>
          <p className="eyebrow">AI RECOMMENDATION ENGINE</p>
          <h2>Top 3 Recommended Plans</h2>
        </div>

        <span className="recommendation-badge">
          ✨ Personalized
        </span>

      </div>

      <div className="plans-grid">

        {plans.map((plan) => (

          <div
            className={`plan-card ${
              plan.rank === 1 ? "best-plan" : ""
            }`}
            key={plan.rank}
          >

            {plan.rank === 1 && (
              <div className="best-label">
                ⭐ BEST MATCH
              </div>
            )}

            <div className="rank">
              #{plan.rank}
            </div>

            <h3>{plan.name}</h3>

            <div className="plan-price">
              {plan.price}
              <span>/month</span>
            </div>

            <div className="match-score">
              <strong>{plan.score}</strong>
              <span>match</span>
            </div>

            <div className="plan-details">

              <div>
                <span>📞</span>
                {plan.minutes}
              </div>

              <div>
                <span>📶</span>
                {plan.data}
              </div>

            </div>

            <div className="saving">
              Save approximately <strong>{plan.saving}</strong>/month
            </div>

            <p className="plan-reason">
              {plan.reason}
            </p>

            <button className="select-plan">
              View Plan →
            </button>

          </div>

        ))}

      </div>

    </section>
  );
}

export default RecommendationCard;