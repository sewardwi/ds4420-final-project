import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const linkStyle = (path) => ({
    color: pathname === path ? '#fff' : 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    marginRight: 28,
    fontSize: 14,
    fontWeight: pathname === path ? 600 : 400,
    borderBottom: pathname === path ? '2px solid #fff' : '2px solid transparent',
    paddingBottom: 4,
    transition: 'color 0.15s',
  })

  return (
    <nav style={{ background: '#1a1a2e', padding: '0 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', height: 56 }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginRight: 40, letterSpacing: '-0.3px' }}>
          Kalshi Efficiency
        </span>
        <Link to="/" style={linkStyle('/')}>Home</Link>
        <Link to="/results" style={linkStyle('/results')}>ARIMA Results</Link>
      </div>
    </nav>
  )
}
