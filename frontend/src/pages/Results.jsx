import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const COLORS = { Yes: '#4CAF50', No: '#FF5722' }
const OUTCOME_COLORS = { 1: '#1565c0', 0: '#c62828' }

function StatCard({ label, value }) {
  return (
    <div style={{ flex: 1, minWidth: 150, background: '#f8f9fa', borderRadius: 8,
      padding: '16px 20px', border: '1px solid #e8e8e8' }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e' }}>{value}</div>
    </div>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #ddd', padding: '10px 14px',
      borderRadius: 6, fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: 240 }}>
      <p style={{ fontWeight: 700, marginBottom: 6, color: '#1a1a2e', wordBreak: 'break-all' }}>
        {d.ticker}
      </p>
      <p style={{ margin: '2px 0' }}>Model: <strong>{d.arima_order}</strong></p>
      <p style={{ margin: '2px 0' }}>RMSE: <strong>{d.rmse}</strong></p>
      <p style={{ margin: '2px 0' }}>Trades: <strong>{d.n_trades?.toLocaleString()}</strong></p>
      <p style={{ margin: '2px 0' }}>Outcome: <strong style={{ color: OUTCOME_COLORS[d.outcome] }}>
        {d.outcome === 1 ? 'YES' : 'NO'}
      </strong></p>
      <p style={{ margin: '2px 0' }}>ADF p: <strong>{d.adf_p}</strong></p>
      <p style={{ margin: '2px 0' }}>LB p: <strong>{d.lb_p}</strong></p>
    </div>
  )
}

export default function Results() {
  const [data, setData]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [outcomeFilter, setOutcome]   = useState('all')
  const [rwFilter, setRw]             = useState('all')
  const [sortField, setSortField]     = useState('n_trades')
  const [sortDir, setSortDir]         = useState('desc')

  useEffect(() => {
    fetch('/arima_results.csv')
      .then(r => r.text())
      .then(text => {
        const { data: rows } = Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true })
        setData(rows)
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => data.filter(d => {
    if (outcomeFilter === 'yes' && d.outcome !== 1) return false
    if (outcomeFilter === 'no'  && d.outcome !== 0) return false
    if (rwFilter === 'yes' && d.random_walk !== 'Yes') return false
    if (rwFilter === 'no'  && d.random_walk !== 'No')  return false
    return true
  }), [data, outcomeFilter, rwFilter])

  const scatterYes = useMemo(() =>
    filtered.filter(d => d.random_walk === 'Yes').map(d => ({ ...d, log_trades: +Math.log10(d.n_trades).toFixed(3) })),
    [filtered])

  const scatterNo = useMemo(() =>
    filtered.filter(d => d.random_walk === 'No').map(d => ({ ...d, log_trades: +Math.log10(d.n_trades).toFixed(3) })),
    [filtered])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortField], bv = b[sortField]
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortDir === 'asc' ? av - bv : bv - av
    })
  }, [filtered, sortField, sortDir])

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const n        = filtered.length
  const pctRW    = n ? (filtered.filter(d => d.random_walk === 'Yes').length / n * 100).toFixed(1) + '%' : '—'
  const medRMSE  = n ? [...filtered].map(d => d.rmse).sort((a, b) => a - b)[Math.floor(n / 2)]?.toFixed(4) : '—'

  const selStyle = { padding: '7px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: 14, background: '#fff', cursor: 'pointer' }
  const thStyle  = (field) => ({
    padding: '10px 12px', textAlign: 'left', cursor: 'pointer', userSelect: 'none',
    borderBottom: '2px solid #e8e8e8', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
    color: sortField === field ? '#1a1a2e' : '#555',
  })

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#888', fontSize: 16 }}>
      Loading results...
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px' }}>

      <h1 style={{ color: '#1a1a2e', marginBottom: 6 }}>ARIMA Results</h1>
      <p style={{ color: '#666', marginBottom: 28 }}>
        ARIMA(p, d, q) models fit to {data.length} Kalshi contracts. Filter, explore, and hover points for details.
      </p>

      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatCard label="Contracts shown" value={n} />
        <StatCard label="Pure random walk" value={pctRW} />
        <StatCard label="Median RMSE" value={medRMSE} />
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 28, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Contract Outcome
          </label>
          <select value={outcomeFilter} onChange={e => setOutcome(e.target.value)} style={selStyle}>
            <option value="all">All outcomes</option>
            <option value="yes">Resolved YES</option>
            <option value="no">Resolved NO</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Random Walk
          </label>
          <select value={rwFilter} onChange={e => setRw(e.target.value)} style={selStyle}>
            <option value="all">All</option>
            <option value="yes">Pure random walk</option>
            <option value="no">Not random walk</option>
          </select>
        </div>
        {(outcomeFilter !== 'all' || rwFilter !== 'all') && (
          <button onClick={() => { setOutcome('all'); setRw('all') }}
            style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '7px 14px',
              fontSize: 13, cursor: 'pointer', color: '#555', alignSelf: 'flex-end' }}>
            Clear filters
          </button>
        )}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8,
        padding: '24px 24px 12px', marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, color: '#1a1a2e', marginBottom: 4 }}>
          Trade Volume vs. Out-of-Sample RMSE
        </h2>
        <p style={{ fontSize: 13, color: '#777', marginBottom: 20 }}>
          Each point is one contract. X-axis is log&#8321;&#8320;(number of trades). Colored by random walk classification.
          Hover for contract details.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 10, right: 30, bottom: 40, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="log_trades"
              type="number"
              name="Log Trades"
              domain={['auto', 'auto']}
              tickFormatter={v => `10^${v.toFixed(1)}`}
              label={{ value: 'log\u2081\u2080(Number of Trades)', position: 'insideBottom', offset: -25, fontSize: 12, fill: '#666' }}
            />
            <YAxis
              dataKey="rmse"
              type="number"
              name="RMSE"
              label={{ value: 'Out-of-Sample RMSE', angle: -90, position: 'insideLeft', offset: 15, fontSize: 12, fill: '#666' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Scatter name="Pure Random Walk" data={scatterYes} fill={COLORS.Yes} opacity={0.65} r={4} />
            <Scatter name="Not Random Walk"  data={scatterNo}  fill={COLORS.No}  opacity={0.65} r={4} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 16, color: '#1a1a2e' }}>All Contracts</h2>
          <span style={{ fontSize: 13, color: '#888' }}>{n} results</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                {[
                  ['ticker',      'Ticker'],
                  ['n_trades',    'Trades'],
                  ['outcome',     'Outcome'],
                  ['arima_order', 'Model'],
                  ['d',           'd'],
                  ['adf_p',       'ADF p'],
                  ['lb_p',        'LB p'],
                  ['rmse',        'RMSE'],
                  ['random_walk', 'Random Walk'],
                ].map(([field, label]) => (
                  <th key={field} onClick={() => handleSort(field)} style={thStyle(field)}>
                    {label} {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr key={row.ticker} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px 12px', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: 11, color: '#333' }}>
                    {row.ticker}
                  </td>
                  <td style={{ padding: '8px 12px' }}>{row.n_trades?.toLocaleString()}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                      background: row.outcome === 1 ? '#e3f2fd' : '#fce4ec',
                      color: row.outcome === 1 ? '#1565c0' : '#c62828' }}>
                      {row.outcome === 1 ? 'YES' : 'NO'}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 11 }}>{row.arima_order}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>{row.d}</td>
                  <td style={{ padding: '8px 12px' }}>{row.adf_p}</td>
                  <td style={{ padding: '8px 12px' }}>{row.lb_p}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{row.rmse}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                      background: row.random_walk === 'Yes' ? '#e8f5e9' : '#fff3e0',
                      color: row.random_walk === 'Yes' ? '#2e7d32' : '#e65100' }}>
                      {row.random_walk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
