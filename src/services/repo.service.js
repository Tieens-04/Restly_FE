import { api } from '../lib/api';

export const repoService = {
  listRepositories() {
    return api.get('/repos');
  },
  listBranches(owner, repo) {
    return api.get(`/repos/${owner}/${repo}/branches`);
  },
  getTree(owner, repo, branch) {
    return api.get(`/repos/${owner}/${repo}/tree`, {
      params: { branch },
    });
  },
};
