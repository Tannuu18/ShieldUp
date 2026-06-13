import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ModuleCard from "../components/ModuleCard";

export default function Dashboard() {
  return (
    <div className="bg-[#06111f] min-h-screen">
      <Sidebar />

      <div className="ml-64 p-8">
        <h1 className="text-5xl font-bold text-cyan-400">
          CyberShield
        </h1>

        <p className="text-gray-400 mt-2">
          Your AI-Powered Cybersecurity Toolkit
        </p>

        <div className="grid grid-cols-4 gap-5 mt-8">
          <StatCard
            title="Total Scans"
            value="14,208"
            subtitle="+12% 7d"
          />

          <StatCard
            title="Threats Detected"
            value="342"
            subtitle="+4% 7d"
            color="text-red-500"
          />

          <StatCard
            title="Safe Results"
            value="13,866"
            subtitle="97.5% total"
            color="text-green-500"
          />

          <StatCard
            title="AI Accuracy"
            value="99.8%"
            subtitle="Operational"
            color="text-yellow-500"
          />
        </div>

        <h2 className="text-cyan-400 font-bold text-xl mt-10">
          ACTIVE DEFENSE MODULES
        </h2>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <ModuleCard
            title="Scam Message Analyzer"
            description="Analyze SMS, emails and phishing messages."
          />

          <ModuleCard
            title="URL Safety Scanner"
            description="Scan suspicious links in real-time."
          />

          <ModuleCard
            title="Screenshot Phishing Detector"
            description="Detect phishing through screenshots."
          />

          <ModuleCard
            title="AI Scam Simulator"
            description="Train against AI-generated scams."
          />
        </div>
      </div>
    </div>
  );
}