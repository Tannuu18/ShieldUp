import Sidebar from "../components/Sidebar";

export default function PhishingDetector() {
  return (
    <div className="bg-[#06111f] min-h-screen">
      <Sidebar />

      <div className="ml-64 p-8">
        <h1 className="text-4xl font-bold text-white">Screenshot Phishing Detector</h1>
        <p className="text-gray-400 mt-2">
          Upload screenshots to inspect for phishing indicators.
        </p>

        <div className="bg-[#0b1629] border border-[#1b2a44] rounded-xl mt-8 p-6">
          <p className="text-gray-300">
            This section is ready for screenshot upload and analysis.
          </p>
        </div>
      </div>
    </div>
  );
}