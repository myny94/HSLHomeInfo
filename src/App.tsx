import { Routes, Route, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MainPage from "./pages/Main";
import StopPage from "./pages/StopPage";
import "./App.css"

function App() {

  return (
    <div className="App">
      <header className="HSLheader">
        <div className="headingText">HSL real time table</div>
        <p className="subHeadingText">Real-time bus schedule near your location (Uusimaa region)</p>
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/schedule" element={<MainPage />} />
          <Route path="/stop" element={<StopPage />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
