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
      alert(transcriptText);

      const videoTitle = await getVideoTitle(videoUrl); // Fetch video title
      console.log('Video Title:', videoTitle);

      // Update recent videos and recent videos table
      updateRecentVideos({ url: videoUrl, title: videoTitle });
      updateRecentVideosTable(recentVideosTableBody);

      // Display video title and transcript in UI as needed
      displayVideoDetails(videoTitle, transcriptText);

    } catch (error) {
      console.error('Error fetching transcript:', error);
      alert('Error fetching transcript');
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

export function updateRecentVideos(video) {
  recentVideos.push(video);
  if (recentVideos.length > 5) {
    recentVideos = recentVideos.slice(recentVideos.length - 5);
  }
}

function updateRecentVideosTable(recentVideosTableBody) {
  recentVideosTableBody.innerHTML = '';
  recentVideos.forEach((video, index) => {
    const row = document.createElement('tr');
    
    const indexCell = document.createElement('td');
    indexCell.textContent = index + 1;
    row.appendChild(indexCell);
    
    const titleCell = document.createElement('td');
    const titleLink = document.createElement('a');
    titleLink.textContent = video.title;
    titleLink.href = video.url;
    titleLink.target = '_blank'; // Open link in a new tab
    titleCell.appendChild(titleLink);
    row.appendChild(titleCell);

    const lectureDeliveryCell = document.createElement('td');
    lectureDeliveryCell.textContent = '10/10';
    row.appendChild(lectureDeliveryCell);

    const engagementCell = document.createElement('td');
    engagementCell.textContent = '10/10';
    row.appendChild(engagementCell);

    const clarityCell = document.createElement('td');
    clarityCell.textContent = '10/10';
    row.appendChild(clarityCell);

    const overallCell = document.createElement('td');
    overallCell.textContent = '10/10';
    row.appendChild(overallCell);

    const actionsCell = document.createElement('td');
    const feedbackButton = document.createElement('button');
    feedbackButton.textContent = 'Detailed Feedback';
    feedbackButton.onclick = () => alert('Detailed feedback for ' + video.title);
    actionsCell.appendChild(feedbackButton);
    row.appendChild(actionsCell);
    
    recentVideosTableBody.appendChild(row);
  });
}

function displayVideoDetails(title, transcript) {
  // Example: Displaying video title and transcript in the console
  console.log('Video Title:', title);
  console.log('Transcript:', transcript);

  // You can update your UI here to display the video title and transcript
  // Example: document.getElementById('videoTitle').textContent = title;
  // Example: document.getElementById('transcript').textContent = transcript;
}
