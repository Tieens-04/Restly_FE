import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, Github, Play, RefreshCw } from 'lucide-react';
import { getErrorMessage } from '../lib/api';
import { analysisService } from '../services/analysis.service';
import { repoService } from '../services/repo.service';

export function RepositoriesPage() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [tree, setTree] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const selectedFileMeta = useMemo(() => {
    return tree?.detectedFiles?.find((file) => file.path === selectedFile);
  }, [selectedFile, tree]);

  const loadRepositories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await repoService.listRepositories();
      setRepositories(response.data.repositories || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepositories();
  }, []);

  useEffect(() => {
    const loadBranches = async () => {
      if (!selectedRepo) return;
      const [owner, repo] = selectedRepo.split('/');

      setBranches([]);
      setTree(null);
      setSelectedBranch('');
      setSelectedFile('');
      setError('');

      try {
        const response = await repoService.listBranches(owner, repo);
        const nextBranches = response.data.branches || [];
        setBranches(nextBranches);
        setSelectedBranch(nextBranches[0]?.name || '');
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      }
    };

    loadBranches();
  }, [selectedRepo]);

  useEffect(() => {
    const loadTree = async () => {
      if (!selectedRepo || !selectedBranch) return;
      const [owner, repo] = selectedRepo.split('/');

      setTree(null);
      setSelectedFile('');
      setError('');

      try {
        const response = await repoService.getTree(owner, repo, selectedBranch);
        setTree(response.data);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      }
    };

    loadTree();
  }, [selectedBranch, selectedRepo]);

  const handleAnalyze = async () => {
    if (!selectedRepo || !selectedBranch || !selectedFile) return;

    setAnalyzing(true);
    setError('');
    try {
      const response = await analysisService.create({
        repoFullName: selectedRepo,
        branch: selectedBranch,
        filePath: selectedFile,
        fileType: selectedFileMeta?.detectedAs,
      });
      navigate(`/analysis/${response.data.analysis._id}`);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="panel p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-[#172033]">Repositories</h1>
            <p className="mt-2 text-sm leading-6 text-[#66728a]">
              Select a GitHub repository, branch, and detected API file to run APILens analysis.
            </p>
          </div>
          <button
            type="button"
            onClick={loadRepositories}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#d9e0ec] bg-white px-3 text-sm font-semibold text-[#172033] hover:bg-[#f1f4f9]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </section>

      {error ? <div className="rounded-md border border-[#f4b4ae] bg-[#fce8e6] p-4 text-sm text-[#a83531]">{error}</div> : null}

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <section className="panel p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#172033]">
            <Github size={17} />
            Repository setup
          </div>

          <label className="mt-5 block text-sm font-medium text-[#536079]">Repository</label>
          <select
            value={selectedRepo}
            onChange={(event) => setSelectedRepo(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-[#d9e0ec] bg-white px-3 text-sm text-[#172033]"
          >
            <option value="">{loading ? 'Loading repositories...' : 'Select repository'}</option>
            {repositories.map((repo) => (
              <option key={repo.id} value={repo.fullName}>
                {repo.fullName}
              </option>
            ))}
          </select>

          <label className="mt-5 block text-sm font-medium text-[#536079]">Branch</label>
          <select
            value={selectedBranch}
            onChange={(event) => setSelectedBranch(event.target.value)}
            disabled={!selectedRepo}
            className="mt-2 h-11 w-full rounded-md border border-[#d9e0ec] bg-white px-3 text-sm text-[#172033] disabled:bg-[#f1f4f9]"
          >
            <option value="">{selectedRepo ? 'Select branch' : 'Choose repository first'}</option>
            {branches.map((branch) => (
              <option key={branch.name} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!selectedFile || analyzing}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#1e5eff] px-4 text-sm font-semibold text-white hover:bg-[#164bd1] disabled:bg-[#aeb8ca]"
          >
            <Play size={16} />
            {analyzing ? 'Analyzing...' : 'Analyze selected file'}
          </button>
        </section>

        <section className="panel p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#172033]">
            <GitBranch size={17} />
            Detected API files
          </div>

          {tree?.warnings?.length ? (
            <div className="mt-4 rounded-md bg-[#fff4db] p-3 text-sm text-[#8a5a00]">
              {tree.warnings.join(' ')}
            </div>
          ) : null}

          <div className="mt-4 max-h-[520px] overflow-auto rounded-md border border-[#d9e0ec]">
            {!tree ? (
              <div className="p-5 text-sm text-[#66728a]">Choose a repository and branch to inspect files.</div>
            ) : tree.detectedFiles?.length === 0 ? (
              <div className="p-5 text-sm text-[#66728a]">No supported API files were detected in this branch.</div>
            ) : (
              tree.detectedFiles.map((file) => (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelectedFile(file.path)}
                  className={`flex w-full items-center justify-between border-b border-[#edf1f7] px-4 py-3 text-left text-sm last:border-b-0 ${
                    selectedFile === file.path ? 'bg-[#eaf0ff]' : 'bg-white hover:bg-[#f5f7fb]'
                  }`}
                >
                  <span className="font-mono text-xs text-[#172033]">{file.path}</span>
                  <span className="rounded-md bg-[#f1f4f9] px-2 py-1 text-xs font-semibold text-[#536079]">
                    {file.detectedAs}
                  </span>
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
