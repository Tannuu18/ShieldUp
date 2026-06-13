import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navItems = [
    { to: "/", label: "Dashboard", badge: "01" },
    { to: "/scam-analyzer", label: "Scam Analyzer", badge: "02" },
    { to: "/url-scanner", label: "URL Scanner", badge: "03" },
    { to: "/phishing-detector", label: "Phishing Detector", badge: "04" },
    { to: "/ai-simulator", label: "AI Simulator", badge: "05" },
    { to: "/qr-analyzer", label: "QR Analyzer", badge: "06" },
  ];

  return (
    <div className="w-64 h-screen bg-[#081120] border-r border-[#1a2940] fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-white text-2xl font-bold">CyberShield</h1>
        <p className="text-cyan-400 text-sm">AI</p>
      </div>

      <nav className="px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 p-3 rounded-lg transition",
                isActive
                  ? "text-cyan-300 bg-[#0d1d33]"
                  : "text-gray-400 hover:bg-[#0d1d33] hover:text-white",
              ].join(" ")
            }
          >
            <span className="h-8 w-8 rounded-lg border border-[#1f3553] bg-[#0f2039] text-xs font-semibold text-cyan-300 grid place-items-center shrink-0">
              {item.badge}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}