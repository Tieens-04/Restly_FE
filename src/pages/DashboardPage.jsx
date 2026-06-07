import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, FlaskConical, Github } from 'lucide-react';
import { Alert } from '../components/common/Alert';
import { analysisService } from '../services/analysis.service';
import { getErrorMessage } from '../lib/api';

export function DashboardPage() {
  const [analyses, setAnalyses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        const response = await analysisService.listMine({ limit: 5 });
        setAnalyses(response.data.analyses || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      }
    };

    loadAnalyses();
  }, []);

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1e5eff]">APILens workspace</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#172033]">API Quality Dashboard</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#536079]">
              Start by connecting a GitHub repository, selecting a branch, and analyzing detected API files.
            </p>
          </div>
          <Link
            to="/repositories"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1e5eff] px-4 text-sm font-semibold text-white hover:bg-[#164bd1]"
          >
            Open repositories
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'GitHub workflow', text: 'Choose repositories, branches, and detected API files.', icon: Github, to: '/repositories' },
          { title: 'Playground', text: 'Analyze raw Express, OpenAPI, or Postman content.', icon: FlaskConical, to: '/playground' },
          { title: 'History', text: 'Review saved analysis reports from MongoDB.', icon: Clock, to: '/history' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} to={item.to} className="panel p-5 hover:border-[#1e5eff]">
              <Icon className="text-[#1e5eff]" size={22} />
              <h2 className="mt-4 text-base font-semibold text-[#172033]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#66728a]">{item.text}</p>
            </Link>
          );
        })}
      </div>

      {error ? <Alert tone="warning">{error}</Alert> : null}

      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#edf1f7] p-5">
          <div>
            <h2 className="text-base font-semibold text-[#172033]">Recent analyses</h2>
            <p className="mt-1 text-sm text-[#66728a]">Latest reports saved by the backend.</p>
          </div>
          <Link to="/history" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e5eff]">
            View all
            <ArrowRight size={16} />
          </Link>
        </div>
        {analyses.length === 0 ? (
          <div className="p-5 text-sm text-[#66728a]">No recent analyses yet.</div>
        ) : (
          analyses.map((analysis) => (
            <Link
              key={analysis._id}
              to={`/analysis/${analysis._id}`}
              className="flex flex-col gap-2 border-b border-[#edf1f7] p-4 last:border-b-0 hover:bg-[#f5f7fb] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-mono text-sm font-semibold text-[#172033]">{analysis.filePath}</p>
                <p className="mt-1 text-sm text-[#66728a]">{analysis.repoFullName} / {analysis.branch}</p>
              </div>
              <span className="w-fit rounded-md bg-[#f1f4f9] px-3 py-2 text-sm font-semibold text-[#172033]">
                Score {analysis.score}
              </span>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
