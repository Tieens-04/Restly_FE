import { useMemo, useState } from 'react';

const severityStyles = {
  Critical: 'bg-[#fce8e6] text-[#c2413b]',
  Medium: 'bg-[#fff4db] text-[#9a6700]',
  Low: 'bg-[#eaf0ff] text-[#1e5eff]',
};

export function SmellList({ smells = [] }) {
  const [severity, setSeverity] = useState('All');

  const filteredSmells = useMemo(() => {
    if (severity === 'All') return smells;
    return smells.filter((smell) => smell.severity === severity);
  }, [severity, smells]);

  return (
    <section className="panel p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-semibold text-[#172033]">Detected Smells</h2>
          <p className="mt-1 text-sm text-[#66728a]">Sorted by backend severity and rule order.</p>
        </div>
        <select
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
          className="h-10 rounded-md border border-[#d9e0ec] bg-white px-3 text-sm text-[#172033]"
        >
          {['All', 'Critical', 'Medium', 'Low'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 space-y-3">
        {filteredSmells.length === 0 ? (
          <div className="rounded-md bg-[#f5f7fb] p-4 text-sm text-[#66728a]">No smells match this filter.</div>
        ) : (
          filteredSmells.map((smell, index) => (
            <article key={`${smell.ruleId}-${index}`} className="rounded-md border border-[#d9e0ec] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-[#1e5eff]">{smell.ruleId}</span>
                    <h3 className="text-sm font-semibold text-[#172033]">{smell.smellName}</h3>
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${severityStyles[smell.severity]}`}>
                      {smell.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#536079]">{smell.description}</p>
                </div>
                <div className="text-left text-xs text-[#66728a] sm:text-right">
                  Weight {smell.weight}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(smell.endpoints || []).map((endpoint) => (
                  <span key={endpoint} className="rounded-md bg-[#f1f4f9] px-2 py-1 font-mono text-xs text-[#172033]">
                    {endpoint}
                  </span>
                ))}
                {(smell.lineNumbers || []).map((line) => (
                  <span key={line} className="rounded-md bg-[#edf7f2] px-2 py-1 text-xs text-[#0f8a5f]">
                    line {line}
                  </span>
                ))}
              </div>

              {smell.suggestion ? (
                <div className="mt-3 rounded-md bg-[#f5f7fb] p-3 text-sm leading-6 text-[#172033]">
                  {smell.suggestion}
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
