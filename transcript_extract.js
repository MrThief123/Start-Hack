export function setupFetchAndDisplaySubtitles(goButton, urlInput) {
  goButton.addEventListener('click', async () => {
    const videoUrl = urlInput.value.trim(); // Assuming urlInput is an input element

    try {
      const response = await fetch(`http://localhost:3003/fetchTranscript?url=${encodeURIComponent(videoUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }

      const transcriptText = await response.text(); // Get the plain text response
      
      console.log('Transcript:', transcriptText); // Logging transcript to console
      alert(transcriptText); // Displaying transcript as an alert
    } catch (error) {
      console.error('Error fetching transcript:', error);
      alert('Error fetching transcript');
    }
  });
}
