import Sidebar from "../components/Sidebar";

export default function AISimulator() {
  return (
    <div className="bg-[#06111f] min-h-screen">
      <Sidebar />

      <div className="ml-64 p-8">
        <h1 className="text-4xl font-bold text-white">AI Scam Simulator</h1>
        <p className="text-gray-400 mt-2">
          Practice against generated scam scenarios.
        </p>

        <div className="bg-[#0b1629] border border-[#1b2a44] rounded-xl mt-8 p-6">
          <p className="text-gray-300">
            This section can host simulated scam campaigns and response training.
          </p>
        </div>
      </div>
    </div>
  );
}