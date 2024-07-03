// feedback.js

// Import functions from other modules
import { openDatabase, getAllVideos } from './indexedDB.js';

// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Get the URL parameters from the current window location
  const urlParams = new URLSearchParams(window.location.search);
  // Decode the video URL parameter
  const videoUrl = decodeURIComponent(urlParams.get('url'));

  try {
    // Open the IndexedDB database
    const db = await openDatabase();
    // Retrieve all videos stored in IndexedDB
    const videos = await getAllVideos(db);

    // Find the video details that match the given URL
    const videoDetails = videos.find(video => video.url === videoUrl);
    if (!videoDetails) {
      console.error('Video details not found in IndexedDB'); // Log an error if video details are not found
      return;
    }

    // Display the video details on the page
    displayVideoDetails(videoDetails);
  } catch (error) {
    console.error('Error fetching video details:', error); // Log any errors that occur
    alert('Error fetching video details'); // Show an alert to the user
  }
});

// Function to display video details on the page
function displayVideoDetails(videoDetails) {
  document.getElementById('feedbackDate').textContent = videoDetails.date; // Set the date
  document.getElementById('feedbackTitle').textContent = videoDetails.title; // Set the title
  document.getElementById('feedbackLectureDelivery').textContent = videoDetails.lectureDelivery; // Set lecture delivery rating
  document.getElementById('feedbackEngagement').textContent = videoDetails.engagement; // Set engagement rating
  document.getElementById('feedbackClarity').textContent = videoDetails.clarity; // Set clarity rating
  document.getElementById('feedbackOverall').textContent = videoDetails.overall; // Set overall rating
  document.getElementById('feedbackTranscript').textContent = videoDetails.transcript; // Set the transcript text
  document.getElementById('feedbackContent').textContent = videoDetails.feedback; // Set the feedback content
}
