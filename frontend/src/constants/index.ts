export const MAX_DURATION_MINUTES = 1;

export const VOICES: Array<{
  id: string;
  name: string;
  nationality: 'Indian' | 'Singaporean';
  gender: 'Male' | 'Female';
}> = [
  {
    id: 'amiAXapsDOAiHJqbsAZj',  // Priya voice
    name: 'Priya',
    nationality: 'Indian',
    gender: 'Female',
  },
  {
    id: 'pzxut4zZz4GImZNlqQ3H',  // Raju voice
    name: 'Raju',
    nationality: 'Indian',
    gender: 'Male',
  },
  {
    id: '6qpxBH5KUSDb40bij36w',  // Lilian voice
    name: 'Lilian',
    nationality: 'Singaporean',
    gender: 'Female',
  },
];

export const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'podcast_settings',
  HISTORY: 'podcast_history',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; 