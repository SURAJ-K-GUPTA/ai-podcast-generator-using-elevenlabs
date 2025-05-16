import express, { Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { ElevenLabsClient } from 'elevenlabs';
import { Readable } from 'stream';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Constants
const MAX_DURATION_MINUTES = 1;
const WORDS_PER_MINUTE = 150; // Average speaking rate
const MAX_WORDS = MAX_DURATION_MINUTES * WORDS_PER_MINUTE;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize ElevenLabs
const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// CORS middleware
// Allow only the frontend domain // CLIENT_URL
const allowedOrigins = [process.env.CLIENT_URL || ''];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(limiter);

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello World');
});

// Helper function to convert response to Buffer
async function streamToBuffer(response: any): Promise<Buffer> {
  if (response instanceof Buffer) {
    return response;
  }
  
  if (response instanceof Uint8Array) {
    return Buffer.from(response);
  }
  
  if (typeof response.arrayBuffer === 'function') {
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  
  throw new Error('Unsupported response type');
}

// Helper function to count words
function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

// Generate script endpoint
app.post('/api/generate-script', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Missing prompt parameter' });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a podcast script writer. Create a well-structured podcast script with an introduction and main content. The script MUST be short and concise, approximately ${MAX_DURATION_MINUTES} minute when spoken (around ${MAX_WORDS} words). Format the response in a natural, conversational style.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 120,
    });

    const script = completion.choices[0].message.content;
    if (!script) {
      res.status(400).json({ error: 'No script generated' });
      return;
    }

    const wordCount = countWords(script);

    if (wordCount > MAX_WORDS) {
      res.status(400).json({ 
        error: `Script is too long (${wordCount} words). Maximum allowed is ${MAX_WORDS} words for ${MAX_DURATION_MINUTES} minute of speech.`
      });
      return;
    }

    res.json({ script });
  } catch (error) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

// Generate audio endpoint
app.post('/api/generate-audio', async (req: Request, res: Response): Promise<void> => {
  try {
    const { script, voiceId } = req.body;

    if (!script || !voiceId) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const audio = await elevenLabs.textToSpeech.convertAsStream(voiceId, {
      text: script,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
    });

    // Convert audio stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);
    const audioBase64 = audioBuffer.toString('base64');
    const audioUrl = `data:audio/mp3;base64,${audioBase64}`;

    res.json({
      audioUrl,
      duration: MAX_DURATION_MINUTES,
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});

// Preview voice endpoint
// Preview voice endpoint
app.get('/api/preview-voice/:voiceId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { voiceId } = req.params;
    const previewText = 'Hi, this is a sample of my voice.';

    const audio = await elevenLabs.textToSpeech.convertAsStream(voiceId, {
      text: previewText,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
    });

    // Convert audio stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);
    const audioBase64 = audioBuffer.toString('base64');
    const previewUrl = `data:audio/mp3;base64,${audioBase64}`;

    res.json({ previewUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate voice preview' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 