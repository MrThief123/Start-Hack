import { openDatabase, saveVideoDetails, getAllVideos } from './indexedDB.js';

let recentVideos = [];

export function setupFetchAndDisplaySubtitles(goButton, urlInput, recentVideosTableBody) {
  goButton.addEventListener('click', async () => {
    const videoUrl = urlInput.value.trim();

    try {
      const response = await fetch(`http://localhost:3003/fetchTranscript?url=${encodeURIComponent(videoUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }

      const transcriptText = await response.text();
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

      const db = await openDatabase();
      await saveVideoDetails(db, videoDetails);

      recentVideos.push(videoDetails);
      if (recentVideos.length > 5) {
        recentVideos = recentVideos.slice(recentVideos.length - 5);
      }
      
      updateRecentVideosTable(recentVideosTableBody);

      displayVideoDetails(videoTitle, transcriptText);
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

function updateRecentVideosTable(recentVideosTableBody) {
  recentVideosTableBody.innerHTML = '';
  recentVideos.forEach((video, index) => {
    const row = document.createElement('tr');
    
    const indexCell = document.createElement('td');
    indexCell.textContent = index + 1;
    row.appendChild(indexCell);
    
    const dateCell = document.createElement('td');
    dateCell.textContent = video.date;
    row.appendChild(dateCell);

    const titleCell = document.createElement('td');
    const titleLink = document.createElement('a');
    titleLink.textContent = video.title;
    titleLink.href = video.url;
    titleLink.target = '_blank'; // Open link in a new tab
    titleCell.appendChild(titleLink);
    row.appendChild(titleCell);

    const lectureDeliveryCell = document.createElement('td');
    lectureDeliveryCell.textContent = video.lectureDelivery;
    row.appendChild(lectureDeliveryCell);

    const engagementCell = document.createElement('td');
    engagementCell.textContent = video.engagement;
    row.appendChild(engagementCell);

    const clarityCell = document.createElement('td');
    clarityCell.textContent = video.clarity;
    row.appendChild(clarityCell);

    const overallCell = document.createElement('td');
    overallCell.textContent = video.overall;
    row.appendChild(overallCell);

    const actionsCell = document.createElement('td');
    const feedbackButton = document.createElement('button');
    feedbackButton.textContent = 'Detailed Feedback';
    feedbackButton.onclick = () => {
      window.location.href = `feedback.html?url=${encodeURIComponent(video.url)}`;
    };
    actionsCell.appendChild(feedbackButton);
    row.appendChild(actionsCell);
    
    recentVideosTableBody.appendChild(row);
  });
}

