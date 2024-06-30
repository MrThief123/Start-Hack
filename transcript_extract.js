// Function to extract video ID from YouTube URL
function extractVideoId(url) {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
}

// Function to fetch caption tracks associated with a video
async function fetchCaptionTracks(videoId, apiKey) {
    const url = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.items; // Return list of caption tracks
    } catch (error) {
        console.error('Error fetching caption tracks:', error.message);
        throw error;
    }
}

// Function to download caption text based on caption track ID
async function downloadCaptionText(captionId, apiKey) {
    const url = `https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text(); // Get the text content of the caption
        return data;
    } catch (error) {
        console.error('Error downloading caption text:', error.message);
        throw error;
    }
}

// Function to set up caption fetching and alert display
export function setupFetchAndDisplaySubtitles(goButton, urlInput) {
    goButton.addEventListener('click', async () => {
        const url = urlInput.value;
        const apiKey = 'AIzaSyD6nrtMBXfiBptdNJx9hZznN3UGCR6-boY'; // Replace with your actual YouTube Data API key
        
        const videoId = extractVideoId(url);
        
        if (videoId) {
            try {
                const captionTracks = await fetchCaptionTracks(videoId, apiKey);
                if (captionTracks.length === 0) {
                    throw new Error('No caption tracks found for the video');
                }
                
                // Assuming we want the first caption track, you can adjust this as needed
                const firstCaptionId = captionTracks[0].id;
                const captions = await downloadCaptionText(firstCaptionId, apiKey);
                alert('Captions:\n' + captions);
                // Replace alert with your own logic to display or process captions
            } catch (error) {
                alert('Error fetching captions: ' + error.message);
            }
        } else {
            alert('Please enter a valid YouTube URL');
        }
    });
}
