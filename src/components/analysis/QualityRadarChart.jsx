import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

const fallbackScores = {
  Naming: 100,
  'HTTP Design': 100,
  Documentation: 100,
  Security: 100,
  'Response Consistency': 100,
};

export function QualityRadarChart({ categoryScores }) {
  const scores = categoryScores || fallbackScores;
  const data = Object.entries(scores).map(([category, score]) => ({
    category,
    score,
  }));

  return (
    <section className="panel p-5">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-[#172033]">Quality Dimensions</h2>
        <p className="mt-1 text-sm text-[#66728a]">Radar view by smell category.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="#d9e0ec" />
            <PolarAngleAxis dataKey="category" tick={{ fill: '#536079', fontSize: 12 }} />
            <Radar dataKey="score" stroke="#1e5eff" fill="#1e5eff" fillOpacity={0.18} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
