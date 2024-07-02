// transcript_extract.js
import { openDatabase, saveVideoDetails, getAllVideos } from './indexedDB.js';
import { updateRecentVideosTable } from './main.js';

export function setupFetchAndDisplaySubtitles(goButton, urlInput, recentVideosTableBody, db, updateRecentVideos) {
  goButton.addEventListener('click', async () => {
    const videoUrl = urlInput.value.trim();

    try {
      const response = await fetch(`http://localhost:3003/fetchTranscript?url=${encodeURIComponent(videoUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }

      let encodedText = await response.text();
      let transcriptText = encodedText.replace(/&amp;#(\d+);/g, function(match, dec) {
          return String.fromCharCode(dec);
      });
      console.log('Transcript:', transcriptText);

      const videoTitle = await getVideoTitle(videoUrl); // Fetch video title
      console.log('Video Title:', videoTitle);

      const currentDate = new Date().toLocaleDateString(); // Get the current date

      const videoDetails = {
        url: videoUrl,
        title: videoTitle,
        date: currentDate,
        lectureDelivery: 10,
        engagement: 10,
        clarity: 10,
        overall: 10,
        transcript: transcriptText,
        feedback: 'Sample feedback' // Replace with actual feedback
      };

      await saveVideoDetails(db, videoDetails);

      // Fetch all videos from IndexedDB after saving the new video
      const recentVideos = await getAllVideos(db);
      updateRecentVideos(recentVideosTableBody, recentVideos); // Update the table with all videos

    } catch (error) {
      console.error('Error fetching transcript:', error);
    }
  });
}

async function getVideoTitle(videoUrl) {
  try {
    const videoId = getVideoIdFromUrl(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const apiKey = 'AIzaSyD6nrtMBXfiBptdNJx9hZznN3UGCR6-boY'; // Replace with your YouTube Data API key
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();
    const videoTitle = data.items[0].snippet.title;
    return videoTitle;
  } catch (error) {
    console.error('Error fetching video title:', error);
    return 'Video Title'; // Fallback title or error handling
  }
}

function getVideoIdFromUrl(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}
