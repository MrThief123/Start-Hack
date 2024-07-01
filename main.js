import './style.css';
import { setupFetchAndDisplaySubtitles } from './transcript_extract.js'; // Corrected import path

document.querySelector('#app').innerHTML = `
  <h1>Hello!</h1>
  <div>
    <input type="text" id="urlInput" placeholder="Enter a URL" />
    <button id="goButton">Go</button>
  </div>
  <div>
    <h2>Recent Videos</h2>
    <table id="recentVideosTable">
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Lecture Delivery</th>
          <th>Engagement</th>
          <th>Clarity</th>
          <th>Overall</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Recent videos will be populated here -->
      </tbody>
    </table>
  </div>
`;

// Now call setupYoutubeCaptions after setting up the DOM
setupFetchAndDisplaySubtitles(
  document.querySelector('#goButton'),
  document.querySelector('#urlInput'),
  document.querySelector('#recentVideosTable tbody')
);
