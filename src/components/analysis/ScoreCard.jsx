const getScoreColor = (score) => {
  if (score >= 80) return 'text-[#0f8a5f]';
  if (score >= 50) return 'text-[#b7791f]';
  return 'text-[#c2413b]';
};

export function ScoreCard({ analysis }) {
  const score = analysis?.score ?? 0;

  return (
    <section className="panel p-5">
      <p className="text-sm font-medium text-[#66728a]">API Quality Score</p>
      <div className="mt-4 flex items-end gap-3">
        <span className={`text-6xl font-semibold ${getScoreColor(score)}`}>{score}</span>
        <span className="pb-2 text-sm text-[#66728a]">/ 100</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-[#f5f7fb] p-3">
          <p className="text-[#66728a]">Endpoints</p>
          <p className="mt-1 text-xl font-semibold text-[#172033]">{analysis?.endpointCount ?? 0}</p>
        </div>
        <div className="rounded-md bg-[#f5f7fb] p-3">
          <p className="text-[#66728a]">Smells</p>
          <p className="mt-1 text-xl font-semibold text-[#172033]">{analysis?.smellCount ?? analysis?.smells?.length ?? 0}</p>
        </div>
      </div>
    </section>
  );
}
