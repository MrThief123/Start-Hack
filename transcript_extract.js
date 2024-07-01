export function setupFetchAndDisplaySubtitles(goButton, urlInput) {
  goButton.addEventListener('click', async () => {
    const videoUrl = 'https://www.youtube.com/watch?v=lkbV8oP-F44a';

    fetch(`http://localhost:3001/fetchTranscript?url=${encodeURIComponent(videoUrl)}`)
      .then(response => response.json())
      .then(transcript => {
        const transcriptString = transcript.map(item => item.text).join(' ');

        console.log(transcriptString);// Displaying transcript as an alert
        alert(transcriptString)
      })
      .catch(error => {
        console.error('Error fetching transcript:', error);
      });
  
})}
