// Function to extract video ID from YouTube URL
function extractVideoId(url) {
    let videoId = '';
    
    // Regular expression patterns to match different YouTube URL formats
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/
    ];

    // Iterate over patterns and extract video ID if found
    patterns.forEach(pattern => {
        if (pattern.test(url)) {
            videoId = url.match(pattern)[1];
        }
    });

    return videoId;
}

// Function to set up caption fetching and alert display
export function setupFetchAndDisplaySubtitles(goButton, urlInput) {
    
    goButton.addEventListener('click', async () => {
        const url = urlInput.value; // Get the value of the input element (assuming it's an input[type="text"])

        const videoId = extractVideoId(url);
        
        if (videoId) {
            alert('Video ID: ' + videoId);
            // Now you can proceed with fetching captions using this videoId
            // Replace alert with your own logic to fetch and display captions
        } else {
            alert('Please enter a valid YouTube URL');
        }
    });
}
