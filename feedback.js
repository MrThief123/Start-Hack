// feedback.js

import { openDatabase, getAllVideos } from './indexedDB.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoUrl = decodeURIComponent(urlParams.get('url'));

  try {
    const db = await openDatabase();
    const videos = await getAllVideos(db);

    const videoDetails = videos.find(video => video.url === videoUrl);
    if (!videoDetails) {
      console.error('Video details not found in IndexedDB');
      return;
    }

    displayVideoDetails(videoDetails);
  } catch (error) {
    console.error('Error fetching video details:', error);
    alert('Error fetching video details');
  }
});

function displayVideoDetails(videoDetails) {
  document.getElementById('feedbackDate').textContent = videoDetails.date;
  document.getElementById('feedbackTitle').textContent = videoDetails.title;
  document.getElementById('feedbackLectureDelivery').textContent = videoDetails.lectureDelivery;
  document.getElementById('feedbackEngagement').textContent = videoDetails.engagement;
  document.getElementById('feedbackClarity').textContent = videoDetails.clarity;
  document.getElementById('feedbackOverall').textContent = videoDetails.overall;
  document.getElementById('feedbackTranscript').textContent = videoDetails.transcript;
  document.getElementById('feedbackContent').textContent = videoDetails.feedback;
}
