import axios from 'axios';
import { API_BASE_URL } from '../constants';
import type { VoiceOption } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GenerateScriptResponse {
  script: string;
}

export interface GenerateAudioResponse {
  audioUrl: string;
  duration: number;
}

export const generateScript = async (prompt: string, duration: number): Promise<GenerateScriptResponse> => {
  const response = await api.post('/api/generate-script', { prompt, duration });
  return response.data;
};

export const generateAudio = async (
  script: string,
  voice: VoiceOption,
): Promise<GenerateAudioResponse> => {
  const response = await api.post('/api/generate-audio', { script, voiceId: voice.id });
  return response.data;
};

export const previewVoice = async (voiceId: string): Promise<string> => {
  const response = await api.get(`/api/preview-voice/${voiceId}`);
  return response.data.previewUrl;
}; 