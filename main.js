// main.js

import { openDatabase, saveVideoDetails, getAllVideos } from './indexedDB.js';
import { setupFetchAndDisplaySubtitles } from './transcript_extract.js';

let recentVideos = [];

document.addEventListener('DOMContentLoaded', async () => {
  const recentVideosTableBody = document.querySelector('#recentVideosTable tbody');

  try {
    const db = await openDatabase();

    // Fetch all videos from IndexedDB on page load
    recentVideos = await getAllVideos(db);
    updateRecentVideosTable(recentVideosTableBody);

    // Setup fetch and display subtitles on Go button click
    setupFetchAndDisplaySubtitles(
      document.querySelector('#goButton'),
      document.querySelector('#urlInput'),
      recentVideosTableBody,
      db
    );
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    alert('Failed to initialize IndexedDB');
  }
});

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
