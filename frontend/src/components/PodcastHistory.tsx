import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../constants';
import type { GeneratedPodcast } from '../types';
import { AudioPlayer } from './AudioPlayer';

export function PodcastHistory() {
  const [history] = useLocalStorage<GeneratedPodcast[]>(LOCAL_STORAGE_KEYS.HISTORY, []);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Previous Podcasts</h2>
      <div className="space-y-4">
        {history.map((podcast) => (
          <div key={podcast.id} className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Prompt</h3>
                <p className="mt-1 text-gray-500">{podcast.prompt}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="mr-4">Voice: {podcast.voice.name}</span>
                <span>Created: {new Date(podcast.createdAt).toLocaleDateString()}</span>
              </div>
              <AudioPlayer
                audioUrl={podcast.audioUrl}
                title={`Podcast - ${new Date(podcast.createdAt).toLocaleDateString()}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 