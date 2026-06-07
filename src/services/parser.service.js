import { api } from '../lib/api';

export const parserService = {
  preview(payload) {
    return api.post('/parser/preview', payload);
  },
  analyzePreview(payload) {
    return api.post('/parser/analyze-preview', payload);
  },
};
