import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { VoiceSelector } from './components/VoiceSelector'
import { AudioPlayer } from './components/AudioPlayer'
import { PodcastHistory } from './components/PodcastHistory'
import { useLocalStorage } from './hooks/useLocalStorage'
import { LOCAL_STORAGE_KEYS, MAX_DURATION_MINUTES } from './constants'
import type { PodcastSettings, GeneratedPodcast, VoiceOption } from './types'
import { generateScript, generateAudio } from './services/api'

function App() {
  const [settings, setSettings] = useLocalStorage<PodcastSettings>(
    LOCAL_STORAGE_KEYS.SETTINGS,
    {
      duration: MAX_DURATION_MINUTES,
      selectedVoice: null,
      prompt: '',
    }
  )

  const [history, setHistory] = useLocalStorage<GeneratedPodcast[]>(
    LOCAL_STORAGE_KEYS.HISTORY,
    []
  )

  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPodcast, setCurrentPodcast] = useState<GeneratedPodcast | null>(null)
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)

  const handleGenerate = async () => {
    if (!settings.prompt) {
      toast.error('Please enter a prompt')
      return
    }

    if (!settings.selectedVoice) {
      toast.error('Please select a voice')
      return
    }

    try {
      setIsGenerating(true)
      setIsGeneratingScript(true)
      
      // Generate script
      const scriptResult = await generateScript(settings.prompt, settings.duration)
      setIsGeneratingScript(false)
      setIsGeneratingAudio(true)
      
      // Generate audio
      const audioResult = await generateAudio(scriptResult.script, settings.selectedVoice)
      
      // Create podcast object
      const podcast: GeneratedPodcast = {
        id: Date.now().toString(),
        prompt: settings.prompt,
        script: scriptResult.script,
        audioUrl: audioResult.audioUrl,
        createdAt: new Date().toISOString(),
        duration: audioResult.duration,
        voice: settings.selectedVoice,
      }

      // Update history
      setHistory((prev) => [podcast, ...prev])
      setCurrentPodcast(podcast)
      
      toast.success('Podcast generated successfully!')
    } catch (error) {
      console.error('Error generating podcast:', error)
      toast.error('Failed to generate podcast. Please try again.')
    } finally {
      setIsGenerating(false)
      setIsGeneratingScript(false)
      setIsGeneratingAudio(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">AI Podcast Generator</h1>
          <p className="mt-2 text-lg text-gray-600">
            Generate engaging podcasts with AI voices
          </p>
        </div>

        <div className="space-y-8">
          {/* Input Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <label htmlFor="prompt" className="block text-lg font-medium text-gray-900 mb-2">
                Enter your topic or idea
              </label>
              <textarea
                id="prompt"
                rows={4}
                value={settings.prompt}
                onChange={(e) => setSettings({ ...settings, prompt: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter a topic or idea for your podcast..."
                disabled={isGenerating}
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-900">Duration:</span>
                <span className="ml-2 text-gray-600">1 minute</span>
                <span className="ml-2 text-sm text-gray-500">(~150 words)</span>
              </div>
            </div>

            <VoiceSelector
              selectedVoice={settings.selectedVoice}
              onVoiceSelect={(voice: VoiceOption) => setSettings({ ...settings, selectedVoice: voice })}
              disabled={isGenerating}
            />

            <div className="mt-6">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isGeneratingScript ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Script...
                  </>
                ) : isGeneratingAudio ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Audio...
                  </>
                ) : (
                  'Generate Podcast'
                )}
              </button>
            </div>
          </div>

          {/* Current Podcast */}
          {currentPodcast && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Podcast</h2>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Prompt</h3>
                <p className="mt-1 text-gray-500">{currentPodcast.prompt}</p>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Script</h3>
                <p className="mt-1 text-gray-500 whitespace-pre-wrap">{currentPodcast.script}</p>
              </div>
              <AudioPlayer
                audioUrl={currentPodcast.audioUrl}
                title={`Podcast - ${new Date(currentPodcast.createdAt).toLocaleDateString()}`}
              />
            </div>
          )}

          {/* History */}
          <PodcastHistory />
        </div>
      </div>
    </div>
  )
}

export default App
