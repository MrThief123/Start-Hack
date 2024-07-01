export function setupFetchAndDisplaySubtitles(goButton, urlInput) {
  goButton.addEventListener('click', async () => {
    const videoUrl = urlInput.value.trim(); // Assuming urlInput is an input element

    try {
      // send the url to proxy server to extract transcipt
      const response = await fetch(`http://localhost:3003/fetchTranscript?url=${encodeURIComponent(videoUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }

      const transcriptText = await response.text(); 
      
      console.log('Transcript:', transcriptText); 
      alert(transcriptText); // print the transcipt
    } catch (error) {
      console.error('Error fetching transcript:', error);
      alert('Error fetching transcript');
    }
  });
}
