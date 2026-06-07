import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileCode2, RotateCcw } from 'lucide-react';
import { Button } from '../components/common/Button';
import { AiSuggestionPanel } from '../components/analysis/AiSuggestionPanel';
import { QualityRadarChart } from '../components/analysis/QualityRadarChart';
import { ScoreCard } from '../components/analysis/ScoreCard';
import { SeveritySummary } from '../components/analysis/SeveritySummary';
import { SmellList } from '../components/analysis/SmellList';
import { getErrorMessage } from '../lib/api';
import { analysisService } from '../services/analysis.service';

export function AnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rerunning, setRerunning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalysis = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await analysisService.get(id);
        setAnalysis(response.data.analysis);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [id]);

  if (loading) {
    return <div className="text-sm text-[#66728a]">Loading analysis...</div>;
  }

  if (error) {
    return <div className="rounded-md border border-[#f4b4ae] bg-[#fce8e6] p-4 text-sm text-[#a83531]">{error}</div>;
  }

  if (!analysis) {
    return <div className="text-sm text-[#66728a]">Analysis not found.</div>;
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeFileName = `${analysis.filePath || 'analysis'}`
      .replace(/[^a-z0-9._-]+/gi, '-')
      .replace(/^-|-$/g, '');

    link.href = url;
    link.download = `apilens-${safeFileName || analysis._id}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const rerunAnalysis = async () => {
    setRerunning(true);
    setError('');
    try {
      const response = await analysisService.create({
        repoFullName: analysis.repoFullName,
        branch: analysis.branch,
        filePath: analysis.filePath,
        fileType: analysis.fileType,
      });
      navigate(`/analysis/${response.data.analysis._id}`);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setRerunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Link to="/repositories" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e5eff]">
            <ArrowLeft size={16} />
            Back to repositories
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-[#172033]">Analysis Report</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#66728a]">
            <FileCode2 size={16} />
            <span>{analysis.repoFullName}</span>
            <span>/</span>
            <span>{analysis.branch}</span>
            <span>/</span>
            <span className="font-mono">{analysis.filePath}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={exportJson}>
            <Download size={16} />
            Export JSON
          </Button>
          {analysis.repoFullName && analysis.filePath ? (
            <Button onClick={rerunAnalysis} disabled={rerunning}>
              <RotateCcw size={16} />
              {rerunning ? 'Re-running...' : 'Re-run'}
            </Button>
          ) : null}
          <span className="rounded-md bg-[#edf7f2] px-3 py-2 text-sm font-semibold text-[#0f8a5f]">
            {analysis.status}
          </span>
        </div>
      </div>

      {analysis.warnings?.length ? (
        <div className="rounded-md bg-[#fff4db] p-4 text-sm text-[#8a5a00]">{analysis.warnings.join(' ')}</div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[300px_1fr_260px]">
        <ScoreCard analysis={analysis} />
        <QualityRadarChart categoryScores={analysis.categoryScores} />
        <SeveritySummary summary={analysis.severitySummary} />
      </div>

      <AiSuggestionPanel suggestion={analysis.aiSuggestion} />
      <SmellList smells={analysis.smells || []} />
    </div>
  );
}
