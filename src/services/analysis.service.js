import { api } from '../lib/api';

export const analysisService = {
  create(payload) {
    return api.post('/analyses', payload);
  },
  get(id) {
    return api.get(`/analyses/${id}`);
  },
  listMine(params = {}) {
    return api.get('/analyses/me', { params });
  },
  delete(id) {
    return api.delete(`/analyses/${id}`);
  },
  analyzeVSCode(payload) {
    return api.post('/analyses/vscode', payload);
  },
};
