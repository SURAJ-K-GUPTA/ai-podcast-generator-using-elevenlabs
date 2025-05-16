# AI Podcast Generator 🎙️

A modern web application that generates AI-powered podcasts using OpenAI's GPT-4 for script generation and ElevenLabs for voice synthesis. Create engaging podcasts with natural-sounding voices in multiple languages and accents.

## ✨ Features

- 🤖 **AI Script Generation**: Utilizes GPT-4 to create well-structured podcast scripts
- 🗣️ **Multiple Voice Options**:
  - 🇮🇳 Indian Voices: Priya (Female), Raju (Male)
  - 🇸🇬 Singaporean Voices: Lilian (Female), Jack (Male)
- 🎵 **Real-time Audio Preview**: Test voices before generating full podcasts
- 📊 **Waveform Visualization**: Visual representation of audio using WaveSurfer.js
- 💾 **Download Capabilities**: Save generated podcasts locally
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔄 **History Tracking**: Keep track of all generated podcasts

## 🛠️ Technology Stack

### Frontend
- React + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- HeadlessUI for accessible components
- WaveSurfer.js for audio visualization
- Axios for API communication

### Backend
- Node.js + Express
- TypeScript
- OpenAI API for script generation
- ElevenLabs API for voice synthesis
- Rate limiting and error handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key
- ElevenLabs API key

### Environment Setup

1. **Backend Setup**
```bash
cd backend
cp .env.example .env
# Add your API keys to .env file:
# OPENAI_API_KEY=your_openai_key
# ELEVENLABS_API_KEY=your_elevenlabs_key
# CLIENT_URL=your_frontend_url
npm install
npm run dev
```

2. **Frontend Setup**
```bash
cd frontend
cp .env.example .env
# Add your backend URL to .env file:
# VITE_API_URL=your_backend_url
npm install
npm run dev
```

## 🌟 Usage

1. Enter your podcast topic or idea in the text area
2. Select a voice from the available options
3. Click "Generate Podcast" to create your content
4. Preview the generated audio using the built-in player
5. Download your podcast when satisfied

## 🔒 API Rate Limits

- Maximum 10 requests per 15 minutes per IP
- Script length limited to approximately 150 words (1 minute of speech)
- Audio preview available for all voices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- ElevenLabs for voice synthesis
- WaveSurfer.js for audio visualization
- All contributors and users of this project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---
Made with ❤️ using React, Node.js, and AI 