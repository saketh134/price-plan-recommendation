function UsageAnalysis() {

  return (
    <section className="panel">

      <div className="panel-header">
        <div>
          <p className="eyebrow">BEHAVIOR ANALYSIS</p>
          <h2>Customer Usage Behavior</h2>
        </div>

        <span className="cluster-badge">
          Cluster 6 · High Usage
        </span>
      </div>

      <div className="usage-bars">

        <div className="usage-item">
          <div>
            <span>Day Usage</span>
            <b>78%</b>
          </div>
          <div className="bar">
            <div style={{ width: "78%" }}></div>
          </div>
        </div>

        <div className="usage-item">
          <div>
            <span>Evening Usage</span>
            <b>64%</b>
          </div>
          <div className="bar">
            <div style={{ width: "64%" }}></div>
          </div>
        </div>

        <div className="usage-item">
          <div>
            <span>Night Usage</span>
            <b>82%</b>
          </div>
          <div className="bar">
            <div style={{ width: "82%" }}></div>
          </div>
        </div>

        <div className="usage-item">
          <div>
            <span>International Usage</span>
            <b>38%</b>
          </div>
          <div className="bar">
            <div style={{ width: "38%" }}></div>
          </div>
        </div>

      </div>

      <div className="behavior-message">

        <div className="message-icon">💡</div>

        <div>
          <strong>What we found</strong>

          <p>
            You are a high-usage customer with significant
            night and day calling activity. A larger plan
            can reduce your overall monthly cost.
          </p>
        </div>

      </div>

    </section>
  );
}

export default UsageAnalysis;