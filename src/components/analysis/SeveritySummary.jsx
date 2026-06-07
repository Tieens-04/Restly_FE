const items = [
  { key: 'critical', label: 'Critical', color: 'bg-[#fce8e6] text-[#c2413b]' },
  { key: 'medium', label: 'Medium', color: 'bg-[#fff4db] text-[#9a6700]' },
  { key: 'low', label: 'Low', color: 'bg-[#eaf0ff] text-[#1e5eff]' },
];

export function SeveritySummary({ summary }) {
  return (
    <section className="panel p-5">
      <h2 className="text-base font-semibold text-[#172033]">Severity Summary</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded-md bg-[#f5f7fb] p-3">
            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${item.color}`}>{item.label}</span>
            <span className="text-xl font-semibold text-[#172033]">{summary?.[item.key] ?? 0}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
