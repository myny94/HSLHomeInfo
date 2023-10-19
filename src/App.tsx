import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import MainPage from './pages/Main'
import StopPage from './pages/StopPage'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="HSLheader">
        <div className="headingText p-2">HSL real time table</div>
        <p className="subHeadingText">
          Real-time bus schedule near your location (Uusimaa region)
        </p>
      </header>
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/schedule" element={<MainPage />} />
            <Route path="/stop" element={<StopPage />} />
            <Route path="/" element={<Navigate to="/schedule" replace />} />
            <Route path="*" element={<p>There is nothing here: 404!</p>} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
