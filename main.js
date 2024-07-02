// main.js

import { openDatabase, saveVideoDetails, getAllVideos, clearDatabase } from './indexedDB.js';
import { setupFetchAndDisplaySubtitles } from './transcript_extract.js';

let recentVideos = [];

document.addEventListener('DOMContentLoaded', async () => {
  const recentVideosTableBody = document.querySelector('#recentVideosTable tbody');
  const clearButton = document.querySelector('#clearButton'); // Select the clear button

  try {
    const db = await openDatabase();

    // Fetch all videos from IndexedDB on page load
    recentVideos = await getAllVideos(db);
    updateRecentVideosTable(recentVideosTableBody, recentVideos);

    // Setup fetch and display subtitles on Go button click
    setupFetchAndDisplaySubtitles(
      document.querySelector('#goButton'),
      document.querySelector('#urlInput'),
      recentVideosTableBody,
      db,
      updateRecentVideosTable // Pass the update function to be called after new video is added
    );

    // Add event listener to clear button
    clearButton.addEventListener('click', async () => {
      await clearDatabase(db);
      recentVideos = [];
      updateRecentVideosTable(recentVideosTableBody, recentVideos);
      alert('All videos have been cleared.');
    });

  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    alert('Failed to initialize IndexedDB');
  }
});

export function updateRecentVideosTable(recentVideosTableBody, recentVideos) {
  recentVideosTableBody.innerHTML = ''; // Clear the table body
  recentVideos.forEach((video, index) => {
    const row = createVideoRow(video, index);
    recentVideosTableBody.appendChild(row); // Append each row to the table body
  });
}

function createVideoRow(video, index) {
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

  return row;
}
