import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Results from './pages/Results'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
