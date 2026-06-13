export default function StatCard({
  title,
  value,
  subtitle,
  color = "text-cyan-400",
}) {
  return (
    <div className="bg-[#0b1629] border border-[#1b2a44] rounded-xl p-6">
      <h3 className="text-gray-400 text-sm">{title}</h3>

      <h2 className={`text-3xl font-bold mt-3 ${color}`}>
        {value}
      </h2>

      <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}