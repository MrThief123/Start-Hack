// main.js

// Import functions from other modules
import { openDatabase, saveVideoDetails, getAllVideos, clearDatabase } from './indexedDB.js';
import { setupFetchAndDisplaySubtitles } from './transcript_extract.js';

let recentVideos = []; // Array to store recent video details

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', async () => {
  const recentVideosTableBody = document.querySelector('#recentVideosTable tbody'); // Select the table body for recent videos
  const clearButton = document.querySelector('#clearButton'); // Select the clear button

  try {
    const db = await openDatabase(); // Open the IndexedDB database

    // Fetch all videos from IndexedDB on page load
    recentVideos = await getAllVideos(db);
    updateRecentVideosTable(recentVideosTableBody, recentVideos); // Update the table with fetched videos

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
      await clearDatabase(db); // Clear the database
      recentVideos = []; // Reset the recentVideos array
      updateRecentVideosTable(recentVideosTableBody, recentVideos); // Update the table to reflect cleared data
      alert('All videos have been cleared.'); // Alert the user
    });

  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error); // Log any errors
    alert('Failed to initialize IndexedDB'); // Alert the user if database initialization fails
  }
});

// Function to update the recent videos table
export function updateRecentVideosTable(recentVideosTableBody, recentVideos) {
  recentVideosTableBody.innerHTML = ''; // Clear the table body
  recentVideos.forEach((video, index) => {
    const row = createVideoRow(video, index); // Create a row for each video
    recentVideosTableBody.appendChild(row); // Append each row to the table body
  });
}

// Function to create a table row for a video
function createVideoRow(video, index) {
  const row = document.createElement('tr'); // Create a new table row

  // Create and append the index cell
  const indexCell = document.createElement('td');
  indexCell.textContent = index + 1;
  row.appendChild(indexCell);

  // Create and append the date cell
  const dateCell = document.createElement('td');
  dateCell.textContent = video.date;
  row.appendChild(dateCell);

  // Create and append the title cell with a link
  const titleCell = document.createElement('td');
  const titleLink = document.createElement('a');
  titleLink.textContent = video.title;
  titleLink.href = video.url;
  titleLink.target = '_blank'; // Open link in a new tab
  titleCell.appendChild(titleLink);
  row.appendChild(titleCell);

  // Create and append the lecture delivery cell
  const lectureDeliveryCell = document.createElement('td');
  lectureDeliveryCell.textContent = video.lectureDelivery;
  row.appendChild(lectureDeliveryCell);

  // Create and append the engagement cell
  const engagementCell = document.createElement('td');
  engagementCell.textContent = video.engagement;
  row.appendChild(engagementCell);

  // Create and append the clarity cell
  const clarityCell = document.createElement('td');
  clarityCell.textContent = video.clarity;
  row.appendChild(clarityCell);

  // Create and append the overall cell
  const overallCell = document.createElement('td');
  overallCell.textContent = video.overall;
  row.appendChild(overallCell);

  // Create and append the actions cell with a feedback button
  const actionsCell = document.createElement('td');
  const feedbackButton = document.createElement('button');
  feedbackButton.textContent = 'Detailed Feedback';
  feedbackButton.onclick = () => {
    window.location.href = `feedback.html?url=${encodeURIComponent(video.url)}`; // Navigate to feedback page
  };
  actionsCell.appendChild(feedbackButton);
  row.appendChild(actionsCell);

  return row; // Return the created row
}
