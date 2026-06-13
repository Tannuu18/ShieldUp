export default function ModuleCard({
  title,
  description,
}) {
  return (
    <div className="bg-[#0b1629] border border-[#1b2a44] rounded-xl p-6 hover:border-cyan-500 transition">
      <div className="flex justify-between">
        <h3 className="text-white font-semibold">
          {title}
        </h3>

        <button className="text-cyan-400">
          Launch ↗
        </button>
      </div>

      <p className="text-gray-400 mt-3 text-sm">
        {description}
      </p>
    </div>
  );
}