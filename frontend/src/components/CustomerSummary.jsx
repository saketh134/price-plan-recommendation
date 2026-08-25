function CustomerSummary() {

  return (
    <section className="summary-grid">

      <div className="stat-card">
        <div className="stat-icon">📞</div>
        <div>
          <span>Day Minutes</span>
          <h2>158.4</h2>
          <small>Monthly average</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🌙</div>
        <div>
          <span>Night Minutes</span>
          <h2>184.2</h2>
          <small>Monthly average</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📱</div>
        <div>
          <span>International</span>
          <h2>42.8</h2>
          <small>Minutes used</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💬</div>
        <div>
          <span>Customer Calls</span>
          <h2>1.8</h2>
          <small>Support calls</small>
        </div>
      </div>

    </section>
  );
}

export default CustomerSummary;