import { useState } from 'react';
import { FlaskConical, Play } from 'lucide-react';
import { Alert } from '../components/common/Alert';
import { Button } from '../components/common/Button';
import { AiSuggestionPanel } from '../components/analysis/AiSuggestionPanel';
import { QualityRadarChart } from '../components/analysis/QualityRadarChart';
import { ScoreCard } from '../components/analysis/ScoreCard';
import { SeveritySummary } from '../components/analysis/SeveritySummary';
import { SmellList } from '../components/analysis/SmellList';
import { getErrorMessage } from '../lib/api';
import { analysisService } from '../services/analysis.service';
import { parserService } from '../services/parser.service';

const sampleCode = "const router = require('express').Router();\nrouter.post('/createUser', createUser);\nrouter.get('/users', listUsers);";

export function PlaygroundPage() {
  const [form, setForm] = useState({
    sourceFile: 'src/routes/users.js',
    fileType: 'express',
    content: sampleCode,
  });
  const [mode, setMode] = useState('vscode');
  const [analysis, setAnalysis] = useState(null);
  const [parseResult, setParseResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setAnalysis(null);
    setParseResult(null);
    try {
      if (mode === 'parse') {
        const response = await parserService.preview(form);
        setParseResult(response.data);
      } else if (mode === 'analyze-preview') {
        const response = await parserService.analyzePreview(form);
        setAnalysis(response.data);
      } else {
        const response = await analysisService.analyzeVSCode(form);
        setAnalysis(response.data.analysis);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="panel p-5">
        <div className="flex items-center gap-3">
          <FlaskConical className="text-[#1e5eff]" size={22} />
          <div>
            <h1 className="text-2xl font-semibold text-[#172033]">Analysis Playground</h1>
            <p className="mt-1 text-sm text-[#66728a]">Run the synchronous `/analyses/vscode` pipeline with raw file content.</p>
          </div>
        </div>
      </section>

      {error ? <Alert>{error}</Alert> : null}

      <section className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <div className="panel p-5">
          <label className="block text-sm font-medium text-[#536079]">Source file</label>
          <input
            value={form.sourceFile}
            onChange={(event) => setForm((current) => ({ ...current, sourceFile: event.target.value }))}
            className="mt-2 h-10 w-full rounded-md border border-[#d9e0ec] px-3 text-sm"
          />

          <label className="mt-4 block text-sm font-medium text-[#536079]">File type</label>
          <select
            value={form.fileType}
            onChange={(event) => setForm((current) => ({ ...current, fileType: event.target.value }))}
            className="mt-2 h-10 w-full rounded-md border border-[#d9e0ec] px-3 text-sm"
          >
            <option value="express">Express</option>
            <option value="openapi">OpenAPI</option>
            <option value="postman">Postman</option>
          </select>

          <label className="mt-4 block text-sm font-medium text-[#536079]">Backend endpoint</label>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="mt-2 h-10 w-full rounded-md border border-[#d9e0ec] px-3 text-sm"
          >
            <option value="vscode">POST /analyses/vscode</option>
            <option value="analyze-preview">POST /parser/analyze-preview</option>
            <option value="parse">POST /parser/preview</option>
          </select>

          <label className="mt-4 block text-sm font-medium text-[#536079]">Content</label>
          <textarea
            value={form.content}
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            className="mt-2 min-h-72 w-full rounded-md border border-[#d9e0ec] p-3 font-mono text-xs leading-5"
          />

          <Button onClick={handleAnalyze} disabled={loading} className="mt-4 w-full">
            <Play size={16} />
            {loading ? 'Analyzing...' : 'Run analysis'}
          </Button>
        </div>

        <div className="space-y-5">
          {parseResult ? (
            <div className="panel p-5">
              <h2 className="text-base font-semibold text-[#172033]">Parsed endpoints</h2>
              <p className="mt-1 text-sm text-[#66728a]">
                {parseResult.endpointCount} endpoint(s) detected as {parseResult.fileType}.
              </p>
              <div className="mt-4 space-y-2">
                {(parseResult.endpoints || []).map((endpoint, index) => (
                  <div key={`${endpoint.method}-${endpoint.path}-${index}`} className="rounded-md bg-[#f5f7fb] p-3">
                    <p className="font-mono text-sm font-semibold text-[#172033]">
                      {endpoint.method} {endpoint.path}
                    </p>
                    <p className="mt-1 text-xs text-[#66728a]">line {endpoint.lineNumber || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : !analysis ? (
            <div className="panel p-5 text-sm text-[#66728a]">Run an analysis to see score, smells, and AI suggestion.</div>
          ) : (
            <>
              <div className="grid gap-5 xl:grid-cols-[260px_1fr_220px]">
                <ScoreCard analysis={analysis} />
                <QualityRadarChart categoryScores={analysis.categoryScores} />
                <SeveritySummary summary={analysis.severitySummary} />
              </div>
              <AiSuggestionPanel suggestion={analysis.aiSuggestion} />
              <SmellList smells={analysis.smells || []} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
