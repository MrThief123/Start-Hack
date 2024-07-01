import express from 'express';
import cors from 'cors';
import { YoutubeTranscript } from 'youtube-transcript';

const app = express();
const PORT = 3003; // You can change this if needed

app.use(cors());

app.get('/fetchTranscript', async (req, res) => {
  const videoUrl = req.query.url;
  

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl); // Await the promise
    const transcriptText = transcript.map(entry => entry.text.replace(/\n/g, ' ')).join(' '); // Combine text into a single string
     console.log(transcriptText)
     res.send(transcriptText); // Sending JSON response with concatenated transcript text
  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).send('Error fetching transcript');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
