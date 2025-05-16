export interface VoiceOption {
  id: string;
  name: string;
  preview_url?: string;
  nationality: 'Indian' | 'Singaporean';
  gender: 'Male' | 'Female';
}

export interface PodcastSettings {
  duration: number;
  selectedVoice: VoiceOption | null;
  prompt: string;
}

export interface GeneratedPodcast {
  id: string;
  prompt: string;
  script: string;
  audioUrl: string;
  createdAt: string;
  duration: number;
  voice: VoiceOption;
}

export interface LocalStorageKeys {
  SETTINGS: 'podcast_settings';
  HISTORY: 'podcast_history';
} 