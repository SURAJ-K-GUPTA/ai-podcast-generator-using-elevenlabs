import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { VOICES } from '../constants';
import type { VoiceOption } from '../types';
import { previewVoice } from '../services/api';

interface VoiceSelectorProps {
  selectedVoice: VoiceOption | null;
  onVoiceSelect: (voice: VoiceOption) => void;
  disabled?: boolean;
}

export function VoiceSelector({ selectedVoice, onVoiceSelect, disabled = false }: VoiceSelectorProps) {
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [loadingPreview, setLoadingPreview] = useState<string | null>(null);

  const handlePreview = async (voice: VoiceOption) => {
    try {
      setLoadingPreview(voice.id);
      if (previewAudio) {
        previewAudio.pause();
      }
      const previewUrl = await previewVoice(voice.id);
      const audio = new Audio(previewUrl);
      setPreviewAudio(audio);
      await audio.play();
    } catch (error) {
      console.error('Error playing preview:', error);
    } finally {
      setLoadingPreview(null);
    }
  };

  return (
    <RadioGroup value={selectedVoice} onChange={onVoiceSelect} disabled={disabled}>
      <RadioGroup.Label className="text-lg font-medium text-gray-900">
        Select a Voice
      </RadioGroup.Label>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VOICES.map((voice) => (
          <RadioGroup.Option
            key={voice.id}
            value={voice}
            className={({ active, checked }) =>
              `${
                active ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
              } ${
                checked ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'
              } relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`
            }
            disabled={disabled}
          >
            {({ checked }) => (
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <RadioGroup.Label
                      as="p"
                      className={`font-medium ${
                        checked ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {voice.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className={`inline ${
                        checked ? 'text-indigo-100' : 'text-gray-500'
                      }`}
                    >
                      {voice.nationality} {voice.gender}
                    </RadioGroup.Description>
                  </div>
                </div>
                {checked && (
                  <div className="shrink-0 text-white">
                    <CheckCircleIcon className="h-6 w-6" />
                  </div>
                )}
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
      {selectedVoice && (
        <button
          onClick={() => handlePreview(selectedVoice)}
          disabled={disabled || loadingPreview === selectedVoice.id}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loadingPreview === selectedVoice.id ? 'Loading...' : 'Preview Voice'}
        </button>
      )}
    </RadioGroup>
  );
} 