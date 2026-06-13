import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ScamAnalyzer from "./pages/ScamAnalyzer";
import URLSafetyScanner from "./pages/URLSafetyScanner";
import PhishingDetector from "./pages/PhishingDetector";
import AISimulator from "./pages/AISimulator";
import QRAnalyzer from "./pages/QRAnalyzer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scam-analyzer" element={<ScamAnalyzer />} />
        <Route path="/url-scanner" element={<URLSafetyScanner />} />
        <Route path="/phishing-detector" element={<PhishingDetector />} />
        <Route path="/ai-simulator" element={<AISimulator />} />
        <Route path="/qr-analyzer" element={<QRAnalyzer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;