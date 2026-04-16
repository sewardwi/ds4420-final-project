import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

      <div style={{ marginBottom: 48 }}>
        <p style={{ color: '#888', fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          DS 4420 Final Project — Spring 2026
        </p>
        <h1 style={{ fontSize: 38, color: '#1a1a2e', marginBottom: 16, lineHeight: 1.2 }}>
          Are Kalshi Prediction Markets Efficient?
        </h1>
        <p style={{ fontSize: 17, color: '#555', maxWidth: 700, marginBottom: 28 }}>
          Analyzing trade-level data across 347 contracts to test whether Kalshi prices
          follow a random walk — and whether alpha can be generated from predictable market structure.
        </p>
        <button
          onClick={() => navigate('/results')}
          style={{ background: '#1a1a2e', color: '#fff', border: 'none', padding: '12px 28px',
            borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Explore ARIMA Results →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
        {[
          { stat: '347', label: 'Contracts analyzed' },
          { stat: '70.3%', label: 'Classified as pure random walks' },
          { stat: '0.144', label: 'Median out-of-sample RMSE' },
        ].map(item => (
          <div key={item.stat} style={{ background: '#1a1a2e', color: '#fff', borderRadius: 8, padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 6 }}>{item.stat}</div>
            <div style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.4 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ color: '#1a1a2e', fontSize: 22, borderBottom: '2px solid #eee', paddingBottom: 10, marginBottom: 20 }}>
          About This Project
        </h2>
        <p>
          Electronic prediction markets have become a mainstream way for individuals to bet on future events,
          with Kalshi being the most well-known U.S.-regulated platform. As usage grows, a natural question
          emerges: are prices in these markets truly efficient? If they are, prices reflect all available
          information and future movements are unpredictable. If they are not, systematic
          patterns exist that could be exploited to generate alpha.
        </p>
        <p>
          This project investigates market efficiency on Kalshi using three complementary machine learning
          methods: ARIMA time series modeling, Bayesian regression, and LSTM. We analyze trade-level data across
          347 contracts spanning sports, politics, and entertainment markets to assess whether prices behave
          as random walks and whether predictable structure can be identified.
        </p>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ color: '#1a1a2e', fontSize: 22, borderBottom: '2px solid #eee', paddingBottom: 10, marginBottom: 20 }}>
          Methods
        </h2>
        <ul style={{ fontSize: 14, color: '#555', lineHeight: 2, paddingLeft: 20, margin: 0 }}>
          <li>
            <strong style={{ color: '#1a1a2e' }}>ARIMA — Time Series (R):</strong> Auto-selected ARIMA(p, d, q) models
            fit to the yes-price series of each contract. The differencing order <em>d</em> and Ljung-Box residual test
            jointly determine whether a contract's price process is consistent with a random walk. Models are evaluated
            on a held-out 20% test set using RMSE.
          </li>
          <li>
            <strong style={{ color: '#1a1a2e' }}>Bayesian Regression (Python):</strong> A Bayesian logistic regression
            model predicts contract outcomes from features derived from trade history. Posterior distributions over
            coefficients provide interpretable uncertainty estimates of which market signals carry genuine predictive
            value beyond noise.
          </li>
          <li>
            <strong style={{ color: '#1a1a2e' }}>LSTM Neural Network (Python):</strong> A Long Short-Term Memory
            recurrent neural network trained on the sequential yes-price series of each contract. The LSTM captures
            nonlinear temporal dependencies that ARIMA cannot, providing a benchmark for whether deep learning offers
            meaningful gains in forecasting accuracy over classical time series methods.
          </li>
        </ul>
      </div>

    </div>
  )
}
