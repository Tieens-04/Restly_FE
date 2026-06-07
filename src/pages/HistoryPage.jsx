import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileCode2, Trash2 } from 'lucide-react';
import { Alert } from '../components/common/Alert';
import { analysisService } from '../services/analysis.service';
import { getErrorMessage } from '../lib/api';

export function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const deleteAnalysis = async (event, id) => {
    event.preventDefault();
    event.stopPropagation();

    setError('');
    try {
      await analysisService.delete(id);
      setAnalyses((current) => current.filter((analysis) => analysis._id !== id));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await analysisService.listMine({ limit: 20 });
        setAnalyses(response.data.analyses || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      <section className="panel p-5">
        <div className="flex items-center gap-3">
          <Clock className="text-[#1e5eff]" size={22} />
          <div>
            <h1 className="text-2xl font-semibold text-[#172033]">Analysis History</h1>
            <p className="mt-1 text-sm text-[#66728a]">Latest saved reports from GitHub analysis runs.</p>
          </div>
        </div>
      </section>

      {error ? <Alert>{error}</Alert> : null}

      <section className="panel overflow-hidden">
        {loading ? (
          <div className="p-5 text-sm text-[#66728a]">Loading history...</div>
        ) : analyses.length === 0 ? (
          <div className="p-5 text-sm text-[#66728a]">No saved analyses yet.</div>
        ) : (
          analyses.map((analysis) => (
            <Link
              key={analysis._id}
              to={`/analysis/${analysis._id}`}
              className="flex flex-col gap-3 border-b border-[#edf1f7] p-4 last:border-b-0 hover:bg-[#f5f7fb] md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-md bg-[#eaf0ff] text-[#1e5eff]">
                  <FileCode2 size={17} />
                </span>
                <div>
                  <p className="font-mono text-sm font-semibold text-[#172033]">{analysis.filePath}</p>
                  <p className="mt-1 text-sm text-[#66728a]">
                    {analysis.repoFullName} / {analysis.branch} / {analysis.fileType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-[#f1f4f9] px-3 py-2 text-sm font-semibold text-[#172033]">
                  Score {analysis.score}
                </span>
                <span className="text-xs text-[#66728a]">
                  {new Date(analysis.createdAt).toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={(event) => deleteAnalysis(event, analysis._id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#d9e0ec] bg-white text-[#c2413b] hover:bg-[#fce8e6]"
                  title="Delete analysis"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
